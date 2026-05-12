"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Banknote, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Target, 
  PieChart,
  Activity,
  Download
} from "lucide-react";

interface FinancialLedgerProps {
  activities: any[];
}

export default function FinancialLedger({ activities }: FinancialLedgerProps) {
  const approvedActivities = activities.filter(a => a.status === "Approved" || a.status === "Completed");
  
  const totalBudget = approvedActivities.reduce((sum, a) => sum + (parseFloat(a.budget) || 0), 0);
  const projectedSpend = totalBudget * 0.85; // Mock data logic

  const stats = [
    { label: "Approved Allocation", value: `₱${totalBudget.toLocaleString()}`, color: "#3b82f6", bg: "#eff6ff", icon: <Banknote size={24} /> },
    { label: "Actual Utilization", value: `₱${projectedSpend.toLocaleString()}`, color: "#10b981", bg: "#f0fdf4", icon: <Target size={24} /> },
    { label: "Operational Surplus", value: `₱${(totalBudget - projectedSpend).toLocaleString()}`, color: "#f59e0b", bg: "#fffbeb", icon: <Activity size={24} /> },
  ];

  return (
    <div style={{ display: "grid", gap: "2.5rem" }}>
      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
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
               <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b" }}>Financial Intelligence Ledger</h3>
               <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", marginTop: "0.25rem" }}>Consolidated activity expenditure tracking.</p>
            </div>
            <button style={{ padding: "0.75rem 1.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
               <Download size={16} /> Export Audit CSV
            </button>
         </div>

         <div style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
               <thead>
                  <tr style={{ textAlign: "left", background: "white" }}>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Activity Description</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Allocation</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
                     <th style={{ padding: "1.5rem 3rem", fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em" }}>Efficiency</th>
                  </tr>
               </thead>
               <tbody>
                  {approvedActivities.map((act, i) => (
                     <tr key={act.id} style={{ borderTop: "1px solid #f1f5f9", background: i % 2 === 0 ? "white" : "#fafbfb" }}>
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <p style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>{act.title}</p>
                           <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", marginTop: "0.25rem" }}>{act.date}</p>
                        </td>
                        <td style={{ padding: "1.5rem 3rem", fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>
                           ₱{parseFloat(act.budget).toLocaleString()}
                        </td>
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <span style={{ fontSize: "0.7rem", fontWeight: "900", padding: "0.4rem 0.8rem", background: act.status === "Approved" ? "#eff6ff" : "#f0fdf4", color: act.status === "Approved" ? "#3b82f6" : "#10b981", borderRadius: "10px", textTransform: "uppercase" }}>{act.status}</span>
                        </td>
                        <td style={{ padding: "1.5rem 3rem" }}>
                           <div style={{ width: "120px", height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                              <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 1, delay: i * 0.1 }} style={{ height: "100%", background: "#10b981" }} />
                           </div>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
