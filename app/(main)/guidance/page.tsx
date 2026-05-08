"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  HeartHandshake, 
  ShieldAlert, 
  CalendarClock, 
  CheckCircle2, 
  HelpCircle, 
  Plus, 
  Download, 
  FileText, 
  Users, 
  BarChart3,
  Clock,
  ClipboardList,
  Stethoscope,
  Smile,
  AlertTriangle,
  Activity,
  Layers,
  ArrowRight,
  Lock,
  Database,
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useRouter } from "next/navigation";
import ProcessGuide from "@/components/ProcessGuide";

export default function GuidancePortal() {
  const router = useRouter();
  const { currentUser, requests: serviceRequests, updateRequestStatus, referrals, endorseReferral } = useGlobalState();
  const [activeTab, setActiveTab] = useState<"Overview" | "Referrals" | "Appointments">("Overview");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, [currentUser]);

  const isAuth = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR" || currentUser?.role === "GUIDANCE_COUNSELOR";

  const goodMoralRequests = (serviceRequests || []).filter(r => r.type === "Good Moral Certificate" && r.status !== "Completed");
  const pendingReferrals = (referrals || []).filter(r => r.status === "Referred to Guidance");

  if (!isHydrated) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
         <Activity size={48} className="status-pulse" color="var(--primary)" />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2.5rem" }}>
         <div style={{ position: "relative" }}>
            <ShieldAlert size={80} color="#ef4444" style={{ opacity: 0.2 }} />
            <Lock size={32} color="#ef4444" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
         </div>
         <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.02em" }}>Access Restricted</h2>
            <p style={{ color: "var(--text-dim)", fontWeight: "700", marginTop: "0.75rem", fontSize: "0.85rem" }}>This page is restricted to Guidance Counselors.</p>
            <p style={{ color: "var(--primary)", fontWeight: "900", marginTop: "1rem", fontSize: "0.6rem", letterSpacing: "0.1em" }}>Required Role: Guidance Counselor</p>
         </div>
         <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/" style={{ padding: "1rem 2rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", textDecoration: "none", fontSize: "0.7rem", fontWeight: "900" }}>Go to Dashboard</a>
            <a href="/login" className="btn-cyan" style={{ padding: "1rem 2rem", textDecoration: "none", fontSize: "0.7rem", fontWeight: "900" }}>Sign In</a>
         </div>
      </div>
    );
  }

  const handleIssueGoodMoral = (id: string) => {
    updateRequestStatus(id, "Completed");
  };

  const dataNodes = [
    { label: "Active Cases", value: "12", meta: "open now", color: "#ef4444" },
    { label: "Today's Sessions", value: "5", meta: "scheduled", color: "#3b82f6" },
    { label: "Good Moral Requests", value: goodMoralRequests.length.toString(), meta: "awaiting clearance", color: "#10b981" },
    { label: "Student Referrals", value: pendingReferrals.length.toString(), meta: "pending review", color: "var(--primary)" },
  ];

  return (
    <div style={{ width: "100%" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Guidance Office</p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "var(--text-main)" }}>
          <span style={{ color: "var(--primary)" }}>Guidance Office</span>
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Manage counseling sessions, Good Moral clearances, and student referrals.</p>
      </div>

      {/* Operation Navigation Nodes */}
      <div style={{ display: "flex", gap: "1px", background: "var(--border-dim)", marginBottom: "3rem", width: "fit-content", padding: "1px" }}>
        {["Overview", "Referrals", "Appointments"].map((tab, i) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)} 
            style={{ 
              padding: "0.85rem 1.5rem", 
              fontSize: "0.7rem",
              fontWeight: "900",
              letterSpacing: "0.05em",
              background: activeTab === tab ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)",
              color: activeTab === tab ? "var(--primary)" : "var(--text-dim)",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid var(--primary)" : "2px solid transparent",
              transition: "all 0.2s",
              cursor: "pointer"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Telemetry Row */}
      <div className="card-grid" style={{ marginBottom: "3rem" }}>
        {dataNodes.map((node, i) => (
          <motion.div 
            key={node.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="sapphire-card"
          >
            <p style={{ fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.2em", color: "var(--text-dim)", marginBottom: "1.5rem" }}>{node.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
               <h2 style={{ fontSize: "2.5rem", fontWeight: "900" }}>{node.value}</h2>
            </div>
            <p style={{ fontSize: "0.55rem", fontWeight: "800", color: node.color, marginTop: "1rem", letterSpacing: "0.1em" }}>{node.meta}</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Overview" && (
          <motion.div key="overview" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            
            <ProcessGuide 
                title="How to Use the Guidance Office"
                steps={[
                   { title: "Review Referrals", desc: "Check incoming referrals from advisers and walk-in requests.", icon: <ClipboardList size={14} /> },
                   { title: "Conduct Session", desc: "Meet with the student for counseling and assessment.", icon: <HeartHandshake size={14} /> },
                   { title: "Record Notes", desc: "Document your findings and recommendations after the session.", icon: <FileText size={14} /> },
                   { title: "Endorse & Clear", desc: "Forward cases to OSAS and clear students for Good Moral certificates.", icon: <ShieldCheck size={14} /> }
                ]}
             />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
               {/* GOOD MORAL QUEUE */}
               <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)" }}>
                  <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem" }}>Quick Actions</h3>
                  <div style={{ display: "grid", gap: "1.5rem" }}>
                     <button className="btn-cyan" style={{ width: "100%", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <Lock size={16} /> Refresh Data
                     </button>
                     <button className="btn-cyan" style={{ width: "100%", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}>
                        <Database size={16} color="var(--primary)" /> Reload Records
                     </button>
                  </div>
               </div>

               {/* RECENT RECORDS */}
               <div className="sapphire-card">
                  <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <ShieldCheck size={18} color="var(--primary)" /> Good Moral Clearance Queue
                  </h2>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", marginBottom: "2rem" }}>Students waiting for Good Moral certificate clearance.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                    {goodMoralRequests.map((req) => (
                      <div key={req.id} style={{ background: "var(--bg-surface)", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontSize: "0.8rem", fontWeight: "800" }}>{req.studentName.toUpperCase()}</p>
                          <p style={{ fontSize: "0.6rem", fontWeight: "800", color: "var(--text-dim)", marginTop: "0.2rem" }}>Date: {req.date}</p>
                        </div>
                        <button onClick={() => handleIssueGoodMoral(req.id)} className="btn-cyan" style={{ padding: "0.5rem 1.25rem", fontSize: "0.6rem" }}>
                          Clear & Issue
                        </button>
                      </div>
                    ))}
                    {goodMoralRequests.length === 0 && (
                       <div style={{ padding: "2rem", textAlign: "center", background: "var(--bg-surface)" }}>
                          <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)" }}>NO awaiting clearanceS</p>
                       </div>
                    )}
                  </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
