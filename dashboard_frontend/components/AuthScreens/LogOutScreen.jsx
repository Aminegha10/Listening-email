import React from "react";
import { LogOut } from "lucide-react";

export const LogOutScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-slate-900 dark:via-rose-900/20 dark:to-pink-900/20 flex flex-col items-center justify-center text-center space-y-8 p-4">
      <div className="relative">
        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-3xl w-32 h-32 -top-4 -left-4" />
        <LogOut className="h-24 w-24 text-red-500 relative z-10 drop-shadow-lg" />
      </div>
      <div className="space-y-4 max-w-md">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 bg-clip-text text-transparent">
          You have successfully logged out!
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          Redirecting to the login page...
        </p>
      </div>
      <div className="flex items-center justify-center space-x-2">
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};
