"use client";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRefreshMutation } from "@/features/authApi";
import { logout } from "@/features/authSlice";
import { useRouter } from "next/navigation";
import { SideBar } from "@/components/SideBar";
import { NavBar } from "@/components/NavBar/NavBar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useState } from "react";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { LogOutScreen } from "@/components/AuthScreens/LogOutScreen";
import { useTheme } from "next-themes";

export default function DashboardLayout({ children }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logOut, setLogOut] = useState(false);
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
  if (logOut) return <LogOutScreen />;

  return (
    <SidebarProvider
      // style={{
      //   "--sidebar-width": "calc(var(--spacing) * 69)",
      //   "--header-height": "calc(var(--spacing) * 12)",
      // }}
    >
      {/* <style jsx global>{`
        @media (min-width: 1536px) {
          :root {
            --sidebar-width: calc(var(--spacing) * 72);
          }
        }
      `}</style> */}
      <SideBar variant="inset" setLogOut={setLogOut} />
      <SidebarInset>
        <NavBar />
        <div className="flex flex-1 flex-col p-6 ">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
