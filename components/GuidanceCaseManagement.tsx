"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Search, 
  Plus, 
  Lock, 
  ShieldCheck, 
  User, 
  Calendar,
  MoreVertical,
  History,
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function GuidanceCaseManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingCase, setViewingCase] = useState<any>(null);

  const mockCases = [
    { id: "C-9012", student: "Juan Dela Cruz", type: "Academic Stress", status: "Active", date: "2024-05-10", notes: "Juan is experiencing severe academic burnout due to multiple scholarship requirements. Recommended reduction in club extracurriculars." },
    { id: "C-9013", student: "Maria Clara", type: "Financial Counseling", status: "Closed", date: "2024-04-28", notes: "Discussed emergency tuition loan options. Successfully transitioned to the SPARK Emergency Fund." },
    { id: "C-9014", student: "Crisostomo Ibarra", type: "Behavioral Intervention", status: "Under Review", date: "2024-05-12", notes: "Multiple absences reported by the College of Engineering. Student cited personal family issues. Needs follow-up next Monday." },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: viewingCase ? "1fr 450px" : "1fr", gap: "2rem", transition: "all 0.3s" }}>
      
      {/* CASE LISTING */}
      <div style={{ background: "white", borderRadius: "32px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
         <div style={{ padding: "2.5rem 3rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
            <div>
               <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Lock size={20} color="#3b82f6" /> Secure Case Records
               </h3>
               <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", marginTop: "0.25rem" }}>Confidential Counselor-Student interactions.</p>
            </div>
            <div style={{ display: "flex", gap: "1rem" }}>
               <div style={{ position: "relative" }}>
                  <Search style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} size={16} />
                  <input 
                    placeholder="Search records..." 
                    style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "0.85rem", outline: "none", width: "220px" }}
                  />
               </div>
               <button style={{ padding: "0.75rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <Plus size={18} /> New Record
               </button>
            </div>
         </div>

         <div style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                  <tr style={{ textAlign: "left", background: "white" }}>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Reference ID</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Student Unit</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Intervention Type</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Security Status</th>
                  </tr>
               </thead>
               <tbody>
                  {mockCases.map((c, i) => (
                     <tr 
                        key={c.id} 
                        onClick={() => setViewingCase(c)}
                        style={{ borderTop: "1px solid #f1f5f9", background: viewingCase?.id === c.id ? "#eff6ff" : "white", cursor: "pointer", transition: "all 0.2s" }}
                     >
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#3b82f6" }}>#{c.id}</p>
                           <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>Logged: {c.date}</p>
                        </td>
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f8fafc", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                 <User size={16} color="#64748b" />
                              </div>
                              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>{c.student}</span>
                           </div>
                        </td>
                        <td style={{ padding: "1.5rem 3rem", fontSize: "0.9rem", fontWeight: "700", color: "#475569" }}>{c.type}</td>
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <span style={{ 
                              fontSize: "0.7rem", 
                              fontWeight: "900", 
                              padding: "0.4rem 0.8rem", 
                              background: c.status === "Active" ? "#fef2f2" : c.status === "Closed" ? "#f0fdf4" : "#fffbeb", 
                              color: c.status === "Active" ? "#ef4444" : c.status === "Closed" ? "#10b981" : "#f59e0b", 
                              borderRadius: "10px", 
                              textTransform: "uppercase",
                              border: `1px solid ${c.status === "Active" ? "#fee2e2" : c.status === "Closed" ? "#dcfce7" : "#fef3c7"}`
                           }}>
                              {c.status}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

      {/* CASE DETAIL PANEL */}
      <AnimatePresence>
         {viewingCase && (
            <motion.div 
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: 50 }}
               style={{ background: "white", padding: "3rem", borderRadius: "32px", border: "1px solid #f1f5f9", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}
            >
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                     <div style={{ width: "48px", height: "48px", background: "#f8fafc", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f1f5f9" }}>
                        <ShieldCheck size={24} color="#3b82f6" />
                     </div>
                     <div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>Incident Intelligence</h4>
                        <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700" }}>Encryption Protocol: AES-256</p>
                     </div>
                  </div>
                  <button onClick={() => setViewingCase(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><MoreVertical size={20} /></button>
               </div>

               <div style={{ display: "grid", gap: "2.5rem" }}>
                  <div>
                     <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Session Subject</p>
                     <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                        <p style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>{viewingCase.student}</p>
                        <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "700", marginTop: "0.5rem" }}>ID: ST-2024-001 • College of Arts</p>
                     </div>
                  </div>

                  <div>
                     <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1rem" }}>Intervention Details</p>
                     <div style={{ background: "white", padding: "1.5rem", borderRadius: "16px", border: "1px dashed #e2e8f0" }}>
                        <p style={{ fontSize: "0.95rem", color: "#334155", lineHeight: "1.7", fontWeight: "500" }}>{viewingCase.notes}</p>
                     </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                     <button style={{ flex: 1, padding: "1rem", background: "#111827", color: "white", border: "none", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                        <History size={16} /> Activity Log
                     </button>
                     <button style={{ flex: 1, padding: "1rem", background: "white", border: "1px solid #e2e8f0", color: "#1e293b", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                        <CheckCircle2 size={16} /> Mark Closed
                     </button>
                  </div>
                  
                  <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", alignItems: "center", color: "#94a3b8", background: "#fafafa", padding: "1rem", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                     <AlertCircle size={16} />
                     <p style={{ fontSize: "0.7rem", fontWeight: "700" }}>Case notes are end-to-end encrypted and only visible to the designated Guidance Counselor.</p>
                  </div>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
