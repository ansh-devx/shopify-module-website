import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Allow access to home page without authentication
    if (req.nextUrl.pathname === "/") {
      return NextResponse.next();
    }

    // For all other protected routes, check authentication
    return NextResponse.next();
  },
  {
    pages: {
      signIn: "/login",
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow home page without authentication
        if (req.nextUrl.pathname === "/") {
          return true;
        }
        // Require authentication for all other routes
        return !!token;
      },
    },
  },
);

// Protect all routes except login, hackathon, home, api, and public assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - hackathon (hackathon page - publicly accessible with auth modal)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|login|hackathon).*)",
  ],
};
