import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Settings, Menu, Sun, Moon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export function NavBar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const path = usePathname();
  console.log("Current theme:", theme);
  console.log("Resolved theme:", resolvedTheme);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="sticky top-0 z-10 bg-gray/80 backdrop-blur-xl dark:bg-sidebar dark:backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between backdrop-blur-2xl">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <SidebarTrigger className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 p-0">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>

          <nav className="hidden sm:flex items-center text-sm space-x-2">
            <span className="text-gray-500 dark:text-gray-400">Pages</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              {path.split("/").filter(Boolean).pop()}
            </span>
          </nav>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 hover:bg-[var(--muted)] dark:hover:bg-[var(--muted)] rounded-lg transition-all duration-200 group"
              >
                <Bell className="h-5 w-5 group-hover:text-[var(--primary)] transition-colors duration-200" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[var(--primary)] text-[var(--destructive-foreground)] hover:bg-[var(--destructive)]"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-80 p-2 shadow-xl bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)]"
            >
              <div className="px-3 py-2 border-b border-[var(--border)] mb-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Notifications</h4>
                  <Badge
                    variant="secondary"
                    className="bg-[var(--secondary)] text-[var(--secondary-foreground)]"
                  >
                    3 new
                  </Badge>
                </div>
              </div>

              <DropdownMenuItem className="p-3 hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors duration-150">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-[var(--chart-3)] rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">New order received</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      2 minutes ago
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-3 hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors duration-150">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-[var(--chart-2)] rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">User registration</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      1 hour ago
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-3 hover:bg-[var(--muted)] rounded-md cursor-pointer transition-colors duration-150">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-[var(--chart-4)] rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm">System maintenance</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      3 hours ago
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 bg-[var(--border)]" />

              <DropdownMenuItem className="p-2 text-center text-sm text-[var(--primary)] hover:text-[var(--primary)] cursor-pointer rounded-md hover:bg-[var(--muted)] transition-colors duration-150">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings Dropdown */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
          >
            {resolvedTheme === "dark" ? (
              <Sun className="h-4 w-4 text-white group-hover:text-primary transition-all duration-300" />
            ) : (
              <Moon className="h-4 w-4 text-gray-700 group-hover:text-primary transition-all duration-300" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
