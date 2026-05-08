"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Activity, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  ShieldAlert, 
  Zap,
  ChevronRight,
  Database,
  ArrowRight
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useState } from "react";
import ProcessGuide from "@/components/ProcessGuide";
import { generateInstitutionalPDF } from "@/lib/utils/pdfGenerator";
import { summarizeAuditLogs } from "@/lib/actions/aiActions";

export default function AuditCenterPage() {
  const { auditLogs, currentUser } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");
  const [isExporting, setIsExporting] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const isAuth = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";

  if (!isAuth) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
         <ShieldAlert size={64} color="#ef4444" />
         <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)" }}>UNAUTHORIZED ACCESS</h2>
            <p style={{ color: "var(--text-dim)", fontWeight: "700", marginTop: "0.5rem" }}>INSTITUTIONAL CLEARANCE REQUIRED.</p>
         </div>
      </div>
    );
  }

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case "CRITICAL": return "#ef4444";
      case "HIGH": return "#f59e0b";
      case "MEDIUM": return "var(--primary)";
      default: return "#10b981";
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === "ALL" || log.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await summarizeAuditLogs(auditLogs);
      setAiAnalysis(analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportPDF = async () => {
    if (filteredLogs.length === 0) return;
    setIsExporting(true);
    
    // Defer to next tick to allow UI to update
    setTimeout(async () => {
      try {
        await generateInstitutionalPDF({
          title: "System Accountability Ledger",
          subtitle: "Official Institutional Audit Stream",
          filename: "SYSTEM_AUDIT_REPORT",
          orientation: "l",
          sections: [
            {
              title: "AUTHORITATIVE AUDIT LOGS",
              data: [
                ["Timestamp", "Action Node", "Details", "Authorized User", "Role", "Severity"],
                ...filteredLogs.map(log => [
                  log.timestamp,
                  log.action,
                  log.details,
                  log.user,
                  log.role,
                  log.severity
                ])
              ]
            }
          ]
        });
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", position: "relative" }}>
      
      {/* EXPORT OVERLAY */}
      <AnimatePresence>
        {isExporting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 999,
              background: "rgba(10, 15, 25, 0.9)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem"
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              style={{ width: "64px", height: "64px", border: "2px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%" }}
            />
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.2em" }}>Generating Report</h2>
              <p style={{ color: "var(--primary)", fontWeight: "700", marginTop: "1rem", fontSize: "0.8rem" }}>Processing {filteredLogs.length} log entries...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Administration</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "var(--text-main)" }}>
            <span style={{ color: "var(--primary)" }}>Activity Log</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Track all administrative actions across the OSAS platform.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button 
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            className="btn-cyan" 
            style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(0, 229, 255, 0.05)", border: "1px solid var(--primary)", color: "var(--primary)" }}
          >
            {isAnalyzing ? <Activity className="animate-pulse" size={18} /> : <Zap size={18} />} 
            {isAnalyzing ? "Analyzing..." : "AI Summary"}
          </button>
          <button 
            onClick={handleExportPDF}
            className="btn-cyan" 
            style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(0, 229, 255, 0.05)", border: "1px solid var(--border-active)", color: "var(--primary)", opacity: filteredLogs.length === 0 ? 0.3 : 1 }}
          >
            <Download size={18} /> EXPORT AUDIT PDF
          </button>
        </div>
      </div>

      <ProcessGuide 
         title="How to Use the Activity Log"
         steps={[
            { title: "View Activity", desc: "See what actions were taken across the system.", icon: <Activity size={14} /> },
            { title: "Check Severity", desc: "Review critical or important actions that may need attention.", icon: <ShieldAlert size={14} /> },
            { title: "Identify Users", desc: "See which staff member performed each action.", icon: <User size={14} /> },
            { title: "Export Report", desc: "Download a PDF of the activity log for your records.", icon: <Database size={14} /> }
         ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "3rem", alignItems: "start", marginTop: "3rem" }}>
        
        {/* Main Log Stream */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--primary)" }}>
                <Activity size={18} />
                <span style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "0.05em" }}>Activity Feed</span>
              </div>
              <div style={{ height: "1px", width: "100px", background: "var(--border-dim)" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>{filteredLogs.length} entries found</span>
            </div>
          </div>

          <AnimatePresence>
            {aiAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ padding: "2rem", marginBottom: "3rem", background: "linear-gradient(135deg, #f8fafc, #f1f5f9)", border: "1px solid #e2e8f0", borderRadius: "16px", position: "relative", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
              >
                <div style={{ position: "absolute", top: 0, right: 0, padding: "0.6rem 1.25rem", background: "#3b82f6", color: "white", fontSize: "0.75rem", fontWeight: "700", borderBottomLeftRadius: "12px" }}>
                  AI Summary
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 250px", gap: "3rem" }}>
                  <div style={{ paddingTop: "0.5rem" }}>
                    <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.75rem" }}>Activity Overview</h3>
                    <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: "1.6" }}>{aiAnalysis.summary}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", paddingTop: "0.5rem" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#3b82f6" }}>Flagged Items</p>
                    {aiAnalysis.anomalies.map((a: string, i: number) => {
                      const isClear = a.toLowerCase().includes("no issues found") || a.includes("NO_ANOMALIES");
                      return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: isClear ? "#64748b" : "#ef4444", fontWeight: "600", padding: "0.5rem", background: isClear ? "rgba(255,255,255,0.5)" : "#fef2f2", borderRadius: "8px", border: isClear ? "1px solid transparent" : "1px solid #fecaca" }}>
                          <ShieldAlert size={16} /> <span style={{ lineHeight: "1.4" }}>{a}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)" }}>
            {filteredLogs.length === 0 ? (
              <div className="sapphire-card" style={{ padding: "8rem", textAlign: "center" }}>
                <Database size={48} style={{ opacity: 0.1, margin: "0 auto 2rem" }} />
                <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em" }}>No log entries match your filters.</p>
              </div>
            ) : (
              filteredLogs.map((log, i) => (
                <motion.div 
                  key={log.id + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    background: "var(--bg-surface)", 
                    padding: "2rem 2.5rem", 
                    display: "grid", 
                    gridTemplateColumns: "200px 1fr 180px", 
                    alignItems: "center",
                    gap: "2rem",
                    borderLeft: `4px solid ${getSeverityColor(log.severity)}`
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>Time: {log.timestamp}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: getSeverityColor(log.severity), boxShadow: `0 0 10px ${getSeverityColor(log.severity)}` }} />
                      <span style={{ fontSize: "0.7rem", fontWeight: "900", color: getSeverityColor(log.severity) }}>{log.severity}</span>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "0.5rem", letterSpacing: "0.02em" }}>{log.action.split('_').join(' ')}</h4>
                    <p style={{ fontSize: "0.85rem", color: "var(--text-dim)", fontWeight: "600", lineHeight: "1.5" }}>{log.details}</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "flex-end", color: "var(--text-main)" }}>
                      <User size={14} color="var(--primary)" />
                      <span style={{ fontSize: "0.75rem", fontWeight: "900" }}>{log.user.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.5rem", letterSpacing: "0.05em" }}>Role: {log.role}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Filters Sidebar */}
        <div style={{ position: "sticky", top: "2rem" }}>
          <div className="sapphire-card" style={{ padding: "2.5rem" }}>
            <h3 style={{ fontSize: "0.8rem", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <Filter size={16} color="var(--primary)" /> Filters
            </h3>
            
            <div style={{ display: "grid", gap: "2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "1rem", letterSpacing: "0.1em" }}>Search Logs</label>
                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                  <input 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by action, user, or detail..." 
                    style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", fontSize: "0.75rem", fontWeight: "800", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "1rem", letterSpacing: "0.1em" }}>Severity Level</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                    <button 
                      key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      style={{ 
                        padding: "0.85rem 1.25rem", 
                        fontSize: "0.65rem", 
                        fontWeight: "900",
                        background: severityFilter === sev ? "rgba(0, 229, 255, 0.05)" : "transparent",
                        color: severityFilter === sev ? "var(--primary)" : "var(--text-dim)",
                        border: severityFilter === sev ? "1px solid var(--primary)" : "1px solid var(--border-dim)",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      {sev} {severityFilter === sev && <ChevronRight size={12} />}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-dim)" }}>
                <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>System Health</p>
                <div style={{ height: "4px", background: "var(--bg-accent)", borderRadius: "2px", overflow: "hidden" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    style={{ height: "100%", background: "#10b981" }} 
                  />
                </div>
                <p style={{ fontSize: "0.5rem", color: "var(--text-dim)", marginTop: "0.75rem", fontWeight: "700" }}>No issues detected. System is running normally.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
