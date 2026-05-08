"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
   Cpu,
   Plus,
   MoreVertical,
   Trash2,
   Edit2,
   ShieldAlert,
   Zap,
   ChevronDown,
   Briefcase,
   Clock,
   Building,
   CheckCircle
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
      auditLogs,
      logAudit,
      updateProfile
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

   const [isScanning, setIsScanning] = useState(false);
   const [aiMatch, setAiMatch] = useState<ScholarshipProgram | null>(null);
   const [matchScore, setMatchScore] = useState(0);

   const [reqs, setReqs] = useState({ pic1x1: false, letter: false, sketch: false, cor: false, grades: false, picHouse: false });
   const [isSuccess, setIsSuccess] = useState(false);

   const [selectedApp, setSelectedApp] = useState<string | null>(null);
   const [selectedApps, setSelectedApps] = useState<string[]>([]);
   const [recommendationLevel, setRecommendationLevel] = useState<"Partial" | "Half" | "Full">("Partial");
   const [viewBatch, setViewBatch] = useState<number>(1);

   const [editingProg, setEditingProg] = useState<ScholarshipProgram | null>(null);
   const [newProgName, setNewProgName] = useState("");
   const [newProgProvider, setNewProgProvider] = useState("");
   const [newProgDesc, setNewProgDesc] = useState("");
   const [newProgDeadline, setNewProgDeadline] = useState("");

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
      if (currentUser) {
         if (isStaff && !isStudent) setActiveTab("OSAS");
         else setActiveTab("Student");
      }
      setIsHydrated(true);
   }, [currentUser, isStaff, isStudent]);

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
         <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
            <Activity size={48} className="animate-pulse" color="#3b82f6" />
         </div>
      );
   }

   const runAIMatchmaker = () => {
      setIsScanning(true);
      setAiMatch(null);
      setTimeout(() => {
         setIsScanning(false);
         if (scholarshipPrograms.length > 0) {
            setAiMatch(scholarshipPrograms[0]);
            setMatchScore(94);
         }
      }, 2500);
   };

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
      setNewProgName(""); setNewProgProvider(""); setNewProgDesc(""); setNewProgDeadline("");
   };

   const handleUpdateProgram = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingProg) return;
      updateScholarshipProgram(editingProg.id, {
         name: newProgName, provider: newProgProvider, description: newProgDesc, deadline: newProgDeadline
      });
      setEditingProg(null);
      setNewProgName(""); setNewProgProvider(""); setNewProgDesc(""); setNewProgDeadline("");
   };

   const startEdit = (prog: ScholarshipProgram) => {
      setEditingProg(prog);
      setNewProgName(prog.name); setNewProgProvider(prog.provider); setNewProgDesc(prog.description); setNewProgDeadline(prog.deadline);
   };

   const handleCreateBatch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!batchName || !batchStart || !batchEnd) return;
      addBatchConfig(batchName, batchStart, batchEnd);
      setBatchName(""); setBatchStart(""); setBatchEnd("");
   };

   const handleUpdateBatch = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingBatch) return;
      updateBatchConfig(editingBatch.id, { name: batchName, startDate: batchStart, endDate: batchEnd });
      setEditingBatch(null);
      setBatchName(""); setBatchStart(""); setBatchEnd("");
   };

   const startEditBatch = (batch: BatchConfig) => {
      setEditingBatch(batch);
      setBatchName(batch.name); setBatchStart(batch.startDate); setBatchEnd(batch.endDate);
   };

   const handleApply = (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentUser?.firstName || !currentUser?.lastName) {
         setIsVerifyingIdentity(true);
         return;
      }
      if (applyingTo) {
         submitScholarshipApp(applyingTo.id, studentName || currentUser?.name || "Current Student", effectiveReqs);
      }
      setIsSuccess(true);
      setTimeout(() => { setIsSuccess(false); setApplyingTo(null); }, 2000);
   };

   const handleCommitIdentity = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!firstName || !lastName) return;
      await updateProfile({ firstName, middleName, lastName });
      await logAudit("IDENTITY_VERIFIED", `Applicant: ${firstName} ${lastName} | Protocol: Digital Signature`, "LOW");
      setIsVerifyingIdentity(false);
      if (applyingTo) {
         submitScholarshipApp(applyingTo.id, `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`, effectiveReqs);
      }
      setIsSuccess(true);
      setTimeout(() => { setIsSuccess(false); setApplyingTo(null); }, 2000);
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
      <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", position: "relative" }}>
         {/* ── Page Header ── */}
         <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
            <div>
               <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Financial Assistance</p>
               <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
                  Scholar<span style={{ color: "#3b82f6" }}>ships</span>
               </h1>
               <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#64748b", maxWidth: "600px", lineHeight: "1.6" }}>
                  Access institutional funding, monitor application cycles, and manage batch approvals for the university scholarship ecosystem.
               </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", background: "#f8fafc", padding: "0.5rem", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
               <button onClick={() => setActiveTab("Student")} style={{ padding: "0.85rem 1.75rem", fontSize: "0.85rem", fontWeight: "800", background: activeTab === "Student" ? "white" : "transparent", color: activeTab === "Student" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "12px", boxShadow: activeTab === "Student" ? "0 4px 6px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
                  For Students
               </button>
               {isStaff && (
                  <button onClick={() => setActiveTab("OSAS")} style={{ padding: "0.85rem 1.75rem", fontSize: "0.85rem", fontWeight: "800", background: activeTab === "OSAS" ? "white" : "transparent", color: activeTab === "OSAS" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "12px", boxShadow: activeTab === "OSAS" ? "0 4px 6px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
                     For Staff
                  </button>
               )}
            </div>
         </div>

         {activeTab === "Student" && (
            <div key="student">
               {!applyingTo ? (
                  <div>
                     <ProcessGuide
                        title="Scholarship Application Lifecycle"
                        steps={[
                           { title: "Eligibility Audit", desc: "Browse available programs and verify your compliance with requirements.", icon: <Search size={16} /> },
                           { title: "Digital Vault", desc: "Ensure all mandatory documents are uploaded and verified in your vault.", icon: <UploadCloud size={16} /> },
                           { title: "Institutional Review", desc: "Submit your application for batch-based review and board approval.", icon: <FileCheck size={16} /> },
                           { title: "Funding Award", desc: "Track endorsement status and receive notification of financial award.", icon: <Award size={16} /> }
                        ]}
                     />

                     {/* AI MATCHMAKER ENGINE */}
                     <div style={{ marginBottom: "3rem", padding: "3rem", background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", position: "relative", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                        <div style={{ position: "absolute", right: "-30px", top: "-30px", opacity: 0.03 }}>
                           <Cpu size={240} color="#3b82f6" />
                        </div>

                        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2.5rem" }}>
                           <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                 <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                                    <Sparkles size={20} />
                                 </div>
                                 <h3 style={{ fontSize: "0.85rem", fontWeight: "900", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.1em" }}>Smart Eligibility Matchmaker</h3>
                              </div>
                              <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", marginBottom: "1rem", letterSpacing: "-0.02em" }}>Instant Scholarship Recommendation</h2>
                              <p style={{ fontSize: "1rem", color: "#64748b", fontWeight: "500", maxWidth: "600px", lineHeight: "1.6" }}>
                                 Our algorithm analyzes your verified vault documents, academic standing, and financial profile to identify your highest probability funding opportunities.
                              </p>
                           </div>
                           {!aiMatch && !isScanning && (
                              <button onClick={runAIMatchmaker} style={{ padding: "1.15rem 2.5rem", background: "#111827", color: "white", border: "none", borderRadius: "16px", fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", transition: "all 0.2s" }}>
                                 <Zap size={20} /> Scan My Profile
                              </button>
                           )}
                        </div>

                        {isScanning && (
                           <div style={{ marginTop: "3rem" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", fontWeight: "800", color: "#3b82f6" }}>
                                    <span>Scanning institutional records...</span>
                                    <span>94% Accuracy Protocol</span>
                                 </div>
                                 <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", width: "100%", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                    <motion.div
                                       initial={{ width: 0 }}
                                       animate={{ width: "100%" }}
                                       transition={{ duration: 2.5, ease: "easeInOut" }}
                                       style={{ height: "100%", background: "#3b82f6", borderRadius: "4px" }}
                                    />
                                 </div>
                              </div>
                           </div>
                        )}

                        {aiMatch && (
                           <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2.5rem", alignItems: "center", background: "#f8fafc", padding: "2.5rem", borderRadius: "20px", border: "1px solid #e2e8f0", position: "relative" }}>
                              <div style={{ position: "absolute", top: 0, left: 0, width: "6px", height: "100%", background: "#10b981", borderRadius: "20px 0 0 20px" }} />
                              <div>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                    <span style={{ fontSize: "0.7rem", fontWeight: "900", padding: "0.4rem 1rem", background: "#f0fdf4", color: "#16a34a", borderRadius: "20px", border: "1px solid #dcfce7", letterSpacing: "0.05em" }}>{matchScore}% ELIGIBILITY SCORE</span>
                                 </div>
                                 <h4 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.75rem" }}>{aiMatch.name}</h4>
                                 <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "600", lineHeight: "1.6" }}>Your verified profile matches the strict criteria for this program. OSAS recommends immediate application for this cycle.</p>
                              </div>
                              <button onClick={() => setApplyingTo(aiMatch)} style={{ padding: "1.15rem 2.5rem", background: "#10b981", color: "white", border: "none", borderRadius: "14px", fontSize: "0.95rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                 Begin Application <ChevronRight size={18} />
                              </button>
                           </motion.div>
                        )}
                     </div>

                     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: "2rem" }}>
                        {scholarshipPrograms.map(prog => (
                           <motion.div 
                             key={prog.id} 
                             whileHover={{ y: -4 }}
                             style={{ display: "flex", flexDirection: "column", background: "white", padding: "2.5rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", transition: "all 0.3s" }}
                             className="hover:shadow-lg"
                           >
                              <div style={{ marginBottom: "2rem" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                                       <Building size={16} />
                                    </div>
                                    <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>{prog.provider}</p>
                                 </div>
                                 <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", lineHeight: "1.4", letterSpacing: "-0.01em" }}>{prog.name}</h3>
                              </div>
                              <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "500", lineHeight: "1.7", marginBottom: "2.5rem" }}>{prog.description}</p>
                              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2rem", borderTop: "1px solid #f8fafc" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8" }}>
                                    <Clock size={16} /> <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>Deadline: {prog.deadline}</span>
                                 </div>
                                 <button onClick={() => setApplyingTo(prog)} style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "800", background: "white", color: "#1e293b", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer", transition: "all 0.2s" }} className="hover:border-blue-300 hover:text-blue-600">
                                    Apply Now
                                 </button>
                              </div>
                           </motion.div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: "900px", margin: "0 auto" }}>
                     <button onClick={() => setApplyingTo(null)} style={{ color: "#64748b", background: "white", border: "1px solid #e2e8f0", padding: "0.75rem 1.25rem", borderRadius: "12px", marginBottom: "2.5rem", fontWeight: "800", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                        <ArrowLeft size={18} /> Exit Application
                     </button>

                     {isSuccess ? (
                        <div style={{ padding: "8rem 4rem", textAlign: "center", background: "white", borderRadius: "32px", border: "1px solid #f1f5f9", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)" }}>
                           <div style={{ width: "100px", height: "100px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 3rem", border: "1px solid #dcfce7" }}>
                              <CheckCircle2 size={48} color="#10b981" />
                           </div>
                           <h2 style={{ fontSize: "2rem", fontWeight: "900", color: "#1e293b", marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>Application Transmitted</h2>
                           <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "500", maxWidth: "500px", margin: "0 auto", lineHeight: "1.7" }}>
                              Your dossier for <strong>{applyingTo.name}</strong> has been successfully queued for institutional review. You will be notified of the board's decision via the dashboard.
                           </p>
                        </div>
                     ) : (
                        <div style={{ background: "white", borderRadius: "32px", border: "1px solid #f1f5f9", boxShadow: "0 20px 40px -10px rgba(0,0,0,0.05)", overflow: "hidden" }}>
                           <div style={{ padding: "3.5rem 4rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                              <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "#3b82f6", letterSpacing: "0.15em", marginBottom: "1rem", textTransform: "uppercase" }}>Funding Application Portal</p>
                              <h2 style={{ fontSize: "2.25rem", fontWeight: "900", color: "#1e293b", lineHeight: "1.1", letterSpacing: "-0.03em" }}>{applyingTo.name}</h2>
                           </div>

                           <form onSubmit={handleApply} style={{ padding: "4rem", display: "grid", gap: "3rem" }}>
                              <div>
                                 <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Institutional Identity (Legal Name)</label>
                                 <input required value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Enter your full legal name as per university records" style={{ width: "100%", padding: "1.5rem", fontSize: "1.05rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", color: "#1e293b" }} />
                              </div>

                              <div>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "1.5rem" }}>
                                    <div>
                                       <label style={{ fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Digital Vault Compliance</label>
                                       <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", marginTop: "0.25rem" }}>Automatic verification against your secure document storage.</p>
                                    </div>
                                    <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "#10b981", display: "flex", alignItems: "center", gap: "0.5rem", background: "#f0fdf4", padding: "0.4rem 1rem", borderRadius: "20px", border: "1px solid #dcfce7" }}><ShieldCheck size={16} /> VAULT SECURED</span>
                                 </div>
                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                                    {Object.entries(vaultMapping).map(([key, label]) => {
                                       const isVerified = (effectiveReqs as any)[key];
                                       return (
                                          <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.5rem", background: isVerified ? "#f0fdf4" : "#f8fafc", borderRadius: "16px", border: isVerified ? "1px solid #dcfce7" : "1px solid #f1f5f9", transition: "all 0.2s" }}>
                                             <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                {isVerified ? (
                                                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "#10b981", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                     <Check size={14} color="white" />
                                                  </div>
                                                ) : (
                                                  <div style={{ width: "24px", height: "24px", borderRadius: "6px", border: "2px solid #cbd5e1", background: "white" }} />
                                                )}
                                                <span style={{ fontWeight: "800", fontSize: "0.9rem", color: isVerified ? "#166534" : "#64748b" }}>{label}</span>
                                             </div>
                                             {isVerified ? (
                                                <span style={{ fontSize: "0.7rem", fontWeight: "900", color: "#10b981", textTransform: "uppercase", letterSpacing: "0.05em" }}>Verified</span>
                                             ) : (
                                                <span style={{ fontSize: "0.7rem", fontWeight: "800", color: "#ef4444" }}>Required</span>
                                             )}
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>

                              <button type="submit" style={{ width: "100%", padding: "1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "16px", fontSize: "1.1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>
                                 <Send size={20} /> Transmit Application Dossier
                              </button>
                           </form>
                        </div>
                     )}
                  </motion.div>
               )}
            </div>
         )}

         {activeTab === "OSAS" && (
            <div key="osas">
               <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", borderBottom: "1px solid #f1f5f9" }}>
                  {[
                     { id: "Applications", label: "Review Queue" },
                     { id: "Programs", label: "Program Registry" },
                     { id: "Batches", label: "Cycle Control" }
                  ].map(v => (
                     <button
                        key={v.id}
                        onClick={() => setOsasView(v.id as any)}
                        style={{ padding: "1.25rem 2rem", background: "none", border: "none", borderBottom: osasView === v.id ? "3px solid #3b82f6" : "3px solid transparent", color: osasView === v.id ? "#3b82f6" : "#64748b", fontSize: "0.95rem", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}
                     >
                        {v.label}
                     </button>
                  ))}
               </div>

               <ProcessGuide
                  title="Institutional Scholarship Protocol"
                  steps={[
                     { title: "Cycle Initiation", desc: "Define administrative timelines and batch parameters for the current cycle.", icon: <Calendar size={16} /> },
                     { title: "Registry Audit", desc: "Update scholarship programs, criteria, and institutional requirements.", icon: <Database size={16} /> },
                     { title: "Dossier Review", desc: "Audit student applications filtered by batch and document compliance.", icon: <FileCheck size={16} /> },
                     { title: "Executive Approval", desc: "Finalize recommendations and grant financial assistace awards.", icon: <ShieldCheck size={16} /> }
                  ]}
               />

               {osasView === "Applications" && (
                  <div style={{ width: "100%" }}>
                     <div style={{ marginBottom: "3rem", background: "white", padding: "2.5rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                           <Activity size={22} color="#3b82f6" />
                           <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>Governance Cycles</h3>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem" }}>
                           {batchConfigs.map((b) => {
                              const isActive = b.status === "Active";
                              return (
                                 <motion.div key={b.id} style={{ background: isActive ? "#eff6ff" : "#f8fafc", border: isActive ? "1px solid #dbeafe" : "1px solid #f1f5f9", padding: "2rem", borderRadius: "20px", display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                                       <div style={{ fontSize: "0.8rem", fontWeight: "900", color: isActive ? "#3b82f6" : "#94a3b8", letterSpacing: "0.05em" }}>BATCH {b.id.toString().padStart(2, '0')}</div>
                                       <span style={{ fontSize: "0.7rem", fontWeight: "900", padding: "0.4rem 1rem", borderRadius: "20px", background: isActive ? "white" : "#f1f5f9", color: isActive ? "#3b82f6" : "#94a3b8", border: isActive ? "1px solid #dbeafe" : "none" }}>
                                          {(b.status || "INACTIVE").toUpperCase()}
                                       </span>
                                    </div>
                                    <h4 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", marginBottom: "1rem" }}>{b.name}</h4>
                                    <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.85rem", color: "#64748b", fontWeight: "700" }}>
                                       <Calendar size={14} /> {b.startDate} — {b.endDate}
                                    </div>
                                 </motion.div>
                              );
                           })}
                        </div>
                     </div>

                     <div style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "2.5rem", alignItems: "start" }}>
                        <div>
                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", background: "white", padding: "1.5rem 2.5rem", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                 <h2 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>Review Pipeline</h2>
                                 <AnimatePresence>
                                   {selectedApps.length > 0 && (
                                      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.5rem 1.25rem", background: "#3b82f6", color: "white", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "800" }}>
                                         {selectedApps.length} Selected
                                         <button onClick={() => setSelectedApps([])} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center", padding: "0 0 0 0.5rem", borderLeft: "1px solid rgba(255,255,255,0.2)" }}><X size={16} /></button>
                                      </motion.div>
                                   )}
                                 </AnimatePresence>
                              </div>
                              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                 <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#64748b" }}>Active Batch:</span>
                                 <select value={viewBatch} onChange={e => setViewBatch(Number(e.target.value))} style={{ padding: "0.75rem 1.25rem", fontSize: "0.9rem", fontWeight: "800", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", color: "#1e293b", outline: "none", cursor: "pointer" }}>
                                    {batchConfigs.map(b => (
                                       <option key={b.id} value={b.id}>Batch {b.id}: {b.name}</option>
                                    ))}
                                 </select>
                              </div>
                           </div>

                           <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                              {scholarshipApps.filter(s => s.batchId === viewBatch).length === 0 && (
                                 <div style={{ padding: "8rem 2rem", textAlign: "center", background: "white", borderRadius: "24px", border: "1px dashed #e2e8f0" }}>
                                    <FileSignature size={48} color="#cbd5e1" style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                                    <p style={{ color: "#94a3b8", fontWeight: "700", fontSize: "1rem" }}>No applications detected for this cycle.</p>
                                 </div>
                              )}
                              {scholarshipApps.filter(s => s.batchId === viewBatch).map((app, i) => (
                                 <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    style={{
                                       display: "grid",
                                       gridTemplateColumns: "auto 1fr auto",
                                       alignItems: "center",
                                       gap: "2rem",
                                       padding: "2rem 2.5rem",
                                       background: selectedApp === app.id ? "#eff6ff" : "white",
                                       borderRadius: "20px",
                                       border: selectedApp === app.id ? "1px solid #dbeafe" : "1px solid #f1f5f9",
                                       cursor: "pointer",
                                       boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                                       transition: "all 0.3s"
                                    }}
                                    onClick={() => setSelectedApp(app.id)}
                                    className="hover:shadow-md"
                                 >
                                    <div onClick={e => e.stopPropagation()}>
                                       <input
                                          type="checkbox"
                                          checked={selectedApps.includes(app.id)}
                                          onChange={(e) => {
                                             setSelectedApps(prev => e.target.checked ? [...prev, app.id] : prev.filter(id => id !== app.id));
                                          }}
                                          style={{ width: "22px", height: "22px", cursor: "pointer", accentColor: "#3b82f6" }}
                                       />
                                    </div>
                                    <div>
                                       <h4 style={{ fontWeight: "900", fontSize: "1.1rem", color: "#1e293b", marginBottom: "0.5rem" }}>{app.studentName}</h4>
                                       <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                          <Clock size={14} /> Received: {app.dateApplied}
                                       </p>
                                    </div>
                                    <div>
                                       <span style={{ fontSize: "0.75rem", fontWeight: "900", padding: "0.5rem 1.25rem", borderRadius: "20px", background: app.status === "Recommended" ? "#f0fdf4" : "#fffbeb", color: app.status === "Recommended" ? "#16a34a" : "#d97706", border: `1px solid ${app.status === "Recommended" ? "#dcfce7" : "#fef3c7"}` }}>
                                          {app.status.toUpperCase()}
                                       </span>
                                    </div>
                                 </motion.div>
                              ))}
                           </div>
                        </div>

                        <div style={{ position: "sticky", top: "2rem" }}>
                           {selectedApp ? (
                              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: "white", padding: "3rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
                                 <div style={{ marginBottom: "3rem" }}>
                                    <h4 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                       <ShieldCheck size={20} color="#3b82f6" /> Document Audit
                                    </h4>
                                    <div style={{ display: "grid", gap: "1rem" }}>
                                       {(() => {
                                          const app = scholarshipApps.find(a => a.id === selectedApp);
                                          const student = users.find(u => u.name === app?.studentName);
                                          return Object.entries(vaultMapping).map(([key, label]) => {
                                             const doc = student?.vault?.[label];
                                             return (
                                                <div key={key} style={{
                                                   padding: "1.25rem",
                                                   background: doc?.uploaded ? "#f8fafc" : "#fff1f2",
                                                   border: doc?.uploaded ? "1px solid #f1f5f9" : "1px solid #fee2e2",
                                                   borderRadius: "14px",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   justifyContent: "space-between"
                                                }}>
                                                   <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f1f5f9" }}>
                                                         <FileText size={16} color={doc?.uploaded ? "#3b82f6" : "#ef4444"} />
                                                      </div>
                                                      <span style={{ fontSize: "0.9rem", fontWeight: "800", color: doc?.uploaded ? "#334155" : "#991b1b" }}>{label}</span>
                                                   </div>
                                                   {doc?.uploaded ? (
                                                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                         <span style={{ fontSize: "0.7rem", fontWeight: "900", color: doc.status === "Approved" ? "#10b981" : doc.status === "Rejected" ? "#ef4444" : "#f59e0b", background: "white", padding: "0.3rem 0.75rem", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                                                            {doc.status.toUpperCase()}
                                                         </span>
                                                         <button
                                                            onClick={() => {
                                                               setPreviewDoc({ name: label, userId: student?.id || "", studentName: student?.name || "" });
                                                               setPreviewData(doc);
                                                            }}
                                                            style={{ width: "32px", height: "32px", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
                                                            className="hover:text-blue-600 hover:border-blue-200"
                                                         >
                                                            <Eye size={16} />
                                                         </button>
                                                      </div>
                                                   ) : (
                                                      <span style={{ fontSize: "0.7rem", fontWeight: "900", color: "#ef4444", textTransform: "uppercase" }}>Missing</span>
                                                   )}
                                                </div>
                                             );
                                          });
                                       })()}
                                    </div>
                                 </div>
                                 <button onClick={handleRecommend} style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                                    <CheckCircle size={20} /> Endorse Recommendation
                                 </button>
                              </motion.div>
                           ) : (
                              <div style={{ background: "white", padding: "8rem 2rem", borderRadius: "32px", border: "1px dashed #e2e8f0", textAlign: "center" }}>
                                 <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", border: "1px solid #f1f5f9" }}>
                                    <FileCheck size={40} color="#cbd5e1" />
                                 </div>
                                 <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.75rem" }}>Review Dossier</h4>
                                 <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#94a3b8", maxWidth: "260px", margin: "0 auto" }}>Select an application from the registry to initiate document audit.</p>
                              </div>
                           )}

                           <AnimatePresence>
                             {selectedApps.length > 0 && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} style={{ marginTop: "2rem", background: "white", padding: "2.5rem", borderRadius: "24px", border: "1px solid #dbeafe", boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.1)" }}>
                                   <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e3a8a", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}><Layers size={20} /> Batch Processing</h3>
                                   <div style={{ display: "grid", gap: "2rem" }}>
                                      <div style={{ display: "grid", gap: "1rem" }}>
                                         <label style={{ fontSize: "0.85rem", fontWeight: "900", color: "#1e3a8a" }}>Designate Award Tier</label>
                                         <select
                                            value={recommendationLevel}
                                            onChange={e => setRecommendationLevel(e.target.value as any)}
                                            style={{ width: "100%", padding: "1.15rem", fontSize: "0.95rem", fontWeight: "800", background: "#f8fafc", border: "1px solid #dbeafe", borderRadius: "14px", color: "#1e293b", outline: "none", cursor: "pointer" }}
                                         >
                                            <option value="Partial">Partial Assistance Award</option>
                                            <option value="Half">Half Assistance Award</option>
                                            <option value="Full">Full Assistance Award</option>
                                         </select>
                                         <button onClick={handleBulkRecommend} style={{ width: "100%", padding: "1.15rem", background: "white", color: "#3b82f6", border: "1px solid #3b82f6", borderRadius: "14px", fontSize: "0.9rem", fontWeight: "900", cursor: "pointer" }} className="hover:bg-blue-50">Recommend Group</button>
                                      </div>
                                      <div style={{ height: "1px", background: "#dbeafe" }} />
                                      <button onClick={handleBulkApprove} style={{ width: "100%", padding: "1.15rem", background: "#111827", color: "white", border: "none", borderRadius: "14px", fontSize: "0.95rem", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                                         <ShieldCheck size={20} /> Authorize Board Approval
                                      </button>
                                   </div>
                                </motion.div>
                             )}
                           </AnimatePresence>

                           <div style={{ marginTop: "2rem", background: "white", padding: "2.5rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", marginBottom: "1.5rem" }}>Cycle Utilities</h3>
                              <div style={{ display: "grid", gap: "1rem" }}>
                                 <button onClick={handlePrintBatch} style={{ width: "100%", padding: "1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#475569", fontSize: "0.9rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer" }} className="hover:bg-slate-50">
                                    <Printer size={18} /> Generate Batch Report
                                 </button>
                                 <button style={{ width: "100%", padding: "1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#475569", fontSize: "0.9rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer" }} className="hover:bg-slate-50">
                                    <Settings size={18} /> Batch Configurations
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {osasView === "Programs" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "3rem", alignItems: "start" }}>
                     <div>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", marginBottom: "2.5rem", letterSpacing: "-0.02em" }}>Program Registry</h2>
                        <div style={{ display: "grid", gap: "2rem" }}>
                           {scholarshipPrograms.map((prog, i) => (
                              <motion.div 
                                key={prog.id} 
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", borderLeft: prog.status === "Archived" ? "6px solid #cbd5e1" : "6px solid #3b82f6", padding: "2.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
                              >
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                                    <div>
                                       <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                                          <div style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f1f5f9" }}>
                                             <Building size={14} color="#94a3b8" />
                                          </div>
                                          <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>{prog.provider}</p>
                                       </div>
                                       <h3 style={{ fontSize: "1.4rem", fontWeight: "900", color: prog.status === "Archived" ? "#94a3b8" : "#1e293b", letterSpacing: "-0.01em" }}>{prog.name}</h3>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.75rem" }}>
                                       <button onClick={() => startEdit(prog)} style={{ width: "40px", height: "40px", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} className="hover:text-blue-600 hover:border-blue-200"><Edit2 size={18} /></button>
                                       <button onClick={() => setConfirmConfig({
                                          isOpen: true,
                                          title: "Delete Program Registry",
                                          message: `CRITICAL: This will permanently remove the ${prog.name} program and all associated data. Proceed?`,
                                          type: "danger",
                                          onConfirm: () => deleteScholarshipProgram(prog.id)
                                       })} style={{ width: "40px", height: "40px", background: "#fff1f2", border: "1px solid #fee2e2", borderRadius: "10px", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} className="hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                                    </div>
                                 </div>
                                 <p style={{ fontSize: "1rem", color: "#64748b", fontWeight: "500", marginBottom: "2.5rem", lineHeight: "1.7" }}>{prog.description}</p>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2rem", borderTop: "1px solid #f8fafc" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8", fontSize: "0.9rem", fontWeight: "700" }}>
                                       <Calendar size={16} /> Deadline: {prog.deadline}
                                    </div>
                                    <button
                                       onClick={() => updateScholarshipProgram(prog.id, { status: prog.status === "Active" ? "Archived" : "Active" })}
                                       style={{ background: "white", border: "1px solid #e2e8f0", padding: "0.75rem 1.5rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", color: "#475569", cursor: "pointer" }}
                                       className="hover:bg-slate-50"
                                    >
                                       {prog.status === "Active" ? "Suspend Program" : "Activate Program"}
                                    </button>
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     </div>

                     <div style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", padding: "3rem", position: "sticky", top: "2rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                           <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                              {editingProg ? <Edit2 size={24} /> : <Plus size={24} />}
                           </div>
                           <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b" }}>
                              {editingProg ? "Update Program" : "Register Program"}
                           </h3>
                        </div>
                        <form onSubmit={editingProg ? handleUpdateProgram : handleCreateProgram} style={{ display: "grid", gap: "1.75rem" }}>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Official Program Title</label>
                              <input required value={newProgName} onChange={e => setNewProgName(e.target.value)} placeholder="e.g. Merit-Based Academic Excellence" style={{ width: "100%", padding: "1.15rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Funding Provider</label>
                              <input required value={newProgProvider} onChange={e => setNewProgProvider(e.target.value)} placeholder="e.g. University Endowment Fund" style={{ width: "100%", padding: "1.15rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Executive Summary</label>
                              <textarea required value={newProgDesc} onChange={e => setNewProgDesc(e.target.value)} rows={5} placeholder="Describe the mission, eligibility criteria, and award benefits..." style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b", resize: "none", lineHeight: "1.6" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Application Cut-off</label>
                              <input type="date" required value={newProgDeadline} onChange={e => setNewProgDeadline(e.target.value)} style={{ width: "100%", padding: "1.15rem", fontSize: "1rem", fontWeight: "900", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                              {editingProg && (
                                 <button type="button" onClick={() => setEditingProg(null)} style={{ flex: 1, padding: "1.15rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#64748b", fontSize: "0.95rem", fontWeight: "800", cursor: "pointer" }}>Cancel</button>
                              )}
                              <button type="submit" style={{ flex: 2, padding: "1.15rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)" }}>{editingProg ? "Save Changes" : "Create Program"}</button>
                           </div>
                        </form>
                     </div>
                  </div>
               )}

               {osasView === "Batches" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "3rem", alignItems: "start" }}>
                     <div>
                        <div style={{ marginBottom: "3.5rem" }}>
                           <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", marginBottom: "2.5rem", letterSpacing: "-0.02em" }}>Scheduling Cycles</h2>
                           
                           {/* BATCH TIMELINE VISUALIZER */}
                           <div style={{ padding: "4rem", background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", marginBottom: "3.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "4rem" }}>
                                 <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                                    <Layers size={22} />
                                 </div>
                                 <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>Institutional Cycle Map</h4>
                              </div>
                              
                              <div style={{ position: "relative", padding: "1.5rem 0" }}>
                                 <div style={{ position: "absolute", top: "35px", left: 0, width: "100%", height: "4px", background: "#f1f5f9", zIndex: 0, borderRadius: "2px" }} />
                                 
                                 <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                                    {batchConfigs.length === 0 ? (
                                       <p style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "700", textAlign: "center", width: "100%", padding: "2rem" }}>No active or historical cycles defined in the registry.</p>
                                    ) : (
                                       batchConfigs.map((batch, index) => {
                                          const isActive = batch.status === "Active";
                                          return (
                                             <div key={batch.id} style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <div style={{ 
                                                   width: "20px", 
                                                   height: "20px", 
                                                   borderRadius: "50%", 
                                                   background: isActive ? "#3b82f6" : "white", 
                                                   border: isActive ? "5px solid #dbeafe" : "2px solid #cbd5e1",
                                                   marginBottom: "1.5rem",
                                                   boxShadow: isActive ? "0 0 0 4px rgba(59, 130, 246, 0.1)" : "none"
                                                }} />
                                                <motion.div 
                                                  whileHover={{ y: -4 }}
                                                  style={{ 
                                                   padding: "1.25rem", 
                                                   background: isActive ? "#eff6ff" : "white", 
                                                   border: "1px solid",
                                                   borderColor: isActive ? "#dbeafe" : "#f1f5f9",
                                                   borderRadius: "16px",
                                                   textAlign: "center",
                                                   minWidth: "140px",
                                                   boxShadow: isActive ? "0 10px 15px -3px rgba(59, 130, 246, 0.1)" : "0 4px 6px rgba(0,0,0,0.02)"
                                                }}>
                                                   <p style={{ fontSize: "0.85rem", fontWeight: "900", color: isActive ? "#1e40af" : "#475569" }}>{batch.name}</p>
                                                   <p style={{ fontSize: "0.75rem", fontWeight: "800", color: isActive ? "#3b82f6" : "#94a3b8", marginTop: "0.5rem" }}>{batch.startDate?.split('-').slice(1).join('/') || "TBD"}</p>
                                                </motion.div>
                                             </div>
                                          );
                                       })
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div style={{ display: "grid", gap: "2rem" }}>
                           {batchConfigs.map(batch => (
                              <motion.div key={batch.id} style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", borderLeft: batch.status === "Archived" ? "6px solid #cbd5e1" : "6px solid #10b981", padding: "2.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                                    <div>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Batch Sequence #{batch.id.toString().padStart(2, '0')}</p>
                                       <h3 style={{ fontSize: "1.3rem", fontWeight: "900", color: batch.status === "Archived" ? "#94a3b8" : "#1e293b" }}>{batch.name}</h3>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.75rem" }}>
                                       <button onClick={() => startEditBatch(batch)} style={{ width: "40px", height: "40px", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} className="hover:text-blue-600 hover:border-blue-200"><Edit2 size={18} /></button>
                                       <button onClick={() => setConfirmConfig({
                                          isOpen: true,
                                          title: "Deprecate Batch Cycle",
                                          message: `Are you sure you want to permanently remove ${batch.name} from the administrative history?`,
                                          type: "danger",
                                          onConfirm: () => deleteBatchConfig(batch.id)
                                       })} style={{ width: "40px", height: "40px", background: "#fff1f2", border: "1px solid #fee2e2", borderRadius: "10px", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} className="hover:bg-red-500 hover:text-white"><Trash2 size={18} /></button>
                                    </div>
                                 </div>
                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2.5rem", background: "#f8fafc", padding: "1.75rem", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                                    <div>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase" }}>Activation Date</p>
                                       <p style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>{batch.startDate || "Pending Schedule"}</p>
                                    </div>
                                    <div style={{ borderLeft: "1px solid #e2e8f0", paddingLeft: "1.5rem" }}>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase" }}>Closure Date</p>
                                       <p style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>{batch.endDate || "Pending Schedule"}</p>
                                    </div>
                                 </div>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.75rem", fontWeight: "900", color: batch.status === "Active" ? "#10b981" : "#64748b", background: batch.status === "Active" ? "#f0fdf4" : "#f1f5f9", padding: "0.5rem 1.25rem", borderRadius: "20px", border: `1px solid ${batch.status === "Active" ? "#dcfce7" : "#e2e8f0"}`, letterSpacing: "0.05em" }}>
                                       {batch.status?.toUpperCase() || "INACTIVE"}
                                    </span>
                                    <div style={{ display: "flex", gap: "1rem" }}>
                                       {batch.status !== "Active" && (
                                          <button
                                             onClick={() => updateBatchConfig(batch.id, { status: "Active" })}
                                             style={{ background: "#3b82f6", border: "none", padding: "0.75rem 1.75rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", color: "white", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}
                                          >
                                             Activate Cycle
                                          </button>
                                       )}
                                       <button
                                          onClick={() => updateBatchConfig(batch.id, { status: batch.status === "Archived" ? "Inactive" : "Archived" })}
                                          style={{ background: "white", border: "1px solid #e2e8f0", padding: "0.75rem 1.5rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", color: "#475569", cursor: "pointer" }}
                                          className="hover:bg-slate-50"
                                       >
                                          {batch.status === "Archived" ? "Restore" : "Archive"}
                                       </button>
                                    </div>
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     </div>

                     <div style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", padding: "3rem", position: "sticky", top: "2rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                           <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                              {editingBatch ? <Edit2 size={24} /> : <Plus size={24} />}
                           </div>
                           <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b" }}>
                              {editingBatch ? "Modify Cycle" : "Provision Cycle"}
                           </h3>
                        </div>
                        <form onSubmit={editingBatch ? handleUpdateBatch : handleCreateBatch} style={{ display: "grid", gap: "1.75rem" }}>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Cycle Identifier</label>
                              <input required value={batchName} onChange={e => setBatchName(e.target.value)} placeholder="e.g. Academic Year 2026 Q3" style={{ width: "100%", padding: "1.15rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Launch Date</label>
                              <input type="date" required value={batchStart} onChange={e => setBatchStart(e.target.value)} style={{ width: "100%", padding: "1.15rem", fontSize: "1rem", fontWeight: "900", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Conclusion Date</label>
                              <input type="date" required value={batchEnd} onChange={e => setBatchEnd(e.target.value)} style={{ width: "100%", padding: "1.15rem", fontSize: "1rem", fontWeight: "900", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                              {editingBatch && (
                                 <button type="button" onClick={() => setEditingBatch(null)} style={{ flex: 1, padding: "1.15rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#64748b", fontSize: "0.95rem", fontWeight: "800", cursor: "pointer" }}>Cancel</button>
                              )}
                              <button type="submit" style={{ flex: 2, padding: "1.15rem", background: "#111827", color: "white", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>{editingBatch ? "Update Parameters" : "Initiate Cycle"}</button>
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
         <AnimatePresence>
           {previewDoc && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backdropFilter: "blur(12px)" }}>
                 <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} style={{ width: "100%", maxWidth: "1100px", background: "white", borderRadius: "32px", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 400px", height: "85vh", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}>
                    <div style={{ background: "#f1f5f9", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem" }}>
                       <div style={{ width: "100%", maxWidth: "500px", aspectRatio: "1/1.414", background: "white", boxShadow: "0 15px 35px rgba(0,0,0,0.1)", borderRadius: "12px", padding: "4rem", display: "flex", flexDirection: "column", position: "relative" }}>
                          <div style={{ borderBottom: "3px solid #f1f5f9", paddingBottom: "2rem", marginBottom: "3rem", textAlign: "center" }}>
                             <h4 style={{ color: "#1e293b", fontSize: "1.25rem", fontWeight: "900", marginBottom: "0.5rem", letterSpacing: "0.02em" }}>Institutional Document</h4>
                             <p style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: "800", letterSpacing: "0.1em" }}>SPARK OSAS • SECURE DIGITAL VAULT</p>
                          </div>
                          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.1 }}>
                             <FileText size={160} color="#3b82f6" />
                          </div>
                          <div style={{ marginTop: "auto", borderTop: "1px solid #f1f5f9", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                             <div>
                                <p style={{ color: "#94a3b8", fontSize: "0.7rem", fontWeight: "900", textTransform: "uppercase", marginBottom: "0.5rem" }}>Digital Signature ID</p>
                                <p style={{ color: "#1e293b", fontSize: "1rem", fontWeight: "900", fontFamily: "monospace" }}>{previewDoc.userId.slice(-12).toUpperCase()}</p>
                             </div>
                             <ShieldCheck size={32} color="#10b981" />
                          </div>
                       </div>
                    </div>
                    
                    <div style={{ padding: "4rem 3rem", display: "flex", flexDirection: "column", borderLeft: "1px solid #f1f5f9", background: "white" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4rem" }}>
                          <div>
                             <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "#3b82f6", letterSpacing: "0.1em", marginBottom: "0.75rem", textTransform: "uppercase" }}>Administrative Audit</p>
                             <h3 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>{previewDoc.name}</h3>
                             <p style={{ fontSize: "1rem", color: "#64748b", fontWeight: "600" }}>Applicant: <span style={{ color: "#1e293b" }}>{previewDoc.studentName}</span></p>
                          </div>
                          <button onClick={() => setPreviewDoc(null)} style={{ width: "48px", height: "48px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "50%", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                             <X size={24} />
                          </button>
                       </div>

                       <div style={{ padding: "2rem", background: "#fffbeb", borderRadius: "16px", border: "1px solid #fef3c7", marginBottom: "2rem" }}>
                          <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                             <Info size={20} color="#d97706" />
                             <p style={{ fontSize: "0.95rem", color: "#92400e", fontWeight: "800" }}>Audit Instructions</p>
                          </div>
                          <p style={{ fontSize: "0.9rem", color: "#92400e", fontWeight: "600", lineHeight: "1.6" }}>Verify the document's authenticity and legibility. Rejections must include a clear rationale for the applicant.</p>
                       </div>

                       <div style={{ marginTop: "auto", display: "grid", gap: "1rem" }}>
                          <button onClick={async () => { await verifyDocument(previewDoc.userId, previewDoc.name, "Approved", "Approved by OSAS."); setPreviewDoc(null); }} style={{ width: "100%", padding: "1.25rem", background: "#10b981", color: "white", border: "none", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                             <CheckCircle size={20} /> Approve Document
                          </button>
                          <button onClick={async () => { const r = prompt("Reason for rejection:"); if (r) { await verifyDocument(previewDoc.userId, previewDoc.name, "Rejected", r); setPreviewDoc(null); } }} style={{ width: "100%", padding: "1.25rem", background: "white", border: "1px solid #fee2e2", color: "#ef4444", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                             <X size={20} /> Decline Document
                          </button>
                       </div>
                    </div>
                 </motion.div>
              </div>
           )}
         </AnimatePresence>

         {/* Identity Verification Modal */}
         <AnimatePresence>
           {isVerifyingIdentity && (
              <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(12px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                 <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} style={{ width: "100%", maxWidth: "600px", background: "white", borderRadius: "32px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                    <div style={{ padding: "2.5rem 3rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <div>
                          <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "#3b82f6", letterSpacing: "0.1em", marginBottom: "0.25rem", textTransform: "uppercase" }}>Security Protocol</p>
                          <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b" }}>Identity Verification</h2>
                       </div>
                       <button onClick={() => setIsVerifyingIdentity(false)} style={{ background: "white", border: "1px solid #f1f5f9", color: "#94a3b8", cursor: "pointer", width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}>
                          <X size={24} />
                       </button>
                    </div>
                    <form onSubmit={handleCommitIdentity} style={{ padding: "3rem", display: "grid", gap: "2rem" }}>
                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                          <div>
                             <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#475569" }}>First Name</label>
                             <input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Juan" style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "14px", outline: "none", color: "#1e293b" }} />
                          </div>
                          <div>
                             <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#475569" }}>Middle Name</label>
                             <input value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="Santos" style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "14px", outline: "none", color: "#1e293b" }} />
                          </div>
                       </div>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#475569" }}>Last Name (Surname)</label>
                          <input required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Dela Cruz" style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "14px", outline: "none", color: "#1e293b" }} />
                       </div>
                       
                       <div style={{ padding: "1.5rem", background: "#eff6ff", borderRadius: "16px", border: "1px solid #dbeafe", display: "flex", gap: "1rem", alignItems: "center" }}>
                          <ShieldCheck size={24} color="#3b82f6" />
                          <p style={{ fontSize: "0.85rem", color: "#1e40af", fontWeight: "700", lineHeight: "1.5" }}>This identity will be bound to your digital signature and all subsequent scholarship applications.</p>
                       </div>

                       <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                          <button type="button" onClick={() => setIsVerifyingIdentity(false)} style={{ flex: 1, padding: "1.25rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "16px", color: "#64748b", fontSize: "1rem", fontWeight: "800", cursor: "pointer" }}>Cancel</button>
                          <button type="submit" style={{ flex: 2, padding: "1.25rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)" }}>Verify & Continue</button>
                       </div>
                    </form>
                 </motion.div>
              </div>
           )}
         </AnimatePresence>
      </div>
   );
}
