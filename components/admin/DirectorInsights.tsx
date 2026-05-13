"use client";

import { motion } from "framer-motion";
import { 
  TrendingUp, 
  Users, 
  ShieldAlert, 
  GraduationCap, 
  Activity,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";

interface DirectorInsightsProps {
  users: any[];
  referrals: any[];
  scholarshipApps: any[];
}

export default function DirectorInsights({ users, referrals, scholarshipApps }: DirectorInsightsProps) {
  // 📊 DATA AGGREGATION
  const programCounts: Record<string, number> = {};
  users.forEach(u => {
    if (u.program) {
      programCounts[u.program] = (programCounts[u.program] || 0) + 1;
    }
  });

  const severityCounts = {
    URGENT: referrals.filter(r => r.severity === "URGENT").length,
    HIGH: referrals.filter(r => r.severity === "HIGH").length,
    NORMAL: referrals.filter(r => r.severity === "NORMAL" || !r.severity).length,
  };

  const programs = Object.entries(programCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = Math.max(...Object.values(programCounts), 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
      
      {/* --- PROGRAM DISTRIBUTION BARS --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ background: "white", padding: "2rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
             <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                <BarChart3 size={20} />
             </div>
             <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>Program Distribution</h3>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", background: "#f8fafc", padding: "0.4rem 0.8rem", borderRadius: "20px" }}>Live Census</span>
        </div>

        <div style={{ display: "grid", gap: "1.25rem" }}>
          {programs.slice(0, 5).map(([name, count]) => (
            <div key={name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700" }}>
                <span style={{ color: "#475569" }}>{name}</span>
                <span style={{ color: "#1e293b" }}>{count} Students</span>
              </div>
              <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(count / maxCount) * 100}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  style={{ 
                    height: "100%", 
                    background: name === "BSE" ? "#800000" : name === "BSIS" ? "#1e3a8a" : "#3b82f6",
                    borderRadius: "4px"
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* --- REFERRAL SEVERITY PIE --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ background: "white", padding: "2rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "2rem" }}>
           <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#fff1f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#f43f5e" }}>
              <PieChart size={20} />
           </div>
           <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>Case Severity Pulse</h3>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
           <div style={{ position: "relative", width: "140px", height: "140px" }}>
              <svg width="140" height="140" viewBox="0 0 140 140">
                 <circle cx="70" cy="70" r="60" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                 {/* Urgent Segment (Simplified SVG approach) */}
                 <motion.circle 
                   cx="70" cy="70" r="60" fill="none" stroke="#ef4444" strokeWidth="12" 
                   strokeDasharray="377"
                   strokeDashoffset={377 - (377 * (severityCounts.URGENT / (referrals.length || 1)))}
                   strokeLinecap="round"
                   transform="rotate(-90 70 70)"
                 />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                 <span style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b" }}>{referrals.length}</span>
                 <span style={{ fontSize: "0.65rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Total</span>
              </div>
           </div>

           <div style={{ display: "grid", gap: "1rem" }}>
              {[
                { label: "Urgent", count: severityCounts.URGENT, color: "#ef4444" },
                { label: "High", count: severityCounts.HIGH, color: "#f59e0b" },
                { label: "Normal", count: severityCounts.NORMAL, color: "#10b981" }
              ].map(item => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                   <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: item.color }} />
                   <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", minWidth: "60px" }}>{item.label}</span>
                   <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#1e293b" }}>{item.count}</span>
                </div>
              ))}
           </div>
        </div>
      </motion.div>

      {/* --- SCHOLARSHIP FLOW --- */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{ background: "#1e293b", padding: "2rem", borderRadius: "24px", color: "white", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
           <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
              <TrendingUp size={20} />
           </div>
           <h3 style={{ fontSize: "1rem", fontWeight: "800" }}>Application Momentum</h3>
        </div>

        <div style={{ marginBottom: "2rem" }}>
           <p style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.05em" }}>{scholarshipApps.length}</p>
           <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" }}>Total Scholarship Portfolios Processed</p>
        </div>

        <div style={{ height: "60px", display: "flex", alignItems: "flex-end", gap: "4px" }}>
           {[40, 70, 45, 90, 65, 80, 100, 50, 85, 95].map((h, i) => (
             <motion.div 
               key={i}
               initial={{ height: 0 }}
               animate={{ height: `${h}%` }}
               transition={{ delay: 0.3 + (i * 0.05), duration: 0.5 }}
               style={{ flex: 1, background: "rgba(96, 165, 250, 0.3)", borderRadius: "2px 2px 0 0" }}
             />
           ))}
        </div>
        <p style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "700", marginTop: "1rem", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.1em" }}>Semester-to-Date Velocity</p>
      </motion.div>

    </div>
  );
}
