"use client";

import { signOut, useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function UserProfile() {
  const { data: session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
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

  // Extract initials from email or name
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
      {/* Avatar Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-shopify-green text-white font-semibold hover:opacity-90 transition-opacity duration-150"
        title={session.user.email || "User"}
      >
        {getInitials()}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-xs text-gray-600">Signed in as</p>
            <p className="text-sm font-medium text-black truncate">
              {session.user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              onClick={() => setShowDropdown(false)}
              className="block px-4 py-2 text-sm text-black hover:bg-gray-100 hover:text-white transition-colors duration-150"
            >
              Profile
            </Link>
            <button
              onClick={() => {
                setShowDropdown(false);
                signOut({ callbackUrl: "/" });
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
