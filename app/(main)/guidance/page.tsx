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
            <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.02em" }}>ACCESS DENIED</h2>
            <p style={{ color: "var(--text-dim)", fontWeight: "700", marginTop: "0.75rem", fontSize: "0.85rem" }}>COUNSELING VAULT REQUIRES UNIT CLEARANCE.</p>
            <p style={{ color: "var(--primary)", fontWeight: "900", marginTop: "1rem", fontSize: "0.6rem", letterSpacing: "0.1em" }}>REQUIRED ROLE: GUIDANCE_COUNSELOR_ONLY</p>
         </div>
         <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/" style={{ padding: "1rem 2rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", textDecoration: "none", fontSize: "0.7rem", fontWeight: "900" }}>RETURN HOME</a>
            <a href="/login" className="btn-cyan" style={{ padding: "1rem 2rem", textDecoration: "none", fontSize: "0.7rem", fontWeight: "900" }}>AUTHORIZE</a>
         </div>
      </div>
    );
  }

  const handleIssueGoodMoral = (id: string) => {
    updateRequestStatus(id, "Completed");
  };

  const dataNodes = [
    { label: "COUNSELING RECORDS", value: "12", meta: "ACTIVE CASES", color: "#ef4444" },
    { label: "CONSULTATION SCHEDULE", value: "5", meta: "TODAY'S SESSIONS", color: "#3b82f6" },
    { label: "GOOD MORAL VERIFICATION", value: goodMoralRequests.length.toString(), meta: "PENDING CLEARANCE", color: "#10b981" },
    { label: "STUDENT REFERRALS", value: pendingReferrals.length.toString(), meta: "PIPELINE QUEUE", color: "var(--primary)" },
  ];

  return (
    <div style={{ width: "100%" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>UNIT: COUNSELING & WELLNESS</p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
          GUIDANCE <span style={{ color: "var(--primary)" }}>VAULT</span>
        </h1>
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
            0{i+1}_ {tab.toUpperCase()}
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
            
            {/* SAPPHIRE SOP PROTOCOL */}
            <div className="sapphire-card" style={{ marginBottom: "3rem", borderLeft: "4px solid var(--primary)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                <Activity size={20} color="var(--primary)" />
                <h3 style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "0.1em" }}>GUIDANCE OPERATIONAL PROTOCOL</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1px", background: "var(--border-dim)" }}>
                {[
                  { step: "01", title: "INTAKE ASSESSMENT", desc: "Review referral or walk-in records." },
                  { step: "02", title: "COUNSELING SESSION", desc: "Conduct one-on-one professional support." },
                  { step: "03", title: "FINDINGS LOG", desc: "Document behavioral recommendations." },
                  { step: "04", title: "OSAS ENDORSEMENT", desc: "Forward disciplinary nodes to the Director." },
                  { step: "05", title: "CLEARANCE ISSUE", desc: "Verify conduct and sign Good Moral certs." }
                ].map((s) => (
                  <div key={s.step} style={{ background: "var(--bg-surface)", padding: "1.5rem" }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.75rem" }}>PHASE {s.step}</div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "0.5rem" }}>{s.title}</p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.4" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
               {/* GOOD MORAL QUEUE */}
               <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)" }}>
                  <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem" }}>VAULT CONTROLS</h3>
                  <div style={{ display: "grid", gap: "1.5rem" }}>
                     <button className="btn-cyan" style={{ width: "100%", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                        <Lock size={16} /> RE-AUTHENTICATE VAULT
                     </button>
                     <button className="btn-cyan" style={{ width: "100%", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}>
                        <Database size={16} color="var(--primary)" /> REFRESH REPOSITORY
                     </button>
                  </div>
               </div>

               {/* RECENT RECORDS */}
               <div className="sapphire-card">
                  <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <ShieldCheck size={18} color="var(--primary)" /> IDENTITY DOCUMENT VAULT
                  </h2>
                  <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", marginBottom: "2rem" }}>SECURE STORAGE FOR INSTITUTIONAL CLEARANCES.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                    {goodMoralRequests.map((req) => (
                      <div key={req.id} style={{ background: "var(--bg-surface)", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <p style={{ fontSize: "0.8rem", fontWeight: "800" }}>{req.studentName.toUpperCase()}</p>
                          <p style={{ fontSize: "0.6rem", fontWeight: "800", color: "var(--text-dim)", marginTop: "0.2rem" }}>STAMPED: {req.date}</p>
                        </div>
                        <button onClick={() => handleIssueGoodMoral(req.id)} className="btn-cyan" style={{ padding: "0.5rem 1.25rem", fontSize: "0.6rem" }}>
                          ISSUE CERTIFICATE
                        </button>
                      </div>
                    ))}
                    {goodMoralRequests.length === 0 && (
                       <div style={{ padding: "2rem", textAlign: "center", background: "var(--bg-surface)" }}>
                          <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)" }}>NO PENDING CLEARANCES</p>
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
