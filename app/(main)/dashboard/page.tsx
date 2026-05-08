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
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--primary)" }}>
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
      color: "var(--primary)",
    },
  ];

  return (
    <div style={{ width: "100%", position: "relative" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
          School Overview
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
          OSAS <span style={{ color: "var(--primary)" }}>Dashboard</span>
        </h1>
        <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#6b7280", maxWidth: "550px", lineHeight: "1.6" }}>
          Welcome back, <strong>{currentUser.name}</strong>. Here's a quick look at what's happening across the campus today.
        </p>
      </div>

      {/* ── Smart Forecast Banner ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          marginBottom: "3rem",
          padding: "clamp(1.5rem, 4vw, 2.5rem) clamp(2rem, 5vw, 3rem)",
          background: "linear-gradient(135deg, rgba(99,102,241,0.04) 0%, rgba(0,229,255,0.04) 100%)",
          border: "1px solid rgba(99,102,241,0.15)",
          borderRadius: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1.5rem",
        }}
      >
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", flex: 1, minWidth: "260px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(99,102,241,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#6366f1", flexShrink: 0 }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#111827", marginBottom: "0.5rem" }}>
              Smart Activity Forecast
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#6b7280", lineHeight: "1.5", maxWidth: "500px" }}>
              Get a quick prediction of how many student requests and club events OSAS should expect next month.
            </p>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={runForecast}
          style={{
            padding: "0.85rem 2rem",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontWeight: "700",
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
          }}
        >
          {isForecasting ? <RefreshCw className="animate-spin" size={16} /> : "Run Forecast"}
        </motion.button>
      </motion.div>

      {/* ── Summary Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}
            style={{
              padding: "1.75rem 2rem",
              background: "white",
              border: "1px solid #f3f4f6",
              borderRadius: "16px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Accent bar */}
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", background: card.color }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: `${card.color}12`, display: "flex", alignItems: "center", justifyContent: "center", color: card.color }}>
                {card.icon}
              </div>
              <ArrowUpRight size={18} color={card.color} style={{ opacity: 0.5 }} />
            </div>

            <h2 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#111827", letterSpacing: "-0.04em", lineHeight: 1 }}>
              {card.value}
            </h2>
            <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#374151", marginTop: "0.5rem" }}>{card.label}</p>
            <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>{card.subtitle}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Two-Column: AI Summary + Announcements ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>

        {/* AI Summary */}
        <div style={{ padding: "2rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", borderLeft: "4px solid var(--primary)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <BrainCircuit size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#111827" }}>AI Summary</h3>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#374151", lineHeight: "1.7", marginBottom: "0.5rem" }}>
            A quick overview of what's been happening in the system, generated from recent activity logs.
          </p>
          <div style={{ background: "#f9fafb", padding: "1.25rem", borderRadius: "10px", marginTop: "1rem" }}>
            <p style={{ fontSize: "0.9rem", color: "#4b5563", lineHeight: "1.7" }}>
              {aiInsight?.summary || "Analyzing recent activities… Check back shortly."}
            </p>
            {aiInsight?.anomalies && aiInsight.anomalies.length > 0 && (
              <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {aiInsight.anomalies.slice(0, 3).map((a: string, i: number) => (
                  <span key={i} style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--primary)", padding: "0.4rem 0.85rem", background: "rgba(0,229,255,0.06)", border: "1px solid rgba(0,229,255,0.2)", borderRadius: "6px" }}>
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Announcements */}
        <div style={{ padding: "2rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
            <Megaphone size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#111827" }}>Recent Announcements</h3>
          </div>
          {(announcements || []).length === 0 ? (
            <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>No announcements yet.</p>
          ) : (
            <div style={{ display: "grid", gap: "1.5rem" }}>
              {(announcements || []).slice(0, 4).map((ann) => (
                <div key={ann.id} style={{ borderLeft: "3px solid var(--primary)", paddingLeft: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--primary)", textTransform: "uppercase" }}>{ann.category}</span>
                    <span style={{ fontSize: "0.6rem", color: "#9ca3af" }}>• {ann.date}</span>
                  </div>
                  <h4 style={{ fontSize: "0.9rem", fontWeight: "700", color: "#111827", marginBottom: "0.25rem" }}>{ann.title}</h4>
                  <p style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: "1.5" }}>{ann.content?.slice(0, 120)}{ann.content?.length > 120 ? "…" : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Recent Activity Log ── */}
      <div style={{ padding: "2rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <History size={20} color="var(--primary)" />
          <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#111827" }}>Recent Activity</h3>
        </div>
        <p style={{ fontSize: "0.8rem", color: "#9ca3af", marginBottom: "1.5rem" }}>
          A log of the latest actions performed in the system.
        </p>
        {(auditLogs || []).length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>No recent activity.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {(auditLogs || []).slice(0, 8).map((log, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "1rem", borderBottom: i < 7 ? "1px solid #f3f4f6" : "none" }}>
                <div>
                  <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#111827" }}>{log.details}</p>
                  <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.25rem" }}>{log.action?.replace(/_/g, " ")}</p>
                </div>
                <span style={{ fontSize: "0.65rem", color: "#9ca3af", whiteSpace: "nowrap", marginLeft: "1rem", flexShrink: 0 }}>
                  {log.timestamp?.split(",")[1]?.trim() || log.timestamp}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
