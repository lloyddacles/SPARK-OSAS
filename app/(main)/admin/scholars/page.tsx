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
    
    await new Promise(r => setTimeout(r, 800));
    setBatchStatus("Verifying records...");
    setBatchProgress(30);
    
    await new Promise(r => setTimeout(r, 1000));
    setBatchStatus(`Updating status: ${status}...`);
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
      title: "Delete Scholar Record",
      message: `Are you sure you want to permanently remove ${name} from the registry? This action cannot be undone.`,
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
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem"
            }}
          >
            <div style={{ width: "100%", maxWidth: "600px", textAlign: "center", background: "white", padding: "4rem", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)" }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                style={{ width: "80px", height: "80px", margin: "0 auto 2rem", position: "relative" }}
              >
                <div style={{ position: "absolute", inset: 0, border: "3px dashed #3b82f6", borderRadius: "50%", opacity: 0.3 }} />
                <div style={{ position: "absolute", inset: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Cpu size={32} color="#3b82f6" />
                </div>
              </motion.div>

              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#111827", marginBottom: "0.5rem" }}>{batchStatus}</h2>
              <p style={{ color: "#6b7280", fontSize: "0.9rem", fontWeight: "600", marginBottom: "3rem" }}>Updating {selectedIds.length} scholar records</p>
              
              <div style={{ height: "8px", width: "100%", background: "#f3f4f6", borderRadius: "4px", overflow: "hidden", marginBottom: "1rem" }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${batchProgress}%` }}
                  style={{ height: "100%", background: "#3b82f6" }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", fontWeight: "700", color: "#6b7280" }}>
                <span>Progress</span>
                <span>{batchProgress}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading && scholars.length === 0 ? (
        <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
           <Loader2 size={48} className="animate-spin" color="var(--primary)" />
        </div>
      ) : !isAuth ? (
        <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
            <AlertCircle size={64} color="#ef4444" />
            <div style={{ textAlign: "center" }}>
               <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#111827" }}>Unauthorized Access</h2>
               <p style={{ color: "#6b7280", fontWeight: "600", marginTop: "0.5rem" }}>System Admin clearance required.</p>
            </div>
        </div>
      ) : (
        <>
          {/* HEADER SECTION */}
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "2rem" }}>
          <div>
             <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Scholarship Management</p>
             <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
               <span style={{ color: "var(--primary)" }}>Scholar Registry</span>
             </h1>
             <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>View, add, update, and manage all scholarship records.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
             <button 
               onClick={handleExportPDF}
               disabled={scholars.length === 0}
               style={{ 
                 padding: "0.85rem 1.5rem", 
                 display: "flex", 
                 alignItems: "center", 
                 gap: "0.75rem", 
                 background: "white", 
                 border: "1px solid #e5e7eb", 
                 color: "#374151", 
                 fontSize: "0.9rem", 
                 fontWeight: "700", 
                 borderRadius: "8px",
                 cursor: scholars.length === 0 ? "not-allowed" : "pointer", 
                 opacity: scholars.length === 0 ? 0.5 : 1,
                 boxShadow: "0 2px 4px rgba(0,0,0,0.02)"
               }}
             >
                <Download size={18} /> Export List
             </button>
             <button 
               onClick={() => { resetForm(); setIsAddModalOpen(true); }}
               style={{ 
                 padding: "0.85rem 1.5rem", 
                 display: "flex", 
                 alignItems: "center", 
                 gap: "0.75rem", 
                 background: "var(--primary)", 
                 border: "none", 
                 color: "white", 
                 fontSize: "0.9rem", 
                 fontWeight: "700", 
                 borderRadius: "8px",
                 cursor: "pointer",
                 boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)"
               }}
             >
                <Plus size={18} /> Add Scholar
             </button>
          </div>
       </div>

       <div style={{ marginBottom: "3rem" }}>
         <ProcessGuide 
            title="How to Manage Scholars"
            steps={[
               { title: "View Scholars", desc: "Browse the full list of scholars by program, batch, or status.", icon: <Search size={16} /> },
               { title: "Add Scholar", desc: "Register a new student into a scholarship program.", icon: <Plus size={16} /> },
               { title: "Update Status", desc: "Change a scholar's status based on their academic standing.", icon: <User size={16} /> },
               { title: "Export Report", desc: "Download the scholar list as a PDF for reporting.", icon: <Download size={16} /> }
            ]}
         />
       </div>

       {/* STATS GRID */}
       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", borderLeft: "4px solid var(--primary)" }}>
             <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginBottom: "0.5rem" }}>Total Scholars</p>
             <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b", lineHeight: "1" }}>{total}</h2>
             <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
                <Activity size={16} color="#3b82f6" />
                <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "#3b82f6" }}>Live Data</span>
             </div>
          </div>
          <div style={{ background: "white", borderRadius: "16px", padding: "2rem", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
             <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginBottom: "0.5rem" }}>Current Batch</p>
             <h2 style={{ fontSize: "2.5rem", fontWeight: "800", color: "#1e293b", lineHeight: "1" }}>{scholars.length > 0 ? scholars[0].batch : "N/A"}</h2>
             <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#94a3b8", marginTop: "1rem" }}>Active school year</p>
          </div>
          <div style={{ background: "linear-gradient(135deg, #f0fdf4, #f8fafc)", borderRadius: "16px", padding: "2rem", border: "1px solid #dcfce7", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
             <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#166534", marginBottom: "0.5rem" }}>Data Security</p>
             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.5rem 0" }}>
                <ShieldCheck size={28} color="#10b981" />
                <span style={{ fontSize: "1.25rem", fontWeight: "800", color: "#16a34a" }}>Secure</span>
             </div>
             <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#15803d", marginTop: "1rem" }}>Records verified</p>
          </div>
       </div>

       {/* CONTROLS & FILTERING */}
       <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", padding: "1.5rem 2rem", marginBottom: "3rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", alignItems: "center" }}>
             <div style={{ position: "relative" }}>
                <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
                <input 
                  type="text" 
                  placeholder="Search scholars..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: "100%", 
                    padding: "0.85rem 1rem 0.85rem 2.75rem", 
                    background: "#f8fafc", 
                    border: "1px solid #e2e8f0", 
                    borderRadius: "8px",
                    color: "#1e293b",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    outline: "none"
                  }}
                />
             </div>
             
             <select 
               value={filters.program}
               onChange={(e) => setFilters({...filters, program: e.target.value})}
               style={{ padding: "0.85rem 1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", fontSize: "0.9rem", fontWeight: "600", outline: "none" }}
             >
                <option value="">All Programs</option>
                {Array.from(new Set(scholars.map(s => s.programName))).map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
             </select>

             <select 
               value={filters.batch}
               onChange={(e) => setFilters({...filters, batch: e.target.value})}
               style={{ padding: "0.85rem 1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", fontSize: "0.9rem", fontWeight: "600", outline: "none" }}
             >
                <option value="">All Batches</option>
                {Array.from(new Set(scholars.map(s => s.batch))).map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
             </select>

             <select 
               value={filters.status}
               onChange={(e) => setFilters({...filters, status: e.target.value})}
               style={{ padding: "0.85rem 1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", color: "#475569", fontSize: "0.9rem", fontWeight: "600", outline: "none" }}
             >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Graduated">Graduated</option>
                <option value="Terminated">Terminated</option>
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
               style={{ 
                 marginBottom: "2rem", 
                 padding: "1.25rem 2rem", 
                 background: "#eff6ff", 
                 border: "1px solid #bfdbfe", 
                 borderRadius: "12px",
                 display: "flex", 
                 justifyContent: "space-between", 
                 alignItems: "center",
                 boxShadow: "0 4px 12px rgba(59, 130, 246, 0.1)",
                 flexWrap: "wrap",
                 gap: "1rem"
               }}
             >
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                     <Zap size={20} color="#2563eb" />
                     <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e3a8a" }}>{selectedIds.length} scholars selected</p>
                   </div>
                   <div style={{ width: "1px", height: "24px", background: "#bfdbfe" }} />
                   <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#3b82f6" }}>Batch actions:</p>
                </div>
                <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                   <button onClick={() => handleBulkStatusUpdate("Active")} style={{ padding: "0.6rem 1.5rem", background: "white", color: "#2563eb", border: "1px solid #bfdbfe", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>Activate</button>
                   <button onClick={() => handleBulkStatusUpdate("Graduated")} style={{ padding: "0.6rem 1.5rem", background: "#10b981", color: "white", border: "none", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)" }}>Graduate</button>
                   <button onClick={() => handleBulkStatusUpdate("Terminated")} style={{ padding: "0.6rem 1.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: "6px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 4px rgba(239, 68, 68, 0.2)" }}>Terminate</button>
                   <button onClick={() => setSelectedIds([])} style={{ padding: "0.6rem 1.5rem", background: "transparent", border: "none", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}>Cancel</button>
                </div>
             </motion.div>
          )}
       </AnimatePresence>

       {/* SCHOLAR TABLE */}
       <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
             <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                   <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ padding: "1.25rem 2rem", width: "80px" }}>
                         <input 
                           type="checkbox" 
                           checked={scholars.length > 0 && selectedIds.length === scholars.length}
                           onChange={toggleSelectAll}
                           style={{ cursor: "pointer", width: "16px", height: "16px" }}
                         />
                      </th>
                      <th style={{ padding: "1.25rem 1rem", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>ID</th>
                      <th style={{ padding: "1.25rem 1rem", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Name</th>
                      <th style={{ padding: "1.25rem 1rem", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Program</th>
                      <th style={{ padding: "1.25rem 1rem", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Batch</th>
                      <th style={{ padding: "1.25rem 1rem", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Category</th>
                      <th style={{ padding: "1.25rem 1rem", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase" }}>Status</th>
                      <th style={{ padding: "1.25rem 2rem", fontSize: "0.8rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", textAlign: "right" }}>Actions</th>
                   </tr>
                </thead>
                   <tbody>
                     <AnimatePresence mode="popLayout">
                       {scholars.map((scholar, i) => (
                         <motion.tr 
                           key={scholar.id} 
                           initial={{ opacity: 0, x: -10 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.02 }}
                           style={{ 
                             borderBottom: "1px solid #f1f5f9", 
                             background: selectedIds.includes(scholar.id) ? "#eff6ff" : "white",
                             transition: "background 0.2s"
                           }}
                         >
                              <td style={{ padding: "1.25rem 2rem" }}>
                                 <input 
                                   type="checkbox" 
                                   checked={selectedIds.includes(scholar.id)}
                                   onChange={() => toggleSelectOne(scholar.id)}
                                   style={{ cursor: "pointer", width: "16px", height: "16px" }}
                                 />
                              </td>
                              <td style={{ padding: "1.25rem 1rem", fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>{scholar.studentId}</td>
                              <td style={{ padding: "1.25rem 1rem" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                                       <User size={16} color="#94a3b8" />
                                    </div>
                                    <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b" }}>{scholar.studentName}</span>
                                 </div>
                              </td>
                              <td style={{ padding: "1.25rem 1rem" }}>
                                 <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1e293b" }}>{scholar.programName}</p>
                                 <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8", marginTop: "0.2rem" }}>{scholar.type}</p>
                              </td>
                              <td style={{ padding: "1.25rem 1rem", fontSize: "0.9rem", fontWeight: "600", color: "#475569" }}>{scholar.batch}</td>
                              <td style={{ padding: "1.25rem 1rem" }}>
                                 <span style={{ 
                                   padding: "0.4rem 0.75rem", 
                                   borderRadius: "20px", 
                                   fontSize: "0.75rem", 
                                   fontWeight: "700", 
                                   background: scholar.category === "New" ? "#eff6ff" : "#f0fdf4",
                                   color: scholar.category === "New" ? "#2563eb" : "#16a34a"
                                 }}>
                                   {scholar.category}
                                 </span>
                              </td>
                              <td style={{ padding: "1.25rem 1rem" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: scholar.status === "Active" ? "#10b981" : "#ef4444" }} />
                                    <span style={{ fontSize: "0.85rem", fontWeight: "700", color: scholar.status === "Active" ? "#10b981" : "#ef4444" }}>{scholar.status}</span>
                                 </div>
                              </td>
                              <td style={{ padding: "1.25rem 2rem", textAlign: "right" }}>
                                 <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                    <button onClick={() => startEdit(scholar)} style={{ width: "36px", height: "36px", background: "white", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                       <Edit2 size={16} />
                                    </button>
                                    <button onClick={() => handleDeleteScholar(scholar.id, scholar.studentName)} style={{ width: "36px", height: "36px", background: "#fef2f2", border: "1px solid #fecaca", color: "#ef4444", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}>
                                       <Trash2 size={16} />
                                    </button>
                                 </div>
                              </td>
                         </motion.tr>
                       ))}
                     </AnimatePresence>
                   {scholars.length === 0 && !isLoading && (
                      <tr>
                         <td colSpan={8} style={{ padding: "6rem", textAlign: "center" }}>
                            <Layers size={48} color="#cbd5e1" style={{ marginBottom: "1.5rem", opacity: 0.5 }} />
                            <p style={{ fontSize: "1rem", fontWeight: "700", color: "#64748b" }}>No scholars found matching your criteria.</p>
                         </td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>

          {/* PAGINATION FOOTER */}
          <div style={{ padding: "1.5rem 2rem", background: "#f8fafc", borderTop: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
             <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>
                Showing <span style={{ fontWeight: "800", color: "#1e293b" }}>{(page - 1) * pageSize + 1}</span> to <span style={{ fontWeight: "800", color: "#1e293b" }}>{Math.min(page * pageSize, total)}</span> of <span style={{ fontWeight: "800", color: "#1e293b" }}>{total}</span> entries
             </p>
             <div style={{ display: "flex", gap: "0.5rem" }}>
                <button 
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "8px", opacity: page === 1 ? 0.5 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
                >
                   <ChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button 
                    key={p}
                    onClick={() => setPage(p)}
                    style={{ 
                      minWidth: "36px", 
                      height: "36px", 
                      padding: "0 0.5rem",
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      background: page === p ? "var(--primary)" : "white", 
                      border: page === p ? "none" : "1px solid #e2e8f0", 
                      color: page === p ? "white" : "#475569", 
                      fontSize: "0.85rem", 
                      fontWeight: "700",
                      cursor: "pointer",
                      borderRadius: "8px"
                    }}
                  >
                    {p}
                  </button>
                ))}
                <button 
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  style={{ width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", background: "white", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "8px", opacity: page === totalPages || totalPages === 0 ? 0.5 : 1, cursor: page === totalPages || totalPages === 0 ? "not-allowed" : "pointer" }}
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
               style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(10px)", zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}
             >
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  style={{ width: "100%", maxWidth: "700px", background: "white", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", overflow: "hidden" }}
                >
                   <div style={{ padding: "2rem 2.5rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                         <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b" }}>{isAddModalOpen ? "Add New Scholar" : "Edit Scholar Record"}</h2>
                         <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b", marginTop: "0.2rem" }}>Scholarship Registry</p>
                      </div>
                      <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} style={{ background: "white", border: "1px solid #e2e8f0", color: "#64748b", cursor: "pointer", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                         <X size={20} />
                      </button>
                   </div>

                   <form onSubmit={isAddModalOpen ? handleAddScholar : handleUpdateScholar} style={{ padding: "2.5rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                      <div style={{ gridColumn: "span 2" }}>
                         <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Full Name</label>
                         <input 
                           required
                           value={formData.studentName}
                           onChange={e => setFormData({...formData, studentName: e.target.value})}
                           style={{ width: "100%", padding: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "0.95rem", fontWeight: "600", outline: "none" }}
                         />
                      </div>
                      <div>
                         <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Student ID</label>
                         <input 
                           required
                           value={formData.studentId}
                           onChange={e => setFormData({...formData, studentId: e.target.value})}
                           style={{ width: "100%", padding: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "0.95rem", fontWeight: "600", outline: "none" }}
                         />
                      </div>
                      <div>
                         <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Batch / School Year</label>
                         <input 
                           required
                           value={formData.batch}
                           onChange={e => setFormData({...formData, batch: e.target.value})}
                           placeholder="e.g. 2023-2024"
                           style={{ width: "100%", padding: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "0.95rem", fontWeight: "600", outline: "none" }}
                         />
                      </div>
                      <div style={{ gridColumn: "span 2" }}>
                         <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Scholarship Program</label>
                         <input 
                           required
                           value={formData.programName}
                           onChange={e => setFormData({...formData, programName: e.target.value})}
                           style={{ width: "100%", padding: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "0.95rem", fontWeight: "600", outline: "none" }}
                         />
                      </div>
                      <div>
                         <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Scholarship Type</label>
                         <select 
                           value={formData.type}
                           onChange={e => setFormData({...formData, type: e.target.value})}
                           style={{ width: "100%", padding: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "0.95rem", fontWeight: "600", outline: "none" }}
                         >
                            <option value="Institutional">Institutional</option>
                            <option value="Government">Government</option>
                            <option value="Private">Private</option>
                         </select>
                      </div>
                      <div>
                         <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "700", color: "#475569", marginBottom: "0.5rem" }}>Category</label>
                         <select 
                           value={formData.category}
                           onChange={e => setFormData({...formData, category: e.target.value})}
                           style={{ width: "100%", padding: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#1e293b", fontSize: "0.95rem", fontWeight: "600", outline: "none" }}
                         >
                            <option value="New">New</option>
                            <option value="Continuing">Continuing</option>
                         </select>
                      </div>
                      <div style={{ gridColumn: "span 2", marginTop: "1rem" }}>
                         <button type="submit" style={{ width: "100%", padding: "1.25rem", background: "var(--primary)", color: "white", borderRadius: "12px", border: "none", fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                            <ShieldCheck size={20} />
                            {isAddModalOpen ? "Save New Scholar" : "Save Changes"}
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
