"use client";

import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/Toast";
import {
  Lock,
  Unlock,
  KeyRound,
  ShieldCheck,
  ShieldAlert,
  X,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
} from "lucide-react";

export function PasswordProtectedModal() {
  const {
    isProtectedModalOpen,
    setIsProtectedModalOpen,
    appPassword,
    isAppUnlocked,
    verifyAppPassword,
    updateAppPassword,
    lockApp,
  } = useUser();

  const { showToast } = useToast();

  const [enteredPassword, setEnteredPassword] = useState("");
  const [showEnteredPass, setShowEnteredPass] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"unlock" | "manage">("unlock");

  // Manage password state
  const [currentPassInput, setCurrentPassInput] = useState("");
  const [newPassInput, setNewPassInput] = useState("");
  const [confirmPassInput, setConfirmPassInput] = useState("");
  const [showManagePass, setShowManagePass] = useState(false);

  if (!isProtectedModalOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enteredPassword.trim()) {
      setErrorMessage("Please enter the password.");
      return;
    }

    const isValid = verifyAppPassword(enteredPassword.trim());
    if (isValid) {
      setErrorMessage("");
      setEnteredPassword("");
      showToast("Access Unlocked successfully!", "success");
      setIsProtectedModalOpen(false);
    } else {
      setErrorMessage("Incorrect password. Default password is 'flowapp2026'.");
    }
  };

  const handleQuickFill = () => {
    setEnteredPassword("flowapp2026");
    setErrorMessage("");
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAppUnlocked && currentPassInput.trim() !== appPassword) {
      showToast("Current password does not match.", "error");
      return;
    }
    if (!newPassInput.trim()) {
      showToast("New password cannot be empty.", "error");
      return;
    }
    if (newPassInput.trim().length < 4) {
      showToast("Password should be at least 4 characters long.", "error");
      return;
    }
    if (newPassInput !== confirmPassInput) {
      showToast("New passwords do not match.", "error");
      return;
    }

    updateAppPassword(newPassInput.trim());
    setCurrentPassInput("");
    setNewPassInput("");
    setConfirmPassInput("");
    showToast("Password updated successfully!", "success");
    setActiveTab("unlock");
  };

  const handleResetToDefault = () => {
    updateAppPassword("flowapp2026");
    showToast("Password reset to default: flowapp2026", "info");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#0b0e17] border border-indigo-500/30 shadow-2xl space-y-6 text-white overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Decorative Background Glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className={`p-2 rounded-xl border ${isAppUnlocked ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"}`}>
                {isAppUnlocked ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Password Security
                </h2>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${isAppUnlocked ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}`}>
                  {isAppUnlocked ? "🔓 App Unlocked" : "🔐 Locked Access"}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 pt-1">
              Enter password <code className="px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 font-mono text-[11px]">flowapp2026</code> to unlock.
            </p>
          </div>

          <button
            onClick={() => setIsProtectedModalOpen(false)}
            className="p-2 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex rounded-xl bg-gray-900/80 p-1 border border-gray-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("unlock")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "unlock"
                ? "bg-indigo-600 text-white shadow-md font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Unlock Access</span>
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === "manage"
                ? "bg-indigo-600 text-white shadow-md font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Set / Change Password</span>
          </button>
        </div>

        {/* TAB 1: UNLOCK FORM */}
        {activeTab === "unlock" && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {isAppUnlocked ? (
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
                <div className="flex items-center gap-3 text-emerald-300">
                  <ShieldCheck className="w-6 h-6 shrink-0" />
                  <div>
                    <h3 className="text-sm font-bold">App is Currently Unlocked</h3>
                    <p className="text-xs text-emerald-300/80">
                      Password protection is satisfied. You can lock access anytime below.
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-gray-400">
                    Active Password: <span className="font-mono text-white font-bold">{appPassword}</span>
                  </div>
                  <button
                    onClick={() => {
                      lockApp();
                      showToast("App locked successfully.", "info");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all cursor-pointer active:scale-95"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock App Now</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUnlock} className="space-y-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                    Enter Protection Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
                    <input
                      type={showEnteredPass ? "text" : "password"}
                      value={enteredPassword}
                      onChange={(e) => {
                        setEnteredPassword(e.target.value);
                        setErrorMessage("");
                      }}
                      placeholder="Enter flowapp2026..."
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/60 border border-indigo-500/40 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20 transition-all font-sans"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowEnteredPass(!showEnteredPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showEnteredPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs animate-in slide-in-from-top-1">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleQuickFill}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Fill default: flowapp2026</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={!enteredPassword.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-xl shadow-indigo-500/30 hover:opacity-95 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Verify & Unlock</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: MANAGE & CHANGE PASSWORD */}
        {activeTab === "manage" && (
          <form onSubmit={handleSaveNewPassword} className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200">
              Set or update your application password. Default password is <span className="font-mono font-bold text-amber-300">flowapp2026</span>.
            </div>

            {isAppUnlocked && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-300">Current Password</label>
                <input
                  type={showManagePass ? "text" : "password"}
                  value={currentPassInput}
                  onChange={(e) => setCurrentPassInput(e.target.value)}
                  placeholder="Enter current password..."
                  className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-300">New Password</label>
              <div className="relative">
                <input
                  type={showManagePass ? "text" : "password"}
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  placeholder="Enter new password (e.g. flowapp2026)..."
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl bg-black/60 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowManagePass(!showManagePass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showManagePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-300">Confirm New Password</label>
              <input
                type={showManagePass ? "text" : "password"}
                value={confirmPassInput}
                onChange={(e) => setConfirmPassInput(e.target.value)}
                placeholder="Re-enter new password..."
                className="w-full px-3.5 py-2 rounded-xl bg-black/60 border border-gray-800 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all font-sans"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset to flowapp2026</span>
              </button>

              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save New Password</span>
              </button>
            </div>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-gray-800/80 text-center text-[11px] text-gray-500">
          Google Flow Edition • Secured Access Control
        </div>
      </div>
    </div>
  );
}
