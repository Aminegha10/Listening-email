"use client";

import {
  Home,
  Table,
  CreditCard,
  Globe,
  User,
  LogIn,
  UserPlus,
  HelpCircle,
  User2,
  ChevronUp,
  Shield,
  Settings,
  LogOut,
  MoreHorizontal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useLogoutMutation } from "@/features/authApi";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { useState } from "react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      badge: null,
    },
    {
      title: "Tables",
      url: "/dashboard/tables",
      icon: Table,
      badge: "New",
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
      badge: null,
    },
    {
      title: "RTL",
      url: "/dashboard/rtl",
      icon: Globe,
      badge: null,
    },
  ],
  accountPages: [
    {
      title: "Profile",
      url: "/profile",
      icon: User,
    },
    {
      title: "Sign In",
      url: "/signin",
      icon: LogIn,
    },
    {
      title: "Sign Up",
      url: "/signup",
      icon: UserPlus,
    },
  ],
};

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const [logout, { isLoading }] = useLogoutMutation();
  const [adminCollapsed, setAdminCollapsed] = useState(false);
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="p-0 border-gray-200/60 dark:border-gray-700/60 bg-white dark:bg-gray-900 shadow-lg"
    >
      <SidebarHeader className="border-b border-gray-100/80 dark:border-gray-700/80 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-800 dark:to-gray-800 py-[18px]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-0 hover:bg-transparent"
            >
              <Link href="/" className="flex items-center gap-3 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-800 dark:text-white leading-tight">
                    PURITY UI
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-3 py-6 space-y-6">
        {/* Main Navigation */}
        <div className="space-y-2">
          <div className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            Main
          </div>
          <SidebarMenu className="space-y-1">
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "group relative rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/30 dark:hover:text-teal-300",
                    item.isActive &&
                      "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300 shadow-sm"
                  )}
                >
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 w-full"
                  >
                    <item.icon
                      className={cn(
                        "h-5 w-5 transition-colors duration-200",
                        item.isActive
                          ? "text-teal-600 dark:text-teal-400"
                          : "text-gray-500 dark:text-gray-400"
                      )}
                    />
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="secondary"
                        className="ml-auto text-xs bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-300"
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {item.isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r"></div>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="space-y-2">
            <div className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
              Admin
            </div>
            <Collapsible open={adminCollapsed} onOpenChange={setAdminCollapsed}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="group rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30 dark:hover:text-red-300">
                    <Shield className="h-5 w-5 text-red-500 dark:text-red-400" />
                    <span className="flex-1">Administration</span>
                    <ChevronUp
                      className={cn(
                        "ml-auto h-4 w-4 transition-transform duration-200",
                        adminCollapsed ? "rotate-0" : "rotate-180"
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="transition-all duration-200 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <SidebarMenuSub className="ml-6 mt-2 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                    <SidebarMenuSubItem>
                      <Link
                        href="/dashboard/administration/users"
                        className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-150"
                      >
                        Users Management
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link
                        href="/settings/security"
                        className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-150"
                      >
                        Security Settings
                      </Link>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <Link
                        href="/settings/notifications"
                        className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-150"
                      >
                        Notifications
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </div>
        )}

        {/* Settings Section */}
        {/* <div className="space-y-2">
          <div className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
            Preferences
          </div>
          <Collapsible open={settingsCollapsed} onOpenChange={setSettingsCollapsed}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="group rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/30 dark:hover:text-blue-300">
                  <Settings className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  <span className="flex-1">Settings</span>
                  <ChevronUp className={cn(
                    "ml-auto h-4 w-4 transition-transform duration-200",
                    settingsCollapsed ? "rotate-0" : "rotate-180"
                  )} />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent className="transition-all duration-200 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                <SidebarMenuSub className="ml-6 mt-2 space-y-1 border-l border-gray-200 dark:border-gray-700 pl-4">
                  <SidebarMenuSubItem>
                    <Link 
                      href="/settings/profile"
                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-150"
                    >
                      Profile Settings
                    </Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link 
                      href="/settings/security"
                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-150"
                    >
                      Security & Privacy
                    </Link>
                  </SidebarMenuSubItem>
                  <SidebarMenuSubItem>
                    <Link 
                      href="/settings/notifications"
                      className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 rounded-md hover:bg-gray-50 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors duration-150"
                    >
                      Notifications
                    </Link>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </div> */}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                className="h-12"
                >
                  <div className="flex items-center gap-3 w-full">
                    {/* Avatar */}
                    <div className="relative">
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shadow-md  transition-shadow duration-300">
                        <User2 className="h-4 w-4 text-white" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                    </div>
                    {/* User Info */}
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name || "User"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {user?.email || "user@example.com"}
                      </div>
                    </div>
                    {/* Icon */}
                    <MoreHorizontal className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors duration-200" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[280px] p-2 shadow-xl border border-gray-200 dark:border-gray-700"
                align="start"
              >
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
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                  <CreditCard className="h-4 w-4 mr-3 text-gray-500" />
                  <span>Billing & Plans</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                  <HelpCircle className="h-4 w-4 mr-3 text-gray-500" />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-2" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-md cursor-pointer text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors duration-150"
                  disabled={isLoading}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  <span>{isLoading ? "Signing out..." : "Sign out"}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
