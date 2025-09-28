import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "./ui/input";
import { Bell, Search, User, Settings, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLogoutMutation } from "@/features/authApi";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export function SiteHeader() {
  // const router = useRouter();
  // const { user } = useSelector((state) => state.auth);
  // console.log(user);
  // const [logout, { isLoading }] = useLogoutMutation();

  // const handleLogout = async () => {
  //   try {
  //     await logout();
  //     router.push("/login");
  //   } catch (err) {
  //     console.error("Logout failed:", err);
  //   }
  // };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-700/60 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          <SidebarTrigger className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200 p-0">
            <Menu className="h-5 w-5" />
          </SidebarTrigger>

          <nav className="hidden sm:flex items-center text-sm space-x-2">
            <span className="text-gray-500 dark:text-gray-400">Pages</span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-gray-900 dark:text-white font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              Dashboard
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
                className="relative h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
              >
                <Bell className="h-5 w-5 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors duration-200" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 hover:bg-red-600"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-2 shadow-xl">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium">Notifications</h4>
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                  >
                    3 new
                  </Badge>
                </div>
              </div>
              <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-teal-500 rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      New order received
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      2 minutes ago
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      User registration
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      1 hour ago
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md cursor-pointer">
                <div className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-gray-900 dark:text-white">
                      System maintenance
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      3 hours ago
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="p-2 text-center text-sm text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 cursor-pointer rounded-md hover:bg-teal-50 dark:hover:bg-teal-950/20">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 group"
          >
            <Settings className="h-4 w-4 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:rotate-90 transition-all duration-300" />
          </Button>

          {/* User Avatar */}
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full p-0 hover:bg-transparent"
              >
                <Avatar className="h-9 w-9 border-2 border-white dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <AvatarImage
                    src="/diverse-user-avatars.png"
                    alt={user?.name || "User Avatar"}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-teal-500 to-cyan-600 text-white text-sm font-medium">
                    {user?.name?.[0].toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 shadow-xl">
              <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700 mb-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || "User"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {user?.email || "user@example.com"}
                </div>
              </div>
              <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                <User className="h-4 w-4 mr-3 text-gray-500" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                <Settings className="h-4 w-4 mr-3 text-gray-500" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoading}
                className="rounded-md cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-150"
              >
                <span>{isLoading ? "Signing out..." : "Sign out"}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </header>
  );
}
