"use client";

import { useEffect, useState, useRef } from "react";
import { HackathonSettings } from "@/types";

interface HackathonFilterProps {
  selectedHackathonId: string | null;
  onHackathonChange: (hackathonId: string) => void;
  filterByCreator?: boolean; // If true, only show hackathons created by the current user (for admins)
}

export default function HackathonFilter({
  selectedHackathonId,
  onHackathonChange,
  filterByCreator = false,
}: HackathonFilterProps) {
  const [hackathons, setHackathons] = useState<HackathonSettings[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedHackathons = useRef(false);

  useEffect(() => {
    if (hasFetchedHackathons.current) return;
    hasFetchedHackathons.current = true;

    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      const url = filterByCreator
        ? "/api/hackathon/list?filterByCreator=true"
        : "/api/hackathon/list";
      const response = await fetch(url);
      const data = await response.json();
      if (data.success) {
        setHackathons(data.data);

        // Auto-select active hackathon if none selected
        if (!selectedHackathonId && data.data.length > 0) {
          const activeHackathon = data.data.find(
            (h: HackathonSettings) => h.isActive,
          );
          if (activeHackathon) {
            onHackathonChange(activeHackathon.id);
          } else {
            onHackathonChange(data.data[0].id);
          }
        }
      }
    } catch (error) {
      console.error("Failed to fetch hackathons:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent"></div>
        <span className="text-sm text-text-tertiary">Loading hackathons...</span>
      </div>
    );
  }

  if (hackathons.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <label
        htmlFor="hackathon-filter"
        className="text-sm font-medium text-gray-700"
      >
        Select Hackathon:
      </label>
      <select
        id="hackathon-filter"
        value={selectedHackathonId || ""}
        onChange={(e) => onHackathonChange(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-white text-black"
      >
        {hackathons.map((hackathon) => (
          <option key={hackathon.id} value={hackathon.id}>
            Hackathon {hackathon.hackathonNumber}
            {hackathon.isActive ? " (Active)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}
