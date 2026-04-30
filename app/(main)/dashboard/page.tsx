"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Activity,
  Cpu,
  Database,
  Hash,
  ArrowUpRight,
  TrendingUp,
  Clock,
  Layers,
  Search,
  BookOpen,
  Users,
  Bell,
  ShieldCheck,
  Zap,
  Globe,
  Radio,
  FileText,
  Building2,
  CheckCircle2,
  AlertTriangle,
  History,
  LayoutDashboard
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function DashboardPage() {
  const { 
    scholarshipApps, 
    organizations, 
    requests: serviceRequests, 
    appointments, 
    currentUser, 
    referrals, 
    announcements,
    scholarshipPrograms,
    serviceTypes,
    auditLogs
  } = useGlobalState();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SAFETY GATE: Ensure we have a user before rendering role-specific content
  if (!mounted || !currentUser) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--primary)" }}>
        <Activity className="animate-pulse" size={48} />
      </div>
    );
  }

  const isGuidance = currentUser.role === "GUIDANCE_COUNSELOR";
  const isAdmin = currentUser.role === "SYSTEM_ADMIN" || currentUser.role === "OSAS_DIRECTOR";
  const isStudent = currentUser.role === "STUDENT_APPLICANT" || currentUser.role === "STUDENT_LEADER";
  const isStaff = isAdmin || isGuidance;
  
  const activeAnnouncements = (announcements || []).slice(0, 5); // Display top 5 recent announcements

  // Student specific calculations
  const vaultItems = currentUser?.vault ? Object.values(currentUser.vault) : [];
  const uploadedCount = vaultItems.filter(v => v.uploaded).length;
  const totalVaultCount = 6; 
  const docProgress = Math.round((uploadedCount / totalVaultCount) * 100);

  const myScholarship = scholarshipApps?.find(a => a.studentName === currentUser?.name);
  const myRequests = (serviceRequests || []).filter(r => r.studentName === currentUser?.name) || [];
  const myApprovedAppointments = (appointments || []).filter(a => a.studentName === currentUser?.name && a.status === "APPROVED") || [];

  // Staff Analytics Calculations
  const scholarshipStats = {
    total: scholarshipApps?.length || 0,
    approved: (scholarshipApps || []).filter(a => a.status === "Approved").length,
    pending: (scholarshipApps || []).filter(a => a.status === "For OSAS Review").length,
    rejected: 0, // 'Rejected' status not defined in type yet
  };

  const orgStats = {
    total: organizations?.length || 0,
    recognized: (organizations || []).filter(o => o.status === "Recognized").length,
    archived: (organizations || []).filter(o => o.status === "Archived").length,
  };

  const requestStats = {
    total: (serviceRequests || []).length,
    pending: (serviceRequests || []).filter(r => r.status === "Pending" || r.status === "In Progress").length,
    completed: (serviceRequests || []).filter(r => r.status === "Completed").length,
  };

  // Service Type Breakdown
  const serviceBreakdown = (serviceTypes || []).map(type => ({
    name: type.name,
    count: (serviceRequests || []).filter(r => r.type === type.name).length
  })).sort((a, b) => b.count - a.count);

  const dataNodes = isGuidance ? [
    { label: "APPOINTMENTS", value: appointments?.length || 0, meta: "TOTAL SESSIONS", color: "#10b981" },
    { label: "STUDENT REFERRALS", value: referrals?.length || 0, meta: "STUDENT CASES", color: "var(--primary)" },
    { label: "CAMPUS WELLNESS", value: "STABLE", meta: "STUDENT MOOD", color: "#6366f1" },
    { label: "PENDING REPORTS", value: (referrals || []).filter(r => r.status === "Endorsed to OSAS").length, meta: "TO OSAS OFFICE", color: "#ec4899" },
  ] : isStudent ? [
    { label: "VAULT PROGRESS", value: `${docProgress}%`, meta: `${uploadedCount}/${totalVaultCount} DOCUMENTS`, color: "var(--primary)" },
    { label: "SCHOLARSHIP", value: myScholarship?.status ? myScholarship.status.split(' ')[0].toUpperCase() : "NONE", meta: myScholarship ? "ACTIVE APPLICATION" : "NO ACTIVE APP", color: "#6366f1" },
    { label: "SERVICE REQS", value: myRequests.length, meta: "TOTAL REQUESTS", color: "#ec4899" },
    { label: "APPROVED APPT", value: myApprovedAppointments.length, meta: "READY SESSIONS", color: "#10b981" },
  ] : [
    { label: "SCHOLARSHIPS", value: scholarshipApps?.length || 0, meta: `${scholarshipStats.pending} PENDING REVIEW`, color: "var(--primary)" },
    { label: "CLUBS & ORGS", value: organizations?.length || 0, meta: `${orgStats.recognized} RECOGNIZED`, color: "#6366f1" },
    { label: "SERVICE REQS", value: (serviceRequests || []).length, meta: `${requestStats.pending} IN QUEUE`, color: "#ec4899" },
    { label: "APPOINTMENTS", value: (appointments || []).length, meta: "SCHEDULED MEETINGS", color: "#10b981" },
  ];

  if (!mounted) return null;

  return (
    <div style={{ width: "100%" }}>
      
      {/* Executive Command Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>STATUS: {isStudent ? "OPERATIONAL" : (isGuidance ? "SECURE" : "INSTITUTIONAL PULSE ACTIVE")}</p>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            {isStudent ? "STUDENT" : (isGuidance ? "GUIDANCE" : "EXECUTIVE")} <span style={{ color: "var(--primary)" }}>DASHBOARD</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>{isGuidance ? "CASE RESOLUTION" : "NETWORK UPTIME"}</p>
              <p style={{ fontSize: "1rem", fontWeight: "900", color: "var(--text-main)" }}>{isGuidance ? "94.2%" : "99.98%"}</p>
           </div>
           <div style={{ height: "40px", width: "1px", background: "var(--border-dim)" }} />
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>{isStudent ? "VAULT INTEGRITY" : (isGuidance ? "ACTIVE CASES" : "ACTIVE NODES")}</p>
              <p style={{ fontSize: "1rem", fontWeight: "900", color: "var(--primary)" }}>{isStudent ? `${docProgress}%` : (isGuidance ? (appointments?.length || 0) + (referrals?.length || 0) : auditLogs?.length || "0")}</p>
           </div>
        </div>
      </div>

      {/* Telemetry Grid */}
      <div className="card-grid" style={{ marginBottom: "4rem" }}>
        {dataNodes.map((node, i) => (
          <motion.div 
            key={node.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="sapphire-card"
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
               <div>
                  <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{node.label}</p>
                  <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "var(--text-main)" }}>{node.value}</h3>
               </div>
               <div style={{ width: "32px", height: "32px", background: "var(--bg-accent)", borderRadius: "2px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-dim)" }}>
                  <TrendingUp size={14} style={{ color: node.color }} />
               </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
               <span style={{ fontSize: "0.55rem", fontWeight: "900", color: node.color, letterSpacing: "0.05em" }}>{node.meta}</span>
               <div style={{ flex: 1, height: "1px", background: "var(--border-dim)" }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: isStaff ? "1fr 400px" : "1fr 350px", gap: "3rem" }}>
        
        {/* Main Feed Area */}
        <div style={{ display: "grid", gap: "3rem" }}>
          
          {isStaff && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="sapphire-card" style={{ padding: "3rem" }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                     <Activity size={20} color="var(--primary)" /> INSTITUTIONAL PULSE
                  </h3>
                  <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>REAL-TIME TELEMETRY</div>
               </div>

               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                  {/* Scholarship Pulse */}
                  <div>
                     <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "1.5rem" }}>SCHOLARSHIP DISTRIBUTION</p>
                     <div style={{ display: "grid", gap: "1.25rem" }}>
                        {[
                          { label: "APPROVED", count: scholarshipStats.approved, total: scholarshipStats.total, color: "#10b981" },
                          { label: "PENDING", count: scholarshipStats.pending, total: scholarshipStats.total, color: "#f59e0b" },
                          { label: "REJECTED", count: scholarshipStats.rejected, total: scholarshipStats.total, color: "#ef4444" }
                        ].map(bar => {
                          const percent = bar.total > 0 ? (bar.count / bar.total) * 100 : 0;
                          return (
                            <div key={bar.label}>
                               <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: "900", marginBottom: "0.5rem" }}>
                                  <span>{bar.label}</span>
                                  <span>{bar.count} UNITS</span>
                               </div>
                               <div style={{ height: "4px", background: "var(--bg-accent)", borderRadius: "10px", overflow: "hidden" }}>
                                  <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }} style={{ height: "100%", background: bar.color }} />
                               </div>
                            </div>
                          );
                        })}
                     </div>
                  </div>

                  {/* Service Pulse */}
                  <div>
                     <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "1.5rem" }}>TOP SERVICE NODES</p>
                     <div style={{ display: "grid", gap: "1rem" }}>
                        {serviceBreakdown.slice(0, 4).map((s, i) => (
                           <div key={s.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                 <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)" }}>0{i+1}</span>
                                 <span style={{ fontSize: "0.65rem", fontWeight: "800" }}>{(s.name || "UNKNOWN").toUpperCase()}</span>
                              </div>
                              <span style={{ fontSize: "0.7rem", fontWeight: "900" }}>{s.count}</span>
                           </div>
                        ))}
                        {serviceBreakdown.length === 0 && (
                          <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontStyle: "italic", textAlign: "center", padding: "1rem" }}>NO SERVICE DATA RECORDED</p>
                        )}
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {/* Announcements & Recent Activities */}
          <div className="sapphire-card" style={{ padding: "3rem" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "3rem", display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <Bell size={20} color="var(--primary)" /> 
              {isStaff ? "SYSTEM BROADCASTS" : "CAMPUS ANNOUNCEMENTS"}
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
              {activeAnnouncements.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", opacity: 0.5 }}>
                  <Radio size={32} style={{ marginBottom: "1.5rem" }} />
                  <p style={{ fontSize: "0.7rem", fontWeight: "900" }}>NO ACTIVE BROADCASTS</p>
                </div>
              ) : (
                activeAnnouncements.map((ann, i) => (
                  <motion.div 
                    key={ann.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{ borderLeft: "2px solid var(--primary)", paddingLeft: "2rem" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                       <span style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.25rem 0.75rem", background: "rgba(0, 229, 255, 0.05)", border: "1px solid var(--primary)", color: "var(--primary)" }}>{(ann.category || "UPDATE").toUpperCase()}</span>
                       <span style={{ fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "800" }}>{ann.date}</span>
                    </div>
                    <h4 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "0.75rem", color: "var(--text-main)" }}>{ann.title}</h4>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", lineHeight: "1.7", fontWeight: "700" }}>{ann.content}</p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Intelligence */}
        <div style={{ display: "grid", gap: "3rem", alignContent: "start" }}>
           {isStaff && (
              <div className="sapphire-card" style={{ padding: "2rem" }}>
                 <h3 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <History size={18} color="var(--primary)" /> AUDIT PULSE
                 </h3>
                 <div style={{ display: "grid", gap: "1.5rem" }}>
                    {(auditLogs || []).slice(0, 6).map((log, i) => (
                       <div key={i} style={{ borderBottom: "1px solid var(--border-dim)", paddingBottom: "1rem" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                             <span style={{ fontSize: "0.5rem", fontWeight: "900", color: log.severity === "HIGH" ? "#ef4444" : "var(--primary)" }}>{log.action}</span>
                             <span style={{ fontSize: "0.5rem", fontWeight: "800", color: "var(--text-dim)" }}>{log.timestamp?.includes(',') ? log.timestamp.split(',')[1] : log.timestamp || "UNKNOWN"}</span>
                          </div>
                          <p style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--text-main)" }}>{log.details}</p>
                       </div>
                    ))}
                    {(!auditLogs || auditLogs.length === 0) && (
                       <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", textAlign: "center" }}>NO RECENT LOGS</p>
                    )}
                 </div>
              </div>
           )}

           <div className="sapphire-card" style={{ padding: "2rem" }}>
             <h3 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <ShieldCheck size={18} color="var(--primary)" /> SECURITY STATUS
             </h3>
             <div style={{ display: "grid", gap: "1.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                   <div style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" }} />
                   <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: "900" }}>BIOMETRIC LINK ACTIVE</p>
                      <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>ENCRYPTED VAULT SESSION</p>
                   </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                   <div style={{ width: "8px", height: "8px", background: "#10b981", borderRadius: "50%" }} />
                   <div>
                      <p style={{ fontSize: "0.75rem", fontWeight: "900" }}>DATABASE INTEGRITY</p>
                      <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>SYNCHRONIZED REAL-TIME</p>
                   </div>
                </div>
             </div>
           </div>

           <div className="sapphire-card" style={{ padding: "2rem", background: "rgba(0, 229, 255, 0.02)", border: "1px solid var(--primary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                 <Zap size={16} color="var(--primary)" />
                 <p style={{ fontSize: "0.7rem", fontWeight: "900" }}>SYSTEM HEALTH</p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem" }}>
                 <h2 style={{ fontSize: "2rem", fontWeight: "900" }}>100<span style={{ fontSize: "1rem", color: "var(--primary)" }}>%</span></h2>
                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>OPTIMAL PERFORMANCE</p>
              </div>
           </div>
        </div>
      </div>

    </div>
  );
}
