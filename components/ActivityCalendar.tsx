"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, MapPin, Clock, Users, Calendar as CalendarIcon, Activity } from "lucide-react";

interface ActivityCalendarProps {
  activities: any[];
}

export default function ActivityCalendar({ activities }: ActivityCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    "JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE",
    "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const approvedActivities = activities.filter(a => a.status === "Approved");

  const getActivitiesForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return approvedActivities.filter(a => a.date === dateStr);
  };

  return (
    <div style={{ background: "white", borderRadius: "32px", border: "1px solid #f1f5f9", padding: "3rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
      {/* Calendar Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
        <div>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>
            {monthNames[month]} <span style={{ color: "#3b82f6" }}>{year}</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600", marginTop: "0.4rem" }}>Institutional Activity Master Map</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={prevMonth} style={{ width: "48px", height: "48px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
            <ChevronLeft size={20} color="#64748b" />
          </button>
          <button onClick={nextMonth} style={{ width: "48px", height: "48px", borderRadius: "14px", border: "1px solid #e2e8f0", background: "white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
            <ChevronRight size={20} color="#64748b" />
          </button>
        </div>
      </div>

      {/* Week Days */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "1px", background: "#f1f5f9", borderRadius: "16px", overflow: "hidden", border: "1px solid #f1f5f9" }}>
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map(day => (
          <div key={day} style={{ padding: "1rem", background: "#f8fafc", textAlign: "center", fontSize: "0.7rem", fontWeight: "900", color: "#64748b", letterSpacing: "0.1em" }}>
            {day}
          </div>
        ))}

        {/* Empty cells for previous month */}
        {[...Array(startDay)].map((_, i) => (
          <div key={`empty-${i}`} style={{ height: "140px", background: "#fcfdfe", opacity: 0.5 }} />
        ))}

        {/* Days of current month */}
        {[...Array(totalDays)].map((_, i) => {
          const day = i + 1;
          const dayActivities = getActivitiesForDay(day);
          const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();

          return (
            <div key={day} style={{ height: "140px", background: "white", padding: "1rem", position: "relative", borderRight: "1px solid #f1f5f9", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ 
                fontSize: "0.95rem", 
                fontWeight: "800", 
                color: isToday ? "white" : "#1e293b",
                width: "32px",
                height: "32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "10px",
                background: isToday ? "#3b82f6" : "transparent"
              }}>
                {day}
              </span>

              <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {dayActivities.map((act, idx) => (
                  <motion.div 
                    key={act.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={{ 
                      padding: "0.4rem 0.6rem", 
                      background: "#eff6ff", 
                      border: "1px solid #dbeafe", 
                      borderRadius: "6px",
                      fontSize: "0.65rem",
                      fontWeight: "800",
                      color: "#3b82f6",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      cursor: "help"
                    }}
                    title={act.title}
                  >
                    {act.title}
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend / Info */}
      <div style={{ marginTop: "3rem", padding: "2rem", background: "#f8fafc", borderRadius: "20px", border: "1px dashed #cbd5e1", display: "flex", gap: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div style={{ width: "12px", height: "12px", borderRadius: "3px", background: "#3b82f6" }} />
          <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>Approved Events</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Activity size={16} color="#3b82f6" />
          <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>{approvedActivities.length} Operations This Cycle</span>
        </div>
      </div>
    </div>
  );
}
