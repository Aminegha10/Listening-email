"use client";
import { useTheme } from "next-themes";
import { useEffect } from "react";

export default function InitTheme() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // If user hasn't chosen a theme yet, use system
    if (!localStorage.getItem("theme")) {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(systemPrefersDark ? "dark" : "light");
    }
  }, [setTheme]);

  return null;
}
