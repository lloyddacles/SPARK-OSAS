"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scale, 
  ShieldAlert, 
  FileSignature, 
  Gavel, 
  CheckCircle2, 
  ArrowRight, 
  HelpCircle,
  FileText,
  Clock,
  User,
  Activity,
  Layers,
  Search,
  Sparkles,
  Cpu
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function StudentReferralsPage() {
  const { referrals, addReferral, endorseReferral, verdictReferral, currentUser } = useGlobalState();
  
  const isAdviser = currentUser?.role === "ADVISER";
  const isGuidance = currentUser?.role === "GUIDANCE_COUNSELOR";
  const isOSAS = currentUser?.role === "OSAS_DIRECTOR" || currentUser?.role === "SYSTEM_ADMIN";
  const isStaff = isGuidance || isOSAS;

  const [activeTab, setActiveTab] = useState<"Adviser" | "Guidance" | "OSAS">(
    isOSAS ? "OSAS" : isGuidance ? "Guidance" : "Adviser"
  );

  // Adviser Form State
  const [studentName, setStudentName] = useState("");
  const [reason, setReason] = useState("");

  // Guidance Endorsement State
  const [selectedGuidanceRef, setSelectedGuidanceRef] = useState<string | null>(null);
  const [findings, setFindings] = useState("");

  // OSAS Verdict State
  const [selectedOsasRef, setSelectedOsasRef] = useState<string | null>(null);
  const [verdictNotes, setVerdictNotes] = useState("");

  // AI Analyst State
  const [isAnalyzingCase, setIsAnalyzingCase] = useState(false);
  const [aiCaseSummary, setAiCaseSummary] = useState<string | null>(null);

  const runCaseAnalysis = () => {
    setIsAnalyzingCase(true);
    setAiCaseSummary(null);
    setTimeout(() => {
      setIsAnalyzingCase(false);
      setAiCaseSummary("Severity: High. This violation relates to Academic Integrity. Suggested Action: Level 2 Warning. Note: The student was cooperative.");
    }, 2500);
  };

  // OSAS Filter & Search State
  const [osasSearchTerm, setOsasSearchTerm] = useState("");
  const [osasFilterStatus, setOsasFilterStatus] = useState<string>("ALL");

  const osasCases = referrals.filter(r => r.status === "Endorsed to OSAS" || r.status === "Sanctioned" || r.status === "Dismissed");
  const filteredOsasCases = osasCases.filter(r => {
    if (osasFilterStatus !== "ALL" && r.status !== osasFilterStatus) return false;
    if (osasSearchTerm && !r.studentName.toLowerCase().includes(osasSearchTerm.toLowerCase())) return false;
    return true;
  });

  const handleCreateReferral = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !reason) return;
    addReferral(studentName, reason);
    setStudentName("");
    setReason("");
  };

  const handleEndorse = () => {
    if (!isGuidance && !isOSAS) return;
    if (!selectedGuidanceRef || !findings) return;
    endorseReferral(selectedGuidanceRef, findings);
    setSelectedGuidanceRef(null);
    setFindings("");
  };

  const handleVerdict = (status: "Sanctioned" | "Dismissed") => {
    if (!isOSAS) return;
    if (!selectedOsasRef || !verdictNotes) return;
    verdictReferral(selectedOsasRef, status, verdictNotes);
    setSelectedOsasRef(null);
    setVerdictNotes("");
  };

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* Header */}
      <div style={{ marginBottom: "4rem" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Welfare</p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
          <span style={{ color: "var(--primary)" }}>Student Referrals</span>
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "0.95rem", color: "#6b7280", maxWidth: "600px", lineHeight: "1.6" }}>Track student behavior referrals from advisers through guidance counseling to OSAS resolution.</p>
      </div>

      {/* Role Navigation Nodes */}
      <div style={{ display: "flex", gap: "0.5rem", background: "#f8fafc", marginBottom: "3rem", width: "fit-content", padding: "0.5rem", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
        {["Adviser", "Guidance", "OSAS"].map((tab) => {
          const isVisible = 
            (tab === "Adviser") || 
            (tab === "Guidance" && isStaff) || 
            (tab === "OSAS" && isStaff);
          
          if (!isVisible) return null;

          return (
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
              {tab === "Adviser" ? "Teacher" : tab}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ADVISER Step */}
        {activeTab === "Adviser" && (
          <motion.div key="adviser" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.4, ease: "easeOut" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2.5rem" }}>
              <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <ShieldAlert size={20} color="#3b82f6" /> Submit a Referral
                </h2>
                <form onSubmit={handleCreateReferral} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Student Name</label>
                    <input 
                      required value={studentName} onChange={e => setStudentName(e.target.value)} 
                      placeholder="Enter student's full name..."
                      style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Reason for Referral</label>
                    <textarea 
                      required value={reason} onChange={e => setReason(e.target.value)} 
                      placeholder="Describe the concern or issue in detail..." rows={5}
                      style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b", outline: "none", resize: "none" }} 
                    />
                  </div>
                  <button type="submit" style={{ padding: "1rem 2rem", fontSize: "0.95rem", fontWeight: "700", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", width: "fit-content", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                    Submit Referral <ArrowRight size={18} />
                  </button>
                </form>
              </div>

              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "1.5rem", color: "#1e293b" }}>My Submitted Referrals</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {referrals.map(ref => (
                    <div key={ref.id} style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #f1f5f9", borderLeft: "4px solid #3b82f6", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", alignItems: "flex-start" }}>
                        <h4 style={{ fontWeight: "700", fontSize: "0.95rem", color: "#1e293b" }}>{ref.studentName}</h4>
                        <span style={{ fontSize: "0.75rem", fontWeight: "700", padding: "0.4rem 0.8rem", borderRadius: "20px", background: "#eff6ff", color: "#2563eb" }}>
                          {ref.status || "Pending"}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.6" }}>{ref.reason}</p>
                    </div>
                  ))}
                  {referrals.length === 0 && (
                     <div style={{ padding: "3rem", textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                        <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#94a3b8" }}>No referrals submitted yet.</p>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* GUIDANCE_Step */}
        {activeTab === "Guidance" && (
          <motion.div key="guidance" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.4, ease: "easeOut" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "1.5rem", color: "#1e293b" }}>Incoming Referrals</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {referrals.filter(r => r.status === "Referred to Guidance").map(ref => (
                    <div 
                      key={ref.id} 
                      onClick={() => setSelectedGuidanceRef(ref.id)}
                      style={{ 
                        padding: "1.5rem", 
                        background: "white",
                        borderRadius: "12px",
                        cursor: "pointer", 
                        border: selectedGuidanceRef === ref.id ? "1px solid #3b82f6" : "1px solid #f1f5f9",
                        boxShadow: selectedGuidanceRef === ref.id ? "0 4px 12px rgba(59, 130, 246, 0.1)" : "0 2px 4px rgba(0,0,0,0.02)",
                        transition: "all 0.2s"
                      }}
                    >
                      <h4 style={{ fontWeight: "700", fontSize: "0.95rem", marginBottom: "0.5rem", color: "#1e293b" }}>{ref.studentName}</h4>
                      <p style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: "700", marginBottom: "1rem" }}>Referred by: {ref.adviserName}</p>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.5" }}>{ref.reason}</p>
                    </div>
                  ))}
                  {referrals.filter(r => r.status === "Referred to Guidance").length === 0 && (
                    <div style={{ padding: "4rem", textAlign: "center", background: "white", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                       <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#94a3b8" }}>No pending referrals at this time.</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedGuidanceRef && (
                <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <FileSignature size={20} color="#3b82f6" /> Counselor's Assessment
                  </h2>
                  <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700" }}>Student:</p>
                    <p style={{ fontWeight: "800", fontSize: "1.25rem", color: "#1e293b", marginTop: "0.2rem" }}>{referrals.find(r => r.id === selectedGuidanceRef)?.studentName}</p>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Your Assessment & Recommendations</label>
                    <textarea 
                      required value={findings} onChange={e => setFindings(e.target.value)} 
                      placeholder="Enter your findings and recommendation..." rows={6}
                      style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", resize: "none", color: "#1e293b", lineHeight: "1.6" }} 
                    />
                  </div>
                  <button onClick={handleEndorse} style={{ width: "100%", marginTop: "2rem", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "700", background: "var(--primary)", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                    Endorse to OSAS <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* OSAS Step */}
        {activeTab === "OSAS" && (
          <motion.div key="osas" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.4, ease: "easeOut" }}>
            
            {/* WORKFLOW PROTOCOL */}
            <div style={{ marginBottom: "3rem", background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", borderLeft: "4px solid #ef4444", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                <Activity size={20} color="#ef4444" />
                <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>OSAS Referral Process</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                {[
                  { step: "01", title: "Read Notes", desc: "Review the counselor's findings." },
                  { step: "02", title: "Check History", desc: "Review the student's past records." },
                  { step: "03", title: "Meet Student", desc: "Schedule a meeting with the student." },
                  { step: "04", title: "Make Decision", desc: "Issue the final OSAS decision." },
                  { step: "05", title: "Save Record", desc: "Archive the completed case." }
                ].map((s) => (
                  <div key={s.step} style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                    <div style={{ fontSize: "0.75rem", fontWeight: "800", color: "#ef4444", marginBottom: "0.5rem" }}>Step {s.step}</div>
                    <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b", marginBottom: "0.5rem" }}>{s.title}</p>
                    <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "500", lineHeight: "1.4" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DISCIPLINARY TRENDS & FILTERS */}
            <div style={{ display: "flex", gap: "1.5rem", marginBottom: "3rem", flexWrap: "wrap" }}>
               <div style={{ flex: 1, display: "flex", gap: "1.5rem" }}>
                  <div style={{ flex: 1, padding: "2rem", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                     <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginBottom: "0.5rem" }}>Total Cases</p>
                     <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b" }}>{osasCases.length}</p>
                  </div>
                  <div style={{ flex: 1, padding: "2rem", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                     <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ef4444", marginBottom: "0.5rem" }}>Sanctioned</p>
                     <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b" }}>{osasCases.filter(r => r.status === "Sanctioned").length}</p>
                  </div>
                  <div style={{ flex: 1, padding: "2rem", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                     <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginBottom: "0.5rem" }}>Dismissed</p>
                     <p style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b" }}>{osasCases.filter(r => r.status === "Dismissed").length}</p>
                  </div>
               </div>
               
               <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", alignItems: "center", background: "#f8fafc", padding: "0.75rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                     <Search size={18} color="#9ca3af" />
                     <input 
                       value={osasSearchTerm} 
                       onChange={e => setOsasSearchTerm(e.target.value)} 
                       placeholder="Search cases by student name..."
                       style={{ background: "transparent", border: "none", color: "#1e293b", fontSize: "0.9rem", fontWeight: "600", marginLeft: "0.75rem", width: "100%", outline: "none" }}
                     />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                     {["ALL", "Endorsed to OSAS", "Sanctioned", "Dismissed"].map(status => (
                        <button 
                           key={status}
                           onClick={() => setOsasFilterStatus(status)}
                           style={{ 
                              padding: "0.6rem 1rem", 
                              fontSize: "0.75rem", 
                              fontWeight: "700", 
                              background: osasFilterStatus === status ? "#fef2f2" : "#f8fafc", 
                              color: osasFilterStatus === status ? "#ef4444" : "#64748b", 
                              border: osasFilterStatus === status ? "1px solid #fecaca" : "1px solid #e2e8f0", 
                              borderRadius: "20px",
                              cursor: "pointer",
                              flex: 1,
                              transition: "all 0.2s"
                           }}
                        >
                           {status === "Endorsed to OSAS" ? "Pending" : status}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2.5rem" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "1.5rem", color: "#1e293b" }}>Case List</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {filteredOsasCases.map(ref => (
                    <div 
                      key={ref.id} 
                      onClick={() => { setSelectedOsasRef(ref.id); setAiCaseSummary(null); }}
                      style={{ 
                        padding: "1.5rem", 
                        background: "white",
                        borderRadius: "12px",
                        cursor: "pointer", 
                        border: selectedOsasRef === ref.id ? "1px solid #ef4444" : "1px solid #f1f5f9",
                        boxShadow: selectedOsasRef === ref.id ? "0 4px 12px rgba(239, 68, 68, 0.1)" : "0 2px 4px rgba(0,0,0,0.02)",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                         <h4 style={{ fontWeight: "800", fontSize: "0.95rem", color: "#1e293b" }}>{ref.studentName}</h4>
                         <span style={{ fontSize: "0.75rem", fontWeight: "700", padding: "0.3rem 0.8rem", borderRadius: "20px", background: ref.status === "Endorsed to OSAS" ? "#fef2f2" : "#f8fafc", color: ref.status === "Endorsed to OSAS" ? "#ef4444" : "#64748b", border: "1px solid", borderColor: ref.status === "Endorsed to OSAS" ? "#fecaca" : "#e2e8f0" }}>
                            {ref.status === "Endorsed to OSAS" ? "Pending" : ref.status}
                         </span>
                      </div>
                      <div style={{ padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px solid #f1f5f9" }}>
                         <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#3b82f6", marginBottom: "0.4rem" }}>Counselor's Findings:</p>
                         <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.5" }}>{ref.counselorFindings}</p>
                      </div>
                    </div>
                  ))}
                  {filteredOsasCases.length === 0 && (
                    <div style={{ padding: "4rem", textAlign: "center", background: "white", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                       <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#94a3b8" }}>No cases match your filters.</p>
                    </div>
                  )}
                </div>
              </div>

              {(() => {
                 const activeRef = referrals.find(r => r.id === selectedOsasRef);
                 return activeRef && (
                   <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", borderTop: "4px solid #ef4444", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                     <h2 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                       <Gavel size={20} color="#ef4444" /> Case: {activeRef.studentName}
                     </h2>
                     
                     {/* TIMELINE */}
                     <div style={{ marginBottom: "3rem", paddingLeft: "1.25rem", borderLeft: "2px solid #e2e8f0", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                        <div style={{ position: "relative" }}>
                           <div style={{ position: "absolute", left: "-1.6rem", top: "0", width: "12px", height: "12px", borderRadius: "50%", background: "white", border: "2px solid #94a3b8" }} />
                           <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", marginBottom: "0.4rem" }}>Referred by {activeRef.adviserName || "Adviser"}</p>
                           <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1e293b", lineHeight: "1.5" }}>{activeRef.reason}</p>
                        </div>
                        <div style={{ position: "relative" }}>
                           <div style={{ position: "absolute", left: "-1.6rem", top: "0", width: "12px", height: "12px", borderRadius: "50%", background: "white", border: "2px solid #3b82f6" }} />
                           <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#3b82f6", marginBottom: "0.4rem" }}>Counselor's Assessment</p>
                           <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1e293b", lineHeight: "1.5" }}>{activeRef.counselorFindings}</p>
                        </div>
                        {activeRef.status !== "Endorsed to OSAS" && (
                           <div style={{ position: "relative" }}>
                              <div style={{ position: "absolute", left: "-1.6rem", top: "0", width: "12px", height: "12px", borderRadius: "50%", background: "white", border: "2px solid #ef4444" }} />
                              <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#ef4444", marginBottom: "0.4rem" }}>OSAS Decision: {activeRef.status}</p>
                              <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1e293b", lineHeight: "1.5" }}>{activeRef.osasVerdict || "No additional notes provided."}</p>
                           </div>
                        )}
                     </div>

                     {activeRef.status === "Endorsed to OSAS" && (
                        <div>
                           {/* AI CASE ANALYST */}
                           <div style={{ marginBottom: "3rem", padding: "2rem", background: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe", position: "relative", overflow: "hidden" }}>
                             <div style={{ position: "absolute", right: "-10px", top: "-10px", opacity: 0.1 }}>
                               <Cpu size={120} color="#3b82f6" />
                             </div>
                             
                             <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                               <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                  <Sparkles size={18} color="#2563eb" />
                                  <h3 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e3a8a" }}>Smart Check Analysis</h3>
                               </div>
                               {!aiCaseSummary && !isAnalyzingCase && (
                                 <button onClick={runCaseAnalysis} style={{ padding: "0.6rem 1.25rem", fontSize: "0.8rem", fontWeight: "700", background: "white", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "6px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                   Generate Summary
                                 </button>
                               )}
                             </div>

                             <AnimatePresence>
                               {isAnalyzingCase && (
                                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                                   <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                      <div style={{ fontSize: "0.8rem", fontWeight: "700", color: "#2563eb" }}>
                                         Analyzing case details...
                                      </div>
                                      <div style={{ height: "4px", background: "#dbeafe", width: "100%", borderRadius: "2px", overflow: "hidden" }}>
                                         <motion.div 
                                           initial={{ x: "-100%" }} 
                                           animate={{ x: "100%" }} 
                                           transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
                                           style={{ width: "50%", height: "100%", background: "#3b82f6" }} 
                                         />
                                      </div>
                                   </div>
                                 </motion.div>
                               )}

                               {aiCaseSummary && (
                                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "1.5rem", padding: "1.25rem", background: "white", borderRadius: "8px", borderLeft: "4px solid #3b82f6", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                    <p style={{ fontSize: "0.9rem", color: "#1e293b", fontWeight: "600", lineHeight: "1.6" }}>{aiCaseSummary}</p>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                           </div>

                           <div style={{ marginBottom: "2rem" }}>
                             <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Your Decision & Notes</label>
                             <textarea 
                               required value={verdictNotes} onChange={e => setVerdictNotes(e.target.value)} 
                               placeholder="Enter your decision and any notes or sanctions..." rows={5}
                               style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", resize: "none", color: "#1e293b", lineHeight: "1.6" }} 
                             />
                           </div>
                           {isOSAS ? (
                             <div style={{ display: "flex", gap: "1rem" }}>
                               <button onClick={() => handleVerdict("Dismissed")} style={{ flex: 1, padding: "1.25rem", fontSize: "0.9rem", fontWeight: "700", background: "white", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}>
                                 Dismiss Case
                               </button>
                               <button onClick={() => handleVerdict("Sanctioned")} style={{ flex: 1, padding: "1.25rem", fontSize: "0.9rem", fontWeight: "700", background: "#ef4444", border: "none", color: "white", borderRadius: "8px", cursor: "pointer", boxShadow: "0 4px 6px rgba(239, 68, 68, 0.2)", transition: "all 0.2s" }}>
                                 Apply Sanction
                               </button>
                             </div>
                           ) : (
                             <div style={{ padding: "1.5rem", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", textAlign: "center" }}>
                                <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#ef4444" }}>Awaiting OSAS Director's decision</p>
                             </div>
                           )}
                        </div>
                     )}
                   </div>
                 );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
