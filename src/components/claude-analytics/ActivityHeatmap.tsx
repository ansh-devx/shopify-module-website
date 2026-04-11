"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";
import { type HeatmapDay } from "@/lib/claude-analytics/aggregate";

interface ActivityHeatmapProps {
  data: HeatmapDay[];
  title?: string;
}

const CELL_SIZE = 13;
const CELL_GAP = 3;
const TOTAL = CELL_SIZE + CELL_GAP;

const INTENSITY_COLORS = [
  "rgba(141,213,214,0.04)", // 0 - empty
  "rgba(141,213,214,0.15)", // 1
  "rgba(141,213,214,0.30)", // 2
  "rgba(141,213,214,0.50)", // 3
  "rgba(141,213,214,0.75)", // 4
  "rgba(141,213,214,1.0)",  // 5 - max
];

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

function getIntensity(count: number, maxCount: number): number {
  if (count === 0) return 0;
  if (maxCount === 0) return 0;
  const ratio = count / maxCount;
  if (ratio <= 0.2) return 1;
  if (ratio <= 0.4) return 2;
  if (ratio <= 0.6) return 3;
  if (ratio <= 0.8) return 4;
  return 5;
}

export default function ActivityHeatmap({
  data,
  title = "Activity",
}: ActivityHeatmapProps) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    date: string;
    count: number;
  } | null>(null);

  const maxCount = useMemo(
    () => Math.max(...data.map((d) => d.count), 1),
    [data]
  );

  const totalSessions = useMemo(
    () => data.reduce((s, d) => s + d.count, 0),
    [data]
  );

  const activeDays = useMemo(
    () => data.filter((d) => d.count > 0).length,
    [data]
  );

  // Organize data into weeks (columns) and days (rows, 0=Sun..6=Sat)
  const { weeks, monthLabels } = useMemo(() => {
    const weeks: (HeatmapDay | null)[][] = [];
    let currentWeek: (HeatmapDay | null)[] = [];

    // Pad the first week with nulls for days before the first data point
    if (data.length > 0) {
      const firstDow = new Date(data[0].date).getDay();
      for (let i = 0; i < firstDow; i++) {
        currentWeek.push(null);
      }
    }

    data.forEach((day) => {
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(day);
    });
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    // Build month labels
    const labels: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDay = week.find((d) => d !== null);
      if (firstDay) {
        const month = new Date(firstDay.date).getMonth();
        if (month !== lastMonth) {
          labels.push({ label: MONTH_LABELS[month], weekIndex: wi });
          lastMonth = month;
        }
      }
    });

    return { weeks, monthLabels: labels };
  }, [data]);

  const svgWidth = weeks.length * TOTAL + 30; // +30 for day labels
  const svgHeight = 7 * TOTAL + 24; // +24 for month labels

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-text-primary mb-1">
            {title}
          </h3>
          <p className="text-sm text-text-tertiary">
            {totalSessions.toLocaleString()} sessions across {activeDays} active
            days in the last {data.length} days
          </p>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-xs text-text-tertiary mr-1">Less</span>
          {INTENSITY_COLORS.map((color, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                width: CELL_SIZE - 2,
                height: CELL_SIZE - 2,
                backgroundColor: color,
              }}
            />
          ))}
          <span className="text-xs text-text-tertiary ml-1">More</span>
        </div>
      </div>

      <div className="overflow-x-auto relative">
        <svg
          width={svgWidth}
          height={svgHeight}
          className="block"
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Month labels */}
          {monthLabels.map(({ label, weekIndex }) => (
            <text
              key={`${label}-${weekIndex}`}
              x={weekIndex * TOTAL + 30}
              y={10}
              fill="var(--text-tertiary)"
              fontSize={10}
              fontFamily="var(--font-sans)"
            >
              {label}
            </text>
          ))}

          {/* Day labels (Mon, Wed, Fri) */}
          {[1, 3, 5].map((dayIndex) => (
            <text
              key={dayIndex}
              x={0}
              y={18 + dayIndex * TOTAL + CELL_SIZE / 2}
              fill="var(--text-tertiary)"
              fontSize={9}
              fontFamily="var(--font-sans)"
              dominantBaseline="central"
            >
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dayIndex]}
            </text>
          ))}

          {/* Cells */}
          {weeks.map((week, wi) =>
            week.map((day, di) => {
              if (!day) return null;
              const intensity = getIntensity(day.count, maxCount);
              const x = wi * TOTAL + 30;
              const y = di * TOTAL + 18;
              return (
                <rect
                  key={day.date}
                  x={x}
                  y={y}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={3}
                  fill={INTENSITY_COLORS[intensity]}
                  className="transition-colors duration-150"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const parent = e.currentTarget
                      .closest(".overflow-x-auto")
                      ?.getBoundingClientRect();
                    if (parent) {
                      setTooltip({
                        x: rect.left - parent.left + CELL_SIZE / 2,
                        y: rect.top - parent.top - 8,
                        date: day.date,
                        count: day.count,
                      });
                    }
                  }}
                  onMouseLeave={() => setTooltip(null)}
                />
              );
            })
          )}
        </svg>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute z-10 pointer-events-none px-2.5 py-1.5 rounded-lg text-xs bg-surface-2 border border-accent/15 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <span className="font-medium text-text-primary">
              {tooltip.count} session{tooltip.count !== 1 ? "s" : ""}
            </span>{" "}
            <span className="text-text-tertiary">
              on {formatDate(tooltip.date)}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
