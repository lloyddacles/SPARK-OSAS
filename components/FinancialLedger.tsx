"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Banknote, 
  Target, 
  Activity, 
  Download,
  CalendarClock,
  ShieldCheck
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

interface FinancialLedgerProps {
  data?: any[];
  mode?: "STIPEND" | "BUDGET";
}

export default function FinancialLedger({ data, mode }: FinancialLedgerProps) {
  const { currentUser, scholarshipApps, activities } = useGlobalState();
  
  // Determine mode based on user role if not explicitly provided
  const effectiveMode = mode || (currentUser?.role === "STUDENT_APPLICANT" ? "STIPEND" : "BUDGET");
  
  // Source the data based on the mode
  const sourceData = data || (effectiveMode === "STIPEND" ? scholarshipApps : activities);
  const approvedData = (sourceData || []).filter(item => 
    item.status === "Approved" || item.status === "Completed" || item.status === "Active"
  );

  // Financial Computations
  const totalAmount = approvedData.reduce((sum, item) => {
    const val = effectiveMode === "STIPEND" ? 25000 : (parseFloat(item.budget) || 0);
    return sum + val;
  }, 0);

  const stats = effectiveMode === "STIPEND" ? [
    { label: "Total Institutional Grants", value: `₱${totalAmount.toLocaleString()}`, color: "#3b82f6", bg: "#eff6ff", icon: <Banknote size={24} /> },
    { label: "Next Projected Release", value: "Jun 15, 2026", color: "#10b981", bg: "#f0fdf4", icon: <CalendarClock size={24} /> },
    { label: "Disbursement Status", value: "Verified", color: "#8b5cf6", bg: "#f5f3ff", icon: <ShieldCheck size={24} /> },
  ] : [
    { label: "Approved Allocation", value: `₱${totalAmount.toLocaleString()}`, color: "#3b82f6", bg: "#eff6ff", icon: <Banknote size={24} /> },
    { label: "Utilization Rate", value: "82.4%", color: "#10b981", bg: "#f0fdf4", icon: <Target size={24} /> },
    { label: "Surplus Forecast", value: `₱${(totalAmount * 0.15).toLocaleString()}`, color: "#f59e0b", bg: "#fffbeb", icon: <Activity size={24} /> },
  ];

  return (
    <div style={{ display: "grid", gap: "2.5rem" }}>
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
         {stats.map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ background: "white", padding: "2rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
            >
               <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: stat.bg, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                  {stat.icon}
               </div>
               <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginBottom: "0.5rem" }}>{stat.label}</p>
               <h3 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>{stat.value}</h3>
            </motion.div>
         ))}
      </div>

      {/* Main Ledger Table */}
      <div style={{ background: "white", borderRadius: "32px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
         <div style={{ padding: "2rem 3rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
               <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b" }}>{effectiveMode === "STIPEND" ? "Student Stipend Ledger" : "Resource Utilization Ledger"}</h3>
               <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", marginTop: "0.25rem" }}>
                  {effectiveMode === "STIPEND" ? "Tracking your financial assistance and grants." : "Consolidated institutional resource tracking."}
               </p>
            </div>
            <button style={{ padding: "0.75rem 1.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
               <Download size={16} /> Export Audit PDF
            </button>
         </div>

         <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                  <tr style={{ textAlign: "left", background: "white" }}>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Reference & Details</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Amount</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Timeline</th>
                  </tr>
               </thead>
               <tbody>
                  {approvedData.length > 0 ? approvedData.map((item, i) => (
                     <tr key={item.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafbfb" }}>
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <p style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>{effectiveMode === "STIPEND" ? (item.name || "Academic Grant") : item.title}</p>
                           <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", marginTop: "0.25rem" }}>ID: {item.id.substring(0, 8).toUpperCase()}</p>
                        </td>
                        <td style={{ padding: "1.5rem 3rem", fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>
                           ₱{(effectiveMode === "STIPEND" ? 25000 : parseFloat(item.budget)).toLocaleString()}
                        </td>
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <span style={{ fontSize: "0.7rem", fontWeight: "900", padding: "0.4rem 0.8rem", background: "#f0fdf4", color: "#10b981", borderRadius: "10px", textTransform: "uppercase" }}>{item.status}</span>
                        </td>
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e293b" }}>{item.dateApplied || item.date || "May 12, 2026"}</p>
                        </td>
                     </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} style={{ padding: "4rem", textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "700" }}>
                        No active financial records found for this period.
                      </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
