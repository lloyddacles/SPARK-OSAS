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
    <div style={{ width: "100%" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>STUDENT MONITORING</p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
          STUDENT <span style={{ color: "var(--primary)" }}>REFERRALS</span>
        </h1>
      </div>

      {/* Role Navigation Nodes */}
      <div style={{ display: "flex", gap: "1px", background: "var(--border-dim)", marginBottom: "3rem", width: "fit-content", padding: "1px" }}>
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
              {tab === "Adviser" ? "TEACHER" : tab.toUpperCase()}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        
        {/* ADVISER PHASE */}
        {activeTab === "Adviser" && (
          <motion.div key="adviser" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "2rem" }}>
              <div className="sapphire-card">
                <h2 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <ShieldAlert size={18} color="var(--primary)" /> SEND A REFERRAL
                </h2>
                <form onSubmit={handleCreateReferral} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>STUDENT NAME</label>
                    <input 
                      required value={studentName} onChange={e => setStudentName(e.target.value)} 
                      placeholder="ENTER FULL NAME..."
                      style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>REASON FOR REFERRAL</label>
                    <textarea 
                      required value={reason} onChange={e => setReason(e.target.value)} 
                      placeholder="DESCRIBE THE ISSUE IN DETAIL..." rows={4}
                      style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} 
                    />
                  </div>
                  <button type="submit" className="btn-cyan" style={{ padding: "1rem", width: "fit-content" }}>
                    SEND TO GUIDANCE <ArrowRight size={16} />
                  </button>
                </form>
              </div>

              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: "900", marginBottom: "2rem", color: "var(--text-dim)" }}>MY SENT REFERRALS</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                  {referrals.map(ref => (
                    <div key={ref.id} style={{ background: "var(--bg-surface)", padding: "1.25rem", borderLeft: "2px solid var(--primary)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                        <h4 style={{ fontWeight: "800", fontSize: "0.85rem" }}>{(ref.studentName || "Unknown Student").toUpperCase()}</h4>
                        <span style={{ fontSize: "0.6rem", fontWeight: "900", padding: "0.25rem 0.5rem", background: "var(--bg-accent)", color: "var(--primary)", border: "1px solid var(--border-dim)" }}>
                          {(ref.status || "Pending").toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: "500", lineHeight: "1.6" }}>{ref.reason}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* GUIDANCE_PHASE */}
        {activeTab === "Guidance" && (
          <motion.div key="guidance" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: "900", marginBottom: "2rem", color: "var(--text-dim)" }}>INCOMING REFERRALS</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                  {referrals.filter(r => r.status === "Referred to Guidance").map(ref => (
                    <div 
                      key={ref.id} 
                      onClick={() => setSelectedGuidanceRef(ref.id)}
                      style={{ 
                        padding: "1.25rem", 
                        background: selectedGuidanceRef === ref.id ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)",
                        cursor: "pointer", 
                        borderLeft: selectedGuidanceRef === ref.id ? "2px solid var(--primary)" : "2px solid transparent",
                        transition: "all 0.2s"
                      }}
                    >
                      <h4 style={{ fontWeight: "800", fontSize: "0.85rem", marginBottom: "0.5rem" }}>{ref.studentName.toUpperCase()}</h4>
                      <p style={{ fontSize: "0.6rem", color: "var(--primary)", fontWeight: "900", marginBottom: "1rem" }}>FILED BY: {ref.adviserName.toUpperCase()}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: "500" }}>{ref.reason}</p>
                    </div>
                  ))}
                  {referrals.filter(r => r.status === "Referred to Guidance").length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", background: "var(--bg-surface)" }}>
                       <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)" }}>NO PENDING REFERRALS</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedGuidanceRef && (
                <div className="sapphire-card">
                  <h2 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <FileSignature size={18} color="var(--primary)" /> COUNSELOR'S NOTES
                  </h2>
                  <div style={{ marginBottom: "2.5rem", padding: "1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                    <p style={{ fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "900" }}>CURRENT STUDENT:</p>
                    <p style={{ fontWeight: "900", fontSize: "1.25rem", color: "var(--primary)", marginTop: "0.5rem" }}>{referrals.find(r => r.id === selectedGuidanceRef)?.studentName.toUpperCase()}</p>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>COUNSELOR'S FEEDBACK</label>
                    <textarea 
                      required value={findings} onChange={e => setFindings(e.target.value)} 
                      placeholder="ENTER CLINICAL ASSESSMENT AND RECOMMENDATION..." rows={5}
                      style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} 
                    />
                  </div>
                  <button onClick={handleEndorse} className="btn-cyan" style={{ width: "100%", marginTop: "2rem" }}>
                    SEND TO OSAS <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* OSAS PHASE */}
        {activeTab === "OSAS" && (
          <motion.div key="osas" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            
            {/* SAPPHIRE WORKFLOW PROTOCOL */}
            <div className="sapphire-card" style={{ marginBottom: "3rem", borderLeft: "4px solid #ef4444" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                <Activity size={20} color="#ef4444" />
                <h3 style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "0.1em" }}>OSAS DISCIPLINARY PROCESS</h3>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1px", background: "var(--border-dim)" }}>
                {[
                  { step: "01", title: "INITIAL REVIEW", desc: "Read counselor notes." },
                  { step: "02", title: "CASE ANALYSIS", desc: "Check student history." },
                  { step: "03", title: "RESOLUTION MEETING", desc: "Meet with student." },
                  { step: "04", title: "FINAL DECISION", desc: "Give official OSAS verdict." },
                  { step: "05", title: "ARCHIVING", desc: "Save case to records." }
                ].map((s) => (
                  <div key={s.step} style={{ background: "var(--bg-surface)", padding: "1.5rem", position: "relative" }}>
                    <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "#ef4444", marginBottom: "0.75rem" }}>PHASE {s.step}</div>
                    <p style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "0.5rem" }}>{s.title}</p>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.4" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* DISCIPLINARY TRENDS & FILTERS */}
            <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", flexWrap: "wrap" }}>
               <div style={{ flex: 1, display: "flex", gap: "1rem" }}>
                  <div className="sapphire-card" style={{ flex: 1, padding: "1.5rem" }}>
                     <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>TOTAL CASES</p>
                     <p style={{ fontSize: "1.5rem", fontWeight: "900" }}>{osasCases.length}</p>
                  </div>
                  <div className="sapphire-card" style={{ flex: 1, padding: "1.5rem" }}>
                     <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "#ef4444" }}>SANCTIONED</p>
                     <p style={{ fontSize: "1.5rem", fontWeight: "900" }}>{osasCases.filter(r => r.status === "Sanctioned").length}</p>
                  </div>
                  <div className="sapphire-card" style={{ flex: 1, padding: "1.5rem" }}>
                     <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>DISMISSED</p>
                     <p style={{ fontSize: "1.5rem", fontWeight: "900" }}>{osasCases.filter(r => r.status === "Dismissed").length}</p>
                  </div>
               </div>
               
               <div className="sapphire-card" style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem" }}>
                  <div style={{ display: "flex", alignItems: "center", background: "var(--bg-accent)", padding: "0.5rem 1rem", border: "1px solid var(--border-dim)" }}>
                     <Search size={14} color="var(--text-dim)" />
                     <input 
                       value={osasSearchTerm} 
                       onChange={e => setOsasSearchTerm(e.target.value)} 
                       placeholder="SEARCH STUDENT NAME..."
                       style={{ background: "transparent", border: "none", color: "var(--text-main)", fontSize: "0.75rem", fontWeight: "700", marginLeft: "0.75rem", width: "100%", outline: "none" }}
                     />
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                     {["ALL", "Endorsed to OSAS", "Sanctioned", "Dismissed"].map(status => (
                        <button 
                           key={status}
                           onClick={() => setOsasFilterStatus(status)}
                           style={{ 
                              padding: "0.5rem 0.75rem", 
                              fontSize: "0.55rem", 
                              fontWeight: "900", 
                              background: osasFilterStatus === status ? "rgba(239, 68, 68, 0.1)" : "var(--bg-accent)", 
                              color: osasFilterStatus === status ? "#ef4444" : "var(--text-dim)", 
                              border: osasFilterStatus === status ? "1px solid #ef4444" : "1px solid var(--border-dim)", 
                              cursor: "pointer",
                              flex: 1
                           }}
                        >
                           {status === "Endorsed to OSAS" ? "PENDING" : status.toUpperCase()}
                        </button>
                     ))}
                  </div>
               </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem" }}>
              <div>
                <h3 style={{ fontSize: "0.8rem", fontWeight: "900", marginBottom: "2rem", color: "var(--text-dim)" }}>STUDENT CASES</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                  {filteredOsasCases.map(ref => (
                    <div 
                      key={ref.id} 
                      onClick={() => { setSelectedOsasRef(ref.id); setAiCaseSummary(null); }}
                      style={{ 
                        padding: "1.5rem", 
                        background: selectedOsasRef === ref.id ? "rgba(239, 68, 68, 0.05)" : "var(--bg-surface)",
                        cursor: "pointer", 
                        borderLeft: selectedOsasRef === ref.id ? "2px solid #ef4444" : "2px solid transparent",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                         <h4 style={{ fontWeight: "800", fontSize: "0.85rem" }}>{ref.studentName.toUpperCase()}</h4>
                         <span style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.25rem 0.5rem", background: ref.status === "Endorsed to OSAS" ? "rgba(239, 68, 68, 0.1)" : "var(--bg-accent)", color: ref.status === "Endorsed to OSAS" ? "#ef4444" : "var(--text-dim)", border: "1px solid var(--border-dim)" }}>
                            {ref.status === "Endorsed to OSAS" ? "PENDING" : ref.status.toUpperCase()}
                         </span>
                      </div>
                      <div style={{ padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                         <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.5rem" }}>GUIDANCE FINDINGS:</p>
                         <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: "500", lineHeight: "1.5" }}>{ref.counselorFindings}</p>
                      </div>
                    </div>
                  ))}
                  {filteredOsasCases.length === 0 && (
                    <div style={{ padding: "3rem", textAlign: "center", background: "var(--bg-surface)" }}>
                       <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)" }}>NO CASES FOUND</p>
                    </div>
                  )}
                </div>
              </div>

              {(() => {
                 const activeRef = referrals.find(r => r.id === selectedOsasRef);
                 return activeRef && (
                   <div className="sapphire-card" style={{ borderTop: "4px solid #ef4444" }}>
                     <h2 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                       <Gavel size={18} color="#ef4444" /> CASE FILE: {activeRef.studentName.toUpperCase()}
                     </h2>
                     
                     {/* TIMELINE */}
                     <div style={{ marginBottom: "3rem", paddingLeft: "1rem", borderLeft: "2px solid var(--border-dim)", display: "flex", flexDirection: "column", gap: "2rem" }}>
                        <div style={{ position: "relative" }}>
                           <div style={{ position: "absolute", left: "-1.35rem", top: "0", width: "12px", height: "12px", borderRadius: "50%", background: "var(--bg-surface)", border: "2px solid var(--text-dim)" }} />
                           <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.25rem", letterSpacing: "0.1em" }}>FILED BY {activeRef.adviserName?.toUpperCase() || "ADVISER"}</p>
                           <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>{activeRef.reason}</p>
                        </div>
                        <div style={{ position: "relative" }}>
                           <div style={{ position: "absolute", left: "-1.35rem", top: "0", width: "12px", height: "12px", borderRadius: "50%", background: "var(--bg-surface)", border: "2px solid var(--primary)" }} />
                           <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.25rem", letterSpacing: "0.1em" }}>COUNSELOR FINDINGS</p>
                           <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>{activeRef.counselorFindings}</p>
                        </div>
                        {activeRef.status !== "Endorsed to OSAS" && (
                           <div style={{ position: "relative" }}>
                              <div style={{ position: "absolute", left: "-1.35rem", top: "0", width: "12px", height: "12px", borderRadius: "50%", background: "var(--bg-surface)", border: "2px solid #ef4444" }} />
                              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "#ef4444", marginBottom: "0.25rem", letterSpacing: "0.1em" }}>OSAS VERDICT: {activeRef.status.toUpperCase()}</p>
                              <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>{activeRef.osasVerdict || "No additional notes provided."}</p>
                           </div>
                        )}
                     </div>

                     {activeRef.status === "Endorsed to OSAS" && (
                        <div>
                           {/* AI CASE ANALYST */}
                           <div style={{ marginBottom: "3rem", padding: "1.5rem", background: "rgba(0, 229, 255, 0.03)", border: "1px solid var(--primary)", position: "relative", overflow: "hidden" }}>
                             <div style={{ position: "absolute", right: "-10px", top: "-10px", opacity: 0.05 }}>
                               <Cpu size={100} color="var(--primary)" />
                             </div>
                             
                             <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                               <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                  <Sparkles size={16} color="var(--primary)" />
                                  <h3 style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>SMART CASE ANALYSIS</h3>
                               </div>
                               {!aiCaseSummary && !isAnalyzingCase && (
                                 <button onClick={runCaseAnalysis} className="btn-cyan" style={{ padding: "0.5rem 1rem", fontSize: "0.55rem" }}>
                                   RUN ANALYSIS
                                 </button>
                               )}
                             </div>

                             <AnimatePresence>
                               {isAnalyzingCase && (
                                 <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                                   <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)" }}>
                                         <span>CHECKING SCHOOL HANDBOOK RULES...</span>
                                      </div>
                                      <div style={{ height: "2px", background: "var(--bg-accent)", width: "100%", overflow: "hidden" }}>
                                         <motion.div 
                                           initial={{ x: "-100%" }} 
                                           animate={{ x: "100%" }} 
                                           transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                                           style={{ width: "50%", height: "100%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }} 
                                         />
                                      </div>
                                   </div>
                                 </motion.div>
                               )}

                               {aiCaseSummary && (
                                 <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "1rem", padding: "1rem", background: "var(--bg-surface)", borderLeft: "2px solid var(--primary)" }}>
                                    <p style={{ fontSize: "0.75rem", color: "var(--text-main)", fontWeight: "600", lineHeight: "1.6" }}>{aiCaseSummary}</p>
                                 </motion.div>
                               )}
                             </AnimatePresence>
                           </div>

                           <div style={{ marginBottom: "2rem" }}>
                             <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>OFFICIAL NOTES</label>
                             <textarea 
                               required value={verdictNotes} onChange={e => setVerdictNotes(e.target.value)} 
                               placeholder="ENTER OFFICIAL SANCTION OR REASON FOR DISMISSAL..." rows={5}
                               style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} 
                             />
                           </div>
                           {isOSAS ? (
                             <div style={{ display: "flex", gap: "1rem" }}>
                               <button onClick={() => handleVerdict("Dismissed")} style={{ flex: 1, padding: "1rem", fontSize: "0.7rem", fontWeight: "900", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", cursor: "pointer" }}>
                                 DISMISS CASE
                               </button>
                               <button onClick={() => handleVerdict("Sanctioned")} className="btn-cyan" style={{ flex: 1, background: "#ef4444", border: "1px solid #ef4444" }}>
                                 APPLY SANCTION
                               </button>
                             </div>
                           ) : (
                             <div style={{ padding: "1.5rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", textAlign: "center" }}>
                                <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "#ef4444" }}>AWAITING OSAS DIRECTOR VERDICT</p>
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
