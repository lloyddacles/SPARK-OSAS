"use client";

import { useGlobalState } from "@/lib/GlobalStateContext";
import { useState, useEffect } from "react";
import { 
  Terminal, 
  ShieldCheck, 
  Search, 
  Activity, 
  Cpu, 
  Database, 
  ArrowRight,
  TrendingUp,
  Settings,
  ChevronRight,
  Zap,
  Globe,
  Grid,
  ShieldAlert,
  User,
  Hash,
  FileUp,
  Workflow,
  GraduationCap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// HOISTED HELPERS
function getSeverityColor(sev: string) {
  switch(sev) {
     case "CRITICAL": return "#ef4444";
     case "HIGH": return "#f59e0b";
     case "MEDIUM": return "var(--primary)";
     default: return "var(--text-dim)";
  }
}

export default function AdminCenterPage() {
  const { currentUser, organizations, activities, announcements, referrals, auditLogs } = useGlobalState();
  const [isLoaded, setIsLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Only allow System Admin access
    if (currentUser && currentUser.role !== "SYSTEM_ADMIN") {
      router.push("/dashboard");
      return;
    }
    setIsLoaded(true);
  }, [currentUser, router]);

  if (!isLoaded) return null;

  return (
    <div style={{ padding: "3rem", maxWidth: "1600px", margin: "0 auto" }}>
      {/* TERMINAL HEADER */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
             <div style={{ width: "48px", height: "48px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--bg-deep)", borderRadius: "4px", boxShadow: "0 0 30px var(--primary-glow)" }}>
                <Terminal size={24} />
             </div>
             <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "0.2em", color: "var(--text-main)" }}>SYSTEM_ADMIN</h1>
          </div>
          <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.4em" }}>CORE_GOVERNANCE_TERMINAL_v2.5</p>
        </div>
        
        <div style={{ textAlign: "right" }}>
           <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>TERMINAL_STATUS</p>
           <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.1em" }}>OPERATIONAL_LEVEL_01</span>
           </div>
        </div>
      </div>

      {/* COMMAND GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem", marginBottom: "4rem" }}>
        {[
          { label: "IDENTITY_REGISTRY", count: organizations.length, icon: <Building2 size={20} />, sub: "Organizations", color: "var(--primary)", href: "/organizations" },
          { label: "TELEMETRY_LOGS", count: auditLogs.length, icon: <Activity size={20} />, sub: "Audit Entries", color: "#10b981", href: "/admin/audit" },
          { label: "PASSPORT_CONTROL", count: 0, icon: <Fingerprint size={20} />, sub: "Student Passports", color: "#8b5cf6", href: "/admin/passport" }
        ].map(node => (
          <motion.div 
            key={node.label}
            whileHover={{ y: -5, borderColor: node.color }}
            onClick={() => router.push(node.href)}
            className="sapphire-card"
            style={{ padding: "2.5rem", cursor: "pointer", position: "relative", overflow: "hidden" }}
          >
             <div style={{ position: "absolute", top: 0, right: 0, width: "100px", height: "100px", background: node.color, opacity: 0.03, borderRadius: "0 0 0 100%" }} />
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <div style={{ color: node.color }}>{node.icon}</div>
                <ChevronRight size={16} color="var(--text-dim)" />
             </div>
             <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>{node.label}</p>
             <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
                <span style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--text-main)" }}>{node.count}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dim)" }}>{node.sub}</span>
             </div>
          </motion.div>
        ))}
      </div>

      {/* SYSTEM LOGS & TELEMETRY */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        
        {/* RECENT SYSTEM AUDIT */}
        <div className="sapphire-card" style={{ padding: "0" }}>
          <div style={{ padding: "2rem 2.5rem", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <h3 style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "0.2em", color: "var(--text-main)" }}>SYSTEM_AUDIT_LEDGER</h3>
             <button onClick={() => router.push("/admin/audit")} style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer", letterSpacing: "0.1em" }}>VIEW_ALL_LOGS</button>
          </div>
          <div style={{ padding: "1.5rem" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border-dim)" }}>
                  <th style={{ padding: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>TIMESTAMP</th>
                  <th style={{ padding: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>ACTION</th>
                  <th style={{ padding: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 8).map((log, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "1rem", fontSize: "0.75rem", color: "var(--text-dim)", fontFamily: "monospace" }}>{log.timestamp}</td>
                    <td style={{ padding: "1rem", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-main)" }}>{log.action}</td>
                    <td style={{ padding: "1rem" }}>
                       <span style={{ 
                         fontSize: "0.55rem", 
                         fontWeight: "900", 
                         padding: "0.2rem 0.5rem", 
                         background: `${getSeverityColor(log.severity)}22`, 
                         color: getSeverityColor(log.severity),
                         border: `1px solid ${getSeverityColor(log.severity)}44`,
                         borderRadius: "2px"
                       }}>
                         {log.severity}
                       </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SYSTEM HEALTH */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
           <div className="sapphire-card" style={{ padding: "2.5rem" }}>
              <h3 style={{ fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.15em", color: "var(--text-main)", marginBottom: "2rem" }}>RESOURCE_MONITOR</h3>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {[
                  { label: "DATABASE_LATENCY", value: "24ms", progress: 15 },
                  { label: "STORAGE_UTILIZATION", value: "1.2GB", progress: 45 },
                  { label: "API_UPTIME", value: "99.98%", progress: 99 }
                ].map(metric => (
                  <div key={metric.label}>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>{metric.label}</span>
                        <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)" }}>{metric.value}</span>
                     </div>
                     <div style={{ height: "4px", background: "var(--bg-accent)", borderRadius: "2px", overflow: "hidden" }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.progress}%` }}
                          style={{ height: "100%", background: "var(--primary)" }} 
                        />
                     </div>
                  </div>
                ))}
              </div>
           </div>

           <div className="sapphire-card" style={{ padding: "2.5rem", background: "linear-gradient(135deg, var(--bg-surface) 0%, rgba(0, 229, 255, 0.05) 100%)" }}>
              <Zap size={24} color="var(--primary)" style={{ marginBottom: "1.5rem" }} />
              <h3 style={{ fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.15em", color: "var(--text-main)", marginBottom: "1rem" }}>AUTOMATED_TASKS</h3>
              <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", lineHeight: "1.6", marginBottom: "1.5rem" }}>System integrity checks scheduled for 04:00 AM daily. All telemetry is being aggregated in real-time.</p>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                 <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                 <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "#10b981", letterSpacing: "0.1em" }}>NEXT_SCAN: 14h 22m</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}

function Building2({ size, color }: { size: number, color?: string }) {
  return <Building2Icon size={size} color={color} />;
}

function Building2Icon({ size, color }: { size: number, color?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 22V4c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v18Z"/>
      <path d="M6 12H4c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h2"/>
      <path d="M18 9h2c1.1 0 2 .9 2 2v9c0 1.1.9 2-2 2h-2"/>
      <path d="M10 6h4"/>
      <path d="M10 10h4"/>
      <path d="M10 14h4"/>
      <path d="M10 18h4"/>
    </svg>
  );
}

function Fingerprint({ size, color }: { size: number, color?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.02-.3 3"/>
      <path d="M14 22a10 10 0 0 0 8-10V9a10 10 0 0 0-20 0v3"/>
      <path d="M2 12v1a10 10 0 0 0 16 7.6"/>
      <path d="M7 2a10 10 0 0 1 10 10v1"/>
      <path d="M12 16a2 2 0 0 1-2-2V9a2 2 0 0 1 4 0v3a2 2 0 0 1-2 2Z"/>
      <path d="M17 16.5a10 10 0 0 1-1.5 5.5"/>
    </svg>
  );
}
