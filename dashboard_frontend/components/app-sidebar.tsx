"use client"

import type * as React from "react"
import { Home, Table, CreditCard, Globe, User, LogIn, UserPlus, HelpCircle } from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"

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
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props} className="border-r bg-white dark:bg-gray-800">
      <SidebarHeader className="border-b border-gray-100 dark:border-gray-700">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-[22px]">
              <a href="/" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-teal-500">
                  <div className="w-4 h-4 bg-white rounded-sm"></div>
                </div>
                <span className="text-sm font-bold text-gray-700 dark:text-white">PURITY UI DASHBOARD</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.accountPages} title="ACCOUNT PAGES" className="mt-6" />
      </SidebarContent>
      <SidebarFooter className="p-4">
        <Card className="bg-teal-500 text-white p-4 text-center shadow-lg border-0">
          <HelpCircle className="h-8 w-8 mx-auto mb-2" />
          <h3 className="font-semibold mb-1">Need help?</h3>
          <p className="text-sm text-teal-100 mb-3">Please check our docs</p>
          <Button variant="secondary" size="sm" className="bg-white text-teal-500 hover:bg-gray-100 font-medium">
            DOCUMENTATION
          </Button>
        </Card>
      </SidebarFooter>
    </Sidebar>
  )
}
