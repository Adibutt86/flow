"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Crown, User as UserIcon, Check, X, ShieldCheck, ArrowRight, Lock, Key, Sparkles } from "lucide-react";

export function AuthModal() {
  const {
    currentUser,
    allUsers,
    loginByName,
    loginAsMaster,
    switchUser,
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useUser();

  const [inputName, setInputName] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Password setup states
  const [showPasswordSetup, setShowPasswordSetup] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordSetupMsg, setPasswordSetupMsg] = useState("");

  if (!isAuthModalOpen) return null;

  const handleSubmitNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputName.trim()) {
      setError("Please enter a username or name");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: inputName.trim(),
          password: inputPassword.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 401 && data.requiresPassword) {
        setRequiresPassword(true);
        setError(data.error || "Password required for this account");
        setIsSubmitting(false);
        return;
      }
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to log in");
      }

      await loginByName(inputName.trim());
      setInputName("");
      setInputPassword("");
      setRequiresPassword(false);
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMasterClick = async () => {
    setIsSubmitting(true);
    try {
      await loginAsMaster();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSetupMsg("");
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          newPassword: newPasswordInput.trim() || null,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password");
      }
      setPasswordSetupMsg(data.message || "Password updated successfully!");
      setNewPasswordInput("");
    } catch (err: any) {
      setPasswordSetupMsg(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0b0e17] border border-indigo-500/30 shadow-2xl space-y-6 text-white overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">Account & Security</h2>
            </div>
            <p className="text-xs text-gray-400">
              Each user has their own saved ideas & projects. Optional passwords supported!
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1-Click Master Login Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-yellow-950/60 border border-amber-500/40 shadow-lg relative overflow-hidden space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <Crown className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-amber-200">1-Click Master Account</h3>
                <p className="text-[11px] text-amber-300/80">Access master workspace & database</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleMasterClick}
            disabled={isSubmitting || currentUser.isMaster}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <Crown className="w-4 h-4" />
            <span>{currentUser.isMaster ? "Currently Logged In as Master" : "Switch to Master Account"}</span>
          </button>
        </div>

        {/* User Login Form */}
        <form onSubmit={handleSubmitNewUser} className="space-y-3">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
            Login or Create User Account
          </label>
          <div className="space-y-2">
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={inputName}
                onChange={(e) => {
                  setInputName(e.target.value);
                  setRequiresPassword(false);
                  setError("");
                }}
                placeholder="Enter username (e.g. Hassan, Sarah)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
              />
            </div>

            {requiresPassword && (
              <div className="relative animate-in slide-in-from-top-1">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="password"
                  value={inputPassword}
                  onChange={(e) => setInputPassword(e.target.value)}
                  placeholder="Enter account password..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-amber-500/50 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all font-sans"
                  autoFocus
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !inputName.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-xs sm:text-sm shadow-lg hover:opacity-95 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <span>{requiresPassword ? "Unlock & Login" : "Start Session / Login"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        </form>

        {/* Set / Change Password for Current Account */}
        <div className="pt-2 border-t border-gray-800/80 space-y-3">
          <button
            type="button"
            onClick={() => setShowPasswordSetup(!showPasswordSetup)}
            className="flex items-center justify-between w-full text-xs font-bold text-gray-300 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Password Settings ({currentUser.name})</span>
            </span>
            <span className="text-[11px] text-indigo-400">{showPasswordSetup ? "Hide" : "Set / Change"}</span>
          </button>

          {showPasswordSetup && (
            <form onSubmit={handleSetPassword} className="space-y-3.5 p-3.5 rounded-2xl bg-black/40 border border-gray-800 animate-in fade-in">
              <p className="text-[11px] text-gray-400">
                Set a password to protect your <strong>{currentUser.name}</strong> account. Leave empty to make account password-free.
              </p>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="Enter new password (or leave empty to clear)..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-gray-700 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                Save Password Setting
              </button>
              {passwordSetupMsg && (
                <p className={`text-xs font-medium ${passwordSetupMsg.startsWith("Error") ? "text-rose-400" : "text-emerald-400"}`}>
                  {passwordSetupMsg}
                </p>
              )}
            </form>
          )}
        </div>

        {/* Saved Local Accounts Switcher */}
        {allUsers.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-800/80">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
              Saved Accounts ({allUsers.length})
            </label>
            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 scrollbar-hide">
              {allUsers.map((user) => {
                const isActive = currentUser.id === user.id;
                return (
                  <button
                    key={user.id}
                    onClick={() => switchUser(user)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-indigo-600/30 border border-indigo-500/50 text-white"
                        : "bg-gray-900/60 hover:bg-gray-800/80 border border-gray-800 text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {user.isMaster ? (
                        <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                          <Crown className="w-3.5 h-3.5" />
                        </span>
                      ) : (
                        <span className="p-1 rounded-lg bg-indigo-500/20 text-indigo-400">
                          <UserIcon className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <div className="text-left">
                        <p className="font-bold">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.email || `ID: ${user.id.slice(0, 10)}`}</p>
                      </div>
                    </div>
                    {isActive ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        <Check className="w-3 h-3" /> Active
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400 hover:text-white">Switch</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
