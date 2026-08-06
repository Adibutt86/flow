"use client";

import React from "react";

export function PasswordProtector({ children }: { children: React.ReactNode }) {
  // Password prompt removed per user requirement
  return <>{children}</>;
}
