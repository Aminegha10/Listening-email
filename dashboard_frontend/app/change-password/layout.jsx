"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  const router = useRouter();
  const { accessToken } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      router.replace("/login");
    } else {
      setLoading(false);
    }
  }, [accessToken, router]);

  if (loading) return null; // don't render anything until check is done

  return <>{children}</>;
}
