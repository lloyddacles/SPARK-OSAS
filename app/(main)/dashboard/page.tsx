"use client";

import { motion, AnimatePresence } from "framer-motion";
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
  GraduationCap,
  Sparkles,
  RefreshCw
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
    auditLogs
  } = useGlobalState();
  const [mounted, setMounted] = React.useState(false);
  const [aiInsight, setAiInsight] = React.useState<any>(null);
  const [isForecasting, setIsForecasting] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (auditLogs && auditLogs.length > 0) {
      summarizeAuditLogs(auditLogs).then(res => setAiInsight(res));
    }
  }, [auditLogs]);

  const runForecast = () => {
    setIsForecasting(true);
    setTimeout(() => setIsForecasting(false), 2000);
  };

  // SAFETY GATE
  if (!mounted || !currentUser) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh", color: "var(--primary)" }}>
        <Activity className="animate-pulse" size={48} />
      </div>
    );
  }

  const dataNodes = [
    { label: "STUDENT CLUBS", value: organizations?.length || 0, meta: "ACTIVE CLUBS", color: "var(--text-main)", icon: <Users size={24} /> },
    { label: "EVENT REQUESTS", value: (serviceRequests || []).length, meta: "APPROVED EVENTS", color: "var(--text-main)", icon: <Activity size={24} /> },
    { label: "SCHOLARSHIPS", value: scholarshipApps?.length || 0, meta: "APPROVED APPLICANTS", color: "var(--text-main)", icon: <GraduationCap size={24} /> },
    { label: "TOTAL STUDENTS", value: auditLogs?.length || 0, meta: "STUDENT ACCOUNTS", color: "var(--text-main)", icon: <Zap size={24} /> },
  ];

  return (
    <div style={{ width: "100%", perspective: "2000px", position: "relative" }}>
      {/* INSTITUTIONAL BACKGROUND GRID */}
      <div style={{ position: "fixed", inset: 0, zIndex: -1, opacity: 0.05, pointerEvents: "none", backgroundImage: `radial-gradient(var(--primary) 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />

      {/* NEW HEADER DESIGN */}
      <div style={{ marginBottom: "5rem" }}>
         <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>SCHOOL STATISTICS</p>
         <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: "900", letterSpacing: "-0.04em", color: "#111827", textTransform: "uppercase" }}>
            OSAS <span style={{ color: "var(--primary)" }}>DASHBOARD</span>
         </h1>
      </div>

      {/* SMART ACTIVITY FORECAST HERO */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          marginBottom: "5rem", 
          padding: "3rem 4rem", 
          background: "rgba(0, 229, 255, 0.02)", 
          border: "1.5px solid rgba(0, 229, 255, 0.2)", 
          borderRadius: "12px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "2rem",
          position: "relative",
          overflow: "hidden"
        }}
      >
         <div style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start", flex: 1, minWidth: "300px" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "10px", background: "rgba(0, 229, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", flexShrink: 0 }}>
               <Sparkles size={24} />
            </div>
            <div>
               <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.15em", marginBottom: "1rem" }}>SMART ACTIVITY FORECAST</h3>
               <p style={{ fontSize: "1rem", color: "#4b5563", fontWeight: "500", lineHeight: "1.6", maxWidth: "600px" }}>
                 Get a quick prediction of how many student requests and club events OSAS should expect next month based on current activities.
               </p>
            </div>
         </div>
         
         <motion.button
           whileHover={{ scale: 1.05 }}
           whileTap={{ scale: 0.95 }}
           onClick={runForecast}
           style={{ 
             padding: "1.25rem 3rem", 
             background: "var(--primary)", 
             color: "white", 
             border: "none", 
             borderRadius: "8px", 
             fontWeight: "900", 
             fontSize: "0.85rem", 
             letterSpacing: "0.1em",
             cursor: "pointer",
             display: "flex",
             alignItems: "center",
             gap: "1.5rem",
             boxShadow: "0 10px 20px rgba(0, 229, 255, 0.2)"
           }}
         >
            {isForecasting ? <RefreshCw className="animate-spin" size={18} /> : "RUN FORECAST"}
         </motion.button>
      </motion.div>

      {/* REFINED TELEMETRY GRID */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "2.5rem",
        marginBottom: "6rem"
      }}>
        {dataNodes.map((node, i) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.05)" }}
            style={{ 
              padding: "2.5rem 3rem", 
              background: "white", 
              border: "1.5px solid rgba(0,0,0,0.03)", 
              borderRadius: "12px",
              position: "relative",
              overflow: "hidden"
            }}
          >
             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem" }}>
                <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "#374151", letterSpacing: "0.1em" }}>{node.label}</p>
                <div style={{ opacity: 0.1, color: "#111827" }}>{node.icon}</div>
             </div>
             
             <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "3.5rem", fontWeight: "900", color: "#111827", letterSpacing: "-0.05em" }}>{node.value}</h2>
                <ArrowUpRight size={24} color="var(--primary)" />
             </div>

             <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>{node.meta}</p>
          </motion.div>
        ))}
      </div>

      {/* LOWER INTELLIGENCE LAYER */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "4rem" }}>
         <div style={{ display: "grid", gap: "4rem" }}>
            <motion.div 
              className="sapphire-card"
              style={{ padding: "4rem", borderRadius: "24px", background: "rgba(255,255,255,0.01)", backdropFilter: "blur(20px)", border: "1px solid rgba(0,0,0,0.05)", borderLeft: "6px solid var(--primary)" }}
            >
               <h3 style={{ fontSize: "1.25rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "2rem", marginBottom: "4rem" }}>
                  <BrainCircuit size={32} color="var(--primary)" /> NEURAL_PREDICTIVE_INSIGHTS
               </h3>
               <div style={{ background: "rgba(0, 229, 255, 0.02)", padding: "3rem", borderRadius: "16px", border: "1px solid rgba(0, 229, 255, 0.1)" }}>
                  <p style={{ fontSize: "1.1rem", color: "#4b5563", lineHeight: "1.9", fontWeight: "600" }}>
                     {aiInsight?.summary || "ANALYZING_TELEMETRY_NODES..."}
                  </p>
                  <div style={{ marginTop: "3rem", display: "flex", gap: "1.5rem" }}>
                    {(aiInsight?.anomalies || []).slice(0, 2).map((a: string, i: number) => (
                      <span key={i} style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", padding: "0.6rem 1.5rem", border: "1px solid var(--primary)", borderRadius: "4px" }}>
                        {a.toUpperCase()}
                      </span>
                    ))}
                  </div>
               </div>
            </motion.div>

            <div className="sapphire-card" style={{ padding: "4rem", borderRadius: "24px", background: "white", border: "1px solid rgba(0,0,0,0.05)" }}>
               <h3 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "4rem", display: "flex", alignItems: "center", gap: "2rem" }}>
                  <Radio size={24} color="var(--primary)" /> BROADCAST_HUB
               </h3>
               <div style={{ display: "grid", gap: "4rem" }}>
                  {(announcements || []).slice(0, 3).map((ann, i) => (
                    <div key={ann.id} style={{ borderLeft: "4px solid var(--primary)", paddingLeft: "3rem" }}>
                       <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.5rem" }}>{ann.category}</p>
                       <h4 style={{ fontSize: "1.25rem", fontWeight: "900", marginBottom: "1rem" }}>{ann.title}</h4>
                       <p style={{ fontSize: "0.95rem", color: "#6b7280" }}>{ann.content}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="sapphire-card" style={{ padding: "3rem", borderRadius: "24px", background: "white", border: "1px solid rgba(0,0,0,0.05)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "4rem", display: "flex", alignItems: "center", gap: "2rem" }}>
               <Network size={24} color="var(--primary)" /> TELEMETRY_STREAM
            </h3>
            <div style={{ display: "grid", gap: "2.5rem" }}>
               {(auditLogs || []).slice(0, 12).map((log, i) => (
                  <div key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.03)", paddingBottom: "2rem" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)" }}>{log.action}</span>
                        <span style={{ fontSize: "0.55rem", color: "#9ca3af", fontWeight: "900" }}>{log.timestamp?.split(',')[1]}</span>
                     </div>
                     <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#111827" }}>{log.details}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
