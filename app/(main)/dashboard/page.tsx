"use client";

import { motion } from "framer-motion";
import * as React from "react";
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
  LayoutDashboard,
  BrainCircuit,
  Waves,
  LineChart,
  BarChart3,
  Network,
  GraduationCap
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
    scholarshipPrograms,
    serviceTypes,
    auditLogs
  } = useGlobalState();
  const [mounted, setMounted] = React.useState(false);
  const [aiInsight, setAiInsight] = React.useState<any>(null);

  React.useEffect(() => {
    setMounted(true);
    if (auditLogs && auditLogs.length > 0) {
      summarizeAuditLogs(auditLogs).then(res => setAiInsight(res));
    }
  }, [auditLogs]);

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

  // Staff Analytics Calculations
  const scholarshipStats = {
    total: scholarshipApps?.length || 0,
    approved: (scholarshipApps || []).filter(a => a.status === "Approved").length,
    pending: (scholarshipApps || []).filter(a => a.status === "For OSAS Review").length,
  };

  const dataNodes = isGuidance ? [
    { label: "APPOINTMENTS", value: appointments?.length || 0, meta: "TOTAL SESSIONS", color: "#10b981", icon: <Clock size={18} /> },
    { label: "STUDENT REFERRALS", value: referrals?.length || 0, meta: "STUDENT CASES", color: "var(--primary)", icon: <AlertTriangle size={18} /> },
    { label: "CAMPUS WELLNESS", value: "STABLE", meta: "STUDENT MOOD", color: "#6366f1", icon: <Activity size={18} /> },
    { label: "PENDING REPORTS", value: (referrals || []).filter(r => r.status === "Endorsed to OSAS").length, meta: "TO OSAS OFFICE", color: "#ec4899", icon: <FileText size={18} /> },
  ] : isStudent ? [
    { label: "VAULT INTEGRITY", value: `ACTIVE`, meta: `SECURE_ENCRYPTED`, color: "var(--primary)", icon: <ShieldCheck size={18} /> },
    { label: "SCHOLARSHIP", value: scholarshipApps?.some(a => a.studentName === currentUser?.name) ? "ACTIVE" : "NONE", meta: "APPLICATION_STATUS", color: "#6366f1", icon: <GraduationCap size={18} /> },
    { label: "SERVICE REQS", value: (serviceRequests || []).filter(r => r.studentName === currentUser?.name).length, meta: "TOTAL REQUESTS", color: "#ec4899", icon: <Zap size={18} /> },
    { label: "ACTIVE APPT", value: (appointments || []).filter(a => a.studentName === currentUser?.name && a.status === "APPROVED").length, meta: "READY SESSIONS", color: "#10b981", icon: <Users size={18} /> },
  ] : [
    { label: "SCHOLARSHIPS", value: scholarshipApps?.length || 0, meta: `${scholarshipStats.pending} PENDING REVIEW`, color: "var(--primary)", icon: <GraduationCap size={18} /> },
    { label: "CLUBS & ORGS", value: organizations?.length || 0, meta: `${(organizations || []).filter(o => o.status === "Recognized").length} RECOGNIZED`, color: "#6366f1", icon: <Users size={18} /> },
    { label: "SERVICE REQS", value: (serviceRequests || []).length, meta: `${(serviceRequests || []).filter(r => r.status === "Pending").length} IN QUEUE`, color: "#ec4899", icon: <Zap size={18} /> },
    { label: "APPOINTMENTS", value: (appointments || []).filter(a => a.status === "APPROVED").length, meta: "SCHEDULED MEETINGS", color: "#10b981", icon: <Clock size={18} /> },
  ];

  return (
    <div style={{ 
      width: "100%", 
      perspective: "2000px",
      position: "relative"
    }}>
      {/* INSTITUTIONAL BACKGROUND GRID */}
      <div style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: -1, 
        opacity: 0.1, 
        pointerEvents: "none",
        backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px), radial-gradient(var(--primary) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        backgroundPosition: "0 0, 20px 20px"
      }} />

      {/* Executive Command Header */}
      <div style={{ marginBottom: "6rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
             <motion.div 
               animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 20px var(--primary)" }} 
             />
             <p style={{ color: "var(--primary)", fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.5em", textTransform: "uppercase" }}>
               STATUS: {isStudent ? "OPERATIONAL" : "INSTITUTIONAL_PULSE_ACTIVE"}
             </p>
          </div>
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)", 
            fontWeight: "900", 
            letterSpacing: "-0.05em", 
            lineHeight: "0.9",
            color: "var(--text-main)",
            textTransform: "uppercase"
          }}>
            {isStudent ? "STUDENT" : (isGuidance ? "GUIDANCE" : "EXECUTIVE")}<br/>
            <span style={{ 
              background: "linear-gradient(to right, var(--primary), #6366f1)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 10px rgba(0, 229, 255, 0.3))"
            }}>DASHBOARD</span>
          </h1>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ 
            display: "flex", 
            gap: "3rem", 
            background: "rgba(255,255,255,0.02)", 
            backdropFilter: "blur(20px)",
            padding: "2rem 3.5rem", 
            borderRadius: "20px", 
            border: "1px solid rgba(255,255,255,0.05)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)"
          }}
        >
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>NETWORK_UPTIME</p>
              <p style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--text-main)", fontFamily: "monospace" }}>99.99<span style={{ fontSize: "0.8rem", color: "var(--primary)" }}>%</span></p>
           </div>
           <div style={{ width: "1px", height: "50px", background: "rgba(255,255,255,0.1)" }} />
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>ACTIVE_NODES</p>
              <p style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--primary)", fontFamily: "monospace" }}>{auditLogs?.length || "0"}</p>
           </div>
        </motion.div>
      </div>

      {/* 3D Crystalline Telemetry Grid */}
      <div className="card-grid" style={{ 
        marginBottom: "6rem", 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "2.5rem" 
      }}>
        {dataNodes.map((node, i) => (
          <motion.div 
            key={node.label}
            whileHover={{ 
              y: -10,
              rotateX: -5,
              rotateY: 5,
              boxShadow: `0 30px 60px rgba(0, 229, 255, 0.2)`
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.8, ease: "circOut" }}
            style={{ 
              padding: "2.5rem", 
              position: "relative", 
              borderRadius: "24px",
              border: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.01)",
              backdropFilter: "blur(20px)",
              overflow: "hidden"
            }}
          >
            {/* Internal Glow Effect */}
            <div style={{ 
              position: "absolute", 
              top: "-50%", 
              left: "-50%", 
              width: "200%", 
              height: "200%", 
              background: `radial-gradient(circle at center, ${node.color}15 0%, transparent 70%)`,
              pointerEvents: "none"
            }} />

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem", position: "relative" }}>
               <div style={{ 
                 width: "50px", 
                 height: "50px", 
                 background: "rgba(255,255,255,0.03)", 
                 borderRadius: "14px", 
                 display: "flex", 
                 alignItems: "center", 
                 justifyContent: "center", 
                 color: node.color, 
                 border: `1px solid ${node.color}30`,
                 boxShadow: `0 0 20px ${node.color}20`
               }}>
                  {node.icon}
               </div>
               <motion.div
                 animate={{ opacity: [0.3, 0.6, 0.3] }}
                 transition={{ duration: 3, repeat: Infinity }}
               >
                 <TrendingUp size={18} style={{ color: node.color }} />
               </motion.div>
            </div>

            <div style={{ position: "relative" }}>
               <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.3em", textTransform: "uppercase", marginBottom: "1rem" }}>{node.label}</p>
               <h3 style={{ fontSize: "3rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.05em", lineHeight: "1" }}>{node.value}</h3>
            </div>

            <div style={{ marginTop: "2.5rem", position: "relative" }}>
               <div style={{ height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden", marginBottom: "1rem" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    style={{ height: "100%", background: `linear-gradient(to right, ${node.color}, #fff)` }}
                  />
               </div>
               <span style={{ fontSize: "0.6rem", fontWeight: "900", color: node.color, letterSpacing: "0.15em" }}>{node.meta}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "4rem" }}>
        
        <div style={{ display: "grid", gap: "4rem" }}>
          
          {/* PREDICTIVE INSIGHT NODE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            style={{ 
              padding: "clamp(1.5rem, 5vw, 4rem)", 
              background: "rgba(255,255,255,0.01)",
              backdropFilter: "blur(30px)",
              borderRadius: "32px",
              border: "1px solid rgba(255,255,255,0.05)",
              borderLeft: "6px solid var(--primary)",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 40px 100px rgba(0,0,0,0.2)"
            }}
          >
             {/* Background Tech Art */}
             <div style={{ position: "absolute", top: "-10%", right: "-5%", opacity: 0.05, zIndex: 0 }}>
                <BrainCircuit size={500} />
             </div>

             <div style={{ position: "relative", zIndex: 10 }}>
               <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem", gap: "2rem" }}>
                  <h3 style={{ 
                    fontSize: "clamp(1.1rem, 3vw, 1.5rem)", 
                    fontWeight: "900", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "1.5rem", 
                    letterSpacing: "0.15em",
                    overflowWrap: "anywhere",
                    wordBreak: "break-word"
                  }}>
                     <BrainCircuit size={28} color="var(--primary)" style={{ flexShrink: 0 }} /> NEURAL_PREDICTIVE_INSIGHTS
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", padding: "0.5rem 1.5rem", background: "rgba(0, 229, 255, 0.05)", borderRadius: "100px", border: "1px solid rgba(0, 229, 255, 0.1)" }}>
                     <Waves size={18} className="animate-pulse" color="var(--primary)" />
                     <span style={{ fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.3em", color: "var(--primary)" }}>STREAM_LIVE</span>
                  </div>
               </div>

               <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "clamp(2rem, 8vw, 6rem)", alignItems: "start" }}>
                  <div>
                     <div style={{ marginBottom: "4rem" }}>
                        <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.3em", marginBottom: "1.5rem" }}>SENTIMENT_INTEGRITY</p>
                        <h4 style={{ fontSize: "clamp(3rem, 10vw, 4.5rem)", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.06em", lineHeight: "1" }}>98.4<span style={{ fontSize: "1.5rem", color: "var(--primary)" }}>%</span></h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "1rem" }}>
                           <ArrowUpRight size={16} color="#10b981" />
                           <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#10b981" }}>+2.1% FROM LAST CYCLE</p>
                        </div>
                     </div>
                     <div style={{ display: "grid", gap: "2rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                           <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 15px var(--primary)", flexShrink: 0 }} />
                           <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.05em" }}>NO_SECURITY_BURSTS_DETECTED</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                           <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", boxShadow: "0 0 15px #10b981", flexShrink: 0 }} />
                           <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.05em" }}>RESOURCE_ALLOCATION_OPTIMAL</p>
                        </div>
                     </div>
                  </div>

                  <div style={{ 
                    background: "rgba(255,255,255,0.02)", 
                    border: "1px solid rgba(255,255,255,0.05)", 
                    borderRadius: "24px", 
                    padding: "clamp(1.5rem, 5vw, 3.5rem)", 
                    backdropFilter: "blur(20px)", 
                    position: "relative", 
                    zIndex: 20,
                    boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
                    overflow: "hidden"
                  }}>
                     <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.3em", marginBottom: "2rem", textTransform: "uppercase" }}>AI_SENTINEL_SUMMARY</p>
                     <p style={{ fontSize: "clamp(0.9rem, 2vw, 1.1rem)", color: "var(--text-dim)", lineHeight: "1.9", fontWeight: "600", overflowWrap: "anywhere" }}>
                       {aiInsight?.summary || "ANALYZING_TELEMETRY_NODES_FOR_PREDICTIVE_TRENDS..."}
                     </p>
                     <div style={{ marginTop: "3rem", display: "flex", flexWrap: "wrap", gap: "1.5rem" }}>
                        {(aiInsight?.anomalies || ["NO_ANOMALIES_DETECTED"]).slice(0, 2).map((a: string, i: number) => (
                          <div key={i} style={{ 
                            fontSize: "0.6rem", 
                            fontWeight: "900", 
                            padding: "0.75rem 1.5rem", 
                            background: "rgba(0, 229, 255, 0.05)", 
                            border: "1px solid var(--primary)", 
                            color: "var(--primary)", 
                            borderRadius: "8px",
                            letterSpacing: "0.1em"
                          }}>
                            {a.toUpperCase()}
                          </div>
                        ))}
                     </div>
                  </div>
               </div>
             </div>
          </motion.div>

          {/* BROADCAST CENTER */}
          <div style={{ 
            padding: "4rem", 
            background: "rgba(255,255,255,0.01)",
            backdropFilter: "blur(20px)",
            borderRadius: "32px",
            border: "1px solid rgba(255,255,255,0.05)"
          }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "900", marginBottom: "5rem", display: "flex", alignItems: "center", gap: "2.5rem", letterSpacing: "0.2em" }}>
              <Radio size={28} color="var(--primary)" /> SYSTEM_BROADCAST_HUB
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "4.5rem" }}>
              {(activeAnnouncements || []).map((ann, i) => (
                <motion.div 
                  key={ann.id}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  style={{ borderLeft: "4px solid var(--primary)", paddingLeft: "4rem", position: "relative" }}
                >
                  <div style={{ position: "absolute", left: "-7px", top: "0", width: "10px", height: "10px", borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "1.5rem" }}>
                     <span style={{ fontSize: "0.65rem", fontWeight: "900", padding: "0.5rem 1.25rem", background: "rgba(0, 229, 255, 0.08)", border: "1px solid var(--primary)", color: "var(--primary)", borderRadius: "6px", letterSpacing: "0.1em" }}>{(ann.category || "UPDATE").toUpperCase()}</span>
                     <span style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: "900", letterSpacing: "0.15em" }}>{ann.date}</span>
                  </div>
                  <h4 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "1rem", color: "var(--text-main)", letterSpacing: "-0.03em" }}>{ann.title}</h4>
                  <p style={{ fontSize: "1.05rem", color: "var(--text-dim)", lineHeight: "1.9", fontWeight: "600" }}>{ann.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR INTELLIGENCE */}
        <div style={{ display: "grid", gap: "4rem", alignContent: "start" }}>
           
           <div style={{ 
             padding: "3rem", 
             borderRadius: "28px",
             background: "rgba(255,255,255,0.01)",
             border: "1px solid rgba(255,255,255,0.05)",
             borderTop: "6px solid var(--primary)" 
           }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
                <h3 style={{ fontSize: "1rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "2rem", letterSpacing: "0.15em" }}>
                   <Network size={24} color="var(--primary)" /> TELEMETRY_STREAM
                </h3>
                <motion.div 
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: "10px", height: "10px", background: "var(--primary)", borderRadius: "50%", boxShadow: "0 0 15px var(--primary)" }}
                />
              </div>
              <div style={{ display: "grid", gap: "2.5rem" }}>
                 {(auditLogs || []).slice(0, 10).map((log, i) => (
                    <div key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "2rem" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                          <span style={{ fontSize: "0.65rem", fontWeight: "900", color: log.severity === "HIGH" ? "#ef4444" : "var(--primary)", letterSpacing: "0.1em" }}>{log.action}</span>
                          <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", fontFamily: "monospace" }}>{log.timestamp?.split(',')[1] || log.timestamp}</span>
                       </div>
                       <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-main)", lineHeight: "1.6" }}>{log.details}</p>
                    </div>
                 ))}
              </div>
           </div>

           <motion.div 
             whileHover={{ scale: 1.02 }}
             style={{ 
               padding: "3.5rem", 
               borderRadius: "28px",
               background: "linear-gradient(135deg, rgba(0, 229, 255, 0.05) 0%, transparent 100%)", 
               border: "1px solid var(--primary)",
               boxShadow: "0 20px 50px rgba(0, 229, 255, 0.1)"
             }}
           >
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginBottom: "3rem" }}>
                 <div style={{ width: "40px", height: "40px", borderRadius: "50%", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 20px rgba(0, 229, 255, 0.2)" }}>
                    <ShieldCheck size={20} color="var(--primary)" />
                 </div>
                 <h3 style={{ fontSize: "1rem", fontWeight: "900", letterSpacing: "0.2em" }}>SECURITY_POSTURE</h3>
              </div>
              <div style={{ display: "grid", gap: "3.5rem" }}>
                 <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", fontWeight: "900", marginBottom: "1.5rem" }}>
                       <span style={{ color: "var(--text-dim)", letterSpacing: "0.1em" }}>IDENTITY_LOCK_CALIBRATION</span>
                       <span style={{ color: "var(--primary)", fontFamily: "monospace" }}>99.9%</span>
                    </div>
                    <div style={{ height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "3px", overflow: "hidden" }}>
                       <motion.div 
                        initial={{ width: 0 }} 
                        animate={{ width: "99.9%" }} 
                        transition={{ duration: 2 }}
                        style={{ height: "100%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }} 
                       />
                    </div>
                 </div>
                 <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                    <div style={{ width: "40px", height: "40px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                       <Globe size={20} color="#10b981" />
                    </div>
                    <div>
                       <p style={{ fontSize: "0.9rem", fontWeight: "900", letterSpacing: "0.05em" }}>PWA_RELIANCE_ACTIVE</p>
                       <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "#10b981", marginTop: "0.25rem", letterSpacing: "0.1em" }}>OFFLINE_NODES_STANDBY</p>
                    </div>
                 </div>
              </div>
           </motion.div>

        </div>
      </div>

    </div>
  );
}
