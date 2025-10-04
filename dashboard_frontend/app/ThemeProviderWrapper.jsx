// app/ThemeProviderWrapper.jsx
"use client";
import { ThemeProvider } from "next-themes";
import InitTheme from "../components/Theme/InitTheme";

export default function ThemeProviderWrapper({ children }) {
  return (
    <ThemeProvider
      attribute="class" // toggles `dark` class on <html>
      defaultTheme="system" // respects OS preference
      enableSystem // allows system theme switching
      disableTransitionOnChange // optional: prevents flicker
    >
      <InitTheme />
      {children}
    </ThemeProvider>
  );
}
