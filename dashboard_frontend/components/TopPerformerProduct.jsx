import React from "react";
import { Card, CardContent } from "./ui/card";
import { TrendingUp } from "lucide-react";

const TopPerformerProduct = () => {
  return (
    <Card className="mb-5 bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200  mt-4">
      <CardContent className="px-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-sm text-emerald-600 font-medium">
              TOP PERFORMER
            </p>
            <p className="text-lg font-semibold text-emerald-800">
              Soudeuse à tapis 900 verticale
            </p>
            <p className="text-sm text-emerald-600">4 units sold</p>
          </div>
        </div>
        <p className="text-sm text-emerald-600 mt-2">
          Leading the team with exceptional performance
        </p>
      </CardContent>
    </Card>
  );
};

export { TopPerformerProduct };
