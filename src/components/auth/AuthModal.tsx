"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { User as UserIcon, X, ShieldCheck, ArrowRight, Lock, LogOut } from "lucide-react";

export function AuthModal() {
  const {
    currentUser,
    loginByName,
    loginWithUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isLoggedIn,
    logout,
  } = useUser();

  const [selectedUser, setSelectedUser] = useState<"hassan" | "adi" | "">("");
  const [inputPassword, setInputPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isAuthModalOpen) return null;

  const handleUserSelect = (userName: "hassan" | "adi") => {
    setSelectedUser(userName);
    setInputPassword("");
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) {
      setError("Please select an account (Hassan or Adi)");
      return;
    }
    if (!inputPassword.trim()) {
      setError("Please enter your account password");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedUser,
          password: inputPassword.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid password");
      }

      if (data.user) {
        loginWithUser(data.user);
      } else {
        await loginByName(selectedUser, inputPassword.trim());
      }
      setSelectedUser("");
      setInputPassword("");
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0b0e17] border border-indigo-500/30 shadow-2xl space-y-6 text-white overflow-hidden font-sans">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                {isLoggedIn ? "Account Workspace" : "Select Your Account"}
              </h2>
            </div>
            <p className="text-xs text-gray-400">
              {isLoggedIn
                ? `Currently active in ${currentUser.name}'s private workspace.`
                : "Select your account name below to open your workspace."}
            </p>
          </div>
          {isLoggedIn && (
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Close popup"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Account Selection Cards (Hassan & Adi) */}
        <div className="space-y-2.5">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
            Choose Workspace User
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Hassan Account Button */}
            <button
              type="button"
              onClick={() => handleUserSelect("hassan")}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer active:scale-95 space-y-1.5 select-none ${
                selectedUser === "hassan" || (isLoggedIn && currentUser.name.toLowerCase() === "hassan" && !selectedUser)
                  ? "bg-indigo-600/30 border-2 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500/50"
                  : "bg-indigo-950/30 hover:bg-indigo-900/50 border border-indigo-500/30 text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base text-indigo-200">
                <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>Hassan</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Hassan&apos;s Workspace</p>
            </button>

            {/* Adi Account Button */}
            <button
              type="button"
              onClick={() => handleUserSelect("adi")}
              className={`p-4 rounded-2xl text-left transition-all cursor-pointer active:scale-95 space-y-1.5 select-none ${
                selectedUser === "adi" || (isLoggedIn && currentUser.name.toLowerCase() === "adi" && !selectedUser)
                  ? "bg-cyan-600/30 border-2 border-cyan-500 text-white shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-500/50"
                  : "bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 text-gray-300"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-base text-cyan-200">
                <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
                  <UserIcon className="w-4 h-4" />
                </div>
                <span>Adi</span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">Adi&apos;s Workspace</p>
            </button>
          </div>
        </div>

        {/* Password Form (Shown when an account is selected) */}
        {selectedUser && (
          <form onSubmit={handleLogin} className="space-y-3.5 pt-1 animate-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider">
                Enter Password for <span className="text-white capitalize">{selectedUser}</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder={`Enter ${selectedUser}'s password...`}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/80 border-2 border-amber-500/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20 transition-all font-sans"
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !inputPassword.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-bg-primary text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 hover:opacity-95 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <span>Login to {selectedUser === "hassan" ? "Hassan" : "Adi"}&apos;s Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {error && <p className="text-xs text-rose-400 font-bold text-center bg-rose-950/40 p-2.5 rounded-xl border border-rose-800/40">{error}</p>}

        {/* Logout Option (Shown when currently logged in) */}
        {isLoggedIn && (
          <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">
              Active: <strong className="text-white capitalize">{currentUser.name}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setSelectedUser("");
                setInputPassword("");
                logout();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 font-bold text-xs transition-all cursor-pointer active:scale-95 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout & Lock</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
