"use client";

import { useState, useRef, useEffect } from "react";

interface DateTimePickerProps {
  label: string;
  value: { date: string; time: string };
  onChange: (value: { date: string; time: string }) => void;
  minDate?: string;
  required?: boolean;
}

export default function DateTimePicker({
  label,
  value,
  onChange,
  minDate,
  required = false,
}: DateTimePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setShowTimePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const isDateDisabled = (date: Date) => {
    if (!minDate) return false;
    const min = new Date(minDate);
    min.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < min;
  };

  const handleDateSelect = (day: number) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const selectedDate = new Date(year, month, day);

    if (isDateDisabled(selectedDate)) return;

    // Format date as YYYY-MM-DD without timezone conversion
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day,
    ).padStart(2, "0")}`;
    onChange({ ...value, date: dateString });
    setShowCalendar(false);
  };

  const handleHourSelect = (hour: number) => {
    const currentMinute = value.time ? parseInt(value.time.split(":")[1]) : 0;
    const timeString = `${String(hour).padStart(2, "0")}:${String(
      currentMinute,
    ).padStart(2, "0")}`;
    onChange({ ...value, time: timeString });
    // Don't close the picker - let user select minutes
  };

  const handleMinuteSelect = (minute: number) => {
    const currentHour = value.time ? parseInt(value.time.split(":")[0]) : 0;
    const timeString = `${String(currentHour).padStart(2, "0")}:${String(
      minute,
    ).padStart(2, "0")}`;
    onChange({ ...value, time: timeString });
    // Close picker after selecting minute
    setShowTimePicker(false);
  };

  const formatDisplayDate = () => {
    if (!value.date) return "Select date";
    const date = new Date(value.date);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatDisplayTime = () => {
    if (!value.time) return "Select time";
    const [hour, minute] = value.time.split(":");
    const h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    const displayHour = h % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(selectedMonth);
  const monthName = selectedMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = [0, 15, 30, 45];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="grid grid-cols-2 gap-4">
        {/* Date Picker */}
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-accent focus:ring-2 focus:ring-accent focus:border-accent text-left flex items-center justify-between bg-white transition-all duration-150 shadow-sm hover:shadow"
          >
            <span
              className={
                value.date ? "text-black font-medium" : "text-black/50"
              }
            >
              {formatDisplayDate()}
            </span>
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </button>

          {showCalendar && (
            <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-accent/10 p-5 w-80">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedMonth(
                      new Date(
                        selectedMonth.getFullYear(),
                        selectedMonth.getMonth() - 1,
                      ),
                    )
                  }
                  className="p-2 hover:bg-surface-2 rounded-lg text-black transition-colors"
                >
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
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <span className="font-semibold text-black text-base">
                  {monthName}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedMonth(
                      new Date(
                        selectedMonth.getFullYear(),
                        selectedMonth.getMonth() + 1,
                      ),
                    )
                  }
                  className="p-2 hover:bg-surface-2 rounded-lg text-black transition-colors"
                >
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-semibold text-black/70 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const date = new Date(
                    selectedMonth.getFullYear(),
                    selectedMonth.getMonth(),
                    day,
                  );
                  const disabled = isDateDisabled(date);
                  const isSelected =
                    value.date === date.toISOString().split("T")[0];

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      disabled={disabled}
                      style={
                        disabled
                          ? { backgroundColor: "#e5e7eb", color: "#9ca3af" }
                          : isSelected
                            ? {}
                            : {}
                      }
                      className={`
                        p-2.5 text-sm rounded-lg transition-all duration-150 font-medium
                        ${
                          isSelected
                            ? "bg-accent text-white hover:bg-accent shadow-sm"
                            : !disabled
                              ? "text-black hover:bg-black hover:text-white"
                              : "cursor-not-allowed"
                        }
                      `}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Time Picker */}
        <div className="relative" ref={timeRef}>
          <button
            type="button"
            onClick={() => setShowTimePicker(!showTimePicker)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg hover:border-accent focus:ring-2 focus:ring-accent focus:border-accent text-left flex items-center justify-between bg-white transition-all duration-150 shadow-sm hover:shadow"
          >
            <span
              className={
                value.time ? "text-black font-medium" : "text-black/50"
              }
            >
              {formatDisplayTime()}
            </span>
            <svg
              className="w-5 h-5 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          {showTimePicker && (
            <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-xl border border-accent/10 p-5 w-80">
              <div className="mb-3">
                <div className="text-sm font-semibold text-black mb-1">
                  Select Time
                </div>
                <div className="text-xs text-black/60">
                  Choose hour first, then minute
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Hours */}
                <div>
                  <div className="text-xs font-semibold text-black/70 mb-2 uppercase tracking-wide">
                    Hour
                  </div>
                  <div className="max-h-56 overflow-y-auto border border-accent/10 rounded-lg">
                    {hours.map((hour) => {
                      const isSelected =
                        value.time &&
                        parseInt(value.time.split(":")[0]) === hour;
                      return (
                        <button
                          key={hour}
                          type="button"
                          onClick={() => handleHourSelect(hour)}
                          className={`
                            w-full px-4 py-2.5 text-sm font-medium text-left transition-all duration-150
                            ${
                              isSelected
                                ? "bg-accent text-white shadow-sm"
                                : "text-black hover:bg-black hover:text-white"
                            }
                          `}
                        >
                          {String(hour).padStart(2, "0")}:00
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minutes */}
                <div>
                  <div className="text-xs font-semibold text-black/70 mb-2 uppercase tracking-wide">
                    Minute
                  </div>
                  <div className="border border-accent/10 rounded-lg overflow-hidden">
                    {minutes.map((minute) => {
                      const isSelected =
                        value.time &&
                        parseInt(value.time.split(":")[1]) === minute;
                      return (
                        <button
                          key={minute}
                          type="button"
                          onClick={() => handleMinuteSelect(minute)}
                          className={`
                            w-full px-4 py-2.5 text-sm font-medium text-left transition-all duration-150
                            ${
                              isSelected
                                ? "bg-accent text-white shadow-sm"
                                : "text-black hover:bg-black hover:text-white"
                            }
                          `}
                        >
                          :{String(minute).padStart(2, "0")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {value.time && (
                <div className="mt-4 pt-4 border-t border-accent/10">
                  <div className="text-xs text-black/60 mb-1">
                    Selected Time
                  </div>
                  <div className="text-lg font-bold text-accent">
                    {formatDisplayTime()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
