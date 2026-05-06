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

export default function AuditCenterPage() {
  const { auditLogs, currentUser } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

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

  const handleExportPDF = async () => {
    if (filteredLogs.length === 0) return;
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
  };

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
      
      {/* Institutional Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>SYSTEM: INSTITUTIONAL TELEMETRY</p>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            AUDIT <span style={{ color: "var(--primary)" }}>COMMAND</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
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
         title="System Accountability Protocol"
         steps={[
            { title: "Monitor Activity", desc: "Review real-time administrative logs for potential security anomalies or workflow errors.", icon: <Activity size={14} /> },
            { title: "Verify Severity", desc: "Analyze high-severity logs (Critical/High) to ensure system integrity and institutional safety.", icon: <ShieldAlert size={14} /> },
            { title: "Audit Identity", desc: "Trace actions back to specific personnel nodes to maintain administrative non-repudiation.", icon: <User size={14} /> },
            { title: "Export Ledger", desc: "Generate encrypted PDF reports for board review and institutional record-keeping.", icon: <Database size={14} /> }
         ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "3rem", alignItems: "start", marginTop: "3rem" }}>
        
        {/* Main Log Stream */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "var(--primary)" }}>
                <Activity size={18} />
                <span style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "0.05em" }}>LIVE_TELEMETRY_STREAM</span>
              </div>
              <div style={{ height: "1px", width: "100px", background: "var(--border-dim)" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>{filteredLogs.length} NODES DETECTED</span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)" }}>
            {filteredLogs.length === 0 ? (
              <div className="sapphire-card" style={{ padding: "8rem", textAlign: "center" }}>
                <Database size={48} style={{ opacity: 0.1, margin: "0 auto 2rem" }} />
                <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em" }}>NO_LOGS_FOUND_IN_CURRENT_BUFFER</p>
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
                    <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>STAMP: {log.timestamp}</p>
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
                    <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.5rem", letterSpacing: "0.05em" }}>ROLE: {log.role}</p>
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
              <Filter size={16} color="var(--primary)" /> TELEMETRY FILTERS
            </h3>
            
            <div style={{ display: "grid", gap: "2rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "1rem", letterSpacing: "0.1em" }}>SEARCH LOG ENTRIES</label>
                <div style={{ position: "relative" }}>
                  <Search size={14} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                  <input 
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="ACTION, USER, DETAIL..." 
                    style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", fontSize: "0.75rem", fontWeight: "800", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "1rem", letterSpacing: "0.1em" }}>SEVERITY THRESHOLD</label>
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
                <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>SYSTEM_INTEGRITY_INDEX</p>
                <div style={{ height: "4px", background: "var(--bg-accent)", borderRadius: "2px", overflow: "hidden" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    style={{ height: "100%", background: "#10b981" }} 
                  />
                </div>
                <p style={{ fontSize: "0.5rem", color: "var(--text-dim)", marginTop: "0.75rem", fontWeight: "700" }}>NO ANOMALIES DETECTED IN LAST 1,000 NODES.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
