"use client";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const timeRangeOptions = [
  { value: "thisWeek", label: "This Week", shortLabel: "Week" },
  { value: "thisMonth", label: "This Month", shortLabel: "Month" },
  { value: "currentYear", label: "Current Year", shortLabel: "Year" },
];

export function TimeRangeSelector({ value, onChange, className = "" }) {
  return (
    <div className=" p-1 bg-muted rounded-lg w-[266px]">
      <div className="flex items-center">
        {timeRangeOptions.map((option, index) => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-8 px-3 cursor-pointer text-xs font-medium transition-all duration-200 relative",
              index === 0 && "rounded-r-none",
              index === timeRangeOptions.length - 1 && "rounded-l-none",
              index > 0 &&
                index < timeRangeOptions.length - 1 &&
                "rounded-none",
              value === option.value
                ? "bg-background text-foreground shadow-sm border border-border z-10"
                : "hover:bg-accent/50 hover:text-accent-foreground border-transparent",
              index > 0 && value !== option.value && "border-l border-border/30"
            )}
          >
            <span className="sm:hidden">{option.shortLabel}</span>
            <span className="hidden sm:inline">{option.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
