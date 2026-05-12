"use client";

import { motion } from "framer-motion";
import * as React from "react";
import {
  Activity,
  ArrowUpRight,
  Users,
  GraduationCap,
  CalendarCheck,
  FileText,
  Megaphone,
  Clock,
  Sparkles,
  RefreshCw,
  ClipboardList,
  History,
  BrainCircuit,
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { summarizeAuditLogs } from "@/lib/actions/aiActions";

export default function DashboardPage() {
  const {
    scholarshipApps,
    organizations,
    requests: serviceRequests,
    appointments,
    currentUser,
    referrals,
    announcements,
    auditLogs,
  } = useGlobalState();
  const [mounted, setMounted] = React.useState(false);
  const [aiInsight, setAiInsight] = React.useState<any>(null);
  const [isForecasting, setIsForecasting] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (auditLogs && auditLogs.length > 0) {
      summarizeAuditLogs(auditLogs).then((res) => setAiInsight(res));
    }
  }, [auditLogs]);

  const runForecast = () => {
    setIsForecasting(true);
    setTimeout(() => setIsForecasting(false), 2000);
  };

  // Wait for data to load
  if (!mounted || !currentUser) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "#3b82f6" }}>
        <Activity className="animate-pulse" size={48} />
      </div>
    );
  }

  // ── Summary cards with plain labels ──
  const summaryCards = [
    {
      label: "Student Clubs",
      value: organizations?.length || 0,
      subtitle: "Active clubs & organizations",
      icon: <Users size={22} />,
      color: "#6366f1",
    },
    {
      label: "Service Requests",
      value: (serviceRequests || []).length,
      subtitle: "Requests from students",
      icon: <ClipboardList size={22} />,
      color: "#f59e0b",
    },
    {
      label: "Scholarships",
      value: scholarshipApps?.length || 0,
      subtitle: "Total applications filed",
      icon: <GraduationCap size={22} />,
      color: "#10b981",
    },
    {
      label: "Appointments",
      value: (appointments || []).filter((a) => a.status === "APPROVED").length,
      subtitle: "Upcoming scheduled meetings",
      icon: <CalendarCheck size={22} />,
      color: "#3b82f6",
    },
  ];

  return (
    <div style={{ width: "100%", position: "relative", maxWidth: "1600px", margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
          School Overview
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
          OSAS <span style={{ color: "#3b82f6" }}>Dashboard</span>
        </h1>
        <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#64748b", maxWidth: "550px", lineHeight: "1.6" }}>
          Welcome back, <strong>{currentUser.name}</strong>. Here's a quick look at what's happening across the campus today.
        </p>
      </div>

      {/* ── Smart Forecast Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: "3rem",
          padding: "2.5rem 3rem",
          background: "linear-gradient(135deg, #f8fafc, #f0f9ff)",
          border: "1px solid #e2e8f0",
          borderRadius: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
          boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
        }}
      >
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flex: 1, minWidth: "260px" }}>
          <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", flexShrink: 0, boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
            <Sparkles size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>
              Smart Activity Forecast
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: "1.6", maxWidth: "500px" }}>
              Our AI engine is processing historical data to predict student request volume and club activity peaks for the coming month.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)" }}
          whileTap={{ scale: 0.97 }}
          onClick={runForecast}
          style={{
            padding: "1rem 2.5rem",
            background: "#3b82f6",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontWeight: "800",
            fontSize: "0.9rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            transition: "all 0.2s"
          }}
        >
          {isForecasting ? <RefreshCw className="animate-spin" size={18} /> : <>Generate Report <ArrowUpRight size={18} /></>}
        </motion.button>
      </motion.div>

      {/* ── Summary Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
            style={{
              padding: "2rem",
              background: "white",
              border: "1px solid #f3f4f6",
              borderRadius: "20px",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
              <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${card.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                {card.icon}
              </div>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ArrowUpRight size={16} color="#94a3b8" />
              </div>
            </div>

            <h2 style={{ fontSize: "2.8rem", fontWeight: "900", color: "#111827", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {card.value}
            </h2>
            <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e293b", marginTop: "0.75rem" }}>{card.label}</p>
            <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.25rem", fontWeight: "500" }}>{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Two-Column: AI Summary + Announcements ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>

        {/* Institutional Intelligence Brief */}
        <div style={{ padding: "3rem", background: "white", border: "1px solid #f1f5f9", borderRadius: "32px", position: "relative", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}>
           <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "6px", background: "linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)" }} />
           
           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)" }}>
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>Intelligence Brief</h3>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", marginTop: "0.25rem" }}>Autonomous OSAS Analysis Agent</p>
                </div>
              </div>
              <div style={{ background: "#f0fdf4", color: "#166534", padding: "0.5rem 1rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid #dcfce7" }}>
                 <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#22c55e" }} /> OSAS_CORE: ONLINE
              </div>
           </div>

           <div style={{ display: "grid", gap: "2.5rem" }}>
              <div style={{ background: "#f8fafc", padding: "2rem", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                <p style={{ fontSize: "1rem", color: "#334155", lineHeight: "1.8", fontWeight: "500", fontStyle: "italic" }}>
                  "{aiInsight?.summary || "Analyzing telemetry and audit logs… Executive summary will appear shortly."}"
                </p>
              </div>

              <div>
                 <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Detected Action Items</p>
                 <div style={{ display: "grid", gap: "1rem" }}>
                    {[
                      { icon: <Clock size={16} />, label: "Scholarship Batch Endings", val: "3 Active Cycles", color: "#f59e0b" },
                      { icon: <ClipboardList size={16} />, label: "Pending Service Requests", val: (serviceRequests || []).length + " Requests", color: "#3b82f6" },
                      { icon: <Activity size={16} />, label: "Anomalous Activity", val: (aiInsight?.anomalies?.length || 0) + " Flags", color: "#ef4444" }
                    ].map((item, idx) => (
                      <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", background: "white", border: "1px solid #f1f5f9", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.01)" }}>
                         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            <div style={{ color: item.color }}>{item.icon}</div>
                            <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#475569" }}>{item.label}</span>
                         </div>
                         <span style={{ fontSize: "0.85rem", fontWeight: "900", color: "#1e293b" }}>{item.val}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>

        {/* Announcements */}
        <div style={{ padding: "2.5rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "24px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#fff7ed", display: "flex", alignItems: "center", justifyContent: "center", color: "#f59e0b" }}>
              <Megaphone size={22} />
            </div>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Bulletin & Announcements</h3>
          </div>
          {(announcements || []).length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #e2e8f0" }}>
              <p style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>The digital bulletin is currently empty.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gap: "1.25rem" }}>
              {(announcements || []).slice(0, 4).map((ann) => (
                <div key={ann.id} style={{ padding: "1.25rem", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: "800", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em", padding: "0.3rem 0.7rem", background: "white", borderRadius: "6px", border: "1px solid #dbeafe" }}>{ann.category}</span>
                    <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{ann.date}</span>
                  </div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>{ann.title}</h4>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", lineHeight: "1.6" }}>{ann.content?.slice(0, 120)}{ann.content?.length > 120 ? "…" : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Activity Log ── */}
      <div style={{ padding: "2.5rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "24px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", border: "1px solid #f1f5f9" }}>
            <History size={22} />
          </div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>System Governance Audit Log</h3>
        </div>
        
        {(auditLogs || []).length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "#94a3b8", textAlign: "center", padding: "3rem" }}>No governance activities recorded in the current session.</p>
        ) : (
          <div style={{ display: "grid", gap: "0.75rem" }}>
            {(auditLogs || []).slice(0, 10).map((log, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", background: i % 2 === 0 ? "#f8fafc" : "white", borderRadius: "12px", border: "1px solid #f1f5f9" }}
              >
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                   <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", width: "120px", fontFamily: "monospace" }}>{log.action?.replace(/_/g, " ")}</div>
                   <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>{log.details}</p>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", whiteSpace: "nowrap", fontWeight: "700" }}>
                  {log.timestamp?.split(",")[1]?.trim() || log.timestamp}
                </span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
