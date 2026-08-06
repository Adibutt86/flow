"use client";

import React, { useState } from "react";
import { useUser, MASTER_USER } from "@/context/UserContext";
import { Crown, User as UserIcon, Plus, Check, X, Sparkles, ShieldCheck, ArrowRight } from "lucide-react";

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      await loginByName(inputName);
      setInputName("");
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0b0e17] border border-indigo-500/30 shadow-2xl space-y-6 text-white overflow-hidden">
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
              <h2 className="text-xl font-extrabold text-white tracking-tight">Account & Login</h2>
            </div>
            <p className="text-xs text-gray-400">
              Each user has their own saved ideas & projects. No password required!
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
                <p className="text-[11px] text-amber-300/80">Access master database with zero restrictions</p>
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

        {/* Password-Free Login Form */}
        <form onSubmit={handleSubmitNewUser} className="space-y-3">
          <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
            Create or Enter Username (No Password Required)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="Enter name (e.g. Hassan, Sarah)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-gray-800 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !inputName.trim()}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-xs sm:text-sm shadow-lg hover:opacity-95 transition-all active:scale-95 cursor-pointer disabled:opacity-50 shrink-0"
            >
              <span>Login</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        </form>

        {/* Saved Local Accounts Switcher */}
        {allUsers.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-gray-800/80">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
              Switch Account on Device ({allUsers.length})
            </label>
            <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1 scrollbar-hide">
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
