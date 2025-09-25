import React from "react";
import { Separator } from "./ui/separator";

const SepararorTables = ({ title, subtitle, icon, className = "" }) => {
  return (
    <div className={`py-8 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-6">
          <Separator className="flex-1" />
          {(title || icon) && (
            <div className="px-6 flex items-center gap-3">
              {icon && (
                <div className="p-2 rounded-full bg-primary/10">{icon}</div>
              )}
              {title && (
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
          <Separator className="flex-1" />
        </div>
      </div>
    </div>
  );
};

export { SepararorTables };
