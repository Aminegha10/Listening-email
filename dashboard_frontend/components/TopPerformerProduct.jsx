import React from "react";
import { Card, CardContent } from "./ui/card";
import { TrendingUp } from "lucide-react";

const TopPerformerProduct = () => {
  return (
    <Card className=" bg-gradient-to-r from-[var(--color-destructive)] to-[var(--color-destructive)] border-[var(--color-destructive)]">
      <CardContent className="px-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--color-destructive)] rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-[var(--color-primary)] font-medium">
              TOP PERFORMER
            </p>
            <p className="text-lg font-semibold text-[var(--color-primary)]">
              Soudeuse à tapis 900 verticale
            </p>
            <p className="text-sm text-[var(--color-primary)]">4 units sold</p>
          </div>
        </div>
        <p className="text-sm text-[var(--color-primary)] mt-2">
          Leading the team with exceptional performance
        </p>
      </CardContent>
    </Card>
  );
};

export { TopPerformerProduct };
