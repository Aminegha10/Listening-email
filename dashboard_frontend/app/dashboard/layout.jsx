"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRefreshMutation } from "@/features/authApi";
import { setCredentials, logout } from "@/features/authSlice";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const accessToken = useSelector((state) => state.auth.accessToken);
  const [refresh, { isLoading }] = useRefreshMutation();

  useEffect(() => {
    const checkAccess = async () => {
      if (!accessToken) {
        try {
          console.log('z')
          const res = await refresh().unwrap();
          dispatch(
            setCredentials({ accessToken: res.accessToken, user: res.user })
          );
        } catch {
          dispatch(logout());
          router.push("/login");
        }
      }
    };
    checkAccess();
  }, [accessToken, dispatch, refresh, router]);

  // Optional: show loading spinner while refreshing token
  if (isLoading) return <div>Loading...</div>;

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
