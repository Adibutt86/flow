"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, customDuration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success", customDuration?: number) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    const timeout = customDuration || (type === "error" ? 10000 : 7000);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, timeout);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl shadow-2xl backdrop-blur-lg border transition-all duration-300 transform translate-y-0 ${
              toast.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-100"
                : toast.type === "error"
                ? "bg-rose-950/90 border-rose-500/40 text-rose-100"
                : "bg-indigo-950/90 border-indigo-500/40 text-indigo-100"
            }`}
          >
            <div className="flex items-center gap-3">
              {toast.type === "success" && (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              )}
              {toast.type === "error" && (
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              )}
              {toast.type === "info" && (
                <Info className="w-5 h-5 text-indigo-400 shrink-0" />
              )}
              <span className="text-sm font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-white transition-colors ml-4"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
