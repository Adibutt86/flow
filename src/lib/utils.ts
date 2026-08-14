import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  }
  return Promise.resolve(false);
}

export async function safeJsonResponse<T = any>(res: Response): Promise<T | null> {
  try {
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      return await res.json();
    }
    const text = await res.text();
    if (!text || text.trim().startsWith("<")) {
      return null;
    }
    return JSON.parse(text) as T;
  } catch (err) {
    console.warn("Failed to parse JSON response:", err);
    return null;
  }
}

