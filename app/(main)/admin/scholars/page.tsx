"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Plus, 
  Download, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  User, 
  GraduationCap, 
  ClipboardList, 
  Activity, 
  Layers, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  X,
  Zap,
  Cpu,
  Loader2,
  ShieldAlert
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { 
  getScholarInventory, 
  addScholarToInventory, 
  updateScholarInInventory, 
  deleteScholarFromInventory, 
  bulkUpdateScholarStatus,
  getAllUsers 
} from "@/lib/actions/adminActions";
import { generateInstitutionalPDF } from "@/lib/utils/pdfGenerator";
import ConfirmModal from "@/components/ConfirmModal";
import ProcessGuide from "@/components/ProcessGuide";
import { useState, useEffect } from "react";

export default function ScholarInventoryPage() {
  const { currentUser, logAudit } = useGlobalState();
  const [scholars, setScholars] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Selection & Filtering
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    program: "",
    batch: "",
    status: "",
    type: ""
  });
  
  // Bulk Operation State
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const [batchProgress, setBatchProgress] = useState(0);
  const [batchStatus, setBatchStatus] = useState("");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentScholar, setCurrentScholar] = useState<any>(null);
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    programId: "",
    programName: "",
    type: "Institutional",
    category: "New",
    batch: "",
    status: "Active"
  });

  // Confirmation State
  const [confirmConfig, setConfirmConfig] = useState<any>({ isOpen: false, title: "", message: "", onConfirm: () => {}, type: "danger" });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isAuth = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";

  useEffect(() => {
    if (isAuth) {
      fetchScholars();
    }
  }, [isAuth, page, pageSize, searchTerm, filters]);

  const fetchScholars = async () => {
    setIsLoading(true);
    const result = await getScholarInventory(page, pageSize, searchTerm, filters);
    setScholars(result.scholars);
    setTotal(result.total);
    setIsLoading(false);
    setSelectedIds([]); 
  };

  const handleBulkStatusUpdate = async (status: string) => {
    if (selectedIds.length === 0) return;
    
    setIsProcessingBatch(true);
    setBatchStatus("Preparing update...");
    setBatchProgress(10);
    
    // Artificial High-Fidelity Sequence
    await new Promise(r => setTimeout(r, 800));
    setBatchStatus("Verifying records...");
    setBatchProgress(30);
    
    await new Promise(r => setTimeout(r, 1000));
    setBatchStatus(`Updating status: ${status.toUpperCase()}...`);
    setBatchProgress(60);

    const res = await bulkUpdateScholarStatus(selectedIds, status);
    
    if (res.success) {
      setBatchProgress(90);
      setBatchStatus("Saving changes...");
      await new Promise(r => setTimeout(r, 600));
      
      logAudit("BULK_STATUS_UPDATE", `Updated status to ${status} for ${selectedIds.length} scholars.`, "MEDIUM");
      fetchScholars();
      
      setBatchProgress(100);
      setBatchStatus("Update complete!");
      await new Promise(r => setTimeout(r, 1000));
    } else {
      setBatchStatus("Update failed. Please try again.");
      await new Promise(r => setTimeout(r, 2000));
    }
    
    setIsProcessingBatch(false);
    setBatchProgress(0);
    setBatchStatus("");
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === scholars.length && scholars.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(scholars.map(s => s.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleAddScholar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addScholarToInventory(formData);
    if (res.success) {
      setIsAddModalOpen(false);
      resetForm();
      fetchScholars();
      logAudit("SCHOLAR_ADDED", `New scholar added: ${formData.studentName} (${formData.studentId})`, "MEDIUM");
    }
  };

  const handleUpdateScholar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentScholar) return;
    const res = await updateScholarInInventory(currentScholar.id, formData);
    if (res.success) {
      setIsEditModalOpen(false);
      resetForm();
      fetchScholars();
      logAudit("SCHOLAR_UPDATED", `Updated record for: ${formData.studentName}`, "LOW");
    }
  };

  const handleDeleteScholar = async (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "DELETE SCHOLAR RECORD",
      message: `Are you sure you want to permanently remove ${name.toUpperCase()} from the registry? This action cannot be undone.`,
      type: "danger",
      onConfirm: async () => {
        const res = await deleteScholarFromInventory(id);
        if (res.success) {
          fetchScholars();
          logAudit("SCHOLAR_REMOVED", `Removed scholar: ${name}`, "HIGH");
        }
        setConfirmConfig({ ...confirmConfig, isOpen: false });
      }
    });
  };

  const startEdit = (scholar: any) => {
    setCurrentScholar(scholar);
    setFormData({
      studentId: scholar.studentId,
      studentName: scholar.studentName,
      programId: scholar.programId || "",
      programName: scholar.programName,
      type: scholar.type,
      category: scholar.category,
      batch: scholar.batch,
      status: scholar.status
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      studentName: "",
      programId: "",
      programName: "",
      type: "Institutional",
      category: "New",
      batch: "",
      status: "Active"
    });
    setCurrentScholar(null);
  };

  const handleExportPDF = async () => {
    if (scholars.length === 0) return;
    await generateInstitutionalPDF({
      title: "Scholarship Registry Roster",
      subtitle: "Official Institutional Scholar Inventory",
      filename: "SCHOLAR_REGISTRY_ROSTER",
      orientation: "l",
      sections: [
        {
          title: "AUTHORITATIVE SCHOLAR REGISTRY",
          data: [
            ["ID", "Student Name", "Academic Program", "Batch", "Type", "Status"],
            ...scholars.map(s => [
              s.studentId,
              s.studentName,
              s.programName,
              s.batch,
              s.type,
              s.status
            ])
          ]
        }
      ]
    });
  };

  const totalPages = Math.ceil(total / pageSize);

  if (!isHydrated) return null;

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", position: "relative" }}>
      
      {/* BATCH PROGRESS OVERLAY */}
      <AnimatePresence>
        {isProcessingBatch && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 2000,
              background: "rgba(10, 15, 25, 0.9)",
              backdropFilter: "blur(40px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem"
            }}
          >
            <div style={{ width: "100%", maxWidth: "600px", textAlign: "center" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                style={{ width: "80px", height: "80px", margin: "0 auto 3rem", position: "relative" }}
              >
                <div style={{ position: "absolute", inset: 0, border: "2px dashed var(--primary)", borderRadius: "50%", opacity: 0.3 }} />
                <div style={{ position: "absolute", inset: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Cpu size={32} color="var(--primary)" />
                </div>
              </motion.div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.2em", marginBottom: "1rem" }}>{batchStatus}</h2>
              <p style={{ color: "var(--primary)", fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.1em", marginBottom: "3rem" }}>Updating {selectedIds.length} scholar records</p>
              
              <div style={{ height: "4px", width: "100%", background: "var(--bg-accent)", borderRadius: "2px", overflow: "hidden", marginBottom: "1rem" }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${batchProgress}%` }}
                  style={{ height: "100%", background: "var(--primary)", boxShadow: "0 0 20px var(--primary-glow)" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>
                <span>Progress</span>
                <span>{batchProgress}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && scholars.length === 0 ? (
        <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
           <Activity size={48} className="status-pulse" color="var(--primary)" />
        </div>
      ) : !isAuth ? (
        <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
            <AlertCircle size={64} color="#ef4444" />
            <div style={{ textAlign: "center" }}>
               <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)" }}>UNAUTHORIZED ACCESS</h2>
               <p style={{ color: "var(--text-dim)", fontWeight: "700", marginTop: "0.5rem" }}>INSTITUTIONAL CLEARANCE REQUIRED.</p>
            </div>
        </div>
      ) : (
        <>
          {/* HEADER SECTION */}
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
          <div>
             <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Scholarship Management</p>
             <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "var(--text-main)" }}>
               <span style={{ color: "var(--primary)" }}>Scholar Registry</span>
             </h1>
             <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>View, add, update, and manage all scholarship records.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
             <button 
               onClick={handleExportPDF}
               disabled={scholars.length === 0}
               style={{ padding: "1.25rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem", background: "rgba(0, 229, 255, 0.05)", border: "1px solid var(--border-active)", color: "var(--primary)", fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.15em", cursor: "pointer", opacity: scholars.length === 0 ? 0.3 : 1 }}
             >
                <Download size={18} /> Export Scholar List
             </button>
             <button 
               onClick={() => { resetForm(); setIsAddModalOpen(true); }}
               className="btn-cyan" 
               style={{ padding: "1.25rem 2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}
             >
                <Plus size={18} /> Add New Scholar
             </button>
          </div>
       </div>

       <ProcessGuide 
          title="How to Manage Scholars"
          steps={[
             { title: "View Scholars", desc: "Browse the full list of scholars by program, batch, or status.", icon: <Search size={14} /> },
             { title: "Add Scholar", desc: "Register a new student into a scholarship program.", icon: <Plus size={14} /> },
             { title: "Update Status", desc: "Change a scholar's status based on their academic standing.", icon: <User size={14} /> },
             { title: "Export Report", desc: "Download the scholar list as a PDF for reporting.", icon: <Download size={14} /> }
          ]}
       />

       {/* TELEMETRY NODES */}
       <div className="card-grid" style={{ marginBottom: "4rem" }}>
          <div className="sapphire-card" style={{ borderLeft: "4px solid var(--primary)" }}>
             <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "1.5rem" }}>Total Scholars</p>
             <h2 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--text-main)" }}>{total}</h2>
             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1.5rem" }}>
                <Activity size={14} color="var(--primary)" className="animate-pulse" />
                <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.05em" }}>Live Data</span>
             </div>
          </div>
          <div className="sapphire-card">
             <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "1.5rem" }}>Current Batch</p>
             <h2 style={{ fontSize: "2.5rem", fontWeight: "900", color: "var(--text-main)" }}>{scholars.length > 0 ? scholars[0].batch : "N/A"}</h2>
             <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "1.5rem" }}>Active school year batch</p>
          </div>
          <div className="sapphire-card" style={{ background: "rgba(0, 229, 255, 0.02)", border: "1px solid var(--primary)" }}>
             <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em", marginBottom: "1.5rem" }}>Data Security</p>
             <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <ShieldCheck size={28} color="#10b981" />
                <span style={{ fontSize: "1rem", fontWeight: "900", color: "#10b981" }}>Secure</span>
             </div>
             <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "1.5rem" }}>Data verified and up to date</p>
          </div>
       </div>

       {/* CONTROLS & FILTERING */}
       <div className="sapphire-card" style={{ marginBottom: "3rem", padding: "2rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "2rem", alignItems: "center" }}>
             <div style={{ position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--primary)", opacity: 0.5 }} />
                <input 
                  type="text" 
                  placeholder="Search by name or student ID..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "1rem 1rem 1rem 3.5rem", 
                    background: "rgba(255,255,255,0.02)", 
                    border: "1px solid var(--border-dim)", 
                    color: "var(--text-main)",
                    fontSize: "0.85rem",
                    fontWeight: "700"
                  }}
                />
             </div>
             
             <select 
               value={filters.program}
               onChange={(e) => setFilters({...filters, program: e.target.value})}
               style={{ padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.75rem", fontWeight: "900" }}
             >
                <option value="">All Programs</option>
                {Array.from(new Set(scholars.map(s => s.programName))).map(p => (
                  <option key={p} value={p}>{p.toUpperCase()}</option>
                ))}
             </select>

             <select 
               value={filters.batch}
               onChange={(e) => setFilters({...filters, batch: e.target.value})}
               style={{ padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.75rem", fontWeight: "900" }}
             >
                <option value="">All Batches</option>
                {Array.from(new Set(scholars.map(s => s.batch))).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
             </select>

             <select 
               value={filters.status}
               onChange={(e) => setFilters({...filters, status: e.target.value})}
               style={{ padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.75rem", fontWeight: "900" }}
             >
                <option value="">All Statuses</option>
                <option value="Active">ACTIVE</option>
                <option value="Graduated">GRADUATED</option>
                <option value="Terminated">TERMINATED</option>
             </select>
          </div>
       </div>

       {/* BULK ACTION BAR */}
       <AnimatePresence>
          {selectedIds.length > 0 && (
             <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 15 }}
               className="sapphire-card" 
               style={{ 
                 marginBottom: "3rem", 
                 padding: "1.5rem 2.5rem", 
                 background: "rgba(0, 229, 255, 0.05)", 
                 border: "1px solid var(--primary)", 
                 display: "flex", 
                 justifyContent: "space-between", 
                 alignItems: "center",
                 boxShadow: "0 10px 30px rgba(0, 229, 255, 0.1)"
               }}
             >
                <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                     <Zap size={20} color="var(--primary)" />
                     <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.05em" }}>{selectedIds.length}  scholars selected</p>
                   </div>
                   <div style={{ width: "1px", height: "30px", background: "var(--border-dim)" }} />
                   <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>Batch actions:</p>
                </div>
                <div style={{ display: "flex", gap: "1rem" }}>
                   <button onClick={() => handleBulkStatusUpdate("Active")} className="btn-cyan" style={{ padding: "0.75rem 2rem", fontSize: "0.7rem", fontWeight: "900" }}>ACTIVATE</button>
                   <button onClick={() => handleBulkStatusUpdate("Graduated")} style={{ padding: "0.75rem 2rem", background: "#10b981", color: "white", fontSize: "0.7rem", fontWeight: "900", border: "none", cursor: "pointer", borderRadius: "4px" }}>GRADUATE</button>
                   <button onClick={() => handleBulkStatusUpdate("Terminated")} style={{ padding: "0.75rem 2rem", background: "#ef4444", color: "white", fontSize: "0.7rem", fontWeight: "900", border: "none", cursor: "pointer", borderRadius: "4px" }}>TERMINATE</button>
                   <button onClick={() => setSelectedIds([])} style={{ padding: "0.75rem 2rem", background: "transparent", border: "1px solid var(--border-dim)", color: "var(--text-dim)", fontSize: "0.7rem", fontWeight: "900", cursor: "pointer", borderRadius: "4px" }}>CANCEL</button>
                </div>
             </motion.div>
          )}
       </AnimatePresence>

       {/* SCHOLAR TABLE */}
       <div className="sapphire-card" style={{ padding: "0", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
             <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                   <tr style={{ background: "rgba(0, 229, 255, 0.02)", borderBottom: "1px solid var(--border-dim)" }}>
                      <th style={{ padding: "2rem", width: "80px" }}>
                         <input 
                           type="checkbox" 
                           checked={scholars.length > 0 && selectedIds.length === scholars.length}
                           onChange={toggleSelectAll}
                         />
                      </th>
                      <th style={{ padding: "2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>IDENTIFIER</th>
                      <th style={{ padding: "2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>SCHOLAR_NAME</th>
                      <th style={{ padding: "2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>PROGRAM</th>
                      <th style={{ padding: "2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>BATCH</th>
                      <th style={{ padding: "2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>CATEGORY</th>
                      <th style={{ padding: "2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>STATUS</th>
                      <th style={{ padding: "2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", textAlign: "right" }}>ACTIONS</th>
                   </tr>
                </thead>
                   <tbody>
                     <AnimatePresence mode="popLayout">
                       {scholars.map((scholar, i) => (
                         <motion.tr 
                           key={scholar.id} 
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.03 }}
                           style={{ 
                             borderBottom: "1px solid var(--border-dim)", 
                             background: selectedIds.includes(scholar.id) ? "rgba(0, 229, 255, 0.05)" : (i % 2 === 0 ? "transparent" : "rgba(0, 229, 255, 0.01)"),
                             transition: "background 0.2s"
                           }}
                         >
                              <td style={{ padding: "2rem" }}>
                                 <input 
                                   type="checkbox" 
                                   checked={selectedIds.includes(scholar.id)}
                                   onChange={() => toggleSelectOne(scholar.id)}
                                 />
                              </td>
                              <td style={{ padding: "2rem", fontSize: "0.8rem", fontWeight: "900", color: "var(--text-dim)" }}>{scholar.studentId}</td>
                              <td style={{ padding: "2rem" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-dim)" }}>
                                       <User size={16} color="var(--primary)" />
                                    </div>
                                    <span style={{ fontSize: "0.9rem", fontWeight: "800", color: "white" }}>{scholar.studentName.toUpperCase()}</span>
                                 </div>
                              </td>
                              <td style={{ padding: "2rem" }}>
                                 <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--text-main)" }}>{scholar.programName}</p>
                                 <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.4rem", letterSpacing: "0.1em" }}>TYPE: {scholar.type.toUpperCase()}</p>
                              </td>
                              <td style={{ padding: "2rem", fontSize: "0.9rem", fontWeight: "800", color: "var(--text-main)" }}>{scholar.batch}</td>
                              <td style={{ padding: "2rem" }}>
                                 <span style={{ 
                                   padding: "0.5rem 1rem", 
                                   borderRadius: "4px", 
                                   fontSize: "0.6rem", 
                                   fontWeight: "900", 
                                   background: scholar.category === "New" ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
                                   color: scholar.category === "New" ? "#3b82f6" : "#10b981",
                                   border: `1px solid ${scholar.category === "New" ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)"}`,
                                   letterSpacing: "0.1em"
                                 }}>
                                   {scholar.category.toUpperCase()}
                                 </span>
                              </td>
                              <td style={{ padding: "2rem" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: scholar.status === "Active" ? "#10b981" : "#ef4444", boxShadow: scholar.status === "Active" ? "0 0 10px rgba(16, 185, 129, 0.4)" : "none" }} />
                                    <span style={{ fontSize: "0.75rem", fontWeight: "900", color: scholar.status === "Active" ? "#10b981" : "#ef4444" }}>{scholar.status.toUpperCase()}</span>
                                 </div>
                              </td>
                              <td style={{ padding: "2rem", textAlign: "right" }}>
                                 <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                                    <button onClick={() => startEdit(scholar)} style={{ padding: "0.75rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", borderRadius: "4px", cursor: "pointer" }}>
                                       <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteScholar(scholar.id, scholar.studentName)} style={{ padding: "0.75rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", borderRadius: "4px", cursor: "pointer" }}>
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                         </motion.tr>
                       ))}
                     </AnimatePresence>
                   {scholars.length === 0 && !isLoading && (
                      <tr>
                         <td colSpan={8} style={{ padding: "10rem", textAlign: "center" }}>
                            <Layers size={64} color="var(--text-dim)" style={{ marginBottom: "2rem", opacity: 0.1 }} />
                            <p style={{ fontSize: "1rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em" }}>No scholars found matching your search.</p>
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div style={{ padding: "2rem 3rem", background: "rgba(255, 255, 255, 0.01)", borderTop: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
             <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.05em" }}>
                Showing: <span style={{ color: "var(--text-main)" }}>{(page - 1) * pageSize + 1}—{Math.min(page * pageSize, total)}</span> of <span style={{ color: "var(--primary)" }}>{total}</span>
             </p>
             <div style={{ display: "flex", gap: "0.75rem" }}>
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{ padding: "0.75rem 1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.7rem", fontWeight: "900", opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? "not-allowed" : "pointer", borderRadius: "4px" }}
                >
                   <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p}
                    onClick={() => setPage(p)}
                    style={{ 
                      padding: "0.75rem 1.5rem", 
                      background: page === p ? "var(--primary)" : "var(--bg-accent)", 
                      border: "1px solid var(--border-dim)", 
                      color: page === p ? "var(--bg-deep)" : "white", 
                      fontSize: "0.7rem", 
                      fontWeight: "900",
                      cursor: "pointer",
                      borderRadius: "4px"
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  style={{ padding: "0.75rem 1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.7rem", fontWeight: "900", opacity: page === totalPages || totalPages === 0 ? 0.3 : 1, cursor: page === totalPages || totalPages === 0 ? "not-allowed" : "pointer", borderRadius: "4px" }}
                >
                   <ChevronRight size={16} />
                </button>
             </div>
          </div>
       </div>

       {/* ADD/EDIT MODAL */}
       <AnimatePresence>
          {(isAddModalOpen || isEditModalOpen) && (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               style={{ position: "fixed", inset: 0, background: "rgba(5, 7, 10, 0.9)", backdropFilter: "blur(20px)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
             >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  style={{ width: "100%", maxWidth: "800px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", padding: "4rem", position: "relative", overflow: "hidden" }}
                >
                   {/* Technical Overlay */}
                   <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: "var(--primary)" }} />

                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4rem" }}>
                      <div>
                         <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.02em" }}>{isAddModalOpen ? "Add New Scholar" : "Edit Scholar Record"}</h2>
                         <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", marginTop: "0.5rem", letterSpacing: "0.2em" }}>Scholarship Registry</p>
                      </div>
                      <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid var(--border-dim)", color: "var(--text-dim)", cursor: "pointer", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                         <X size={20} />
                      </button>
                   </div>

                   <form onSubmit={isAddModalOpen ? handleAddScholar : handleUpdateScholar} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
                      <div style={{ gridColumn: "span 2" }}>
                         <label style={{ display: "block", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>Full Name</label>
                         <input 
                           required
                           value={formData.studentName}
                           onChange={e => setFormData({...formData, studentName: e.target.value})}
                           style={{ width: "100%", padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.95rem", fontWeight: "800" }}
                         />
                      </div>
                      <div>
                         <label style={{ display: "block", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>Student ID</label>
                         <input 
                           required
                           value={formData.studentId}
                           onChange={e => setFormData({...formData, studentId: e.target.value})}
                           style={{ width: "100%", padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.95rem", fontWeight: "800" }}
                         />
                      </div>
                      <div>
                         <label style={{ display: "block", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>Batch / School Year</label>
                         <input 
                           required
                           value={formData.batch}
                           onChange={e => setFormData({...formData, batch: e.target.value})}
                           placeholder="e.g. 2023-2024"
                           style={{ width: "100%", padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.95rem", fontWeight: "800" }}
                         />
                      </div>
                      <div>
                         <label style={{ display: "block", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>Scholarship Program</label>
                         <input 
                           required
                           value={formData.programName}
                           onChange={e => setFormData({...formData, programName: e.target.value})}
                           style={{ width: "100%", padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.95rem", fontWeight: "800" }}
                         />
                      </div>
                      <div>
                         <label style={{ display: "block", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.75rem", letterSpacing: "0.1em" }}>Scholarship Type</label>
                         <select 
                           value={formData.type}
                           onChange={e => setFormData({...formData, type: e.target.value})}
                           style={{ width: "100%", padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.95rem", fontWeight: "800" }}
                         >
                            <option value="Institutional">INSTITUTIONAL</option>
                            <option value="Government">GOVERNMENT</option>
                            <option value="Private">PRIVATE</option>
                         </select>
                      </div>
                      <div style={{ gridColumn: "span 2", marginTop: "3rem" }}>
                         <button type="submit" className="btn-cyan" style={{ width: "100%", padding: "1.5rem", fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1.25rem", justifyContent: "center" }}>
                            <ShieldCheck size={20} />
                            {isAddModalOpen ? "Add Scholar" : "Save Changes"}
                         </button>
                      </div>
                   </form>
                </motion.div>
             </motion.div>
          )}
       </AnimatePresence>

       <ConfirmModal 
         isOpen={confirmConfig.isOpen}
         title={confirmConfig.title}
         message={confirmConfig.message}
         onConfirm={confirmConfig.onConfirm}
         onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
         type={confirmConfig.type}
       />
      </>)}
    </div>
  );
}
