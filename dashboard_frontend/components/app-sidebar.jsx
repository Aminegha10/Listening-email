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
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { useLogoutMutation } from "@/features/authApi";
import { useRouter } from "next/navigation";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Tables",
      url: "/dashboard/tables",
      icon: Table,
    },
    {
      title: "Billing",
      url: "/dashboard/billing",
      icon: CreditCard,
    },
    {
      title: "RTL",
      url: "/dashboard/rtl",
      icon: Globe,
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

  const [logout, { isLoading }] = useLogoutMutation();
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
      className="border-r bg-white dark:bg-gray-800"
    >
      <SidebarHeader className="border-b border-gray-100 dark:border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-[22px]"
            >
              <Link href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-500">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-white">
                  PURITY UI DASHBOARD
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <NavMain items={data.navMain} />
        <NavSecondary
          items={data.accountPages}
          title="ACCOUNT PAGES"
          className="mt-6"
        />
        {/* Collapsible Menu */}
        <Collapsible>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton>
                Settings
                <ChevronUp className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <Link href="/settings/profile">Profile</Link>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <Link href="/settings/security">Security</Link>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <Link href="/settings/notifications">Notifications</Link>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleLogout()}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
