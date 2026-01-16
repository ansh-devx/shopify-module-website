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
      day
    ).padStart(2, "0")}`;
    onChange({ ...value, date: dateString });
    setShowCalendar(false);
  };

  const handleTimeSelect = (hour: number, minute: number) => {
    const timeString = `${String(hour).padStart(2, "0")}:${String(
      minute
    ).padStart(2, "0")}`;
    onChange({ ...value, time: timeString });
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

      <div className="grid grid-cols-2 gap-3">
        {/* Date Picker */}
        <div className="relative" ref={calendarRef}>
          <button
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shopify-green focus:border-transparent text-left flex items-center justify-between bg-white"
          >
            <span className={value.date ? "text-black" : "text-black"}>
              {formatDisplayDate()}
            </span>
            <svg
              className="w-5 h-5 text-gray-400"
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
            <div className="absolute z-50 mt-2 bg-black rounded-lg shadow-xl border border-white/20 p-4 w-80">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedMonth(
                      new Date(
                        selectedMonth.getFullYear(),
                        selectedMonth.getMonth() - 1
                      )
                    )
                  }
                  className="p-1 hover:bg-white/10 rounded text-white"
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
                <span className="font-semibold text-white">{monthName}</span>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedMonth(
                      new Date(
                        selectedMonth.getFullYear(),
                        selectedMonth.getMonth() + 1
                      )
                    )
                  }
                  className="p-1 hover:bg-white/10 rounded text-white"
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
                    className="text-center text-xs font-medium text-white/60 py-1"
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
                    day
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
                      className={`
                        p-2 text-sm rounded-lg transition-colors
                        ${
                          disabled
                            ? "text-white/20 cursor-not-allowed"
                            : "hover:bg-white/10 text-white"
                        }
                        ${
                          isSelected
                            ? "bg-shopify-green text-white hover:bg-shopify-green"
                            : ""
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-shopify-green focus:border-transparent text-left flex items-center justify-between bg-white"
          >
            <span className={value.time ? "text-black" : "text-black"}>
              {formatDisplayTime()}
            </span>
            <svg
              className="w-5 h-5 text-gray-400"
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
            <div className="absolute z-50 mt-2 bg-black rounded-lg shadow-xl border border-white/20 p-4 w-64">
              <div className="grid grid-cols-2 gap-4">
                {/* Hours */}
                <div>
                  <div className="text-xs font-medium text-white/60 mb-2">
                    Hour
                  </div>
                  <div className="max-h-48 overflow-y-auto border border-white/20 rounded">
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => {
                          const currentMinute = value.time
                            ? parseInt(value.time.split(":")[1])
                            : 0;
                          handleTimeSelect(hour, currentMinute);
                        }}
                        className={`
                          w-full px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors
                          ${
                            value.time &&
                            parseInt(value.time.split(":")[0]) === hour
                              ? "bg-shopify-green text-white hover:bg-shopify-green"
                              : "text-white"
                          }
                        `}
                      >
                        {String(hour).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Minutes */}
                <div>
                  <div className="text-xs font-medium text-white/60 mb-2">
                    Minute
                  </div>
                  <div className="border border-white/20 rounded">
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => {
                          const currentHour = value.time
                            ? parseInt(value.time.split(":")[0])
                            : 0;
                          handleTimeSelect(currentHour, minute);
                        }}
                        className={`
                          w-full px-3 py-2 text-sm text-left hover:bg-white/10 transition-colors
                          ${
                            value.time &&
                            parseInt(value.time.split(":")[1]) === minute
                              ? "bg-shopify-green text-white hover:bg-shopify-green"
                              : "text-white"
                          }
                        `}
                      >
                        {String(minute).padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
