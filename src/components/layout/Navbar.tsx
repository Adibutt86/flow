"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Video, PlusCircle, Sparkles, Film, HelpCircle, Menu, X, Crown, User as UserIcon, Image as ImageIcon, Sun, Moon } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useTheme } from "@/context/ThemeContext";

interface NavbarProps {
  onOpenWizard?: () => void;
  isLight?: boolean;
  onToggleTheme?: () => void;
}

export function Navbar({ onOpenWizard, isLight: isLightProp, onToggleTheme: onToggleThemeProp }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, setIsAuthModalOpen, isLoggedIn } = useUser();
  const { isLight: globalIsLight, toggleTheme: globalToggleTheme } = useTheme();

  const isLight = isLightProp !== undefined ? isLightProp : globalIsLight;
  const onToggleTheme = onToggleThemeProp || globalToggleTheme;

  return (
    <header className={`sticky top-0 z-40 w-full border-b transition-colors duration-300 ${
      isLight
        ? "bg-white/90 border-slate-200 text-slate-900 shadow-sm backdrop-blur-xl"
        : "bg-[#07090e]/90 border-gray-800/60 text-white backdrop-blur-xl"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Logo & Product Name */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform shrink-0">
            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className={`font-black text-sm sm:text-lg tracking-tight truncate ${
                isLight ? "text-slate-900" : "text-white"
              }`}>
                <span className="sm:hidden">AI Studio</span>
                <span className="hidden sm:inline">AI Short Studio</span>
              </span>
              <span className={`text-[9px] sm:text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full border shrink-0 ${
                isLight
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                  : "bg-indigo-500/20 text-indigo-300 border-indigo-500/30"
              }`}>
                Flow
              </span>
            </div>
            <p className={`text-[11px] font-medium hidden md:block truncate ${
              isLight ? "text-slate-600" : "text-gray-400"
            }`}>
              Short-form Video Prompts & Storyboards (8s Clips)
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Actions */}
        <div className="hidden md:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-black transition-colors ${
                  isLight
                    ? "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Ideas</span>
              </Link>

              <Link
                href="/nano-pro"
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-black transition-colors ${
                  isLight
                    ? "text-slate-700 hover:text-slate-950 hover:bg-slate-100"
                    : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                }`}
              >
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span>Nano Pro</span>
              </Link>

              {/* Theme Switcher Button in Header */}
              {onToggleTheme && (
                <button
                  type="button"
                  onClick={onToggleTheme}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer active:scale-95 shadow-sm ${
                    isLight
                      ? "bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-950"
                      : "bg-indigo-950/80 hover:bg-indigo-900 border-indigo-500/40 text-indigo-200"
                  }`}
                  title="Toggle Light / Dark Mode"
                >
                  {isLight ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                      <span>Light Mode</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-indigo-300 fill-indigo-300" />
                      <span>Dark Mode</span>
                    </>
                  )}
                </button>
              )}

              {onOpenWizard && (
                <button
                  onClick={onOpenWizard}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-all active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Video</span>
                </button>
              )}

              {/* User Account Controls */}
              <div className={`flex items-center gap-2 pl-2 border-l ${isLight ? "border-slate-200" : "border-gray-800"}`}>
                <button
                  onClick={() => setIsAuthModalOpen(true)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer shadow-sm active:scale-95 ${
                    isLight
                      ? "bg-indigo-50 border-indigo-200 text-indigo-950 hover:bg-indigo-100"
                      : "bg-indigo-950/40 border-indigo-500/40 text-indigo-200 hover:bg-indigo-900/50"
                  }`}
                >
                  <UserIcon className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg-primary text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/30 hover:opacity-95 transition-all active:scale-95 cursor-pointer"
            >
              <UserIcon className="w-4 h-4" />
              <span>Login to Access Pages</span>
            </button>
          )}
        </div>

        {/* Mobile Header Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {/* Theme Switcher Icon Button for Mobile */}
          {onToggleTheme && (
            <button
              type="button"
              onClick={onToggleTheme}
              className={`p-2 rounded-xl border text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                isLight ? "bg-amber-100 border-amber-300 text-amber-950" : "bg-zinc-800 border-zinc-700 text-zinc-200"
              }`}
              title="Toggle Light / Dark Mode"
            >
              {isLight ? <Sun className="w-4 h-4 text-amber-600 fill-amber-500" /> : <Moon className="w-4 h-4 text-indigo-300" />}
            </button>
          )}

          {isLoggedIn ? (
            <>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border font-bold text-xs active:scale-95 cursor-pointer ${
                  isLight
                    ? "bg-indigo-50 border-indigo-200 text-indigo-950"
                    : "bg-indigo-950/60 border-indigo-500/40 text-indigo-200"
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span className="max-w-[70px] truncate">{currentUser.name.split(" ")[0]}</span>
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 rounded-xl border active:scale-95 transition-all ${
                  isLight
                    ? "bg-slate-100 border-slate-300 text-slate-800 hover:text-slate-950"
                    : "bg-gray-900 border-gray-800 text-gray-300 hover:text-white"
                }`}
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-bg-primary text-white font-bold text-xs active:scale-95 cursor-pointer shadow-md"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Login</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Drawer Menu (Only when logged in) */}
      {mobileMenuOpen && isLoggedIn && (
        <div className={`md:hidden border-t px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2 ${
          isLight ? "bg-white border-slate-200 text-slate-900" : "bg-[#0d1019] border-gray-800/80 text-white"
        }`}>
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-black transition-colors ${
              isLight ? "text-slate-700 hover:bg-slate-100" : "text-gray-200 hover:bg-gray-800/60"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>AI Idea Generator</span>
          </Link>

          <Link
            href="/nano-pro"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-black transition-colors ${
              isLight ? "text-slate-700 hover:bg-slate-100" : "text-gray-200 hover:bg-gray-800/60"
            }`}
          >
            <ImageIcon className="w-4 h-4 text-purple-500" />
            <span>Nano Pro Generator</span>
          </Link>

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              setIsAuthModalOpen(true);
            }}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold border ${
              isLight ? "bg-slate-50 border-slate-300 text-slate-900" : "bg-gray-900/80 border-gray-800 text-gray-200"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {currentUser.isMaster ? <Crown className="w-4 h-4 text-amber-500" /> : <UserIcon className="w-4 h-4 text-indigo-500" />}
              <span>Account: {currentUser.name}</span>
            </div>
            <span className="text-xs text-indigo-600 font-black">Switch</span>
          </button>

          {onOpenWizard && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWizard();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-bg-primary text-white font-bold text-sm shadow-md mt-2 cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Video Project</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
}
