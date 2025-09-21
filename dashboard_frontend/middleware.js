import { NextResponse } from "next/server";

export function middleware(req) {
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const url = req.nextUrl.clone();
  const path = url.pathname;

  // If user is NOT logged in and trying to access dashboard → redirect to login
  if (!refreshToken && path.startsWith("/dashboard")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // If user IS logged in and trying to access login → redirect to dashboard
  if (refreshToken && path === "/login") {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // Otherwise, allow
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"], // apply middleware
};
