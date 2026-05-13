"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  Activity,
  PieChart,
  BarChart,
  Clock
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function ReferralAnalytics() {
  const { referrals } = useGlobalState();
  
  // Computations
  const totalCases = referrals.length;
  const closedCases = referrals.filter(r => r.status === "Sanctioned" || r.status === "Dismissed").length;
  const pendingCases = totalCases - closedCases;
  const resolutionRate = totalCases > 0 ? ((closedCases / totalCases) * 100).toFixed(1) : 0;

  const stats = [
    { label: "Institutional Volume", value: totalCases, icon: <Activity size={20} />, color: "#3b82f6" },
    { label: "Active Investigations", value: pendingCases, icon: <ShieldAlert size={20} />, color: "#ef4444" },
    { label: "Resolution Efficacy", value: `${resolutionRate}%`, icon: <TrendingUp size={20} />, color: "#10b981" },
  ];

  return (
    <div style={{ display: "grid", gap: "2.5rem" }}>
      {/* Metrics Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: "white", padding: "2rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
               <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: `${stat.color}10`, color: stat.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {stat.icon}
               </div>
               <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "#94a3b8", letterSpacing: "0.1em" }}>REAL-TIME</span>
            </div>
            <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginBottom: "0.5rem" }}>{stat.label}</p>
            <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#1e293b" }}>{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "2rem" }}>
        {/* Trend Graph Placeholder */}
        <div style={{ background: "white", padding: "2.5rem", borderRadius: "32px", border: "1px solid #f1f5f9", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                 <BarChart size={20} color="#3b82f6" /> Case Volume Distribution
              </h3>
              <select style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700" }}>
                 <option>All Sections</option>
                 <option>First Year</option>
                 <option>Senior Level</option>
              </select>
           </div>
           
           <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: "200px", gap: "1rem", padding: "0 1rem" }}>
              {[65, 45, 85, 30, 95, 40, 75].map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
                   <motion.div 
                     initial={{ height: 0 }} 
                     animate={{ height: `${h}%` }} 
                     transition={{ duration: 1, delay: i * 0.1 }}
                     style={{ width: "100%", background: i === 4 ? "#3b82f6" : "#f1f5f9", borderRadius: "8px 8px 4px 4px", position: "relative" }} 
                   >
                     {i === 4 && <div style={{ position: "absolute", top: "-25px", left: "50%", transform: "translateX(-50%)", fontSize: "0.65rem", fontWeight: "900", color: "#3b82f6" }}>PEAK</div>}
                   </motion.div>
                   <span style={{ fontSize: "0.6rem", fontWeight: "800", color: "#94a3b8" }}>MON</span>
                </div>
              ))}
           </div>
        </div>

        {/* Categories Card */}
        <div style={{ background: "white", padding: "2.5rem", borderRadius: "32px", border: "1px solid #f1f5f9", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.02)" }}>
           <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <PieChart size={20} color="#8b5cf6" /> Behavioral Categories
           </h3>
           <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {[
                { label: "Academic Integrity", count: 12, color: "#3b82f6" },
                { label: "Code of Conduct", count: 8, color: "#8b5cf6" },
                { label: "Financial Dispute", count: 5, color: "#10b981" },
                { label: "Attendance Issue", count: 14, color: "#f59e0b" }
              ].map((cat, i) => (
                <div key={cat.label}>
                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>{cat.label}</span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "900", color: "#1e293b" }}>{cat.count}</span>
                   </div>
                   <div style={{ width: "100%", height: "6px", background: "#f8fafc", borderRadius: "3px", overflow: "hidden" }}>
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(cat.count / 40) * 100}%` }} style={{ height: "100%", background: cat.color }} />
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
