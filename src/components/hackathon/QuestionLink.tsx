"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";

interface QuestionLinkProps {
  questionLink: string | null;
  startTime: Date;
  endTime: Date;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function QuestionLink({
  questionLink,
  startTime,
  endTime,
}: QuestionLinkProps) {
  const [status, setStatus] = useState<"before" | "during" | "after">("before");
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null,
  );

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      let currentStatus: "before" | "during" | "after" = "before";
      let targetTime = start;

      if (now >= start && now < end) {
        currentStatus = "during";
        targetTime = end;
      } else if (now >= end) {
        currentStatus = "after";
      }

      setStatus(currentStatus);

      // Calculate time remaining
      const diff = targetTime.getTime() - now.getTime();
      const totalSeconds = Math.max(0, Math.floor(diff / 1000));

      setTimeRemaining({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
      });
    };

    updateStatus();
    const interval = setInterval(updateStatus, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  // No question link set
  if (!questionLink) {
    return null;
  }

  // After hackathon ended
  if (status === "after") {
    return (
      <Card className="bg-gray-100">
        <CardContent className="pt-6">
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              Hackathon Ended
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Thank you for participating! Results will be announced soon.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // During hackathon - show "Go to Question" button with countdown
  if (status === "during" && timeRemaining) {
    return (
      <Card className="bg-shopify-green/10 border-2 border-shopify-green">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div>
              <h3 className="text-xl font-bold text-shopify-green mb-2">
                Hackathon is Live!
              </h3>
            </div>
            <a
              href={questionLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-shopify-green hover:bg-shopify-green/90 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              <span>Go to Question</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Before hackathon starts
  return null;
}
