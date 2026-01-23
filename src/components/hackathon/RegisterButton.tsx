"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { RegistrationResponse } from "@/types";

interface RegisterButtonProps {
  hackathonId: string;
  isRegistered: boolean;
  onRegistrationChange: () => void;
  endTime: Date;
}

export default function RegisterButton({
  hackathonId,
  isRegistered,
  onRegistrationChange,
  endTime,
}: RegisterButtonProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Check if hackathon has ended
  const hasEnded = new Date() >= endTime;

  const handleRegister = async () => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/hackathon/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hackathonSettingsId: hackathonId }),
      });

      const data: RegistrationResponse = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Successfully registered!",
        });
        onRegistrationChange();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to register" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setLoading(false);
    }
  };

  // Don't show registration button/status if hackathon has ended
  if (hasEnded) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={handleRegister}
          disabled={isRegistered || loading}
          variant={isRegistered ? "secondary" : "primary"}
          size="md"
        >
          {loading
            ? "Registering..."
            : isRegistered
              ? "✓ Registered"
              : "Register for Hackathon"}
        </Button>

        {isRegistered && (
          <span className="text-sm text-green-600 font-medium">
            You are registered for this hackathon
          </span>
        )}
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  );
}
