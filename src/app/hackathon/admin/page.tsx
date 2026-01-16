"use client";

import { useSession } from "next-auth/react";
import ContentLayout from "@/components/layout/ContentLayout";
import RoleGuard from "@/components/auth/RoleGuard";
import { UserRole } from "@/types";
import LogoutButton from "@/components/auth/LogoutButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import DateTimePicker from "@/components/ui/DateTimePicker";
import { useState } from "react";

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
      `${formData.startDate}T${formData.startTime}`
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
        `${formData.startDate}T${formData.startTime}`
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
        description="Manage hackathon settings and questions"
      >
        <LogoutButton />

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Hackathon Settings</CardTitle>
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

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-shopify-green hover:bg-shopify-green/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? "Updating..." : "Update Settings"}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </ContentLayout>
    </RoleGuard>
  );
}
