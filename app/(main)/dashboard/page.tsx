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
  const [mounted, setMounted] = useState(false);
  const [aiInsight, setAiInsight] = useState<any>(null);

  useEffect(() => {
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
    { label: "APPOINTMENTS", value: (appointments || []).length, meta: "SCHEDULED MEETINGS", color: "#10b981", icon: <Clock size={18} /> },
  ];

  return (
    <div style={{ width: "100%", perspective: "1000px" }}>
      
      {/* Executive Command Header */}
      <div style={{ marginBottom: "5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
             <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }} />
             <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em" }}>STATUS: {isStudent ? "OPERATIONAL" : "INSTITUTIONAL_PULSE_ACTIVE"}</p>
          </div>
          <h1 style={{ fontSize: "3.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            {isStudent ? "STUDENT" : (isGuidance ? "GUIDANCE" : "EXECUTIVE")} <span style={{ color: "var(--primary)" }}>DASHBOARD</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "2.5rem", background: "rgba(255,255,255,0.02)", padding: "1.5rem 2.5rem", borderRadius: "12px", border: "1px solid var(--border-dim)" }}>
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>NETWORK_UPTIME</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)" }}>99.99<span style={{ fontSize: "0.7rem", color: "var(--primary)" }}>%</span></p>
           </div>
           <div style={{ width: "1px", height: "40px", background: "var(--border-dim)" }} />
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>ACTIVE_NODES</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--primary)" }}>{auditLogs?.length || "0"}</p>
           </div>
        </div>
      </div>

      {/* 3D Liquid Telemetry Grid */}
      <div className="card-grid" style={{ marginBottom: "5rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2.5rem" }}>
        {dataNodes.map((node, i) => (
          <motion.div 
            key={node.label}
            whileHover={{ 
              scale: 1.02, 
              rotateX: -2, 
              rotateY: 2,
              boxShadow: `0 20px 40px rgba(0, 229, 255, 0.15)`
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="sapphire-card"
            style={{ 
              padding: "2.5rem", 
              position: "relative", 
              overflow: "hidden",
              border: "1px solid var(--border-dim)",
              background: "linear-gradient(135deg, var(--bg-surface) 0%, rgba(0, 229, 255, 0.02) 100%)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
               <div style={{ width: "40px", height: "40px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: node.color, border: "1px solid var(--border-dim)" }}>
                  {node.icon}
               </div>
               <TrendingUp size={16} style={{ color: node.color, opacity: 0.5 }} />
            </div>
            <div>
               <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>{node.label}</p>
               <h3 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.02em" }}>{node.value}</h3>
            </div>
            <div style={{ marginTop: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
               <div style={{ flex: 1, height: "2px", background: "var(--border-dim)", borderRadius: "1px", overflow: "hidden" }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "70%" }}
                    style={{ height: "100%", background: node.color }}
                  />
               </div>
               <span style={{ fontSize: "0.55rem", fontWeight: "900", color: node.color, letterSpacing: "0.1em" }}>{node.meta}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: "4rem" }}>
        
        <div style={{ display: "grid", gap: "4rem" }}>
          
          {/* PREDICTIVE INSIGHT NODE */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="sapphire-card" 
            style={{ 
              padding: "4rem", 
              background: "linear-gradient(to right, var(--bg-surface), rgba(0, 229, 255, 0.03))",
              borderLeft: "4px solid var(--primary)",
              position: "relative",
              overflow: "hidden"
            }}
          >
             {/* Background Tech Art */}
             <div style={{ position: "absolute", top: "-20%", right: "-10%", opacity: 0.03 }}>
                <BrainCircuit size={400} />
             </div>

             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1.5rem", letterSpacing: "0.1em" }}>
                   <BrainCircuit size={28} color="var(--primary)" /> NEURAL_PREDICTIVE_INSIGHTS
                </h3>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--primary)" }}>
                   <Waves size={16} className="animate-pulse" />
                   <span style={{ fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.2em" }}>ANALYSIS_STREAM_LIVE</span>
                </div>
             </div>

             <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "4rem" }}>
                <div>
                   <div style={{ marginBottom: "2.5rem" }}>
                      <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "1rem" }}>SENTIMENT_INTEGRITY</p>
                      <h4 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--primary)" }}>98.4<span style={{ fontSize: "1rem" }}>%</span></h4>
                      <p style={{ fontSize: "0.65rem", fontWeight: "700", color: "#10b981", marginTop: "0.5rem" }}>+2.1% FROM LAST CYCLE</p>
                   </div>
                   <div style={{ display: "grid", gap: "1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                         <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--primary)" }} />
                         <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "var(--text-main)" }}>NO_SECURITY_BURSTS_DETECTED</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                         <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                         <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "var(--text-main)" }}>RESOURCE_ALLOCATION_OPTIMAL</p>
                      </div>
                   </div>
                </div>

                <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-dim)", borderRadius: "12px", padding: "2.5rem" }}>
                   <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "1.5rem" }}>AI_SENTINEL_SUMMARY</p>
                   <p style={{ fontSize: "0.9rem", color: "var(--text-dim)", lineHeight: "1.8", fontWeight: "600" }}>
                     {aiInsight?.summary || "ANALYZING_TELEMETRY_NODES_FOR_PREDICTIVE_TRENDS..."}
                   </p>
                   <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
                      {aiInsight?.anomalies.slice(0, 2).map((a: string, i: number) => (
                        <div key={i} style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.5rem 1rem", background: "rgba(0, 229, 255, 0.05)", border: "1px solid var(--primary)", color: "var(--primary)" }}>
                          {a.toUpperCase()}
                        </div>
                      ))}
                   </div>
                </div>
             </div>
          </motion.div>

          {/* BROADCAST CENTER */}
          <div className="sapphire-card" style={{ padding: "4rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "4rem", display: "flex", alignItems: "center", gap: "2rem", letterSpacing: "0.1em" }}>
              <Radio size={24} color="var(--primary)" /> SYSTEM_BROADCAST_HUB
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
              {activeAnnouncements.map((ann, i) => (
                <motion.div 
                  key={ann.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  style={{ borderLeft: "4px solid var(--primary)", paddingLeft: "3rem", position: "relative" }}
                >
                  <div style={{ position: "absolute", left: "-6px", top: "0", width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem" }}>
                     <span style={{ fontSize: "0.6rem", fontWeight: "900", padding: "0.4rem 1rem", background: "rgba(0, 229, 255, 0.05)", border: "1px solid var(--primary)", color: "var(--primary)", borderRadius: "4px" }}>{(ann.category || "UPDATE").toUpperCase()}</span>
                     <span style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "900", letterSpacing: "0.1em" }}>{ann.date}</span>
                  </div>
                  <h4 style={{ fontSize: "1.25rem", fontWeight: "900", marginBottom: "1rem", color: "var(--text-main)", letterSpacing: "-0.02em" }}>{ann.title}</h4>
                  <p style={{ fontSize: "0.95rem", color: "var(--text-dim)", lineHeight: "1.8", fontWeight: "600" }}>{ann.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* SIDEBAR INTELLIGENCE */}
        <div style={{ display: "grid", gap: "4rem", alignContent: "start" }}>
           
           <div className="sapphire-card" style={{ padding: "3rem", borderTop: "4px solid var(--primary)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                <h3 style={{ fontSize: "0.9rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                   <Network size={20} color="var(--primary)" /> TELEMETRY_STREAM
                </h3>
                <motion.div 
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: "8px", height: "8px", background: "var(--primary)", borderRadius: "50%" }}
                />
              </div>
              <div style={{ display: "grid", gap: "2rem" }}>
                 {(auditLogs || []).slice(0, 8).map((log, i) => (
                    <div key={i} style={{ borderBottom: "1px solid var(--border-dim)", paddingBottom: "1.5rem" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                          <span style={{ fontSize: "0.6rem", fontWeight: "900", color: log.severity === "HIGH" ? "#ef4444" : "var(--primary)" }}>{log.action}</span>
                          <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>{log.timestamp?.split(',')[1] || log.timestamp}</span>
                       </div>
                       <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-main)", lineHeight: "1.4" }}>{log.details}</p>
                    </div>
                 ))}
              </div>
           </div>

           <div className="sapphire-card" style={{ padding: "3rem", background: "rgba(0, 229, 255, 0.02)", border: "1px solid var(--primary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2.5rem" }}>
                 <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldCheck size={16} color="var(--primary)" />
                 </div>
                 <h3 style={{ fontSize: "0.9rem", fontWeight: "900", letterSpacing: "0.1em" }}>SECURITY_POSTURE</h3>
              </div>
              <div style={{ display: "grid", gap: "2.5rem" }}>
                 <div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", fontWeight: "900", marginBottom: "1rem" }}>
                       <span style={{ color: "var(--text-dim)" }}>IDENTITY_LOCK_CALIBRATION</span>
                       <span style={{ color: "var(--primary)" }}>99%</span>
                    </div>
                    <div style={{ height: "4px", background: "var(--bg-accent)", borderRadius: "2px", overflow: "hidden" }}>
                       <motion.div initial={{ width: 0 }} animate={{ width: "99%" }} style={{ height: "100%", background: "var(--primary)" }} />
                    </div>
                 </div>
                 <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <Globe size={16} color="#10b981" />
                    <div>
                       <p style={{ fontSize: "0.8rem", fontWeight: "900" }}>PWA_RELIANCE_ACTIVE</p>
                       <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.25rem" }}>OFFLINE_NODES_STANDBY</p>
                    </div>
                 </div>
              </div>
           </div>

        </div>
      </div>

    </div>
  );
}
