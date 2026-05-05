"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  Search, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  MoreVertical,
  Filter,
  Download,
  Trash2,
  Edit2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Activity,
  Calendar,
  Layers,
  ShieldCheck,
  X
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { getScholarInventory, addScholarToInventory, updateScholarInInventory, deleteScholarFromInventory, getAllUsers } from "@/lib/actions/adminActions";
import ConfirmModal from "@/components/ConfirmModal";

export default function ScholarInventoryPage() {
  const { currentUser, logAudit } = useGlobalState();
  const [scholars, setScholars] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState<any | null>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    programId: "",
    programName: "",
    type: "Institutional",
    category: "New",
    batch: "2023-2024",
    status: "Active",
    dateAwarded: new Date().toISOString().split('T')[0]
  });

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "danger" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning"
  });

  const isAuth = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";

  useEffect(() => {
    if (isAuth) {
      fetchScholars();
    }
  }, [isAuth, page, pageSize, searchTerm]);

  const fetchScholars = async () => {
    setIsLoading(true);
    const result = await getScholarInventory(page, pageSize, searchTerm);
    setScholars(result.scholars);
    setTotal(result.total);
    setIsLoading(false);
  };

  const handleAddScholar = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await addScholarToInventory(formData);
    if (res.success) {
      logAudit("SCHOLAR_ADDED", `Scholar ${formData.studentName} added to inventory.`, "LOW");
      setIsAddModalOpen(false);
      fetchScholars();
      resetForm();
    }
  };

  const handleUpdateScholar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedScholar) return;
    const res = await updateScholarInInventory(selectedScholar.id, formData);
    if (res.success) {
      logAudit("SCHOLAR_MODIFIED", `Scholar ${formData.studentName} records updated.`, "MEDIUM");
      setIsEditModalOpen(false);
      fetchScholars();
    }
  };

  const handleDeleteScholar = (id: string, name: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "TERMINATE SCHOLAR RECORD",
      message: `ARE YOU ABSOLUTELY SURE YOU WANT TO REMOVE '${name.toUpperCase()}' FROM THE OFFICIAL SCHOLAR INVENTORY? THIS ACTION IS PERMANENT.`,
      type: "danger",
      onConfirm: async () => {
        const res = await deleteScholarFromInventory(id);
        if (res.success) {
          logAudit("SCHOLAR_TERMINATED", `Scholar ${name} removed from inventory.`, "HIGH");
          fetchScholars();
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      studentName: "",
      programId: "",
      programName: "",
      type: "Institutional",
      category: "New",
      batch: "2023-2024",
      status: "Active",
      dateAwarded: new Date().toISOString().split('T')[0]
    });
  };

  const startEdit = (scholar: any) => {
    setSelectedScholar(scholar);
    setFormData({
      studentId: scholar.studentId,
      studentName: scholar.studentName,
      programId: scholar.programId,
      programName: scholar.programName,
      type: scholar.type,
      category: scholar.category,
      batch: scholar.batch,
      status: scholar.status,
      dateAwarded: new Date(scholar.dateAwarded).toISOString().split('T')[0]
    });
    setIsEditModalOpen(true);
  };

  if (!isAuth) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
         <AlertTriangle size={64} color="#ef4444" />
         <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)" }}>UNAUTHORIZED ACCESS</h2>
            <p style={{ color: "var(--text-dim)", fontWeight: "700", marginTop: "0.5rem" }}>INSTITUTIONAL CLEARANCE REQUIRED.</p>
         </div>
      </div>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div style={{ padding: "2rem 0" }}>
      
      {/* HEADER SECTION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem" }}>
         <div>
            <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>UNIT: OSAS_SCHOLARSHIP_DIVISION</p>
            <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
              SCHOLAR <span style={{ color: "var(--primary)" }}>INVENTORY</span>
            </h1>
         </div>
         <div style={{ display: "flex", gap: "1rem" }}>
            <button 
              onClick={() => { resetForm(); setIsAddModalOpen(true); }}
              className="btn-cyan" 
              style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}
            >
               <Plus size={18} /> PROVISION NEW RECORD
            </button>
         </div>
      </div>

      {/* TELEMETRY NODES */}
      <div className="card-grid" style={{ marginBottom: "3rem" }}>
         <div className="sapphire-card">
            <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "1rem" }}>TOTAL ACTIVE SCHOLARS</p>
            <h2 style={{ fontSize: "2rem", fontWeight: "900" }}>{total}</h2>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1rem" }}>
               <Activity size={12} color="var(--primary)" />
               <span style={{ fontSize: "0.55rem", fontWeight: "800", color: "var(--primary)" }}>REAL-TIME REGISTRY SYNC</span>
            </div>
         </div>
         <div className="sapphire-card">
            <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "1rem" }}>BATCH DISTRIBUTION</p>
            <h2 style={{ fontSize: "2rem", fontWeight: "900" }}>{scholars.length > 0 ? scholars[0].batch : "N/A"}</h2>
            <p style={{ fontSize: "0.55rem", fontWeight: "800", color: "var(--text-dim)", marginTop: "1rem" }}>PRIMARY COHORT</p>
         </div>
         <div className="sapphire-card">
            <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "1rem" }}>SYSTEM HEALTH</p>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
               <ShieldCheck size={24} color="#10b981" />
               <span style={{ fontSize: "0.8rem", fontWeight: "900", color: "#10b981" }}>ENCRYPTED</span>
            </div>
            <p style={{ fontSize: "0.55rem", fontWeight: "800", color: "var(--text-dim)", marginTop: "1rem" }}>DATA INTEGRITY VERIFIED</p>
         </div>
      </div>

      {/* CONTROLS & FILTERING */}
      <div className="sapphire-card" style={{ marginBottom: "2rem", padding: "1.5rem" }}>
         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ position: "relative", width: "400px" }}>
               <Search size={16} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
               <input 
                 type="text" 
                 placeholder="SEARCH BY NAME, ID, OR BATCH..." 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 style={{ 
                   width: "100%", 
                   padding: "1rem 1rem 1rem 3rem", 
                   background: "var(--bg-accent)", 
                   border: "1px solid var(--border-dim)", 
                   color: "white",
                   fontSize: "0.75rem",
                   fontWeight: "700"
                 }}
               />
            </div>
            <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
               <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>SHOW</span>
               <select 
                 value={pageSize}
                 onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                 style={{ background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", padding: "0.5rem 1rem", fontSize: "0.7rem", fontWeight: "900" }}
               >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
               </select>
               <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>RECORDS</span>
            </div>
         </div>
      </div>

      {/* SCHOLAR TABLE */}
      <div className="sapphire-card" style={{ padding: "0", overflow: "hidden" }}>
         <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
               <thead>
                  <tr style={{ background: "rgba(0, 229, 255, 0.02)", borderBottom: "1px solid var(--border-dim)" }}>
                     <th style={{ padding: "1.5rem 2rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>IDENTIFIER</th>
                     <th style={{ padding: "1.5rem 2rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>SCHOLAR NAME</th>
                     <th style={{ padding: "1.5rem 2rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>PROGRAM</th>
                     <th style={{ padding: "1.5rem 2rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>BATCH</th>
                     <th style={{ padding: "1.5rem 2rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>CATEGORY</th>
                     <th style={{ padding: "1.5rem 2rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>STATUS</th>
                     <th style={{ padding: "1.5rem 2rem", fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em", textAlign: "right" }}>ACTIONS</th>
                  </tr>
               </thead>
               <tbody>
                  <AnimatePresence mode="popLayout">
                     {scholars.map((scholar, i) => (
                        <motion.tr 
                          key={scholar.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{ borderBottom: "1px solid var(--border-dim)", background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.01)" }}
                        >
                           <td style={{ padding: "1.5rem 2rem", fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)" }}>{scholar.studentId}</td>
                           <td style={{ padding: "1.5rem 2rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                 <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border-dim)" }}>
                                    <User size={14} color="var(--primary)" />
                                 </div>
                                 <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "white" }}>{scholar.studentName.toUpperCase()}</span>
                              </div>
                           </td>
                           <td style={{ padding: "1.5rem 2rem" }}>
                              <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-main)" }}>{scholar.programName}</p>
                              <p style={{ fontSize: "0.55rem", fontWeight: "800", color: "var(--text-dim)", marginTop: "0.2rem" }}>TYPE: {scholar.type.toUpperCase()}</p>
                           </td>
                           <td style={{ padding: "1.5rem 2rem", fontSize: "0.75rem", fontWeight: "800" }}>{scholar.batch}</td>
                           <td style={{ padding: "1.5rem 2rem" }}>
                              <span style={{ 
                                padding: "0.4rem 0.8rem", 
                                borderRadius: "4px", 
                                fontSize: "0.55rem", 
                                fontWeight: "900", 
                                background: scholar.category === "New" ? "rgba(59, 130, 246, 0.1)" : "rgba(16, 185, 129, 0.1)",
                                color: scholar.category === "New" ? "#3b82f6" : "#10b981",
                                border: `1px solid ${scholar.category === "New" ? "rgba(59, 130, 246, 0.2)" : "rgba(16, 185, 129, 0.2)"}`
                              }}>
                                {scholar.category.toUpperCase()}
                              </span>
                           </td>
                           <td style={{ padding: "1.5rem 2rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                 <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: scholar.status === "Active" ? "#10b981" : "#ef4444" }} />
                                 <span style={{ fontSize: "0.65rem", fontWeight: "900", color: scholar.status === "Active" ? "#10b981" : "#ef4444" }}>{scholar.status.toUpperCase()}</span>
                              </div>
                           </td>
                           <td style={{ padding: "1.5rem 2rem", textAlign: "right" }}>
                              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                                 <button onClick={() => startEdit(scholar)} style={{ padding: "0.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", borderRadius: "4px", cursor: "pointer" }}>
                                    <Edit2 size={14} />
                                 </button>
                                 <button onClick={() => handleDeleteScholar(scholar.id, scholar.studentName)} style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", color: "#ef4444", borderRadius: "4px", cursor: "pointer" }}>
                                    <Trash2 size={14} />
                                 </button>
                              </div>
                           </td>
                        </motion.tr>
                     ))}
                  </AnimatePresence>
                  {scholars.length === 0 && !isLoading && (
                     <tr>
                        <td colSpan={7} style={{ padding: "5rem", textAlign: "center" }}>
                           <Layers size={48} color="var(--text-dim)" style={{ marginBottom: "1.5rem", opacity: 0.2 }} />
                           <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>NO SCHOLAR RECORDS FOUND IN THE CURRENT ARCHIVE</p>
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>

         {/* PAGINATION FOOTER */}
         <div style={{ padding: "1.5rem 2rem", background: "rgba(0, 229, 255, 0.02)", borderTop: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>
               SHOWING <span style={{ color: "var(--text-main)" }}>{(page - 1) * pageSize + 1}</span> TO <span style={{ color: "var(--text-main)" }}>{Math.min(page * pageSize, total)}</span> OF <span style={{ color: "var(--text-main)" }}>{total}</span> SCHOLARS
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
               <button 
                 disabled={page === 1}
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 style={{ padding: "0.5rem 1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.6rem", fontWeight: "900", opacity: page === 1 ? 0.3 : 1, cursor: page === 1 ? "not-allowed" : "pointer" }}
               >
                  <ChevronLeft size={14} />
               </button>
               {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                 <button 
                   key={p}
                   onClick={() => setPage(p)}
                   style={{ 
                     padding: "0.5rem 1rem", 
                     background: page === p ? "var(--primary)" : "var(--bg-accent)", 
                     border: "1px solid var(--border-dim)", 
                     color: page === p ? "var(--text-dark)" : "white", 
                     fontSize: "0.6rem", 
                     fontWeight: "900",
                     cursor: "pointer"
                   }}
                 >
                   {p}
                 </button>
               ))}
               <button 
                 disabled={page === totalPages || totalPages === 0}
                 onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                 style={{ padding: "0.5rem 1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.6rem", fontWeight: "900", opacity: page === totalPages || totalPages === 0 ? 0.3 : 1, cursor: page === totalPages || totalPages === 0 ? "not-allowed" : "pointer" }}
               >
                  <ChevronRight size={14} />
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
              style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
            >
               <motion.div 
                 initial={{ scale: 0.9, y: 20 }}
                 animate={{ scale: 1, y: 0 }}
                 style={{ width: "100%", maxWidth: "700px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", padding: "3rem" }}
               >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
                     <div>
                        <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)" }}>{isAddModalOpen ? "PROVISION NEW SCHOLAR" : "MODIFY SCHOLAR RECORD"}</h2>
                        <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", marginTop: "0.25rem" }}>INSTITUTIONAL REGISTRY NODE</p>
                     </div>
                     <button onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}>
                        <X size={24} />
                     </button>
                  </div>

                  <form onSubmit={isAddModalOpen ? handleAddScholar : handleUpdateScholar} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                     <div style={{ gridColumn: "span 2" }}>
                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>STUDENT FULL NAME</label>
                        <input 
                          required
                          value={formData.studentName}
                          onChange={e => setFormData({...formData, studentName: e.target.value})}
                          style={{ width: "100%", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.8rem", fontWeight: "800" }}
                        />
                     </div>
                     <div>
                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>INSTITUTIONAL ID</label>
                        <input 
                          required
                          value={formData.studentId}
                          onChange={e => setFormData({...formData, studentId: e.target.value})}
                          style={{ width: "100%", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.8rem", fontWeight: "800" }}
                        />
                     </div>
                     <div>
                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>BATCH YEAR</label>
                        <input 
                          required
                          value={formData.batch}
                          onChange={e => setFormData({...formData, batch: e.target.value})}
                          placeholder="e.g. 2023-2024"
                          style={{ width: "100%", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.8rem", fontWeight: "800" }}
                        />
                     </div>
                     <div>
                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>SCHOLARSHIP PROGRAM</label>
                        <input 
                          required
                          value={formData.programName}
                          onChange={e => setFormData({...formData, programName: e.target.value})}
                          style={{ width: "100%", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.8rem", fontWeight: "800" }}
                        />
                     </div>
                     <div>
                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>PROVIDER TYPE</label>
                        <select 
                          value={formData.type}
                          onChange={e => setFormData({...formData, type: e.target.value})}
                          style={{ width: "100%", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.8rem", fontWeight: "800" }}
                        >
                           <option value="Institutional">Institutional</option>
                           <option value="Government">Government</option>
                           <option value="Private">Private</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>SCHOLAR CATEGORY</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          style={{ width: "100%", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.8rem", fontWeight: "800" }}
                        >
                           <option value="New">New Scholar</option>
                           <option value="Continuing">Continuing Scholar</option>
                        </select>
                     </div>
                     <div>
                        <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>SYSTEM STATUS</label>
                        <select 
                          value={formData.status}
                          onChange={e => setFormData({...formData, status: e.target.value})}
                          style={{ width: "100%", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "white", fontSize: "0.8rem", fontWeight: "800" }}
                        >
                           <option value="Active">Active</option>
                           <option value="Graduated">Graduated</option>
                           <option value="Terminated">Terminated</option>
                        </select>
                     </div>
                     <div style={{ gridColumn: "span 2", marginTop: "2rem" }}>
                        <button type="submit" className="btn-cyan" style={{ width: "100%", padding: "1.25rem", fontSize: "0.75rem", fontWeight: "900" }}>
                           {isAddModalOpen ? "AUTHORIZE NEW SCHOLAR RECORD" : "SAVE INSTITUTIONAL UPDATES"}
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
    </div>
  );
}
