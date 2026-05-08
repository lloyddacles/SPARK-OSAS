"use client";

import { motion } from "framer-motion";
import { Users, Search, Filter, MessageSquare, History, UserPlus, HeartHandshake } from "lucide-react";

const students = [
  { id: "2024-0001", name: "Alice Johnson", dept: "BS Computer Science", status: "Active", lastSession: "2 days ago" },
  { id: "2024-0002", name: "Bob Smith", dept: "BS Information Technology", status: "Pending", lastSession: "Never" },
  { id: "2024-0003", name: "Charlie Davis", dept: "BS Electronics", status: "Follow-up", lastSession: "1 week ago" },
];

export default function CounselingPage() {
  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* Analytics Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Wellness</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            Coun<span style={{ color: "#3b82f6" }}>seling</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Manage student sessions, wellness documentation, and guidance records.</p>
        </div>
        <button style={{ padding: "1rem 2rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
          <UserPlus size={18} /> New Session
        </button>
      </div>

      <div style={{ background: "white", padding: "1.25rem", borderRadius: "16px", marginBottom: "2rem", display: "flex", gap: "1rem", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input 
            type="text" 
            placeholder="Search students by name or ID..." 
            style={{ 
              width: "100%", 
              background: "#f8fafc", 
              border: "1px solid #e2e8f0", 
              padding: "1rem 1rem 1rem 3rem", 
              borderRadius: "10px",
              color: "#1e293b",
              fontSize: "0.95rem",
              fontWeight: "500",
              outline: "none"
            }} 
          />
        </div>
        <button style={{ padding: "0 1.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", display: "flex", alignItems: "center", gap: "0.5rem", color: "#475569", fontWeight: "700", cursor: "pointer" }} className="hover:bg-slate-50">
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
            style={{ 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "space-between",
              background: "white",
              padding: "1.5rem 2rem",
              borderRadius: "16px",
              border: "1px solid #f3f4f6",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ 
                width: "56px", 
                height: "56px", 
                background: "#eff6ff", 
                borderRadius: "12px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: "#3b82f6",
                border: "1px solid #bfdbfe"
              }}>
                <HeartHandshake size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.25rem" }}>{student.name}</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500" }}>{student.id} • {student.dept}</p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4rem" }}>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", marginBottom: "0.25rem" }}>Status</p>
                <span style={{ 
                  fontSize: "0.8rem", 
                  fontWeight: "800",
                  padding: "0.4rem 1rem",
                  borderRadius: "20px",
                  background: student.status === "Active" ? "#f0fdf4" : student.status === "Follow-up" ? "#eff6ff" : "#fffbeb",
                  color: student.status === "Active" ? "#10b981" : student.status === "Follow-up" ? "#3b82f6" : "#f59e0b",
                  border: `1px solid ${student.status === "Active" ? "#bbf7d0" : student.status === "Follow-up" ? "#bfdbfe" : "#fde68a"}`
                }}>
                  {student.status}
                </span>
              </div>
              
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase", marginBottom: "0.25rem" }}>Last Session</p>
                <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b" }}>{student.lastSession}</p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button title="New Message" style={{ padding: "0.75rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} className="hover:text-blue-500 hover:border-blue-200">
                  <MessageSquare size={18} />
                </button>
                <button title="View History" style={{ padding: "0.75rem", borderRadius: "10px", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }} className="hover:text-blue-500 hover:border-blue-200">
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
