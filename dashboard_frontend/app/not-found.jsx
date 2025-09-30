"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Construction, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div>
      {/* Main Card */}
      <Card className=" overflow-hidden min-h-screen w-full  border-2 border-[var(--chart-2)]/20 shadow-xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--chart-2)]/5 via-transparent to-[var(--chart-1)]/5 animate-pulse" />

        <CardContent className="relative z-10 p-12 space-y-8">
          {/* Animated icon with pulse effect */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-[var(--color-primary)]/20 rounded-full animate-ping" />
            <div className="absolute inset-2 bg-[var(--color-primary)]/30 rounded-full animate-pulse" />
            <div className="relative w-24 h-24 bg-[var(--color-primary)]/10 rounded-full flex items-center justify-center border-2 border-[var(--color-primary)]/30">
              <Construction className="h-10 w-10 text-[var(--color-primary)]" />
            </div>
          </div>

          {/* Main heading with gradient text */}
          <div className="space-y-6 text-center">
            <h1 className="text-4xl py-2 text-center font-black bg-[var(--color-primary)]/50  bg-clip-text text-transparent">
              Page Not Found
            </h1>
            <div className="flex items-center justify-center gap-2 text-lg text-muted-foreground">
              <Zap className="h-5 w-5 text-[var(--chart-1)] animate-pulse" />
              <span className="font-medium">In Progress of Developing</span>
              <Zap className="h-5 w-5 text-[var(--chart-1)] animate-pulse" />
            </div>
          </div>

          {/* Description */}
          <p className="text-muted-foreground max-w-md mx-auto text-center leading-relaxed">
            This page is currently under development. Our team is working hard
            to bring you an amazing experience.
          </p>

          {/* Animated progress dots */}
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            />
            <div
              className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            />
            <div
              className="w-3 h-3 bg-[var(--color-primary)] rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            />
          </div>

          <div className="text-center">
            {/* Back to dashboard button */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-medium hover:bg-[var(--color-primary)]/90 transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
