"use client";

import { motion } from "framer-motion";
import { Users, Search, Filter, MessageSquare, History, UserPlus } from "lucide-react";

const students = [
  { id: "2024-0001", name: "Alice Johnson", dept: "BS Computer Science", status: "Active", lastSession: "2 days ago" },
  { id: "2024-0002", name: "Bob Smith", dept: "BS Information Technology", status: "Pending", lastSession: "Never" },
  { id: "2024-0003", name: "Charlie Davis", dept: "BS Electronics", status: "Follow-up", lastSession: "1 week ago" },
];

export default function CounselingPage() {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>Counseling Management</h1>
          <p style={{ color: "var(--muted-foreground)" }}>Manage student sessions and wellness documentation.</p>
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
          <UserPlus size={20} /> New Session
        </button>
      </header>

      <div className="glass" style={{ padding: "1rem", marginBottom: "2rem", display: "flex", gap: "1rem" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--muted-foreground)" }} />
          <input 
            type="text" 
            placeholder="Search students by name or ID..." 
            style={{ 
              width: "100%", 
              background: "rgba(255,255,255,0.05)", 
              border: "1px solid var(--border)", 
              padding: "0.75rem 1rem 0.75rem 3rem", 
              borderRadius: "8px",
              color: "white"
            }} 
          />
        </div>
        <button className="glass" style={{ padding: "0.75rem 1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      <div style={{ display: "grid", gap: "1rem" }}>
        {students.map((student, i) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card"
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between" 
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                background: "var(--secondary)", 
                borderRadius: "50%", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                fontSize: "1.25rem",
                fontWeight: "700",
                color: "var(--primary)"
              }}>
                {student.name.charAt(0)}
              </div>
              <div>
                <h3 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{student.name}</h3>
                <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>{student.id} • {student.dept}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4rem" }}>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Status</p>
                <span style={{ 
                  fontSize: "0.75rem", 
                  fontWeight: "600",
                  padding: "0.25rem 0.75rem",
                  borderRadius: "20px",
                  background: student.status === "Active" ? "rgba(16, 185, 129, 0.1)" : "rgba(245, 158, 11, 0.1)",
                  color: student.status === "Active" ? "#10b981" : "#f59e0b"
                }}>
                  {student.status}
                </span>
              </div>
              
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Last Session</p>
                <p style={{ fontSize: "0.875rem" }}>{student.lastSession}</p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button title="New Message" style={{ padding: "0.5rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }}>
                  <MessageSquare size={18} />
                </button>
                <button title="View History" style={{ padding: "0.5rem", borderRadius: "8px", background: "rgba(255,255,255,0.05)" }}>
                  <History size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
