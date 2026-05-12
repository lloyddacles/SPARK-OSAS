"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  MoreVertical,
  Mail,
  Calendar,
  MessageSquare,
  GraduationCap
} from "lucide-react";

export default function AdviserPerformanceMonitor() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockAdvisees = [
    { id: "S-101", name: "Juan Dela Cruz", gpa: "1.25", status: "Stable", trend: "up", course: "BS Computer Science", lastConsult: "2024-05-02" },
    { id: "S-102", name: "Maria Clara", gpa: "3.25", status: "At Risk", trend: "down", course: "BS Computer Science", lastConsult: "2024-04-15" },
    { id: "S-103", name: "Crisostomo Ibarra", gpa: "1.75", status: "Excellent", trend: "up", course: "BS Computer Science", lastConsult: "2024-05-11" },
    { id: "S-104", name: "Basilio Santos", gpa: "2.50", status: "Needs Support", trend: "down", course: "BS Computer Science", lastConsult: "2024-04-20" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Excellent": return { color: "#10b981", bg: "#f0fdf4", border: "#dcfce7" };
      case "Stable": return { color: "#3b82f6", bg: "#eff6ff", border: "#dbeafe" };
      case "Needs Support": return { color: "#f59e0b", bg: "#fffbeb", border: "#fef3c7" };
      case "At Risk": return { color: "#ef4444", bg: "#fef2f2", border: "#fee2e2" };
      default: return { color: "#64748b", bg: "#f8fafc", border: "#f1f5f9" };
    }
  };

  return (
    <div style={{ display: "grid", gap: "2.5rem" }}>
      
      {/* HEADER & SEARCH */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
         <div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>Advisee Performance Sentinel</h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600", marginTop: "0.4rem" }}>Predictive academic health tracking for assigned students.</p>
         </div>
         <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={20} />
            <input 
              placeholder="Query advisee by name or ID..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ padding: "1.25rem 1.5rem 1.25rem 3.5rem", borderRadius: "18px", border: "1px solid #f1f5f9", background: "white", fontSize: "1rem", fontWeight: "600", outline: "none", width: "350px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }} 
            />
         </div>
      </div>

      {/* PERFORMANCE CARDS GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "2rem" }}>
         {mockAdvisees.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())).map((student, i) => {
            const styles = getStatusColor(student.status);
            return (
               <motion.div 
                  key={student.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ background: "white", borderRadius: "28px", border: "1px solid #f1f5f9", padding: "2.5rem", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.02)", position: "relative" }}
               >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                     <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "18px", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", fontWeight: "900", color: "#3b82f6" }}>
                           {student.name.charAt(0)}
                        </div>
                        <div>
                           <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>{student.name}</h4>
                           <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>ID: {student.id} • {student.course}</p>
                        </div>
                     </div>
                     <button style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><MoreVertical size={20} /></button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem" }}>
                     <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                        <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Academic GPA</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                           <span style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b" }}>{student.gpa}</span>
                           {student.trend === "up" ? <TrendingUp size={20} color="#10b981" /> : <TrendingDown size={20} color="#ef4444" />}
                        </div>
                     </div>
                     <div style={{ padding: "1.5rem", background: styles.bg, borderRadius: "20px", border: `1px solid ${styles.border}` }}>
                        <p style={{ fontSize: "0.7rem", fontWeight: "900", color: styles.color, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Predictive Status</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                           <span style={{ fontSize: "1.1rem", fontWeight: "900", color: styles.color }}>{student.status}</span>
                        </div>
                     </div>
                  </div>

                  <div style={{ display: "grid", gap: "1rem" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", background: "white", border: "1px solid #f1f5f9", borderRadius: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                           <Calendar size={16} color="#94a3b8" />
                           <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Last Consultation</span>
                        </div>
                        <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#1e293b" }}>{student.lastConsult}</span>
                     </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                     <button style={{ flex: 1, padding: "1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "14px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                        <Mail size={16} /> Send Notice
                     </button>
                     <button style={{ flex: 1, padding: "1rem", background: "white", border: "1px solid #e2e8f0", color: "#1e293b", borderRadius: "14px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                        <MessageSquare size={16} /> Log Session
                     </button>
                  </div>
               </motion.div>
            );
         })}
      </div>
    </div>
  );
}
