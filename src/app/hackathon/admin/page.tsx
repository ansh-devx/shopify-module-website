"use client";

import { useSession } from "next-auth/react";
import ContentLayout from "@/components/layout/ContentLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import LogoutButton from "@/components/auth/LogoutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import DateTimePicker from "@/components/ui/DateTimePicker";
import HackathonFilter from "@/components/hackathon/HackathonFilter";
import { useState, useEffect, useRef } from "react";

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

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    questionLink: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Score Management State
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [selectedHackathonId, setSelectedHackathonId] = useState<string | null>(
    null,
  );
  const [scoresLoading, setScoresLoading] = useState(false);
  const hasFetchedScores = useRef(false);
  const lastFetchedHackathonId = useRef<string | null>(null);

  // Fetch scores for selected hackathon
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

  const fetchScores = async () => {
    if (!selectedHackathonId) return;

    setScoresLoading(true);
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
    } finally {
      setScoresLoading(false);
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

  // Get minimum date (today) in YYYY-MM-DD format
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  // Validate that end time is after start time
  const validateTimes = () => {
    if (
      !formData.startDate ||
      !formData.startTime ||
      !formData.endDate ||
      !formData.endTime
    ) {
      return { valid: false, error: "All fields are required" };
    }

    const startDateTime = new Date(
      `${formData.startDate}T${formData.startTime}`,
    );
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);
    const now = new Date();

    if (startDateTime < now) {
      return { valid: false, error: "Start time cannot be in the past" };
    }

    if (endDateTime <= startDateTime) {
      return { valid: false, error: "End time must be after start time" };
    }

    return { valid: true, error: null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    // Validate times
    const validation = validateTimes();
    if (!validation.valid) {
      setMessage({
        type: "error",
        text: validation.error || "Validation failed",
      });
      setLoading(false);
      return;
    }

    try {
      const startDateTime = new Date(
        `${formData.startDate}T${formData.startTime}`,
      );
      const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

      const response = await fetch("/api/hackathon/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionLink: formData.questionLink,
          startTime: startDateTime,
          endTime: endDateTime,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Settings updated successfully!" });
        setFormData({
          questionLink: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
        });
      } else {
        setMessage({
          type: "error",
          text: data.error || "Failed to update settings",
        });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RoleGuard requiredRole={UserRole.ADMIN}>
      <ContentLayout
        title="Admin Dashboard"
        description="Manage hackathon settings and scores"
      >
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
              <CardTitle>Create New Hackathon</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Question Link (Google Docs)
                  </label>
                  <input
                    type="url"
                    value={formData.questionLink}
                    onChange={(e) =>
                      setFormData({ ...formData, questionLink: e.target.value })
                    }
                    placeholder="https://docs.google.com/..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shopify-green focus:border-transparent"
                    required
                  />
                </div>

                <div className="space-y-4">
                  <DateTimePicker
                    label="Start Date & Time"
                    value={{
                      date: formData.startDate,
                      time: formData.startTime,
                    }}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        startDate: value.date,
                        startTime: value.time,
                      })
                    }
                    minDate={getMinDate()}
                    required
                  />

                  <DateTimePicker
                    label="End Date & Time"
                    value={{ date: formData.endDate, time: formData.endTime }}
                    onChange={(value) =>
                      setFormData({
                        ...formData,
                        endDate: value.date,
                        endTime: value.time,
                      })
                    }
                    minDate={formData.startDate || getMinDate()}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-shopify-green hover:bg-shopify-green/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? "Creating Hackathon..." : "Create Hackathon"}
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Score Management Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Manage Scores</CardTitle>
                <HackathonFilter
                  selectedHackathonId={selectedHackathonId}
                  onHackathonChange={handleHackathonChange}
                  filterByCreator={true}
                />
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {session?.user.role === "SUPERADMIN"
                  ? "You can manage scores for all hackathons"
                  : "You can only manage scores for hackathons you created"}
              </p>
            </CardHeader>
            <CardContent>
              {!selectedHackathonId ? (
                <p className="text-white">
                  Please select a hackathon to manage scores
                </p>
              ) : scoresLoading ? (
                <p className="text-white">Loading scores...</p>
              ) : scores.length === 0 ? (
                <p className="text-white">
                  No participants for this hackathon yet
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="border-b border-gray-200">
                      <tr>
                        <th className="text-left py-2 px-4 text-white">
                          Email
                        </th>
                        <th className="text-left py-2 px-4 text-white">Name</th>
                        <th className="text-left py-2 px-4 text-white">
                          Score
                        </th>
                        <th className="text-left py-2 px-4 text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scores.map((scoreEntry) => (
                        <tr
                          key={scoreEntry.id}
                          className="border-b border-gray-100"
                        >
                          <td className="py-3 px-4 text-white">
                            {scoreEntry.userEmail}
                          </td>
                          <td className="py-3 px-4 text-white">
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
                              className="w-20 px-2 py-1 border border-gray-300 rounded text-white"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => fetchScores()}
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
