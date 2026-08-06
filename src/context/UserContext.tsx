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
  loginByName: (name: string) => Promise<User>;
  loginAsMaster: () => Promise<User>;
  switchUser: (user: User) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isLoadingUser: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(MASTER_USER);
  const [allUsers, setAllUsers] = useState<User[]>([MASTER_USER]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  // Load active user from localStorage on start
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedUserStr = localStorage.getItem("flow_current_user");
        if (savedUserStr) {
          const parsed = JSON.parse(savedUserStr);
          if (parsed && parsed.id) {
            setCurrentUser(parsed);
          }
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
      } catch (e) {
        console.error("Error reading stored user session:", e);
      }
    }
    setIsLoadingUser(false);
  }, []);

  // Sync state changes to localStorage
  const updateCurrentUser = (user: User) => {
    setCurrentUser(user);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("flow_current_user", JSON.stringify(user));
      } catch (e) {
        console.error("Failed to save current user to localStorage", e);
      }
    }
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

  const loginByName = async (name: string): Promise<User> => {
    if (!name.trim()) throw new Error("Name cannot be empty");
    const cleanName = name.trim();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: cleanName }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        updateCurrentUser(data.user);
        updateAllUsersList(data.user);
        setIsAuthModalOpen(false);
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
    setIsAuthModalOpen(false);
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
    updateCurrentUser(MASTER_USER);
  };

  return (
    <UserContext.Provider
      value={{
        currentUser,
        allUsers,
        loginByName,
        loginAsMaster,
        switchUser,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isLoadingUser,
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
