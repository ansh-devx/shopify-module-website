"use client";

import { signOut, useSession } from "next-auth/react";

export default function LogoutButton() {
  const { data: session } = useSession();

  if (!session) return null;

  return (
    <div className="flex items-center gap-4 mb-6 p-4 bg-surface-2 rounded-lg border border-accent/10">
      <div className="flex-1">
        <p className="text-sm text-text-tertiary">Signed in as</p>
        <p className="text-white font-medium">{session.user?.email}</p>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/hackathon" })}
        className="px-4 py-2 bg-red-400/80 hover:bg-red-400 text-white rounded-lg transition-colors duration-200 font-medium"
      >
        Logout
      </button>
    </div>
  );
}

