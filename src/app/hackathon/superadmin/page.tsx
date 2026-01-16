"use client";

import { useSession } from "next-auth/react";
import ContentLayout from "@/components/layout/ContentLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import LogoutButton from "@/components/auth/LogoutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  score?: number;
}

export default function SuperadminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/hackathon/users");
      const data = await response.json();
      if (data.success) {
        setUsers(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const response = await fetch("/api/hackathon/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "User role updated!" });
        fetchUsers();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update role",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    }
  };

  const updateScore = async (userId: string, score: number) => {
    try {
      const response = await fetch("/api/hackathon/scores", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, score }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Score updated!" });
        fetchUsers();
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update score",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    }
  };

  return (
    <RoleGuard requiredRole={UserRole.SUPERADMIN}>
      <ContentLayout
        title="Superadmin Dashboard"
        description="Manage users, scores, and roles"
      >
        <LogoutButton />

        <div className="space-y-8">
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-shopify-green/10 text-shopify-green"
                  : "bg-shopify-red/10 text-shopify-red"
              }`}
            >
              {message.text}
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-gray-600">Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-2 px-4">Email</th>
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Role</th>
                        <th className="text-left py-2 px-4">Score</th>
                        <th className="text-left py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100">
                          <td className="py-3 px-4">{user.email}</td>
                          <td className="py-3 px-4">{user.name || "-"}</td>
                          <td className="py-3 px-4">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                updateUserRole(
                                  user.id,
                                  e.target.value as UserRole
                                )
                              }
                              className="px-2 py-1 border border-gray-300 rounded"
                            >
                              <option value={UserRole.MEMBER}>Member</option>
                              <option value={UserRole.ADMIN}>Admin</option>
                              <option value={UserRole.SUPERADMIN}>
                                Superadmin
                              </option>
                            </select>
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              defaultValue={user.score || 0}
                              onBlur={(e) =>
                                updateScore(
                                  user.id,
                                  parseInt(e.target.value) || 0
                                )
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => fetchUsers()}
                              className="text-shopify-green hover:underline"
                            >
                              Refresh
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </ContentLayout>
    </RoleGuard>
  );
}
