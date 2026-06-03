"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

const THEME_CHANGE_EVENT = "tdh-theme-change";

function getThemeSnapshot() {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function subscribeToTheme(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  function handleStorageChange(e: StorageEvent) {
    if (
      typeof document !== "undefined" &&
      e.key === "theme" &&
      (e.newValue === "dark" || e.newValue === "light")
    ) {
      document.documentElement.setAttribute("data-theme", e.newValue);
    }
    onStoreChange();
  }

  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");
  const dark = theme === "dark";

  function toggle() {
    const next = !dark;
    const nextTheme = next ? "dark" : "light";

    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", nextTheme);
    }

    try {
      window.localStorage.setItem("theme", nextTheme);
    } catch {
      // Storage can be disabled; the in-memory DOM theme still updates.
    }

    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 flex items-center justify-center text-text-muted hover:text-text transition-colors"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
