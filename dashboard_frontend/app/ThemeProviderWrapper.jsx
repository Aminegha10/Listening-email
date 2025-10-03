// app/ThemeProviderWrapper.jsx
"use client";
import { ThemeProvider } from "next-themes";

export default function ThemeProviderWrapper({ children }) {
  return (
    <ThemeProvider attribute="class"       // toggles `dark` class on <html>
      defaultTheme="dark"   // respects OS preference
      enableSystem            // allows system theme switching
      disableTransitionOnChange // optional: prevents flicker
    >
      {children}
    </ ThemeProvider>
  );
}
