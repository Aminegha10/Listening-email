// Skeleton loader for sidebar preview
export function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar skeleton */}
      <div className="w-72 bg-sidebar-background border-r border-sidebar-border p-4 space-y-4">
        <div className="flex items-center space-x-3 animate-pulse">
          <div className="w-8 h-8 bg-primary/20 rounded-lg" />
          <div className="h-5 bg-muted rounded w-24" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-2 animate-pulse"
            >
              <div className="w-4 h-4 bg-muted rounded" />
              <div className="h-4 bg-muted rounded flex-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex-1 flex flex-col">
        {/* Header skeleton */}
        <div className="h-12 border-b border-border bg-card px-6 flex items-center justify-between animate-pulse">
          <div className="h-6 bg-muted rounded w-48" />
          <div className="flex space-x-3">
            <div className="w-8 h-8 bg-muted rounded-full" />
            <div className="w-8 h-8 bg-muted rounded-full" />
          </div>
        </div>

        {/* Content skeleton */}
        <div className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-lg p-6 space-y-2"
              >
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-8 bg-muted rounded w-16" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="h-5 bg-muted rounded w-32" />
              <div className="h-64 bg-muted rounded" />
            </div>
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <div className="h-5 bg-muted rounded w-28" />
              <div className="relative h-64 bg-muted/30 rounded overflow-hidden">
                {/* Simulated area chart with curved shape */}
                <div className="absolute bottom-0 left-0 w-full h-full">
                  <svg className="w-full h-full" viewBox="0 0 300 120">
                    <defs>
                      <linearGradient
                        id="chartGradient"
                        x1="0%"
                        y1="0%"
                        x2="0%"
                        y2="100%"
                      >
                        <stop
                          offset="0%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity="0.3"
                        />
                        <stop
                          offset="100%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity="0.1"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M0,80 Q50,60 100,70 T200,50 T300,65 L300,120 L0,120 Z"
                      fill="url(#chartGradient)"
                      className="animate-pulse"
                    />
                    <path
                      d="M0,80 Q50,60 100,70 T200,50 T300,65"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      className="animate-pulse"
                      opacity="0.6"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
