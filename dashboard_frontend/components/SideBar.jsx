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
  LogOut,
  MoreHorizontal,
  Settings,
  Users,
} from "lucide-react";
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
import { usePathname } from "next/navigation";
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
      badge: null,
    },
    {
      title: "Records",
      url: "/dashboard/tables",
      icon: Table,
      badge: "New",
    },
    {
      title: "RTL",
      url: "/dashboard/rtl",
      icon: Globe,
      badge: null,
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: Settings,
      badge: null,
    },
  ],
};

export function SideBar({ setLogOut, ...props }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === "admin";
  const [logout, { isLoading }] = useLogoutMutation();
  const [adminCollapsed, setAdminCollapsed] = useState(false);
  const [settingsCollapsed, setSettingsCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setLogOut(true);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  const isActiveRoute = (url) => {
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(url);
  };

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="p-0 border-sidebar-border bg-sidebar shadow-xl z-20"
    >
      <SidebarHeader className="border-sidebar-border h-32 bg-gradient-to-br from-primary/100 via-primary/3 to-transparent py-6 px-4 flex justify-center items-center">
        <Link href="/" className="flex items-center justify-center">
          <div className=" w-64 flex items-center justify-center">
            <img src="/SmabLogo.jpg" alt="Logo" className="h-full w-full" />
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 py-8 space-y-8">
        <div className="space-y-3">
          <div className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
            Main
          </div>
          <SidebarMenu className="space-y-2">
            {data.navMain.map((item) => {
              const isActive = isActiveRoute(item.url);
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "group relative rounded-xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 hover:bg-sidebar-accent/80 hover:text-sidebar-accent-foreground hover:shadow-sm",
                      isActive &&
                        "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20 hover:bg-primary/15"
                    )}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center gap-4 w-full"
                    >
                      <item.icon
                        className={cn(
                          "h-5 w-5 transition-all duration-300",
                          isActive
                            ? "text-primary scale-110"
                            : "text-muted-foreground group-hover:text-sidebar-accent-foreground"
                        )}
                      />
                      <span className="flex-1 font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-auto text-xs bg-primary/10 text-primary border-primary/20 font-semibold px-2.5 py-0.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-sm"></div>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </div>

        {isAdmin && (
          <div className="space-y-3">
            <div className="px-3 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">
              Admin
            </div>
            <Collapsible open={adminCollapsed} onOpenChange={setAdminCollapsed}>
              <SidebarMenuItem className="list-none">
                <CollapsibleTrigger asChild className="">
                  <SidebarMenuButton
                    className={cn(
                      "group rounded-xl px-4 py-3.5  text-sm font-semibold transition-all duration-300  text-black dark:hover:bg-destructive/10  dark:hover:text-destructive hover:shadow-sm",
                      (adminCollapsed == true ||
                        pathname === "/dashboard/administration/users") &&
                        "dark:bg-destructive/10 dark:text-destructive shadow-sm bg-[#d40924]/10 text-[#d40924] ring-1 ring-[#d40924]/20 hover:bg-[#d40924]/15"
                    )}
                  >
                    <Shield className="h-5 w-5 dark:text-destructive/80  text-[#d40924]/80 transition-colors duration-300" />
                    <span className="flex-1 font-medium">Administration</span>
                    <ChevronUp
                      className={cn(
                        "ml-auto h-4 w-4 transition-all duration-300 text-muted-foreground dark:text-destructive",
                        adminCollapsed ? "rotate-0" : "rotate-180"
                      )}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent className="transition-all duration-300 data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <SidebarMenuSub className="ml-8 mt-3 mr-0 pr-0 rounded-xl space-y-2 !border-none ">
                    <SidebarMenuSubItem className=" rounded-xl">
                      <Link href="/dashboard/administration/users">
                        <SidebarMenuButton
                          className={cn(
                            "flex items-center gap-2 pl-4 text-sm font-medium rounded-lg transition-all duration-200 hover:bg-primary/10 hover:text-primary bg-sidebar-accent ",
                            pathname === "/dashboard/administration/users" &&
                              "bg-primary/10 text-primary"
                          )}
                        >
                          <Users className="h-5 w-5 text-primary  transition-colors duration-300" />
                          <span className="flex-1 font-medium">Users</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          </div>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border bg-sidebar/50  p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-14 hover:bg-sidebar-accent/50 rounded-xl transition-all duration-300">
                  <div className="flex items-center gap-4 w-full">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 ring-1 ring-primary/20">
                        <User2 className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-sidebar rounded-full shadow-sm"></div>
                    </div>
                    <div className="flex-1 text-left">
                      <div className="text-sm font-semibold text-sidebar-foreground">
                        {user?.name || "User"}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {user?.email || "user@example.com"}
                      </div>
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground group-hover:text-sidebar-foreground transition-colors duration-300" />
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[280px] p-3 shadow-xl border border-sidebar-border rounded-xl"
                align="start"
              >
                <div className="px-3 py-3 border-b border-sidebar-border mb-3 rounded-lg bg-sidebar-accent/30">
                  <div className="text-sm font-semibold text-sidebar-foreground">
                    {user?.name || "User"}
                  </div>
                  <div className="text-xs text-muted-foreground font-medium">
                    {user?.email || "user@example.com"}
                  </div>
                </div>
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors duration-200 py-2.5">
                  <User className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="font-medium">Account Settings</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors duration-200 py-2.5">
                  <CreditCard className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="font-medium">Billing & Plans</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem className="rounded-lg cursor-pointer hover:bg-sidebar-accent transition-colors duration-200 py-2.5">
                  <HelpCircle className="h-4 w-4 mr-3 text-muted-foreground" />
                  <span className="font-medium">Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-3" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-lg cursor-pointer text-red-500 hover:bg-destructive/10 transition-colors duration-200 py-2.5 flex items-center group"
                  disabled={isLoading}
                >
                  <LogOut className="h-4 w-4 mr-3 text-red-500 group-hover:text-white transition-colors duration-200" />
                  <span className="font-medium group-hover:text-white">
                    {isLoading ? "Signing out..." : "Sign out"}
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
