"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

interface TimerDisplayProps {
  startTime: Date;
  endTime: Date;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  status: "before" | "during" | "after";
}

export default function TimerDisplay({
  startTime,
  endTime,
}: TimerDisplayProps) {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining | null>(
    null,
  );

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      let status: "before" | "during" | "after" = "before";
      let targetTime = start;

      if (now >= start && now < end) {
        status = "during";
        targetTime = end;
      } else if (now >= end) {
        status = "after";
      }

      const diff = targetTime.getTime() - now.getTime();
      const totalSeconds = Math.max(0, Math.floor(diff / 1000));

      setTimeRemaining({
        days: Math.floor(totalSeconds / 86400),
        hours: Math.floor((totalSeconds % 86400) / 3600),
        minutes: Math.floor((totalSeconds % 3600) / 60),
        seconds: totalSeconds % 60,
        status,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (!timeRemaining) return null;

  // Don't show timer after hackathon ends - QuestionLink handles that state
  if (timeRemaining.status === "after") return null;

  const getStatusColor = () => {
    switch (timeRemaining.status) {
      case "before":
        return "bg-shopify-blue/10 text-shopify-blue";
      case "during":
        return "bg-shopify-green/10 text-shopify-green";
      default:
        return "";
    }
  };

  const getStatusText = () => {
    switch (timeRemaining.status) {
      case "before":
        return "Starts in";
      case "during":
        return "Ends in";
      default:
        return "";
    }
  };

  return (
    <Card className={getStatusColor()}>
      <CardHeader>
        <CardTitle className="text-center">{getStatusText()}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold">
              {String(timeRemaining.days).padStart(2, "0")}
            </div>
            <div className="text-sm opacity-75">Days</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {String(timeRemaining.hours).padStart(2, "0")}
            </div>
            <div className="text-sm opacity-75">Hours</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {String(timeRemaining.minutes).padStart(2, "0")}
            </div>
            <div className="text-sm opacity-75">Minutes</div>
          </div>
          <div>
            <div className="text-3xl font-bold">
              {String(timeRemaining.seconds).padStart(2, "0")}
            </div>
            <div className="text-sm opacity-75">Seconds</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
