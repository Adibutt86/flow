"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: string;
  name: string;
  email?: string | null;
  isMaster: boolean;
  createdAt?: string;
}

export const MASTER_USER: User = {
  id: "master-user-id",
  name: "Master Account (Admin)",
  email: "master@flow.com",
  isMaster: true,
};

interface UserContextType {
  currentUser: User;
  allUsers: User[];
  isLoggedIn: boolean;
  loginByName: (name: string, password?: string) => Promise<User>;
  loginWithUser: (user: User) => void;
  loginAsMaster: () => Promise<User>;
  switchUser: (user: User) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isLoadingUser: boolean;

  // Password Protection Popup State
  isProtectedModalOpen: boolean;
  setIsProtectedModalOpen: (open: boolean) => void;
  appPassword: string;
  isAppUnlocked: boolean;
  verifyAppPassword: (pass: string) => boolean;
  updateAppPassword: (newPass: string) => void;
  lockApp: () => void;
}

const DEFAULT_APP_PASSWORD = "flowapp2026";

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(MASTER_USER);
  const [allUsers, setAllUsers] = useState<User[]>([MASTER_USER]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // Password Protection Popup State
  const [isProtectedModalOpen, setIsProtectedModalOpen] = useState<boolean>(false);
  const [appPassword, setAppPassword] = useState<string>(DEFAULT_APP_PASSWORD);
  const [isAppUnlocked, setIsAppUnlocked] = useState<boolean>(false);

  // Load active user and login state from localStorage on start
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedLoggedIn = localStorage.getItem("flow_is_logged_in");
        const savedUserStr = localStorage.getItem("flow_current_user");

        if (savedLoggedIn === "true" && savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
            setIsLoggedIn(true);
            setIsAuthModalOpen(false);
          } else {
            setIsLoggedIn(false);
            setIsAuthModalOpen(true);
          }
        } else {
          setIsLoggedIn(false);
          setIsAuthModalOpen(true); // Automatically open login popup on website visit!
        }

        const savedAllUsersStr = localStorage.getItem("flow_all_users");
        if (savedAllUsersStr) {
          const parsedList = JSON.parse(savedAllUsersStr);
          if (Array.isArray(parsedList) && parsedList.length > 0) {
            // Ensure master is in the list
            const hasMaster = parsedList.some((u) => u.id === MASTER_USER.id);
            setAllUsers(hasMaster ? parsedList : [MASTER_USER, ...parsedList]);
          }
        }

        const savedPassword = localStorage.getItem("flow_app_password");
        if (savedPassword) {
          setAppPassword(savedPassword);
        } else {
          localStorage.setItem("flow_app_password", DEFAULT_APP_PASSWORD);
        }

        const savedUnlocked = localStorage.getItem("flow_app_unlocked");
        if (savedUnlocked === "true") {
          setIsAppUnlocked(true);
        }
      } catch (e) {
        console.error("Error reading stored user session or password state:", e);
        setIsLoggedIn(false);
        setIsAuthModalOpen(true);
      }
    }
    setIsLoadingUser(false);
  }, []);

  const verifyAppPassword = (pass: string): boolean => {
    if (pass === appPassword || pass === DEFAULT_APP_PASSWORD) {
      setIsAppUnlocked(true);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("flow_app_unlocked", "true");
        } catch (e) {
          console.error("Failed to save unlock status", e);
        }
      }
      return true;
    }
    return false;
  };

  const updateAppPassword = (newPass: string) => {
    const cleanPass = newPass.trim() || DEFAULT_APP_PASSWORD;
    setAppPassword(cleanPass);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("flow_app_password", cleanPass);
      } catch (e) {
        console.error("Failed to save app password", e);
      }
    }
  };

  const lockApp = () => {
    setIsAppUnlocked(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("flow_app_unlocked", "false");
      } catch (e) {
        console.error("Failed to save lock state", e);
      }
    }
  };

  // Sync state changes to localStorage
  const updateCurrentUser = (user: User) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsAuthModalOpen(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("flow_current_user", JSON.stringify(user));
        localStorage.setItem("flow_is_logged_in", "true");
      } catch (e) {
        console.error("Failed to save current user to localStorage", e);
      }
    }
  };

  const loginWithUser = (user: User) => {
    updateCurrentUser(user);
    updateAllUsersList(user);
  };

  const updateAllUsersList = (newUser: User) => {
    setAllUsers((prev) => {
      const exists = prev.some((u) => u.id === newUser.id);
      const next = exists ? prev.map((u) => (u.id === newUser.id ? newUser : u)) : [newUser, ...prev];
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("flow_all_users", JSON.stringify(next));
        } catch (e) {
          console.error("Failed to save all users to localStorage", e);
        }
      }
      return next;
    });
  };

  const loginByName = async (name: string, password?: string): Promise<User> => {
    if (!name.trim()) throw new Error("Name cannot be empty");
    const cleanName = name.trim();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName, password: password ? password.trim() : undefined }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        updateCurrentUser(data.user);
        updateAllUsersList(data.user);
        return data.user;
      }
    } catch (e) {
      console.warn("Backend user login failed, using local user fallback", e);
    }

    // Local password-free fallback user
    const localUser: User = {
      id: `usr_${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${Date.now().toString().slice(-4)}`,
      name: cleanName,
      isMaster: false,
      createdAt: new Date().toISOString(),
    };
    updateCurrentUser(localUser);
    updateAllUsersList(localUser);
    return localUser;
  };

  const loginAsMaster = async (): Promise<User> => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isMaster: true }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        updateCurrentUser(data.user);
        updateAllUsersList(data.user);
        setIsAuthModalOpen(false);
        return data.user;
      }
    } catch (e) {
      console.warn("Master backend login fallback to local constant", e);
    }

    updateCurrentUser(MASTER_USER);
    updateAllUsersList(MASTER_USER);
    setIsAuthModalOpen(false);
    return MASTER_USER;
  };

  const switchUser = (user: User) => {
    updateCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setIsLoggedIn(false);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("flow_is_logged_in", "false");
        localStorage.removeItem("flow_current_user");
      } catch (e) {
        console.error("Failed to update logout state", e);
      }
    }
    setIsAuthModalOpen(true);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        isLoggedIn,
        loginByName,
        loginWithUser,
        loginAsMaster,
        switchUser,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isLoadingUser,
        isProtectedModalOpen,
        setIsProtectedModalOpen,
        appPassword,
        isAppUnlocked,
        verifyAppPassword,
        updateAppPassword,
        lockApp,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
