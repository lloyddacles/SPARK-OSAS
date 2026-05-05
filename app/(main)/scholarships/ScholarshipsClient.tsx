"use client";

import { useState, useEffect } from "react";
import { useGlobalState, ScholarshipProgram, BatchConfig } from "@/lib/GlobalStateContext";
import ConfirmModal from "@/components/ConfirmModal";
import ProcessGuide from "@/components/ProcessGuide";
import { generateBatchRecommendationReport } from "@/lib/utils/reportGenerator";
import {
   GraduationCap,
   Award,
   Calendar,
   Search,
   ArrowRight,
   ArrowLeft,
   CheckCircle2,
   UploadCloud,
   FileCheck,
   Send,
   Printer,
   Share2,
   MessageSquare,
   Users,
   Settings,
   HelpCircle,
   Database,
   Activity,
   Layers,
   ShieldCheck,
   ChevronRight,
   Eye,
   FileText,
   Check,
   AlertCircle,
   X,
   Sparkles,
   Cpu
} from "lucide-react";

export default function ScholarshipsClient() {
   const {
      scholarshipApps,
      submitScholarshipApp,
      recommendScholarship,
      approveBatch,
      scholarshipPrograms,
      addScholarshipProgram,
      updateScholarshipProgram,
      deleteScholarshipProgram,
      batchConfigs,
      addBatchConfig,
      updateBatchConfig,
      deleteBatchConfig,
      currentUser,
      users,
      verifyDocument,
      bulkRecommendScholarships,
      bulkApproveScholarships,
      auditLogs
   } = useGlobalState();
   const [activeTab, setActiveTab] = useState<"Student" | "OSAS">("Student");
   const [isHydrated, setIsHydrated] = useState(false);

   const isStudent = currentUser?.role === "STUDENT_APPLICANT" || currentUser?.role === "STUDENT_LEADER";
   const isStaff = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";

   const [osasView, setOsasView] = useState<"Applications" | "Programs" | "Batches">("Applications");
   const [applyingTo, setApplyingTo] = useState<ScholarshipProgram | null>(null);
   const [studentName, setStudentName] = useState("");
   const [firstName, setFirstName] = useState("");
   const [middleName, setMiddleName] = useState("");
   const [lastName, setLastName] = useState("");
   const [isVerifyingIdentity, setIsVerifyingIdentity] = useState(false);

   // AI Matchmaker State
   const [isScanning, setIsScanning] = useState(false);
   const [aiMatch, setAiMatch] = useState<ScholarshipProgram | null>(null);
   const [matchScore, setMatchScore] = useState(0);

   const { updateProfile } = useGlobalState();

   const [reqs, setReqs] = useState({ pic1x1: false, letter: false, sketch: false, cor: false, grades: false, picHouse: false });
   const [isSuccess, setIsSuccess] = useState(false);

   // OSAS View State
   const [selectedApp, setSelectedApp] = useState<string | null>(null);
   const [selectedApps, setSelectedApps] = useState<string[]>([]);
   const [recommendationLevel, setRecommendationLevel] = useState<"Partial" | "Half" | "Full">("Partial");
   const [viewBatch, setViewBatch] = useState<number>(1);

   // New Program State
   const [editingProg, setEditingProg] = useState<ScholarshipProgram | null>(null);
   const [newProgName, setNewProgName] = useState("");
   const [newProgProvider, setNewProgProvider] = useState("");
   const [newProgDesc, setNewProgDesc] = useState("");
   const [newProgDeadline, setNewProgDeadline] = useState("");

   // New Batch State
   const [editingBatch, setEditingBatch] = useState<BatchConfig | null>(null);
   const [batchName, setBatchName] = useState("");
   const [batchStart, setBatchStart] = useState("");
   const [batchEnd, setBatchEnd] = useState("");

   const [previewDoc, setPreviewDoc] = useState<{ name: string, userId: string, studentName: string } | null>(null);
   const [previewData, setPreviewData] = useState<any>(null);

   const [confirmConfig, setConfirmConfig] = useState<{
      isOpen: boolean;
      title: string;
      message: string;
      onConfirm: () => void;
      type: "danger" | "warning" | "success";
   }>({
      isOpen: false,
      title: "",
      message: "",
      onConfirm: () => { },
      type: "warning"
   });

   useEffect(() => {
      // Determine initial tab based on role
      if (currentUser) {
         if (isStaff && !isStudent) setActiveTab("OSAS");
         else setActiveTab("Student");
      }

      // Finalize hydration after tab is set
      setIsHydrated(true);
   }, [currentUser, isStaff, isStudent]);

   // Auto-fill effect
   useEffect(() => {
      if (currentUser) {
         setStudentName(currentUser.name || "");
         setFirstName(currentUser.firstName || "");
         setMiddleName(currentUser.middleName || "");
         setLastName(currentUser.lastName || "");
      }
   }, [currentUser]);

   if (!isHydrated) {
      return (
         <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Activity size={48} className="status-pulse" color="var(--primary)" />
         </div>
      );
   }

   const runAIMatchmaker = () => {
      setIsScanning(true);
      setAiMatch(null);
      // Simulate AI computing vault parameters
      setTimeout(() => {
         setIsScanning(false);
         // Pick the first active program as a demo match
         if (scholarshipPrograms.length > 0) {
            setAiMatch(scholarshipPrograms[0]);
            setMatchScore(94);
         }
      }, 2500);
   };

   // Requirement Mapping & Lock Logic
   const vaultMapping: { [key: string]: string } = {
      pic1x1: "1x1 Photo",
      letter: "Letter of Intent",
      sketch: "Sketch of House",
      cor: "ID Copy",
      grades: "Report Card",
      picHouse: "Picture of House"
   };

   const getEffectiveReqs = () => {
      const effective = { ...reqs };
      Object.entries(vaultMapping).forEach(([key, vaultName]) => {
         const doc = currentUser?.vault?.[vaultName];
         if (doc?.uploaded && doc.status === "Approved") {
            (effective as any)[key] = true;
         }
      });
      return effective;
   };

   const effectiveReqs = getEffectiveReqs();

   const handleCreateProgram = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newProgName || !newProgProvider || !newProgDesc || !newProgDeadline) return;
      addScholarshipProgram(newProgName, newProgProvider, newProgDesc, newProgDeadline);
      setNewProgName("");
      setNewProgProvider("");
      setNewProgDesc("");
      setNewProgDeadline("");
   };

   const handleUpdateProgram = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingProg) return;
      updateScholarshipProgram(editingProg.id, {
         name: newProgName,
         provider: newProgProvider,
         description: newProgDesc,
         deadline: newProgDeadline
      });
      setEditingProg(null);
      setNewProgName("");
      setNewProgProvider("");
      setNewProgDesc("");
      setNewProgDeadline("");
   };

   const startEdit = (prog: ScholarshipProgram) => {
      setEditingProg(prog);
      setNewProgName(prog.name);
      setNewProgProvider(prog.provider);
      setNewProgDesc(prog.description);
      setNewProgDeadline(prog.deadline);
   };

   const handleCreateBatch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!batchName || !batchStart || !batchEnd) return;
      addBatchConfig(batchName, batchStart, batchEnd);
      setBatchName("");
      setBatchStart("");
      setBatchEnd("");
   };

   const handleUpdateBatch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingBatch) return;
      updateBatchConfig(editingBatch.id, {
         name: batchName,
         startDate: batchStart,
         endDate: batchEnd
      });
      setEditingBatch(null);
      setBatchName("");
      setBatchStart("");
      setBatchEnd("");
   };

   const startEditBatch = (batch: BatchConfig) => {
      setEditingBatch(batch);
      setBatchName(batch.name);
      setBatchStart(batch.startDate);
      setBatchEnd(batch.endDate);
   };

   const handleApply = (e: React.FormEvent) => {
      e.preventDefault();

      // Check if name components exist
      if (!currentUser?.firstName || !currentUser?.lastName) {
         setIsVerifyingIdentity(true);
         return;
      }

      if (applyingTo) {
         submitScholarshipApp(applyingTo.id, studentName || currentUser?.name || "Current Student", effectiveReqs);
      }
      setIsSuccess(true);
      setTimeout(() => {
         setIsSuccess(false);
         setApplyingTo(null);
      }, 2000);
   };

   const handleCommitIdentity = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!firstName || !lastName) return;

      await updateProfile({ firstName, middleName, lastName });
      setIsVerifyingIdentity(false);

      // Automatically proceed with application
      if (applyingTo) {
         submitScholarshipApp(applyingTo.id, `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`, effectiveReqs);
      }
      setIsSuccess(true);
      setTimeout(() => {
         setIsSuccess(false);
         setApplyingTo(null);
      }, 2000);
   };

   const handleRecommend = () => {
      if (!selectedApp) return;
      const appDate = scholarshipApps.find(a => a.id === selectedApp)?.dateApplied;
      const matchingBatch = batchConfigs.find(b => b.startDate && b.endDate && appDate && appDate >= b.startDate && appDate <= b.endDate);

      if (matchingBatch) {
         setConfirmConfig({
            isOpen: true,
            title: "Submit Recommendation",
            message: `Are you sure you want to recommend this student for a ${recommendationLevel} scholarship?`,
            type: "success",
            onConfirm: () => {
               recommendScholarship(selectedApp, recommendationLevel, matchingBatch.id);
               setSelectedApp(null);
            }
         });
      } else {
         alert("Error: The application date doesn't match the current batch dates.");
         return;
      }
   };

   const handleBulkRecommend = () => {
      if (selectedApps.length === 0) return;
      const matchingBatch = batchConfigs.find(b => b.status === "Active");
      if (!matchingBatch) {
         alert("Please activate a batch before bulk recommending.");
         return;
      }

      setConfirmConfig({
         isOpen: true,
         title: "Bulk Recommendation",
         message: `Recommend ${selectedApps.length} students for a ${recommendationLevel} scholarship in ${matchingBatch.name}?`,
         type: "success",
         onConfirm: async () => {
            await bulkRecommendScholarships(selectedApps, recommendationLevel, matchingBatch.id);
            setSelectedApps([]);
         }
      });
   };

   const handleBulkApprove = () => {
      if (selectedApps.length === 0) return;
      setConfirmConfig({
         isOpen: true,
         title: "Bulk Approval",
         message: `Finalize and approve ${selectedApps.length} scholarship applications?`,
         type: "success",
         onConfirm: async () => {
            await bulkApproveScholarships(selectedApps);
            setSelectedApps([]);
         }
      });
   };

   const handlePrintBatch = () => {
      const batchApps = scholarshipApps.filter(s => s.batchId === viewBatch && s.status === "Recommended");
      if (batchApps.length === 0) {
         alert("No recommended students found in this batch to generate a report.");
         return;
      }
      generateBatchRecommendationReport(viewBatch, batchApps);
   };

   return (
      <div style={{ width: "100%" }}>
         {/* Sapphire Header */}
         <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
               <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>SCHOLARSHIP PORTAL</p>
               <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
                  SCHOLAR <span style={{ color: "var(--primary)" }}>SHIPS</span>
               </h1>
            </div>
            <div style={{ display: "flex", gap: "1px", background: "var(--border-dim)", padding: "1px" }}>
               <button onClick={() => setActiveTab("Student")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.65rem", fontWeight: "900", background: activeTab === "Student" ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", color: activeTab === "Student" ? "var(--primary)" : "var(--text-dim)", border: "none", borderBottom: activeTab === "Student" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>
                  STUDENT PORTAL
               </button>
               {isStaff && (
                  <button onClick={() => setActiveTab("OSAS")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.65rem", fontWeight: "900", background: activeTab === "OSAS" ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", color: activeTab === "OSAS" ? "var(--primary)" : "var(--text-dim)", border: "none", borderBottom: activeTab === "OSAS" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>
                     OSAS ADMIN
                  </button>
               )}
            </div>
         </div>

         {activeTab === "Student" && (
            <div key="student">
               {!applyingTo ? (
                  <div>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                           <Database size={18} color="var(--primary)" /> AVAILABLE SCHOLARSHIPS
                        </h2>
                     </div>

                     <ProcessGuide
                        title="How to Apply for Scholarships"
                        steps={[
                           { title: "Review Eligibility", desc: "Browse available scholarship programs below and click 'APPLY NOW' on the one you qualify for.", icon: <Search size={14} color="var(--text-main)" /> },
                           { title: "Complete Digital Vault", desc: "Ensure your Student Identity Vault has all required documents uploaded and verified by OSAS.", icon: <UploadCloud size={14} color="var(--text-main)" /> },
                           { title: "Submit Application", desc: "Fill in any final requirements and submit. Track your status directly on your dashboard.", icon: <Send size={14} color="var(--text-main)" /> }
                        ]}
                        themeColor="var(--primary)"
                     />

                     {/* AI MATCHMAKER ENGINE */}
                     <div data-tour="ai-matchmaker" style={{ marginBottom: "3rem", padding: "2rem", background: "rgba(0, 229, 255, 0.03)", border: "1px solid var(--primary)", position: "relative", overflow: "hidden" }}>
                        <div style={{ position: "absolute", right: "-20px", top: "-20px", opacity: 0.1 }}>
                           <Cpu size={150} color="var(--primary)" />
                        </div>

                        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                 <Sparkles size={16} color="var(--primary)" />
                                 <h3 style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>SMART SCHOLARSHIP MATCHER</h3>
                              </div>
                              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: "600", maxWidth: "500px", lineHeight: "1.6" }}>
                                 We instantly scan your uploaded documents, grades, and profile to automatically find the exact scholarship you are most likely to win.
                              </p>
                           </div>
                           {!aiMatch && !isScanning && (
                              <button onClick={runAIMatchmaker} className="btn-cyan" style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                 <Sparkles size={16} /> SCAN MY PROFILE
                              </button>
                           )}
                        </div>


                        {isScanning && (
                           <div style={{ marginTop: "2rem" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)" }}>
                                    <span>CHECKING YOUR DOCUMENTS...</span>
                                    <span>PROCESSING</span>
                                 </div>
                                 <div style={{ height: "2px", background: "var(--bg-accent)", width: "100%", overflow: "hidden" }}>
                                    <div
                                       style={{ width: "50%", height: "100%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }}
                                    />
                                 </div>
                              </div>
                           </div>
                        )}

                        {aiMatch && (
                           <div style={{ marginTop: "2rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center", background: "var(--bg-surface)", padding: "1.5rem", borderLeft: "4px solid var(--primary)" }}>
                              <div>
                                 <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "#10b981", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{matchScore}% BEST SCHOLARSHIP FOUND</p>
                                 <h4 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "0.5rem" }}>{aiMatch.name.toUpperCase()}</h4>
                                 <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: "600" }}>Based on your grades and uploaded requirements, you are a perfect fit for this scholarship.</p>
                              </div>
                              <button onClick={() => setApplyingTo(aiMatch)} className="btn-cyan" style={{ padding: "0.75rem 2rem", height: "fit-content" }}>
                                 APPLY IMMEDIATELY
                              </button>
                           </div>
                        )}
                     </div>

                     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
                        {scholarshipPrograms.map(prog => (
                           <div key={prog.id} className="sapphire-card" style={{ display: "flex", flexDirection: "column" }}>
                              <div style={{ marginBottom: "2rem" }}>
                                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>PROVIDER: {prog.provider.toUpperCase()}</p>
                                 <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "var(--text-main)" }}>{prog.name.toUpperCase()}</h3>
                              </div>
                              <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.6", marginBottom: "2.5rem" }}>{prog.description}</p>
                              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--text-dim)" }}>
                                    <Calendar size={12} /> <span style={{ fontSize: "0.6rem", fontWeight: "900" }}>EXP: {prog.deadline}</span>
                                 </div>
                                 <button onClick={() => setApplyingTo(prog)} className="btn-cyan" style={{ padding: "0.5rem 1.25rem", fontSize: "0.65rem" }}>
                                    APPLY NOW
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <div style={{ opacity: 1, transform: "none" }}>
                     <button onClick={() => setApplyingTo(null)} style={{ color: "var(--text-dim)", background: "none", border: "none", marginBottom: "2rem", fontWeight: "900", fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                        <ArrowLeft size={14} /> GO BACK
                     </button>

                     {isSuccess ? (
                        <div className="sapphire-card" style={{ padding: "6rem", textAlign: "center" }}>
                           <CheckCircle2 size={64} color="#10b981" style={{ margin: "0 auto 2.5rem" }} />
                           <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)" }}>APPLICATION SENT</h2>
                           <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontWeight: "700", marginTop: "1.5rem", maxWidth: "600px", margin: "1.5rem auto 0", lineHeight: "1.8" }}>
                              We have received your application. We will review it soon.
                           </p>
                        </div>
                     ) : (
                        <div className="sapphire-card" style={{ padding: "4rem" }}>
                           <div style={{ marginBottom: "3.5rem" }}>
                              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>APPLICATION FORM</p>
                              <h2 style={{ fontSize: "1.5rem", fontWeight: "900" }}>{applyingTo.name.toUpperCase()}</h2>
                           </div>

                           <form onSubmit={handleApply} style={{ display: "grid", gap: "2.5rem" }}>
                              <div>
                                 <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>APPLICANT IDENTITY</label>
                                 <input required value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="ENTER YOUR FULL NAME..." style={{ width: "100%", padding: "1rem", fontSize: "0.85rem", fontWeight: "700" }} />
                              </div>

                              <div>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
                                    <label style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>DOCUMENT STATUS</label>
                                    <p data-tour="vault-info" style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)" }}>VERIFIED FROM YOUR VAULT</p>
                                 </div>
                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border-dim)" }}>
                                    {Object.entries(vaultMapping).map(([key, label]) => (
                                       <div key={key} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "var(--bg-surface)" }}>
                                          {(effectiveReqs as any)[key] ? <CheckCircle2 size={16} color="#10b981" /> : <div style={{ width: "16px", height: "16px", border: "1px solid var(--border-dim)" }} />}
                                          <span style={{ fontWeight: "700", fontSize: "0.75rem", color: (effectiveReqs as any)[key] ? "var(--text-main)" : "var(--text-dim)" }}>{label.toUpperCase()}</span>
                                       </div>
                                    ))}
                                 </div>
                              </div>

                              <button type="submit" className="btn-cyan" style={{ width: "100%", padding: "1.25rem" }}>
                                 <UploadCloud size={18} /> SUBMIT APPLICATION
                              </button>
                           </form>
                        </div>
                     )}
                  </div>
               )}
            </div>
         )}

         {activeTab === "OSAS" && (
            <div key="osas">
               {/* OSAS SUB NAV */}
               <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", borderBottom: "1px solid var(--border-dim)" }}>
                  {[
                     { id: "Applications", label: "REVIEW APPLICATIONS" },
                     { id: "Programs", label: "MANAGE PROGRAMS" },
                     { id: "Batches", label: "MANAGE BATCHES" }
                  ].map(v => (
                     <button
                        key={v.id}
                        onClick={() => setOsasView(v.id as any)}
                        style={{ padding: "1rem 0", background: "none", border: "none", borderBottom: osasView === v.id ? "2px solid var(--primary)" : "2px solid transparent", color: osasView === v.id ? "var(--primary)" : "var(--text-dim)", fontSize: "0.75rem", fontWeight: "900", cursor: "pointer", transition: "all 0.2s" }}
                     >
                        {v.label}
                     </button>
                  ))}
               </div>

               {osasView === "Applications" && (
                  <div style={{ width: "100%" }}>
                     {/* TIMELINE_PROTOCOL */}
                     <div className="sapphire-card" style={{ marginBottom: "3rem", borderLeft: "4px solid var(--primary)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                           <Activity size={20} color="var(--primary)" />
                           <h3 style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "0.1em" }}>CURRENT BATCHES</h3>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1px", background: "var(--border-dim)" }}>
                           {batchConfigs.map((b) => (
                              <div key={b.id} style={{ background: "var(--bg-surface)", padding: "1.5rem" }}>
                                 <div style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.75rem" }}>BATCH 0{b.id}</div>
                                 <p style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "0.5rem" }}>{(b.status || "Inactive").toUpperCase()}</p>
                                 <p style={{ fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "700" }}>{b.startDate} → {b.endDate}</p>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "3rem", alignItems: "start" }}>
                        {/* APPLICATION QUEUE */}
                        <div>
                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                                 <h2 style={{ fontSize: "0.85rem", fontWeight: "900" }}>APPLICATIONS TO REVIEW</h2>
                                 {selectedApps.length > 0 && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.5rem 1rem", background: "var(--primary)", color: "var(--bg-deep)", borderRadius: "4px", fontSize: "0.65rem", fontWeight: "900" }}>
                                       {selectedApps.length} SELECTED
                                       <button onClick={() => setSelectedApps([])} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", fontWeight: "900" }}>✕</button>
                                    </div>
                                 )}
                              </div>
                              <div style={{ display: "flex", gap: "1rem" }}>
                                 <select value={viewBatch} onChange={e => setViewBatch(Number(e.target.value))} style={{ padding: "0.5rem", fontSize: "0.65rem", fontWeight: "900", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}>
                                    {batchConfigs.map(b => (
                                       <option key={b.id} value={b.id}>BATCH {b.id}</option>
                                    ))}
                                 </select>
                              </div>
                           </div>

                           <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                              {scholarshipApps.filter(s => s.batchId === viewBatch).map(app => (
                                 <div
                                    key={app.id}
                                    style={{
                                       display: "grid",
                                       gridTemplateColumns: "auto 1fr",
                                       alignItems: "center",
                                       gap: "1.5rem",
                                       padding: "1.5rem 2rem",
                                       background: selectedApp === app.id ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)",
                                       cursor: "pointer",
                                       borderLeft: selectedApp === app.id ? "2px solid var(--primary)" : "2px solid transparent",
                                       transition: "all 0.2s"
                                    }}
                                 >
                                    <input
                                       type="checkbox"
                                       checked={selectedApps.includes(app.id)}
                                       onChange={(e) => {
                                          e.stopPropagation();
                                          setSelectedApps(prev => e.target.checked ? [...prev, app.id] : prev.filter(id => id !== app.id));
                                       }}
                                       style={{ width: "16px", height: "16px", cursor: "pointer" }}
                                    />
                                    <div onClick={() => setSelectedApp(app.id)}>
                                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                          <div>
                                             <h4 style={{ fontWeight: "900", fontSize: "0.9rem", color: "var(--text-main)" }}>{app.studentName.toUpperCase()}</h4>
                                             <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", marginTop: "0.25rem" }}>STAMPED: {app.dateApplied}</p>
                                          </div>
                                          <div style={{ textAlign: "right" }}>
                                             <span style={{ fontSize: "0.6rem", fontWeight: "900", padding: "0.4rem 1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: app.status === "Recommended" ? "#10b981" : "#f59e0b" }}>
                                                {app.status.toUpperCase()}
                                             </span>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* ACTION PANEL */}
                        <div>
                           {selectedApp ? (
                              <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)" }}>
                                 <div style={{ marginBottom: "2.5rem" }}>
                                    <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>DOCUMENT INSPECTION</label>
                                    <div style={{ display: "grid", gap: "0.5rem" }}>
                                       {(() => {
                                          const app = scholarshipApps.find(a => a.id === selectedApp);
                                          const student = users.find(u => u.name === app?.studentName);
                                          return Object.entries(vaultMapping).map(([key, label]) => {
                                             const doc = student?.vault?.[label];
                                             return (
                                                <div key={key} style={{
                                                   padding: "1rem",
                                                   background: "var(--bg-accent)",
                                                   border: "1px solid var(--border-dim)",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   justifyContent: "space-between"
                                                }}>
                                                   <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                      <FileText size={16} color={doc?.uploaded ? "var(--primary)" : "var(--text-dim)"} />
                                                      <span style={{ fontSize: "0.6rem", fontWeight: "900", color: doc?.uploaded ? "var(--text-main)" : "var(--text-dim)" }}>{label.toUpperCase()}</span>
                                                   </div>
                                                   {doc?.uploaded ? (
                                                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                         <span style={{ fontSize: "0.5rem", fontWeight: "900", color: doc.status === "Approved" ? "#10b981" : doc.status === "Rejected" ? "#ef4444" : "#f59e0b" }}>
                                                            {(doc.status || "PENDING").toUpperCase()}
                                                         </span>
                                                         <button
                                                            onClick={() => {
                                                               setPreviewDoc({ name: label, userId: student?.id || "", studentName: student?.name || "" });
                                                               setPreviewData(doc);
                                                            }}
                                                            style={{ padding: "0.4rem", background: "var(--primary)", border: "none", color: "var(--text-dark)", cursor: "pointer", display: "flex", alignItems: "center" }}
                                                         >
                                                            <Eye size={12} />
                                                         </button>
                                                      </div>
                                                   ) : (
                                                      <span style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>MISSING</span>
                                                   )}
                                                </div>
                                             );
                                          });
                                       })()}
                                    </div>
                                 </div>

                                 <button onClick={handleRecommend} className="btn-cyan" style={{ width: "100%", padding: "1rem" }}>
                                    SUBMIT FINAL DECISION
                                 </button>
                              </div>
                           ) : (
                              <div className="sapphire-card" style={{ textAlign: "center", padding: "4rem", color: "var(--text-dim)" }}>
                                 <ShieldCheck size={40} style={{ margin: "0 auto 1.5rem", opacity: 0.1 }} />
                                 <p style={{ fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.1em" }}>SELECT A STUDENT TO REVIEW</p>
                              </div>
                           )}

                           {selectedApps.length > 0 && (
                              <div style={{ marginTop: "2rem" }}>
                                 <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)", background: "rgba(0, 229, 255, 0.02)" }}>
                                    <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "1.5rem" }}>BATCH COMMAND CENTER</h3>
                                    <div style={{ display: "grid", gap: "1rem" }}>
                                       <div style={{ display: "flex", gap: "1rem" }}>
                                          <select
                                             value={recommendationLevel}
                                             onChange={e => setRecommendationLevel(e.target.value as any)}
                                             style={{ flex: 1, padding: "0.75rem", fontSize: "0.65rem", fontWeight: "900", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}
                                          >
                                             <option value="Partial">PARTIAL SCHOLAR</option>
                                             <option value="Half">HALF SCHOLAR</option>
                                             <option value="Full">FULL SCHOLAR</option>
                                          </select>
                                          <button onClick={handleBulkRecommend} className="btn-cyan" style={{ flex: 1.5, padding: "0.75rem", fontSize: "0.65rem" }}>RECOMMEND SELECTED</button>
                                       </div>
                                       <button onClick={handleBulkApprove} style={{ width: "100%", padding: "1rem", background: "#10b981", color: "white", border: "none", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>FINAL APPROVAL FOR SELECTED</button>
                                    </div>
                                 </div>
                              </div>
                           )}

                           <div style={{ marginTop: "2rem" }}>
                              <div className="sapphire-card">
                                 <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem" }}>BATCH OPTIONS</h3>
                                 <button onClick={handlePrintBatch} style={{ width: "100%", padding: "1rem", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", marginBottom: "1rem" }}>
                                    <Printer size={14} color="var(--primary)" /> PRINT LIST
                                 </button>
                                 <button style={{ width: "100%", padding: "1rem", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                                    <Settings size={14} color="var(--primary)" /> EDIT DATES
                                 </button>
                              </div>
                           </div>

                           <div style={{ marginTop: "2rem" }}>
                              <div className="sapphire-card">
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                                    <h3 style={{ fontSize: "0.75rem", fontWeight: "900" }}>SCHOLARSHIP AUDIT LOG</h3>
                                    <Activity size={14} color="var(--primary)" />
                                 </div>
                                 <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxHeight: "300px", overflowY: "auto", paddingRight: "0.5rem" }}>
                                    {auditLogs.filter(l => l.action.includes("SCHOLARSHIP")).map(log => (
                                       <div key={log.id} style={{ padding: "1rem", background: "var(--bg-accent)", borderLeft: `2px solid ${log.severity === "HIGH" ? "#ef4444" : "var(--primary)"}` }}>
                                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                             <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)" }}>{log.action}</span>
                                             <span style={{ fontSize: "0.5rem", color: "var(--text-dim)" }}>{log.timestamp}</span>
                                          </div>
                                          <p style={{ fontSize: "0.65rem", fontWeight: "700", color: "var(--text-main)" }}>{log.details}</p>
                                          <p style={{ fontSize: "0.5rem", color: "var(--text-dim)", marginTop: "0.4rem" }}>ADMIN: {log.user} ({log.role})</p>
                                       </div>
                                    ))}
                                    {auditLogs.filter(l => l.action.includes("SCHOLARSHIP")).length === 0 && (
                                       <p style={{ fontSize: "0.6rem", color: "var(--text-dim)", textAlign: "center", padding: "2rem" }}>NO RECENT ACTIONS RECORDED</p>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {osasView === "Programs" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem" }}>
                     <div>
                        <h2 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem" }}>OFFICIAL PROGRAMS</h2>
                        <div style={{ display: "grid", gap: "1.5rem" }}>
                           {scholarshipPrograms.map(prog => (
                              <div key={prog.id} className="sapphire-card" style={{ borderLeft: prog.status === "Archived" ? "4px solid var(--text-dim)" : "4px solid var(--primary)" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                    <div>
                                       <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.4rem" }}>{prog.provider.toUpperCase()}</p>
                                       <h3 style={{ fontSize: "1rem", fontWeight: "900", color: prog.status === "Archived" ? "var(--text-dim)" : "var(--text-main)" }}>{prog.name.toUpperCase()}</h3>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                       <button onClick={() => startEdit(prog)} style={{ padding: "0.4rem", background: "var(--bg-accent)", border: "none", color: "var(--primary)", cursor: "pointer" }}><Settings size={14} /></button>
                                       <button onClick={() => setConfirmConfig({
                                          isOpen: true,
                                          title: "Delete Program",
                                          message: `Are you sure you want to permanently delete the ${prog.name} scholarship program?`,
                                          type: "danger",
                                          onConfirm: () => deleteScholarshipProgram(prog.id)
                                       })} style={{ padding: "0.4rem", background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", cursor: "pointer" }}><X size={14} /></button>
                                    </div>
                                 </div>
                                 <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: "600", marginBottom: "1.5rem", lineHeight: "1.6" }}>{prog.description}</p>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>DEADLINE: {prog.deadline}</span>
                                    <button
                                       onClick={() => updateScholarshipProgram(prog.id, { status: prog.status === "Active" ? "Archived" : "Active" })}
                                       style={{ background: "none", border: "1px solid var(--border-dim)", padding: "0.4rem 1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", cursor: "pointer" }}
                                    >
                                       {prog.status === "Active" ? "ARCHIVE" : "RESTORE"}
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)", position: "sticky", top: "2rem" }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem" }}>{editingProg ? "EDIT PROGRAM" : "NEW PROGRAM"}</h3>
                        <form onSubmit={editingProg ? handleUpdateProgram : handleCreateProgram} style={{ display: "grid", gap: "1.5rem" }}>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>PROGRAM NAME</label>
                              <input required value={newProgName} onChange={e => setNewProgName(e.target.value)} style={{ width: "100%", padding: "0.85rem", fontSize: "0.75rem", fontWeight: "700" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>PROVIDER</label>
                              <input required value={newProgProvider} onChange={e => setNewProgProvider(e.target.value)} style={{ width: "100%", padding: "0.85rem", fontSize: "0.75rem", fontWeight: "700" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>DESCRIPTION</label>
                              <textarea required value={newProgDesc} onChange={e => setNewProgDesc(e.target.value)} rows={4} style={{ width: "100%", padding: "0.85rem", fontSize: "0.75rem", fontWeight: "700" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>DEADLINE</label>
                              <input type="date" required value={newProgDeadline} onChange={e => setNewProgDeadline(e.target.value)} style={{ width: "100%", padding: "0.85rem", fontSize: "0.75rem", fontWeight: "700" }} />
                           </div>
                           <div style={{ display: "flex", gap: "1rem" }}>
                              {editingProg && (
                                 <button type="button" onClick={() => setEditingProg(null)} style={{ flex: 1, padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900" }}>CANCEL</button>
                              )}
                              <button type="submit" className="btn-cyan" style={{ flex: 2, padding: "1rem" }}>{editingProg ? "UPDATE PROGRAM" : "CREATE PROGRAM"}</button>
                           </div>
                        </form>
                     </div>
                  </div>
               )}

               {osasView === "Batches" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem" }}>
                     <div>
                        <h2 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem" }}>SCHEDULING BATCHES</h2>
                        <div style={{ display: "grid", gap: "1.5rem" }}>
                           {batchConfigs.map(batch => (
                              <div key={batch.id} className="sapphire-card" style={{ borderLeft: batch.status === "Archived" ? "4px solid var(--text-dim)" : "4px solid var(--primary)" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                    <div>
                                       <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.4rem" }}>BATCH ID: {batch.id}</p>
                                       <h3 style={{ fontSize: "1rem", fontWeight: "900", color: batch.status === "Archived" ? "var(--text-dim)" : "var(--text-main)" }}>{batch.name.toUpperCase()}</h3>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                       <button onClick={() => startEditBatch(batch)} style={{ padding: "0.4rem", background: "var(--bg-accent)", border: "none", color: "var(--primary)", cursor: "pointer" }}><Settings size={14} /></button>
                                       <button onClick={() => setConfirmConfig({
                                          isOpen: true,
                                          title: "Delete Batch",
                                          message: `Are you sure you want to permanently delete ${batch.name}? This will affect scholarship scheduling.`,
                                          type: "danger",
                                          onConfirm: () => deleteBatchConfig(batch.id)
                                       })} style={{ padding: "0.4rem", background: "rgba(239, 68, 68, 0.1)", border: "none", color: "#ef4444", cursor: "pointer" }}><X size={14} /></button>
                                    </div>
                                 </div>
                                 <div style={{ display: "flex", gap: "2rem", marginBottom: "1.5rem" }}>
                                    <div>
                                       <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.25rem" }}>START DATE</p>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>{batch.startDate || "NOT SET"}</p>
                                    </div>
                                    <div>
                                       <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.25rem" }}>END DATE</p>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "700" }}>{batch.endDate || "NOT SET"}</p>
                                    </div>
                                 </div>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.6rem", fontWeight: "900", color: batch.status === "Active" ? "#10b981" : "var(--text-dim)" }}>
                                       STATUS: {batch.status.toUpperCase()}
                                    </span>
                                    <div style={{ display: "flex", gap: "0.75rem" }}>
                                       {batch.status !== "Active" && (
                                          <button
                                             onClick={() => updateBatchConfig(batch.id, { status: "Active" })}
                                             style={{ background: "none", border: "1px solid var(--primary)", padding: "0.4rem 1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", cursor: "pointer" }}
                                          >
                                             ACTIVATE
                                          </button>
                                       )}
                                       <button
                                          onClick={() => updateBatchConfig(batch.id, { status: batch.status === "Archived" ? "Inactive" : "Archived" })}
                                          style={{ background: "none", border: "1px solid var(--border-dim)", padding: "0.4rem 1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", cursor: "pointer" }}
                                       >
                                          {batch.status === "Archived" ? "RESTORE" : "ARCHIVE"}
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)", position: "sticky", top: "2rem" }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem" }}>{editingBatch ? "EDIT BATCH" : "NEW BATCH"}</h3>
                        <form onSubmit={editingBatch ? handleUpdateBatch : handleCreateBatch} style={{ display: "grid", gap: "1.5rem" }}>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>BATCH NAME</label>
                              <input required value={batchName} onChange={e => setBatchName(e.target.value)} placeholder="E.G. BATCH 2" style={{ width: "100%", padding: "0.85rem", fontSize: "0.75rem", fontWeight: "700" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>START DATE</label>
                              <input type="date" required value={batchStart} onChange={e => setBatchStart(e.target.value)} style={{ width: "100%", padding: "0.85rem", fontSize: "0.75rem", fontWeight: "700" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>END DATE</label>
                              <input type="date" required value={batchEnd} onChange={e => setBatchEnd(e.target.value)} style={{ width: "100%", padding: "0.85rem", fontSize: "0.75rem", fontWeight: "700" }} />
                           </div>
                           <div style={{ display: "flex", gap: "1rem" }}>
                              {editingBatch && (
                                 <button type="button" onClick={() => setEditingBatch(null)} style={{ flex: 1, padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900" }}>CANCEL</button>
                              )}
                              <button type="submit" className="btn-cyan" style={{ flex: 2, padding: "1rem" }}>{editingBatch ? "UPDATE BATCH" : "CREATE BATCH"}</button>
                           </div>
                        </form>
                     </div>
                  </div>
               )}
            </div>
         )}

         <ConfirmModal
            isOpen={confirmConfig.isOpen}
            onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
            onConfirm={confirmConfig.onConfirm}
            title={confirmConfig.title}
            message={confirmConfig.message}
            type={confirmConfig.type as any}
         />

         {/* Digital Vault Previewer Modal */}
         {previewDoc && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backdropFilter: "blur(10px)" }}>
               <div style={{ width: "100%", maxWidth: "1000px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", display: "grid", gridTemplateColumns: "1fr 300px", height: "80vh", overflow: "hidden" }}>
                  <div style={{ background: "#000", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                     <div style={{ textAlign: "center" }}>
                        <div style={{ width: "400px", height: "560px", background: "white", boxShadow: "0 20px 50px rgba(0,0,0,0.5)", position: "relative", padding: "3rem" }}>
                           <div style={{ width: "100%", height: "100%", border: "2px solid #eee", display: "flex", flexDirection: "column", padding: "2rem", textAlign: "left" }}>
                              <div style={{ borderBottom: "2px solid #333", paddingBottom: "1rem", marginBottom: "2rem" }}>
                                 <h4 style={{ color: "#333", fontSize: "1rem", fontWeight: "900", marginBottom: "0.25rem" }}>OFFICIAL DOCUMENT</h4>
                                 <p style={{ color: "#666", fontSize: "0.6rem", fontWeight: "700" }}>UNIVERSITY OF THE PHILIPPINES • SPARK OSAS</p>
                              </div>
                              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
                                 <div style={{ width: "100%", height: "10px", background: "#f0f0f0" }} />
                                 <div style={{ width: "80%", height: "10px", background: "#f0f0f0" }} />
                                 <div style={{ width: "100%", height: "150px", background: "#f9f9f9", border: "1px solid #eee", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <FileText size={40} color="#ccc" />
                                 </div>
                              </div>
                              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                                 <div>
                                    <p style={{ color: "#333", fontSize: "0.5rem", fontWeight: "900" }}>STUDENT NAME</p>
                                    <p style={{ color: "#333", fontSize: "0.7rem", fontWeight: "900" }}>{previewDoc.studentName.toUpperCase()}</p>
                                 </div>
                                 <div style={{ width: "60px", height: "60px", background: "#f0f0f0", borderRadius: "50%" }} />
                              </div>
                           </div>
                           <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "var(--primary)", color: "var(--bg-deep)", padding: "0.5rem", fontSize: "0.5rem", fontWeight: "900", letterSpacing: "0.1em" }}>
                              {previewDoc.name.toUpperCase()}
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setPreviewDoc(null)} style={{ position: "absolute", top: "2rem", right: "2rem", background: "rgba(255,255,255,0.1)", border: "none", color: "white", padding: "1rem", cursor: "pointer", borderRadius: "50%" }}>
                        <X size={20} />
                     </button>
                  </div>
                  <div style={{ padding: "2.5rem", display: "flex", flexDirection: "column", borderLeft: "1px solid var(--border-dim)" }}>
                     <div style={{ marginBottom: "3rem" }}>
                        <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>DOCUMENT METADATA</p>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "900", marginBottom: "0.5rem" }}>{previewDoc.name}</h3>
                        <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700" }}>Submitted by {previewDoc.studentName}</p>
                     </div>
                     <div style={{ marginTop: "auto", display: "grid", gap: "1rem" }}>
                        <button onClick={async () => { await verifyDocument(previewDoc.userId, previewDoc.name, "Approved", "Approved by OSAS."); setPreviewDoc(null); }} style={{ width: "100%", padding: "1.25rem", background: "#10b981", color: "white", border: "none", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>APPROVE</button>
                        <button onClick={async () => { const r = prompt("Reason:"); if (r) { await verifyDocument(previewDoc.userId, previewDoc.name, "Rejected", r); setPreviewDoc(null); } }} style={{ width: "100%", padding: "1.25rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid #ef4444", color: "#ef4444", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>REJECT</button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* Identity Verification Terminal Modal */}
         {isVerifyingIdentity && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <div style={{ width: "100%", maxWidth: "550px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", padding: "3.5rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "var(--primary)" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
                     <div>
                        <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>IDENTITY PROTOCOL</p>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "900" }}>VERIFY IDENTITY</h3>
                     </div>
                     <button onClick={() => setIsVerifyingIdentity(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><X size={20} /></button>
                  </div>
                  <form onSubmit={handleCommitIdentity} style={{ display: "grid", gap: "2rem" }}>
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div>
                           <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>FIRST NAME</label>
                           <input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="E.G. JUAN" style={{ width: "100%", padding: "1rem", fontSize: "0.85rem", fontWeight: "700" }} />
                        </div>
                        <div>
                           <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>MIDDLE NAME</label>
                           <input value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="E.G. SANTOS" style={{ width: "100%", padding: "1rem", fontSize: "0.85rem", fontWeight: "700" }} />
                        </div>
                     </div>
                     <div>
                        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>LAST NAME</label>
                        <input required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="E.G. DELA CRUZ" style={{ width: "100%", padding: "1rem", fontSize: "0.85rem", fontWeight: "700" }} />
                     </div>
                     <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                        <button type="button" onClick={() => setIsVerifyingIdentity(false)} style={{ flex: 1, padding: "1.1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>CANCEL</button>
                        <button type="submit" className="btn-cyan" style={{ flex: 2, padding: "1.1rem" }}>VERIFY & CONTINUE</button>
                     </div>
                  </form>
               </div>
            </div>
         )}
      </div>
   );
}
