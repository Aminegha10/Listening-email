import React from 'react';
import { TrendingUp, Crown, Trophy } from "lucide-react";

// Example dynamic data from front-end
const dynamicOrders = [
  { orders: 6, sales: 3090, salesAgent: "Sales Agent3" },
  { orders: 6, sales: 3280, salesAgent: "Sales Agent2" },
  { orders: 6, sales: 3230, salesAgent: "Sales Agent1" },
  { orders: 3, sales: 500, salesAgent: "Sales Agent5" },
  { orders: 1, sales: 0, salesAgent: "Sales Agent4" }
];

// Simulated hook for demo purposes
const useGetOrdersByAgentsQuery = () => ({
  data: dynamicOrders,
  isLoading: false,
  error: null,
});

// Mock Card components
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg border ${className}`}>{children}</div>
);
const CardHeader = ({ children, className = "" }) => <div className={`p-6 pb-4 ${className}`}>{children}</div>;
const CardContent = ({ children, className = "" }) => <div className={`px-6 ${className}`}>{children}</div>;
const CardFooter = ({ children, className = "" }) => <div className={`p-6 pt-4 ${className}`}>{children}</div>;
const CardTitle = ({ children, className = "" }) => <h3 className={`text-2xl font-bold ${className}`}>{children}</h3>;
const CardDescription = ({ children, className = "" }) => <p className={`text-gray-600 mt-2 ${className}`}>{children}</p>;

// Color palette for agents
const colors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export const TopSalesAgents = () => {
  const { data: orders, isLoading, error } = useGetOrdersByAgentsQuery();

  // Map backend response into chart-like format
  const chartData = orders?.map((item, index) => ({
    salesAgent: item.salesAgent,
    orders: item.orders,
    sales: item.sales,
    fill: colors[index % colors.length],
  })) ?? [];

  // Determine top performer (by orders)
  const bestAgent = chartData.reduce((prev, current) => 
    !prev || current.orders > prev.orders ? current : prev
  , null);

  return (
    <Card className="flex flex-col max-w-2xl">
      <CardHeader className="items-center pb-0">
        <CardTitle>
          <span className="py-2 px-4 border-none rounded-lg bg-green-100 text-xl text-green-800 font-medium">
            Sales Agent Order Distribution
          </span>
        </CardTitle>
        <CardDescription>January - June 2025</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 pb-0">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-8">Error loading chart data</div>
        ) : (
          <div className="space-y-4 p-6">
            <div className="grid gap-3">
              {chartData.map((agent) => (
                <div key={agent.salesAgent} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: agent.fill }}
                    ></div>
                    <span className="font-medium">{agent.salesAgent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{agent.orders}</span>
                    <span className="text-sm text-gray-500">orders</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex-col gap-3 text-sm border-t bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-b-lg">
        {bestAgent && (
          <div className="w-full">
            {/* Best Sales Agent Badge */}
            <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-r from-teal-50 to-emerald-50 border-2 rounded-xl shadow-md hover:shadow-lg transition-shadow" style={{ borderColor: '#00bca2' }}>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-full shadow-lg" style={{ backgroundColor: '#00bca2' }}>
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="w-4 h-4" style={{ color: '#00bca2' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#00bca2' }}>
                      Top Performer
                    </span>
                  </div>
                  <div className="text-base font-bold text-gray-800">{bestAgent.salesAgent}</div>
                  <div className="flex items-center justify-center gap-1 text-sm">
                    <span className="text-xl font-extrabold" style={{ color: '#00bca2' }}>{bestAgent.orders}</span>
                    <span className="text-gray-600">orders</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance insight */}
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-gray-600">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span>Leading the team with exceptional performance</span>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
