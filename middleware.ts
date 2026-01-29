import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/discuss",
  "/contest",
  "/practice",
  "/leaderboard",
];

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}
