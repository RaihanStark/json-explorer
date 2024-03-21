import { NextResponse } from "next/server";

export function middleware(request) {
  console.log("request.cookies", request.cookies.get("password"));
  if (
    request.cookies.has("password") &&
    request.cookies.get("password").value === process.env.PASSWORD
  ) {
    return NextResponse.next();
  }

  if (request.url.includes("/password")) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/password", request.url));
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
