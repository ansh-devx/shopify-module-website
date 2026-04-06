"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function UserProfile() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const getInitials = () => {
    if (session.user.name) {
      return session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return session.user.email?.substring(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-accent text-background font-semibold hover:bg-accent-hover transition-all duration-200 hover:shadow-[0_0_15px_rgba(141,213,214,0.2)]"
        title={session.user.email || "User"}
      >
        {getInitials()}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-accent/10 bg-surface-1 shadow-2xl shadow-accent/5 z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-accent/10">
            <p className="text-xs text-text-tertiary">Signed in as</p>
            <p className="text-sm font-medium text-text-primary truncate">
              {session.user.email}
            </p>
          </div>
          <div className="py-1">
            <Link
              href="/profile"
              onClick={() => setShowDropdown(false)}
              className="block px-4 py-2 text-sm text-text-secondary hover:bg-accent/10 hover:text-text-primary transition-colors duration-200"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                setShowDropdown(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-400/10 transition-colors duration-200 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
