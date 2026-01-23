import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

// Protect all routes except login, hackathon, api, and public assets
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
