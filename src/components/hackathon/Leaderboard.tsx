"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { LeaderboardEntry, LeaderboardResponse } from "@/types";

interface LeaderboardProps {
  hackathonId: string | null;
}

export default function Leaderboard({ hackathonId }: LeaderboardProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState<number | undefined>();
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const hasFetchedLeaderboard = useRef(false);
  const lastFetchedHackathonId = useRef<string | null>(null);

  useEffect(() => {
    if (!hackathonId) return;
    // Reset the ref if hackathon changed
    if (lastFetchedHackathonId.current !== hackathonId) {
      hasFetchedLeaderboard.current = false;
      lastFetchedHackathonId.current = hackathonId;
    }
    if (hasFetchedLeaderboard.current) return;
    hasFetchedLeaderboard.current = true;

    fetchLeaderboard();
  }, [hackathonId]);

  const fetchLeaderboard = async () => {
    if (!hackathonId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/hackathon/leaderboard?hackathonSettingsId=${hackathonId}`,
      );
      const data: LeaderboardResponse = await response.json();

      if (data.success && data.data) {
        setLeaderboard(data.data);
        setCurrentUserRank(data.currentUserRank);
        setTotalParticipants(data.totalParticipants || 0);
      } else {
        setError(data.error || "Failed to load leaderboard");
      }
    } catch (err) {
      setError("An error occurred while loading the leaderboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-shopify-green border-t-transparent"></div>
              <p className="text-white/70 text-sm">Loading leaderboard...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-red-500">{error}</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-white">No participants yet</p>
              <p className="text-sm text-white/70 mt-2">
                Be the first to register for this hackathon!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Leaderboard</CardTitle>
          <div className="text-sm text-white/70">
            {totalParticipants} participant{totalParticipants !== 1 ? "s" : ""}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {currentUserRank && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Your rank: <span className="font-bold">#{currentUserRank}</span>{" "}
              out of {totalParticipants}
            </p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                  Rank
                </th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-white">
                  Name
                </th>
                <th className="text-right py-3 px-4 text-sm font-semibold text-white">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => (
                <tr
                  key={entry.userId}
                  className={`border-b border-gray-100 ${
                    entry.isCurrentUser
                      ? "bg-shopify-green/10 font-medium"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <td className="py-3 px-4 text-sm">
                    {entry.rank <= 3 ? (
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-bold text-xs">
                        {entry.rank}
                      </span>
                    ) : (
                      <span className="text-white">#{entry.rank}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-white">
                    {entry.userName || "Unknown"}
                    {entry.isCurrentUser && (
                      <span className="ml-2 text-xs text-shopify-green">
                        (You)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-right font-semibold text-white">
                    {entry.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
