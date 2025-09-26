"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRefreshMutation } from "@/features/authApi";
import { setCredentials, logout } from "@/features/authSlice";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [refresh] = useRefreshMutation();
  const [loading, setLoading] = useState(true); // we control this!

  useEffect(() => {
    const checkAccess = async () => {
      if (!accessToken) {
        try {
          console.log("z");
          const res = await refresh().unwrap();
          console.log(res);
          // dispatch(
          //   setCredentials({ accessToken: res.accessToken, user: res.user })
          // );
        } catch {
          dispatch(logout());
          router.push("/login");
        }
      }
      setLoading(false); // even if accessToken existed already
    };
    checkAccess();
  }, [accessToken, dispatch, refresh, router]);

  // Optional: show loading spinner while refreshing token
  if (loading) return <DashboardSkeleton />;

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
