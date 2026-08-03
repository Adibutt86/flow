"use client";

import React, { useState, useEffect } from "react";
import { Lock, ArrowRight } from "lucide-react";

export function PasswordProtector({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem("flow_auth");
    if (authStatus === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "flowapp2026") {
      sessionStorage.setItem("flow_auth", "authenticated");
      setIsAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  // While checking session storage, show nothing to avoid flicker
  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#07090e]"></div>;
  }

  // If authenticated, render the app
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Otherwise, show the password prompt
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#07090e] backdrop-blur-sm">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-800">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Restricted</h2>
          <p className="text-sm text-gray-400 mt-1 text-center">
            Please enter the password to access AI Short Studio.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className={`w-full px-4 py-3 bg-black/50 border ${
                error ? "border-rose-500" : "border-gray-700"
              } rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors`}
              autoFocus
            />
            {error && (
              <p className="text-xs text-rose-400 mt-2 ml-1">
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 gradient-bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity"
          >
            Enter <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
