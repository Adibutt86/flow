"use client";

import React from "react";
import { CategoryConfig } from "@/lib/categories/types";
import { Ghost, Laugh, MessageCircle, Sparkles, Dog, Eye, Film, Sliders, ArrowRight } from "lucide-react";

interface CategoryCardProps {
  category: CategoryConfig;
  onSelect: () => void;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Ghost: <Ghost className="w-6 h-6 text-rose-400" />,
  Laugh: <Laugh className="w-6 h-6 text-amber-400" />,
  MessageCircle: <MessageCircle className="w-6 h-6 text-emerald-400" />,
  Sparkles: <Sparkles className="w-6 h-6 text-cyan-400" />,
  Dog: <Dog className="w-6 h-6 text-orange-400" />,
  Eye: <Eye className="w-6 h-6 text-purple-400" />,
  Film: <Film className="w-6 h-6 text-blue-400" />,
  Sliders: <Sliders className="w-6 h-6 text-indigo-400" />,
};

export function CategoryCard({ category, onSelect }: CategoryCardProps) {
  return (
    <div
      onClick={onSelect}
      className="group glass-card glass-card-hover rounded-2xl p-5 border border-gray-800 cursor-pointer flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-900/80 border border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
            {CATEGORY_ICONS[category.iconName] || <Sparkles className="w-6 h-6 text-indigo-400" />}
          </div>
          <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {category.badge}
          </span>
        </div>

        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors mb-1.5">
          {category.name}
        </h3>
        <p className="text-xs text-gray-400 line-clamp-2 mb-4">{category.description}</p>
      </div>

      <div className="pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs text-gray-400 group-hover:text-indigo-300">
        <span className="font-medium">Create {category.name}</span>
        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
}
