"use client";

import { useSession } from "next-auth/react";
import ContentLayout from "@/components/layout/ContentLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole, HackathonSettings } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import HackathonFilter from "@/components/hackathon/HackathonFilter";
import { useEffect, useState, useRef } from "react";

interface User {
  id: string;
  email: string;
  name: string | null;
  role: UserRole;
  score?: number;
}

interface ScoreEntry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  score: number;
  hackathonSettings: {
    id: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
  };
}

export default function SuperadminDashboard() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const hasFetchedUsers = useRef(false);
  const hasFetchedScores = useRef(false);
  const lastFetchedHackathonId = useRef<string | null>(null);

  useEffect(() => {
    if (hasFetchedUsers.current) return;
    hasFetchedUsers.current = true;

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedHackathonId) return;
    // Reset the ref if hackathon changed
    if (lastFetchedHackathonId.current !== selectedHackathonId) {
      hasFetchedScores.current = false;
      lastFetchedHackathonId.current = selectedHackathonId;
    }
    if (hasFetchedScores.current) return;
    hasFetchedScores.current = true;

    fetchScores();
  }, [selectedHackathonId]);

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

  const fetchScores = async () => {
    if (!selectedHackathonId) return;

    try {
      const response = await fetch(
        `/api/hackathon/scores?hackathonSettingsId=${selectedHackathonId}`,
      );
      const data = await response.json();
      if (data.success) {
        setScores(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch scores:", error);
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
    if (!selectedHackathonId) {
      setMessage({ type: "error", text: "Please select a hackathon first" });
      return;
    }

    try {
      const response = await fetch("/api/hackathon/scores", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          score,
          hackathonSettingsId: selectedHackathonId,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Score updated!" });
        fetchScores();
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

  const handleHackathonChange = (hackathonId: string) => {
    setSelectedHackathonId(hackathonId);
  };

  return (
    <RoleGuard requiredRole={UserRole.SUPERADMIN}>
      <ContentLayout
        title="Superadmin Dashboard"
        description="Manage users, scores, and roles"
      >
        <div className="space-y-8">
          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-accent/10 text-accent"
                  : "bg-red-400/10 text-red-400"
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
                <p className="text-black">Loading users...</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-accent/10">
                      <tr>
                        <th className="text-left py-2 px-4">Email</th>
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Role</th>
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
                                  e.target.value as UserRole,
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
                            <button
                              onClick={() => fetchUsers()}
                              className="text-accent hover:underline"
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

          {/* Score Management Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Score Management</CardTitle>
                <HackathonFilter
                  selectedHackathonId={selectedHackathonId}
                  onHackathonChange={handleHackathonChange}
                />
              </div>
            </CardHeader>
            <CardContent>
              {!selectedHackathonId ? (
                <p className="text-white">
                  Please select a hackathon to manage scores
                </p>
              ) : scores.length === 0 ? (
                <p className="text-white">
                  No participants for this hackathon yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-accent/10">
                      <tr>
                        <th className="text-left py-2 px-4">Email</th>
                        <th className="text-left py-2 px-4">Name</th>
                        <th className="text-left py-2 px-4">Score</th>
                        <th className="text-left py-2 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((scoreEntry) => (
                        <tr
                          key={scoreEntry.id}
                          className="border-b border-gray-100"
                        >
                          <td className="py-3 px-4">{scoreEntry.userEmail}</td>
                          <td className="py-3 px-4">
                            {scoreEntry.userName || "-"}
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              defaultValue={scoreEntry.score}
                              onBlur={(e) =>
                                updateScore(
                                  scoreEntry.userId,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="w-20 px-2 py-1 border border-gray-300 rounded"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => fetchScores()}
                              className="text-accent hover:underline"
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
