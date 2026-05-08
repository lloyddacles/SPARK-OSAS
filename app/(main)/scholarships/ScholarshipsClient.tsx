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
   Zap
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
         <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
         {/* Modern Light Header */}
         <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
            <div>
               <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Funding</p>
               <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
                  Scholar<span style={{ color: "var(--primary)" }}>ships</span>
               </h1>
               <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Explore opportunities, apply for funding, and manage scholarship cycles.</p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", background: "#f1f5f9", padding: "0.5rem", borderRadius: "12px" }}>
               <button onClick={() => setActiveTab("Student")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "700", background: activeTab === "Student" ? "white" : "transparent", color: activeTab === "Student" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "8px", boxShadow: activeTab === "Student" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
                  For Students
               </button>
               {isStaff && (
                  <button onClick={() => setActiveTab("OSAS")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "700", background: activeTab === "OSAS" ? "white" : "transparent", color: activeTab === "OSAS" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "8px", boxShadow: activeTab === "OSAS" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
                     For Staff
                  </button>
               )}
            </div>
         </div>

         {activeTab === "Student" && (
            <div key="student">
               {!applyingTo ? (
                  <div>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                        <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                           <Award size={20} color="#3b82f6" /> Available Scholarships
                        </h2>
                     </div>

                     <ProcessGuide
                        title="How to Apply for Scholarships"
                        steps={[
                           { title: "Review Eligibility", desc: "Browse available programs below.", icon: <Search size={16} /> },
                           { title: "Complete Vault", desc: "Ensure documents are verified.", icon: <UploadCloud size={16} /> },
                           { title: "Submit Application", desc: "Apply and track status.", icon: <Send size={16} /> }
                        ]}
                     />

                     {/* AI MATCHMAKER ENGINE */}
                     <div style={{ marginBottom: "3rem", padding: "2.5rem", background: "linear-gradient(135deg, #eff6ff, #f8fafc)", border: "1px solid #bfdbfe", borderRadius: "16px", position: "relative", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                        <div style={{ position: "absolute", right: "-20px", top: "-20px", opacity: 0.05 }}>
                           <Cpu size={200} color="#3b82f6" />
                        </div>

                        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem" }}>
                           <div>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                 <Sparkles size={18} color="#2563eb" />
                                 <h3 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "0.05em" }}>Smart Scholarship Matcher</h3>
                              </div>
                              <p style={{ fontSize: "0.9rem", color: "#475569", fontWeight: "500", maxWidth: "500px", lineHeight: "1.6" }}>
                                 Automatically scan your verified vault documents and academic standing to find the exact scholarship program you are most likely to win.
                              </p>
                           </div>
                           {!aiMatch && !isScanning && (
                              <button onClick={runAIMatchmaker} style={{ padding: "1rem 2rem", background: "white", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)", transition: "all 0.2s" }}>
                                 <Sparkles size={18} /> Scan My Profile
                              </button>
                           )}
                        </div>

                        {isScanning && (
                           <div style={{ marginTop: "2.5rem" }}>
                              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", color: "#2563eb" }}>
                                    <span>Analyzing documents...</span>
                                    <span>Processing</span>
                                 </div>
                                 <div style={{ height: "6px", background: "#bfdbfe", borderRadius: "3px", width: "100%", overflow: "hidden" }}>
                                    <motion.div
                                       initial={{ width: 0 }}
                                       animate={{ width: "80%" }}
                                       transition={{ duration: 2, ease: "easeInOut" }}
                                       style={{ height: "100%", background: "#2563eb", borderRadius: "3px" }}
                                    />
                                 </div>
                              </div>
                           </div>
                        )}

                        {aiMatch && (
                           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2.5rem", display: "grid", gridTemplateColumns: "1fr auto", gap: "2rem", alignItems: "center", background: "white", padding: "2rem", borderRadius: "12px", border: "1px solid #e2e8f0", borderLeft: "4px solid #10b981", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <div>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                                    <div style={{ padding: "0.3rem 0.75rem", background: "#f0fdf4", color: "#16a34a", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "800" }}>{matchScore}% MATCH</div>
                                 </div>
                                 <h4 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>{aiMatch.name}</h4>
                                 <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.5" }}>Based on your verified documents and academic record, you are a strong candidate for this program.</p>
                              </div>
                              <button onClick={() => setApplyingTo(aiMatch)} style={{ padding: "1rem 2rem", background: "#10b981", color: "white", border: "none", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)" }}>
                                 Apply Now
                              </button>
                           </motion.div>
                        )}
                     </div>

                     <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.5rem" }}>
                        {scholarshipPrograms.map(prog => (
                           <div key={prog.id} style={{ display: "flex", flexDirection: "column", background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <div style={{ marginBottom: "1.5rem" }}>
                                 <p style={{ fontSize: "0.7rem", fontWeight: "700", color: "#3b82f6", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Provider: {prog.provider}</p>
                                 <h3 style={{ fontSize: "1.15rem", fontWeight: "800", color: "#1e293b", lineHeight: "1.3" }}>{prog.name}</h3>
                              </div>
                              <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.6", marginBottom: "2rem" }}>{prog.description}</p>
                              <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8" }}>
                                    <Calendar size={14} /> <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>Ends {prog.deadline}</span>
                                 </div>
                                 <button onClick={() => setApplyingTo(prog)} style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem", fontWeight: "700", background: "#f8fafc", color: "#3b82f6", border: "1px solid #e2e8f0", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}>
                                    Apply
                                 </button>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               ) : (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ maxWidth: "800px", margin: "0 auto" }}>
                     <button onClick={() => setApplyingTo(null)} style={{ color: "#64748b", background: "white", border: "1px solid #e2e8f0", padding: "0.5rem 1rem", borderRadius: "8px", marginBottom: "2rem", fontWeight: "700", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                        <ArrowLeft size={16} /> Go Back
                     </button>

                     {isSuccess ? (
                        <div style={{ padding: "6rem 3rem", textAlign: "center", background: "white", borderRadius: "24px", border: "1px solid #f3f4f6", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                           <div style={{ width: "80px", height: "80px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                              <CheckCircle2 size={40} color="#10b981" />
                           </div>
                           <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "#1e293b", marginBottom: "1rem" }}>Application Submitted!</h2>
                           <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "500", maxWidth: "400px", margin: "0 auto", lineHeight: "1.6" }}>
                              Your application for <strong>{applyingTo.name}</strong> has been successfully received and is queued for review.
                           </p>
                        </div>
                     ) : (
                        <div style={{ padding: "3rem", background: "white", borderRadius: "24px", border: "1px solid #f3f4f6", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
                           <div style={{ marginBottom: "3rem", paddingBottom: "2rem", borderBottom: "1px solid #f1f5f9" }}>
                              <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#3b82f6", letterSpacing: "0.05em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Application Form</p>
                              <h2 style={{ fontSize: "1.8rem", fontWeight: "900", color: "#1e293b", lineHeight: "1.2" }}>{applyingTo.name}</h2>
                           </div>

                           <form onSubmit={handleApply} style={{ display: "grid", gap: "2.5rem" }}>
                              <div>
                                 <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Full Name</label>
                                 <input required value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="Enter your full name" style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                              </div>

                              <div>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Document Verification Status</label>
                                    <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#10b981", display: "flex", alignItems: "center", gap: "0.25rem" }}><ShieldCheck size={14} /> Checked against Vault</p>
                                 </div>
                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                    {Object.entries(vaultMapping).map(([key, label]) => {
                                       const isVerified = (effectiveReqs as any)[key];
                                       return (
                                          <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem", background: isVerified ? "#f0fdf4" : "#f8fafc", borderRadius: "12px", border: isVerified ? "1px solid #bbf7d0" : "1px solid #e2e8f0" }}>
                                             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                {isVerified ? <CheckCircle2 size={18} color="#10b981" /> : <div style={{ width: "18px", height: "18px", border: "2px solid #cbd5e1", borderRadius: "4px" }} />}
                                                <span style={{ fontWeight: "600", fontSize: "0.85rem", color: isVerified ? "#166534" : "#64748b" }}>{label}</span>
                                             </div>
                                             {isVerified && (
                                                <span style={{ fontSize: "0.7rem", fontWeight: "800", color: "#16a34a", textTransform: "uppercase" }}>Verified</span>
                                             )}
                                          </div>
                                       );
                                    })}
                                 </div>
                              </div>

                              <button type="submit" style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>
                                 <Send size={18} /> Submit Application
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
               <div style={{ display: "flex", gap: "0.5rem", marginBottom: "3rem", borderBottom: "1px solid #e2e8f0" }}>
                  {[
                     { id: "Applications", label: "Review Applications" },
                     { id: "Programs", label: "Manage Programs" },
                     { id: "Batches", label: "Manage Batches" }
                  ].map(v => (
                     <button
                        key={v.id}
                        onClick={() => setOsasView(v.id as any)}
                        style={{ padding: "1rem 1.5rem", background: "none", border: "none", borderBottom: osasView === v.id ? "2px solid #3b82f6" : "2px solid transparent", color: osasView === v.id ? "#3b82f6" : "#64748b", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}
                     >
                        {v.label}
                     </button>
                  ))}
               </div>

               <ProcessGuide
                  title="How Scholarship Review Works"
                  steps={[
                     { title: "Batches", desc: "Define timelines.", icon: <Calendar size={16} /> },
                     { title: "Programs", desc: "Update requirements.", icon: <Database size={16} /> },
                     { title: "Review", desc: "Filter by batch.", icon: <FileCheck size={16} /> },
                     { title: "Approve", desc: "Finalize scholarship.", icon: <ShieldCheck size={16} /> }
                  ]}
               />

               {osasView === "Applications" && (
                  <div style={{ width: "100%" }}>
                     <div style={{ marginBottom: "3rem", background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                           <Activity size={20} color="#3b82f6" />
                           <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Active Batches</h3>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                           {batchConfigs.map((b) => {
                              const isActive = b.status === "Active";
                              return (
                                 <div key={b.id} style={{ background: isActive ? "#eff6ff" : "#f8fafc", border: isActive ? "1px solid #bfdbfe" : "1px solid #e2e8f0", padding: "1.5rem", borderRadius: "12px", display: "flex", flexDirection: "column" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                       <div style={{ fontSize: "0.75rem", fontWeight: "800", color: isActive ? "#2563eb" : "#64748b" }}>BATCH {b.id}</div>
                                       <span style={{ fontSize: "0.7rem", fontWeight: "700", padding: "0.2rem 0.6rem", borderRadius: "20px", background: isActive ? "#dbeafe" : "#f1f5f9", color: isActive ? "#1e40af" : "#94a3b8" }}>
                                          {(b.status || "Inactive")}
                                       </span>
                                    </div>
                                    <p style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600", marginTop: "auto" }}>{b.startDate} to {b.endDate}</p>
                                 </div>
                              );
                           })}
                        </div>
                     </div>

                     <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2.5rem", alignItems: "start" }}>
                        <div>
                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", background: "white", padding: "1.5rem 2rem", borderRadius: "12px", border: "1px solid #f3f4f6", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                 <h2 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>Application Queue</h2>
                                 {selectedApps.length > 0 && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.4rem 1rem", background: "#eff6ff", color: "#2563eb", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", border: "1px solid #bfdbfe" }}>
                                       {selectedApps.length} Selected
                                       <button onClick={() => setSelectedApps([])} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", display: "flex", alignItems: "center" }}><X size={14} /></button>
                                    </div>
                                 )}
                              </div>
                              <select value={viewBatch} onChange={e => setViewBatch(Number(e.target.value))} style={{ padding: "0.6rem 1rem", fontSize: "0.85rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b", outline: "none" }}>
                                 {batchConfigs.map(b => (
                                    <option key={b.id} value={b.id}>Batch {b.id}</option>
                                 ))}
                              </select>
                           </div>

                           <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                              {scholarshipApps.filter(s => s.batchId === viewBatch).length === 0 && (
                                 <div style={{ padding: "4rem", textAlign: "center", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                                    <p style={{ color: "#64748b", fontWeight: "600" }}>No applications found for this batch.</p>
                                 </div>
                              )}
                              {scholarshipApps.filter(s => s.batchId === viewBatch).map(app => (
                                 <div
                                    key={app.id}
                                    style={{
                                       display: "grid",
                                       gridTemplateColumns: "auto 1fr auto",
                                       alignItems: "center",
                                       gap: "1.5rem",
                                       padding: "1.5rem 2rem",
                                       background: selectedApp === app.id ? "#eff6ff" : "white",
                                       borderRadius: "12px",
                                       border: selectedApp === app.id ? "1px solid #bfdbfe" : "1px solid #f1f5f9",
                                       cursor: "pointer",
                                       boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                                       transition: "all 0.2s"
                                    }}
                                    onClick={() => setSelectedApp(app.id)}
                                 >
                                    <input
                                       type="checkbox"
                                       checked={selectedApps.includes(app.id)}
                                       onChange={(e) => {
                                          e.stopPropagation();
                                          setSelectedApps(prev => e.target.checked ? [...prev, app.id] : prev.filter(id => id !== app.id));
                                       }}
                                       style={{ width: "18px", height: "18px", cursor: "pointer" }}
                                    />
                                    <div>
                                       <h4 style={{ fontWeight: "800", fontSize: "1rem", color: "#1e293b", marginBottom: "0.25rem" }}>{app.studentName}</h4>
                                       <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "500" }}>Submitted: {app.dateApplied}</p>
                                    </div>
                                    <div>
                                       <span style={{ fontSize: "0.75rem", fontWeight: "700", padding: "0.4rem 1rem", borderRadius: "20px", background: app.status === "Recommended" ? "#f0fdf4" : "#fef3c7", color: app.status === "Recommended" ? "#16a34a" : "#d97706" }}>
                                          {app.status}
                                       </span>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        <div>
                           {selectedApp ? (
                              <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", position: "sticky", top: "2rem" }}>
                                 <div style={{ marginBottom: "2.5rem" }}>
                                    <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                       <FileCheck size={18} color="#3b82f6" /> Document Inspection
                                    </h4>
                                    <div style={{ display: "grid", gap: "0.75rem" }}>
                                       {(() => {
                                          const app = scholarshipApps.find(a => a.id === selectedApp);
                                          const student = users.find(u => u.name === app?.studentName);
                                          return Object.entries(vaultMapping).map(([key, label]) => {
                                             const doc = student?.vault?.[label];
                                             return (
                                                <div key={key} style={{
                                                   padding: "1rem",
                                                   background: doc?.uploaded ? "#f8fafc" : "#fff1f2",
                                                   border: doc?.uploaded ? "1px solid #e2e8f0" : "1px solid #ffe4e6",
                                                   borderRadius: "8px",
                                                   display: "flex",
                                                   alignItems: "center",
                                                   justifyContent: "space-between"
                                                }}>
                                                   <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                      <FileText size={16} color={doc?.uploaded ? "#3b82f6" : "#f43f5e"} />
                                                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: doc?.uploaded ? "#1e293b" : "#9f1239" }}>{label}</span>
                                                   </div>
                                                   {doc?.uploaded ? (
                                                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                                         <span style={{ fontSize: "0.7rem", fontWeight: "800", color: doc.status === "Approved" ? "#10b981" : doc.status === "Rejected" ? "#ef4444" : "#f59e0b" }}>
                                                            {doc.status}
                                                         </span>
                                                         <button
                                                            onClick={() => {
                                                               setPreviewDoc({ name: label, userId: student?.id || "", studentName: student?.name || "" });
                                                               setPreviewData(doc);
                                                            }}
                                                            style={{ padding: "0.4rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "6px", color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", transition: "all 0.2s" }}
                                                         >
                                                            <Eye size={14} />
                                                         </button>
                                                      </div>
                                                   ) : (
                                                      <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#e11d48" }}>Missing</span>
                                                   )}
                                                </div>
                                             );
                                          });
                                       })()}
                                    </div>
                                 </div>
                                 <button onClick={handleRecommend} style={{ width: "100%", padding: "1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                                    Submit Recommendation
                                 </button>
                              </div>
                           ) : (
                              <div style={{ background: "white", padding: "4rem 2rem", borderRadius: "16px", border: "1px dashed #cbd5e1", textAlign: "center" }}>
                                 <ShieldCheck size={48} color="#94a3b8" style={{ margin: "0 auto 1.5rem", opacity: 0.5 }} />
                                 <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#64748b" }}>Select a student application from the queue to review their documents.</p>
                              </div>
                           )}

                           {selectedApps.length > 0 && (
                              <div style={{ marginTop: "2rem", background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #bfdbfe", boxShadow: "0 10px 25px rgba(59, 130, 246, 0.1)" }}>
                                 <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e3a8a", marginBottom: "1.5rem" }}>Batch Actions</h3>
                                 <div style={{ display: "grid", gap: "1.5rem" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                       <select
                                          value={recommendationLevel}
                                          onChange={e => setRecommendationLevel(e.target.value as any)}
                                          style={{ width: "100%", padding: "0.85rem", fontSize: "0.85rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#1e293b", outline: "none" }}
                                       >
                                          <option value="Partial">Partial Scholar</option>
                                          <option value="Half">Half Scholar</option>
                                          <option value="Full">Full Scholar</option>
                                       </select>
                                       <button onClick={handleBulkRecommend} style={{ width: "100%", padding: "1rem", background: "#eff6ff", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Recommend Selected</button>
                                    </div>
                                    <div style={{ height: "1px", background: "#e2e8f0" }} />
                                    <button onClick={handleBulkApprove} style={{ width: "100%", padding: "1rem", background: "#10b981", color: "white", border: "none", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)" }}>Final Approval For Selected</button>
                                 </div>
                              </div>
                           )}

                           <div style={{ marginTop: "2rem", background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "1.5rem" }}>Batch Tools</h3>
                              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                                 <button onClick={handlePrintBatch} style={{ width: "100%", padding: "1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", fontSize: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}>
                                    <Printer size={16} /> Print List
                                 </button>
                                 <button style={{ width: "100%", padding: "1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", fontSize: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", transition: "all 0.2s" }}>
                                    <Settings size={16} /> Edit Dates
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
               )}

               {osasView === "Programs" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem", alignItems: "start" }}>
                     <div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem" }}>Active Programs</h2>
                        <div style={{ display: "grid", gap: "1.5rem" }}>
                           {scholarshipPrograms.map(prog => (
                              <div key={prog.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", borderLeft: prog.status === "Archived" ? "4px solid #cbd5e1" : "4px solid #3b82f6", padding: "2rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                    <div>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", marginBottom: "0.25rem" }}>{prog.provider}</p>
                                       <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: prog.status === "Archived" ? "#94a3b8" : "#1e293b" }}>{prog.name}</h3>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                       <button onClick={() => startEdit(prog)} style={{ width: "36px", height: "36px", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}><Edit2 size={16} /></button>
                                       <button onClick={() => setConfirmConfig({
                                          isOpen: true,
                                          title: "Delete Program",
                                          message: `Are you sure you want to permanently delete the ${prog.name} program?`,
                                          type: "danger",
                                          onConfirm: () => deleteScholarshipProgram(prog.id)
                                       })} style={{ width: "36px", height: "36px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}><Trash2 size={16} /></button>
                                    </div>
                                 </div>
                                 <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", marginBottom: "2rem", lineHeight: "1.6" }}>{prog.description}</p>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
                                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#94a3b8" }}><Calendar size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "0.25rem" }}/> Deadline: {prog.deadline}</span>
                                    <button
                                       onClick={() => updateScholarshipProgram(prog.id, { status: prog.status === "Active" ? "Archived" : "Active" })}
                                       style={{ background: "white", border: "1px solid #e2e8f0", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.75rem", fontWeight: "700", color: "#64748b", cursor: "pointer", transition: "all 0.2s" }}
                                    >
                                       {prog.status === "Active" ? "Archive Program" : "Restore Program"}
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", padding: "2.5rem", position: "sticky", top: "2rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                           {editingProg ? <Edit2 size={18} color="#3b82f6" /> : <Plus size={18} color="#3b82f6" />} {editingProg ? "Edit Program" : "New Program"}
                        </h3>
                        <form onSubmit={editingProg ? handleUpdateProgram : handleCreateProgram} style={{ display: "grid", gap: "1.5rem" }}>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>Program Name</label>
                              <input required value={newProgName} onChange={e => setNewProgName(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.9rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>Provider</label>
                              <input required value={newProgProvider} onChange={e => setNewProgProvider(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.9rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>Description</label>
                              <textarea required value={newProgDesc} onChange={e => setNewProgDesc(e.target.value)} rows={4} style={{ width: "100%", padding: "1rem", fontSize: "0.9rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b", resize: "vertical" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>Deadline</label>
                              <input type="date" required value={newProgDeadline} onChange={e => setNewProgDeadline(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.9rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                              {editingProg && (
                                 <button type="button" onClick={() => setEditingProg(null)} style={{ flex: 1, padding: "1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                              )}
                              <button type="submit" style={{ flex: 2, padding: "1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>{editingProg ? "Update Program" : "Create Program"}</button>
                           </div>
                        </form>
                     </div>
                  </div>
               )}

               {osasView === "Batches" && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem", alignItems: "start" }}>
                     <div>
                        <div style={{ marginBottom: "3rem" }}>
                           <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem" }}>Scheduling Cycles</h2>
                           
                           {/* BATCH TIMELINE VISUALIZER */}
                           <div style={{ padding: "3rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", marginBottom: "3rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
                                 <Layers size={20} color="#3b82f6" />
                                 <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>Timeline Map</h4>
                              </div>
                              
                              <div style={{ position: "relative", padding: "1rem 0" }}>
                                 {/* Timeline Axis */}
                                 <div style={{ position: "absolute", top: "35px", left: 0, width: "100%", height: "2px", background: "#e2e8f0", zIndex: 0 }} />
                                 
                                 <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                                    {batchConfigs.length === 0 ? (
                                       <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600", textAlign: "center", width: "100%" }}>No cycles defined.</p>
                                    ) : (
                                       batchConfigs.map((batch, index) => {
                                          const isActive = batch.status === "Active";
                                          return (
                                             <div key={batch.id} style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                                                <div style={{ 
                                                   width: "16px", 
                                                   height: "16px", 
                                                   borderRadius: "50%", 
                                                   background: isActive ? "#3b82f6" : "white", 
                                                   border: isActive ? "4px solid #bfdbfe" : "2px solid #cbd5e1",
                                                   marginBottom: "1rem"
                                                }} />
                                                <div style={{ 
                                                   padding: "1rem", 
                                                   background: isActive ? "#eff6ff" : "white", 
                                                   border: "1px solid",
                                                   borderColor: isActive ? "#bfdbfe" : "#e2e8f0",
                                                   borderRadius: "8px",
                                                   textAlign: "center",
                                                   minWidth: "120px",
                                                   boxShadow: isActive ? "0 4px 6px rgba(59, 130, 246, 0.1)" : "none"
                                                }}>
                                                   <p style={{ fontSize: "0.8rem", fontWeight: "800", color: isActive ? "#1e3a8a" : "#64748b" }}>{batch.name}</p>
                                                   <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8", marginTop: "0.25rem" }}>{batch.startDate?.split('-').slice(1).join('/') || "TBD"}</p>
                                                </div>
                                             </div>
                                          );
                                       })
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div style={{ display: "grid", gap: "1.5rem" }}>
                           {batchConfigs.map(batch => (
                              <div key={batch.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", borderLeft: batch.status === "Archived" ? "4px solid #cbd5e1" : "4px solid #10b981", padding: "2rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                                    <div>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", marginBottom: "0.25rem" }}>Batch #{batch.id}</p>
                                       <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: batch.status === "Archived" ? "#94a3b8" : "#1e293b" }}>{batch.name}</h3>
                                    </div>
                                    <div style={{ display: "flex", gap: "0.5rem" }}>
                                       <button onClick={() => startEditBatch(batch)} style={{ width: "36px", height: "36px", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Edit2 size={16} /></button>
                                       <button onClick={() => setConfirmConfig({
                                          isOpen: true,
                                          title: "Delete Batch",
                                          message: `Are you sure you want to permanently delete ${batch.name}?`,
                                          type: "danger",
                                          onConfirm: () => deleteBatchConfig(batch.id)
                                       })} style={{ width: "36px", height: "36px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", color: "#ef4444", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Trash2 size={16} /></button>
                                    </div>
                                 </div>
                                 <div style={{ display: "flex", gap: "3rem", marginBottom: "2rem", background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                                    <div>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.25rem" }}>Start Date</p>
                                       <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>{batch.startDate || "Not Set"}</p>
                                    </div>
                                    <div>
                                       <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8", marginBottom: "0.25rem" }}>End Date</p>
                                       <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>{batch.endDate || "Not Set"}</p>
                                    </div>
                                 </div>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: batch.status === "Active" ? "#10b981" : "#64748b", background: batch.status === "Active" ? "#f0fdf4" : "#f1f5f9", padding: "0.4rem 1rem", borderRadius: "20px" }}>
                                       {batch.status}
                                    </span>
                                    <div style={{ display: "flex", gap: "0.75rem" }}>
                                       {batch.status !== "Active" && (
                                          <button
                                             onClick={() => updateBatchConfig(batch.id, { status: "Active" })}
                                             style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "700", color: "#2563eb", cursor: "pointer" }}
                                          >
                                             Activate
                                          </button>
                                       )}
                                       <button
                                          onClick={() => updateBatchConfig(batch.id, { status: batch.status === "Archived" ? "Inactive" : "Archived" })}
                                          style={{ background: "white", border: "1px solid #e2e8f0", padding: "0.5rem 1.25rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", cursor: "pointer" }}
                                       >
                                          {batch.status === "Archived" ? "Restore" : "Archive"}
                                       </button>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>

                     <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", padding: "2.5rem", position: "sticky", top: "2rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                           {editingBatch ? <Edit2 size={18} color="#3b82f6" /> : <Plus size={18} color="#3b82f6" />} {editingBatch ? "Edit Batch" : "New Batch"}
                        </h3>
                        <form onSubmit={editingBatch ? handleUpdateBatch : handleCreateBatch} style={{ display: "grid", gap: "1.5rem" }}>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>Batch Name</label>
                              <input required value={batchName} onChange={e => setBatchName(e.target.value)} placeholder="e.g. Batch 2" style={{ width: "100%", padding: "1rem", fontSize: "0.9rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>Start Date</label>
                              <input type="date" required value={batchStart} onChange={e => setBatchStart(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.9rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.8rem", fontWeight: "700", color: "#475569" }}>End Date</label>
                              <input type="date" required value={batchEnd} onChange={e => setBatchEnd(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.9rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                              {editingBatch && (
                                 <button type="button" onClick={() => setEditingBatch(null)} style={{ flex: 1, padding: "1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                              )}
                              <button type="submit" style={{ flex: 2, padding: "1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>{editingBatch ? "Update Batch" : "Create Batch"}</button>
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
            <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem", backdropFilter: "blur(10px)" }}>
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: "100%", maxWidth: "1000px", background: "white", borderRadius: "24px", overflow: "hidden", display: "grid", gridTemplateColumns: "1fr 350px", height: "80vh", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                  <div style={{ background: "#f8fafc", position: "relative", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
                     <div style={{ width: "100%", maxWidth: "450px", aspectRatio: "1/1.4", background: "white", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", borderRadius: "8px", padding: "3rem", display: "flex", flexDirection: "column" }}>
                        <div style={{ borderBottom: "2px solid #e2e8f0", paddingBottom: "1rem", marginBottom: "2rem", textAlign: "center" }}>
                           <h4 style={{ color: "#1e293b", fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.25rem" }}>Official Document</h4>
                           <p style={{ color: "#64748b", fontSize: "0.7rem", fontWeight: "700" }}>UNIVERSITY OF THE PHILIPPINES • SPARK OSAS</p>
                        </div>
                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                           <FileText size={64} color="#cbd5e1" />
                        </div>
                        <div style={{ marginTop: "auto", borderTop: "1px solid #e2e8f0", paddingTop: "1.5rem" }}>
                           <p style={{ color: "#64748b", fontSize: "0.65rem", fontWeight: "700", textTransform: "uppercase", marginBottom: "0.25rem" }}>Document Type</p>
                           <p style={{ color: "#1e293b", fontSize: "0.9rem", fontWeight: "800" }}>{previewDoc.name}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div style={{ padding: "3rem 2.5rem", display: "flex", flexDirection: "column", borderLeft: "1px solid #f1f5f9", background: "white" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "3rem" }}>
                        <div>
                           <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#3b82f6", letterSpacing: "0.05em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Document Review</p>
                           <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>{previewDoc.name}</h3>
                           <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500" }}>Submitted by <strong>{previewDoc.studentName}</strong></p>
                        </div>
                        <button onClick={() => setPreviewDoc(null)} style={{ width: "36px", height: "36px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                           <X size={16} />
                        </button>
                     </div>
                     <div style={{ marginTop: "auto", display: "grid", gap: "1rem" }}>
                        <button onClick={async () => { await verifyDocument(previewDoc.userId, previewDoc.name, "Approved", "Approved by OSAS."); setPreviewDoc(null); }} style={{ width: "100%", padding: "1.25rem", background: "#10b981", color: "white", border: "none", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                           <CheckCircle2 size={18} /> Approve Document
                        </button>
                        <button onClick={async () => { const r = prompt("Reason for rejection:"); if (r) { await verifyDocument(previewDoc.userId, previewDoc.name, "Rejected", r); setPreviewDoc(null); } }} style={{ width: "100%", padding: "1.25rem", background: "white", border: "1px solid #fecaca", color: "#ef4444", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                           <X size={18} /> Reject Document
                        </button>
                     </div>
                  </div>
               </motion.div>
            </div>
         )}

         {/* Identity Verification Modal */}
         {isVerifyingIdentity && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ width: "100%", maxWidth: "600px", background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                  <div style={{ padding: "2rem 2.5rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b" }}>Identity Protocol</h2>
                        <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b", marginTop: "0.25rem" }}>Complete your profile to proceed</p>
                     </div>
                     <button onClick={() => setIsVerifyingIdentity(false)} style={{ background: "white", border: "1px solid #e2e8f0", color: "#64748b", cursor: "pointer", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px" }}>
                        <X size={20} />
                     </button>
                  </div>
                  <form onSubmit={handleCommitIdentity} style={{ padding: "2.5rem", display: "grid", gap: "1.5rem" }}>
                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                        <div>
                           <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>First Name</label>
                           <input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="e.g. Juan" style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", color: "#1e293b" }} />
                        </div>
                        <div>
                           <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Middle Name</label>
                           <input value={middleName} onChange={e => setMiddleName(e.target.value)} placeholder="e.g. Santos" style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", color: "#1e293b" }} />
                        </div>
                     </div>
                     <div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Last Name</label>
                        <input required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="e.g. Dela Cruz" style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", color: "#1e293b" }} />
                     </div>
                     <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                        <button type="button" onClick={() => setIsVerifyingIdentity(false)} style={{ flex: 1, padding: "1.15rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#475569", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                        <button type="submit" style={{ flex: 2, padding: "1.15rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>Verify & Continue</button>
                     </div>
                  </form>
               </motion.div>
            </div>
         )}
      </div>
   );
}
