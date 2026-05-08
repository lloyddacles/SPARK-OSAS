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
  GraduationCap,
  Users
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// HOISTED HELPERS
function getSeverityColor(sev: string) {
  switch(sev) {
     case "CRITICAL": return "#ef4444";
     case "HIGH": return "#f59e0b";
     case "MEDIUM": return "#3b82f6";
     default: return "#10b981";
  }
}

export default function AdminCenterPage() {
  const { currentUser, organizations, activities, announcements, referrals, auditLogs, users } = useGlobalState();
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

  if (!isLoaded) return <div style={{ minHeight: "100vh" }} />;

  return (
    <div style={{ padding: "3rem", maxWidth: "1400px", margin: "0 auto" }}>
      {/* HEADER */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Administration</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            <span style={{ color: "var(--primary)" }}>System Admin</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Manage organizations, audit logs, student profiles, and system health.</p>
        </div>
        
        <div style={{ textAlign: "right", background: "white", padding: "1rem 1.5rem", borderRadius: "12px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
           <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#6b7280", marginBottom: "0.5rem" }}>System Status</p>
           <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px rgba(16, 185, 129, 0.4)" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#10b981" }}>All Systems Online</span>
           </div>
        </div>
      </div>

      {/* COMMAND GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {[
          { label: "Organizations", count: organizations.length, icon: <Building2 size={24} />, sub: "Active Organizations", color: "#3b82f6", href: "/organizations" },
          { label: "User Management", count: users.length, icon: <Users size={24} />, sub: "System Access Nodes", color: "#f43f5e", href: "/admin/users" },
          { label: "Activity Logs", count: auditLogs.length, icon: <Activity size={24} />, sub: "Audit Entries Recorded", color: "#10b981", href: "/admin/audit" },
          { label: "Student Profiles", count: 0, icon: <Fingerprint size={24} />, sub: "Passports Registered", color: "#8b5cf6", href: "/admin/passport" }
        ].map(node => (
          <motion.div 
            key={node.label}
            whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
            onClick={() => router.push(node.href)}
            style={{ 
              background: "white", 
              padding: "2rem", 
              borderRadius: "16px", 
              border: "1px solid #f3f4f6", 
              cursor: "pointer", 
              position: "relative", 
              overflow: "hidden",
              boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
            }}
          >
             <div style={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", background: node.color, opacity: 0.04, borderRadius: "0 0 0 100%" }} />
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: `${node.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: node.color }}>
                  {node.icon}
                </div>
                <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ChevronRight size={16} color="#94a3b8" />
                </div>
             </div>
             <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginBottom: "0.5rem" }}>{node.label}</p>
             <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem" }}>
                <span style={{ fontSize: "2rem", fontWeight: "800", color: "#111827", lineHeight: "1" }}>{node.count}</span>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#9ca3af" }}>{node.sub}</span>
             </div>
          </motion.div>
        ))}
      </div>

      {/* SYSTEM LOGS & TELEMETRY */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "1.5rem" }}>
        
        {/* RECENT SYSTEM AUDIT */}
        <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden", gridColumn: "1 / -1", '@media (min-width: 1024px)': { gridColumn: "span 2" } } as any}>
          <div style={{ padding: "1.5rem 2rem", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
               <Database size={18} color="#64748b" />
               <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>Recent Activity Log</h3>
             </div>
             <button onClick={() => router.push("/admin/audit")} style={{ background: "white", border: "1px solid #e2e8f0", padding: "0.5rem 1rem", borderRadius: "8px", color: "#3b82f6", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>View All</button>
          </div>
          <div style={{ padding: "0" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "1rem 2rem", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Timestamp</th>
                  <th style={{ padding: "1rem 2rem", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Action</th>
                  <th style={{ padding: "1rem 2rem", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Severity</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.slice(0, 5).map((log, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}>
                    <td style={{ padding: "1.25rem 2rem", fontSize: "0.85rem", color: "#64748b", fontFamily: "'Inter', monospace" }}>{log.timestamp}</td>
                    <td style={{ padding: "1.25rem 2rem", fontSize: "0.9rem", fontWeight: "600", color: "#1e293b" }}>{log.action}</td>
                    <td style={{ padding: "1.25rem 2rem" }}>
                       <span style={{ 
                         fontSize: "0.7rem", 
                         fontWeight: "700", 
                         padding: "0.3rem 0.75rem", 
                         background: `${getSeverityColor(log.severity)}15`, 
                         color: getSeverityColor(log.severity),
                         borderRadius: "20px"
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
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
           <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", padding: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <Activity size={18} color="#3b82f6" />
                <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>System Health</h3>
              </div>
              <div style={{ display: "grid", gap: "1.5rem" }}>
                {[
                  { label: "Response Time", value: "24ms", progress: 15, color: "#3b82f6" },
                  { label: "Storage Used", value: "1.2GB", progress: 45, color: "#f59e0b" },
                  { label: "System Uptime", value: "99.98%", progress: 99, color: "#10b981" }
                ].map(metric => (
                  <div key={metric.label}>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>{metric.label}</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: "800", color: metric.color }}>{metric.value}</span>
                     </div>
                     <div style={{ height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.progress}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{ height: "100%", background: metric.color, borderRadius: "3px" }} 
                        />
                     </div>
                  </div>
                ))}
              </div>
           </div>

           <div style={{ background: "linear-gradient(135deg, #f8fafc, #f0f9ff)", borderRadius: "16px", border: "1px solid #e0f2fe", padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#0284c7", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                <Zap size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#0c4a6e", marginBottom: "0.5rem" }}>Automated Tasks Active</h3>
                <p style={{ fontSize: "0.85rem", color: "#0369a1", lineHeight: "1.6", marginBottom: "1.5rem" }}>Background workers are currently monitoring telemetry and processing queued service requests.</p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "white", padding: "0.75rem 1rem", borderRadius: "8px", width: "fit-content" }}>
                   <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                   <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#0f766e" }}>Next scheduled scan: 14h 22m</span>
                </div>
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
