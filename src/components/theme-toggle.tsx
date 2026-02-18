"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type Theme = "light" | "dark";

const THEME_STORAGE_KEY = "devforces-theme";

const applyTheme = (theme: Theme) => {
  const root = document.documentElement;
  const isDark = theme === "dark";

  root.classList.toggle("dark", isDark);
  root.style.colorScheme = theme;
};

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setMounted(true);
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleSystemThemeChange = () => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        const nextTheme = media.matches ? "dark" : "light";
        setTheme(nextTheme);
      }
    };

    media.addEventListener("change", handleSystemThemeChange);
    return () => media.removeEventListener("change", handleSystemThemeChange);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    setTheme(nextTheme);
  };

  if (!mounted) {
    return (
      <div className="h-9 w-16 rounded-full border border-border/80 bg-card px-1 shadow-sm" />
    );
  }

  return (
    <button
      type="button"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      onClick={toggleTheme}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-border/80 bg-card px-1 shadow-sm transition-all duration-300 hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <span
        className={cn(
          "absolute h-7 w-7 rounded-full bg-primary shadow-sm transition-transform duration-300 ease-out",
          theme === "dark" ? "translate-x-7" : "translate-x-0"
        )}
      />
      <span className="relative z-10 flex w-full items-center justify-between px-1">
        <Sun
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            theme === "light" ? "text-amber-500" : "text-muted-foreground"
          )}
        />
        <Moon
          className={cn(
            "h-4 w-4 transition-colors duration-300",
            theme === "dark" ? "text-slate-100" : "text-muted-foreground"
          )}
        />
      </span>
    </button>
  );
}
