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
  ArrowUpRight,
  Lock,
  Database,
  ShieldCheck,
  RefreshCw,
  Check,
  Zap
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
         <Activity size={48} className="animate-pulse" color="#3b82f6" />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2.5rem" }}>
         <div style={{ position: "relative" }}>
            <ShieldAlert size={80} color="#ef4444" style={{ opacity: 0.1 }} />
            <Lock size={32} color="#ef4444" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
         </div>
         <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "800", color: "#1e293b", letterSpacing: "-0.02em" }}>Access Restricted</h2>
            <p style={{ color: "#64748b", fontWeight: "600", marginTop: "0.75rem", fontSize: "0.95rem" }}>This page is restricted to Guidance Counselors.</p>
            <p style={{ color: "#ef4444", fontWeight: "700", marginTop: "1rem", fontSize: "0.8rem" }}>Required Role: Guidance Counselor</p>
         </div>
         <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/" style={{ padding: "0.85rem 2rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", textDecoration: "none", fontSize: "0.85rem", fontWeight: "700", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>Go to Dashboard</a>
            <a href="/login" style={{ padding: "0.85rem 2rem", background: "#3b82f6", color: "white", borderRadius: "8px", textDecoration: "none", fontSize: "0.85rem", fontWeight: "700", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>Sign In</a>
         </div>
      </div>
    );
  }

  const handleIssueGoodMoral = (id: string) => {
    updateRequestStatus(id, "Completed");
  };

  const dataNodes = [
    { label: "Active Cases", value: "12", meta: "Open now", color: "#ef4444", bg: "#fef2f2" },
    { label: "Today's Sessions", value: "5", meta: "Scheduled", color: "#3b82f6", bg: "#eff6ff" },
    { label: "Good Moral Requests", value: goodMoralRequests.length.toString(), meta: "Awaiting clearance", color: "#10b981", bg: "#f0fdf4" },
    { label: "Student Referrals", value: pendingReferrals.length.toString(), meta: "Pending review", color: "#f59e0b", bg: "#fffbeb" },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "4rem" }}>
        <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Guidance Office</p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
          Guidance <span style={{ color: "#3b82f6" }}>Office</span>
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "#6b7280", maxWidth: "600px", lineHeight: "1.6" }}>Manage counseling sessions, Good Moral clearances, and student referrals to ensure student well-being.</p>
      </div>

      {/* Operation Navigation Nodes */}
      <div style={{ display: "flex", gap: "0.5rem", background: "#f8fafc", marginBottom: "3rem", width: "fit-content", padding: "0.5rem", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
        {["Overview", "Referrals", "Appointments"].map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)} 
            style={{ 
              padding: "0.75rem 1.5rem", 
              fontSize: "0.85rem",
              fontWeight: "700",
              background: activeTab === tab ? "white" : "transparent",
              color: activeTab === tab ? "#3b82f6" : "#64748b",
              border: "none",
              borderRadius: "8px",
              boxShadow: activeTab === tab ? "0 2px 4px rgba(0,0,0,0.05)" : "none",
              transition: "all 0.2s",
              cursor: "pointer"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Telemetry Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {dataNodes.map((node, i) => (
          <motion.div 
            key={node.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
          >
            <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#64748b", marginBottom: "1rem" }}>{node.label}</p>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b", lineHeight: "1" }}>{node.value}</h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem", padding: "0.4rem 0.8rem", background: node.bg, borderRadius: "20px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: node.color }} />
              <p style={{ fontSize: "0.7rem", fontWeight: "700", color: node.color }}>{node.meta}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Overview" && (
          <motion.div key="overview" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.4, ease: "easeOut" }}>
            
            {/* AI PREDICTIVE REFERRALS */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               style={{
                  marginBottom: "3rem",
                  padding: "3rem",
                  background: "linear-gradient(135deg, #f8fafc, #eff6ff)",
                  border: "1px solid #dbeafe",
                  borderRadius: "32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.1)"
               }}
            >
               <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
                  <div style={{ width: "60px", height: "60px", background: "white", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                     <Zap size={28} />
                  </div>
                  <div>
                     <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.5rem" }}>Predictive Referral Sentinel</h3>
                     <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "500", maxWidth: "600px", lineHeight: "1.6" }}>
                        Our AI has identified <strong>3 students</strong> exhibiting high-risk behavioral patterns (sudden grade drops, inactivity, and vault document stagnation).
                     </p>
                  </div>
               </div>
               <button 
                  onClick={() => setActiveTab("Referrals")}
                  style={{ padding: "1rem 2rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "14px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 10px 15px rgba(59, 130, 246, 0.2)" }}
               >
                  Review AI Suggestions <ArrowUpRight size={18} />
               </button>
            </motion.div>

            <div style={{ marginBottom: "3rem" }}>
              <ProcessGuide 
                  title="How to Use the Guidance Office"
                  steps={[
                     { title: "Review Referrals", desc: "Check incoming referrals from advisers and walk-in requests.", icon: <ClipboardList size={16} /> },
                     { title: "Conduct Session", desc: "Meet with the student for counseling and assessment.", icon: <HeartHandshake size={16} /> },
                     { title: "Record Notes", desc: "Document your findings and recommendations after the session.", icon: <FileText size={16} /> },
                     { title: "Endorse & Clear", desc: "Forward cases to OSAS and clear students for Good Moral certificates.", icon: <ShieldCheck size={16} /> }
                  ]}
               />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2.5rem" }}>
               {/* QUICK ACTIONS */}
               <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem" }}>Quick Actions</h3>
                  <div style={{ display: "grid", gap: "1rem" }}>
                     <button style={{ width: "100%", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
                        <RefreshCw size={18} /> Refresh Data
                     </button>
                     <button style={{ width: "100%", padding: "1.25rem", display: "flex", alignItems: "center", gap: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
                        <Database size={18} /> Reload Records
                     </button>
                  </div>
               </div>

               {/* RECENT RECORDS */}
               <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                  <div style={{ padding: "2.5rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <ShieldCheck size={24} color="#10b981" /> Good Moral Clearance Queue
                    </h2>
                    <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500", marginTop: "0.5rem" }}>Students waiting for Good Moral certificate clearance.</p>
                  </div>
                  
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {goodMoralRequests.map((req, i) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        key={req.id} 
                        style={{ padding: "1.5rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9" }}
                      >
                        <div>
                          <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b" }}>{req.studentName}</p>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem", color: "#64748b" }}>
                             <Clock size={14} />
                             <p style={{ fontSize: "0.8rem", fontWeight: "600" }}>{req.date}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleIssueGoodMoral(req.id)} 
                          style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "700", background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}
                        >
                          <Check size={16} /> Clear & Issue
                        </button>
                      </motion.div>
                    ))}
                    {goodMoralRequests.length === 0 && (
                       <div style={{ padding: "4rem", textAlign: "center" }}>
                          <CheckCircle2 size={48} color="#cbd5e1" style={{ margin: "0 auto 1.5rem" }} />
                          <p style={{ fontSize: "1rem", fontWeight: "700", color: "#64748b" }}>Queue is empty.</p>
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
