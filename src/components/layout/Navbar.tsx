"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Video, PlusCircle, Sparkles, Film, HelpCircle, Menu, X } from "lucide-react";

interface NavbarProps {
  onOpenWizard?: () => void;
}

export function Navbar({ onOpenWizard }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/60 bg-[#07090e]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Product Name */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Video className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-bold text-base sm:text-lg text-white tracking-tight">
                AI Short Studio
              </span>
              <span className="text-[9px] sm:text-[10px] uppercase font-semibold px-1.5 sm:px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Flow Edition
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-normal hidden sm:block">
              Short-form Video Prompts & Storyboards (8s Clips)
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
          >
            <Film className="w-4 h-4 text-indigo-400" />
            <span>Projects</span>
          </Link>

          <Link
            href="/ideas"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Ideas</span>
          </Link>

          <a
            href="/#google-flow-info"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Google Flow Guide</span>
          </a>

          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg-primary text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 hover:shadow-indigo-500/40 transition-all active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Video</span>
            </button>
          )}
        </div>

        {/* Mobile Header Buttons */}
        <div className="flex md:hidden items-center gap-2">
          {onOpenWizard && (
            <button
              onClick={onOpenWizard}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl gradient-bg-primary text-white font-semibold text-xs shadow-md active:scale-95 cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white active:scale-95 transition-all"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800/80 bg-[#0d1019] px-4 py-4 space-y-2 shadow-2xl animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800/60 transition-colors"
          >
            <Film className="w-4 h-4 text-indigo-400" />
            <span>Projects Dashboard</span>
          </Link>

          <Link
            href="/ideas"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800/60 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>AI Idea Generator</span>
          </Link>

          <a
            href="/#google-flow-info"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-200 hover:text-white hover:bg-gray-800/60 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Google Flow Constraint Guide</span>
          </a>

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
