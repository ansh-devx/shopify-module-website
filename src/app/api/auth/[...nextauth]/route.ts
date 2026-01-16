import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma/enums";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/hackathon",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as any).role || UserRole.MEMBER;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Set default role to MEMBER for new users
      await prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.MEMBER },
      });
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
