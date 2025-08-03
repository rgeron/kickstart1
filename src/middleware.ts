import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for auth API routes, static files, and other exclusions
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/sitemap.xml") ||
    pathname.startsWith("/robots.txt") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // For all other routes, continue without modification
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes that need to be excluded
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
