"use client";

import React from "react";
import Link from "next/link";
import { Video, PlusCircle, Sparkles, Film, HelpCircle } from "lucide-react";

interface NavbarProps {
  onOpenWizard?: () => void;
}

export function Navbar({ onOpenWizard }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/60 bg-[#090b10]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Product Name */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <Video className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-white tracking-tight">
                AI Short Studio
              </span>
              <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Google Flow Edition
              </span>
            </div>
            <p className="text-xs text-gray-400 font-normal hidden sm:block">
              Short-form Video Prompts & Storyboards (8s Clips)
            </p>
          </div>
        </Link>

        {/* Navigation Actions */}
        <div className="flex items-center gap-3">
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
            href="#google-flow-info"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-gray-800/50 transition-colors"
          >
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>Google Flow Guide</span>
          </a>

          <button
            onClick={onOpenWizard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl gradient-bg-primary text-white font-medium text-sm shadow-lg shadow-indigo-500/25 hover:opacity-95 hover:shadow-indigo-500/40 transition-all active:scale-95 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Video</span>
          </button>
        </div>
      </div>
    </header>
  );
}
