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
            <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#111827" }}>Unauthorized Access</h2>
            <p style={{ color: "#6b7280", fontWeight: "600", marginTop: "0.5rem" }}>System Admin clearance is required to view the Activity Log.</p>
         </div>
      </div>
    );
  }

  const getSeverityColor = (sev: string) => {
    switch(sev) {
      case "CRITICAL": return "#ef4444";
      case "HIGH": return "#f59e0b";
      case "MEDIUM": return "#3b82f6";
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
              background: "rgba(255, 255, 255, 0.9)",
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
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              style={{ width: "64px", height: "64px", border: "3px solid #f3f4f6", borderTopColor: "#3b82f6", borderRadius: "50%" }}
            />
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#111827", letterSpacing: "-0.02em" }}>Generating Report</h2>
              <p style={{ color: "#3b82f6", fontWeight: "700", marginTop: "0.5rem", fontSize: "0.9rem" }}>Processing {filteredLogs.length} log entries...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Administration</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            <span style={{ color: "var(--primary)" }}>Activity Log</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Track all administrative actions across the OSAS platform.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <button 
            onClick={handleAIAnalysis}
            disabled={isAnalyzing}
            style={{ 
              padding: "0.85rem 1.5rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              background: "#eff6ff", 
              border: "1px solid #bfdbfe", 
              color: "#2563eb", 
              borderRadius: "8px", 
              fontWeight: "700", 
              fontSize: "0.85rem",
              cursor: isAnalyzing ? "wait" : "pointer" 
            }}
          >
            {isAnalyzing ? <Activity className="animate-pulse" size={18} /> : <Zap size={18} />} 
            {isAnalyzing ? "Analyzing..." : "AI Summary"}
          </button>
          <button 
            onClick={handleExportPDF}
            style={{ 
              padding: "0.85rem 1.5rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              background: "white", 
              border: "1px solid #e5e7eb", 
              color: "#374151", 
              borderRadius: "8px", 
              fontWeight: "700", 
              fontSize: "0.85rem",
              opacity: filteredLogs.length === 0 ? 0.5 : 1,
              cursor: filteredLogs.length === 0 ? "not-allowed" : "pointer" 
            }}
          >
            <Download size={18} /> Export Audit PDF
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "3rem" }}>
        <ProcessGuide 
           title="How to Use the Activity Log"
           steps={[
              { title: "View Activity", desc: "See what actions were taken across the system.", icon: <Activity size={16} /> },
              { title: "Check Severity", desc: "Review critical or important actions that may need attention.", icon: <ShieldAlert size={16} /> },
              { title: "Identify Users", desc: "See which staff member performed each action.", icon: <User size={16} /> },
              { title: "Export Report", desc: "Download a PDF of the activity log for your records.", icon: <Database size={16} /> }
           ]}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: "2.5rem", alignItems: "start", marginTop: "3rem" }}>
        
        {/* Main Log Stream */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                <Activity size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Activity Feed</h3>
                <p style={{ fontSize: "0.85rem", color: "#64748b" }}>{filteredLogs.length} entries found</p>
              </div>
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

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredLogs.length === 0 ? (
              <div style={{ padding: "6rem", textAlign: "center", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                <Database size={48} style={{ opacity: 0.2, margin: "0 auto 1.5rem", color: "#64748b" }} />
                <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#64748b" }}>No log entries match your filters.</p>
              </div>
            ) : (
              filteredLogs.map((log, i) => (
                <motion.div 
                  key={log.id + i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  style={{ 
                    background: "white", 
                    padding: "1.5rem 2rem", 
                    display: "grid", 
                    gridTemplateColumns: "180px 1fr 180px", 
                    alignItems: "center",
                    gap: "2rem",
                    borderRadius: "12px",
                    border: "1px solid #f1f5f9",
                    borderLeft: `4px solid ${getSeverityColor(log.severity)}`,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.01)"
                  }}
                >
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", marginBottom: "0.5rem", fontFamily: "'Inter', monospace" }}>{log.timestamp}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: getSeverityColor(log.severity) }} />
                      <span style={{ fontSize: "0.75rem", fontWeight: "800", color: getSeverityColor(log.severity) }}>{log.severity}</span>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.4rem" }}>{log.action.split('_').join(' ')}</h4>
                    <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.5" }}>{log.details}</p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "flex-end", color: "#1e293b" }}>
                      <User size={14} color="#94a3b8" />
                      <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>{log.user.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8", marginTop: "0.4rem" }}>{log.role}</p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Filters Sidebar */}
        <div style={{ position: "sticky", top: "2rem" }}>
          <div style={{ background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Filter size={18} color="#3b82f6" /> Filters
            </h3>
            
            <div style={{ display: "grid", gap: "2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", marginBottom: "0.75rem" }}>Search Logs</label>
                <div style={{ position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                  <input 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Search by action or user..." 
                    style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", fontSize: "0.85rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", marginBottom: "0.75rem" }}>Severity Level</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  {["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"].map((sev) => (
                    <button 
                      key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      style={{ 
                        padding: "0.75rem 1rem", 
                        fontSize: "0.8rem", 
                        fontWeight: "700",
                        background: severityFilter === sev ? "#eff6ff" : "white",
                        color: severityFilter === sev ? "#2563eb" : "#64748b",
                        border: severityFilter === sev ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
                        borderRadius: "8px",
                        textAlign: "left",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        transition: "all 0.2s"
                      }}
                    >
                      {sev} {severityFilter === sev && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: "1rem", padding: "1.5rem", background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "12px" }}>
                <p style={{ fontSize: "0.8rem", fontWeight: "800", color: "#166534", marginBottom: "0.5rem" }}>System Health</p>
                <div style={{ height: "6px", background: "#bbf7d0", borderRadius: "3px", overflow: "hidden" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    style={{ height: "100%", background: "#22c55e" }} 
                  />
                </div>
                <p style={{ fontSize: "0.75rem", color: "#15803d", marginTop: "0.75rem", fontWeight: "600", lineHeight: "1.4" }}>No issues detected. System is running normally.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
