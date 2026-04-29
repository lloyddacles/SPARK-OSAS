"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Users, ArrowRight, Bell } from "lucide-react";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
};

export default function EventsClient({ events }: { events: Event[] }) {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>Events & Announcements</h1>
          <p style={{ color: "var(--muted-foreground)" }}>Stay updated with university happenings.</p>
        </div>
        <button style={{ 
          background: "var(--primary)", 
          color: "var(--primary-foreground)", 
          padding: "0.75rem 1.5rem", 
          borderRadius: "var(--radius)",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          <Bell size={20} /> Subscribe
        </button>
      </header>

      <div style={{ position: "relative" }}>
        {/* Timeline Line */}
        <div style={{ 
          position: "absolute", 
          left: "24px", 
          top: "0", 
          bottom: "0", 
          width: "2px", 
          background: "var(--border)",
          zIndex: 0
        }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ display: "flex", gap: "2rem", position: "relative", zIndex: 1 }}
            >
              {/* Timeline Dot */}
              <div style={{ 
                width: "50px", 
                height: "50px", 
                background: "var(--background)", 
                border: "2px solid var(--primary)",
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "var(--primary)",
                flexShrink: 0
              }}>
                <Calendar size={24} />
              </div>
              
              {/* Event Card */}
              <div className="card glass" style={{ padding: "2rem", flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "0.5rem" }}>{event.title}</h3>
                    <p style={{ color: "var(--muted-foreground)" }}>{event.description}</p>
                  </div>
                  <div style={{ 
                    background: "rgba(59, 130, 246, 0.1)", 
                    color: "var(--primary)", 
                    padding: "0.5rem 1rem", 
                    borderRadius: "20px",
                    fontWeight: "600",
                    fontSize: "0.875rem"
                  }}>
                    {new Date(event.startTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "2rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                    <MapPin size={16} /> {event.location}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted-foreground)", fontSize: "0.875rem" }}>
                    <Users size={16} /> Capacity: {event.capacity}
                  </div>
                </div>

                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                  <button style={{ 
                    background: "var(--secondary)", 
                    color: "var(--foreground)", 
                    padding: "0.75rem 1.5rem", 
                    borderRadius: "8px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    border: "1px solid var(--border)"
                  }}>
                    RSVP <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
