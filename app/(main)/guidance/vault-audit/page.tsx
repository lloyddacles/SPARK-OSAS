"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  FileText,
  Eye,
  Clock,
  ChevronRight,
  Database,
  ArrowRight,
  Plus,
  Download,
  X,
  Building,
  CheckCircle,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  FileSearch,
  Check,
  AlertTriangle,
  RotateCcw,
  Info
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { getAllStudentVaults, VaultStatus } from "@/lib/actions/vaultActions";
import ProcessGuide from "@/components/ProcessGuide";

export default function VaultAuditPage() {
  const { verifyDocument, currentUser, logAudit } = useGlobalState();
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ name: string; content: string; type: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const isAuth = ["OSAS_DIRECTOR", "SYSTEM_ADMIN", "GUIDANCE_COUNSELOR"].includes(currentUser?.role || "");

  const handleOpenPreview = async (docName: string, student: any) => {
    let content = "";
    let type = "PDF";

    if (docName === "Letter of Intent" || docName === "Sketch of House") {
      const { generateTemplate } = await import("@/lib/actions/templateActions");
      content = await generateTemplate(docName, student.name);
      type = "Template";
    } else if (docName === "1x1 Photo") {
      content = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop"; 
      type = "Image";
    } else {
      content = "INSTITUTIONAL DOCUMENT MOCKUP\n\nThis is a secure preview of the student's uploaded file.\nIn a production environment, this would display the actual PDF/Image from secure storage.\n\nFile: " + docName + "\nStudent: " + student.name;
      type = "PDF";
    }

    setPreviewDoc({ name: docName, content, type });
    setSelectedDoc(docName);
  };

  useEffect(() => {
    const fetchStudents = async () => {
      const data = await getAllStudentVaults();
      setStudents(data);
    };
    if (isAuth) {
      fetchStudents();
    }
  }, [isAuth]);

  const handleVerify = async (status: VaultStatus) => {
    if (!selectedStudent || !selectedDoc) return;
    await verifyDocument(selectedStudent.id, selectedDoc, status, remark);
    logAudit("VAULT_AUDIT_COMPLETED", `Guidance audit for ${selectedDoc} (${selectedStudent.name}) set to ${status}`, "MEDIUM");
    
    const updatedData = await getAllStudentVaults();
    setStudents(updatedData);
    const updatedStudent = updatedData.find((s: any) => s.id === selectedStudent.id);
    setSelectedStudent(updatedStudent);
    setSelectedDoc(null);
    setRemark("");
    setPreviewDoc(null);
  };

  if (!isHydrated) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "white" }}>
         <Activity size={48} className="animate-pulse" color="#3b82f6" />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
         <ShieldAlert size={64} color="#ef4444" />
         <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#111827", letterSpacing: "-0.02em" }}>Access Restricted</h2>
            <p style={{ color: "#64748b", fontWeight: "600", marginTop: "0.5rem" }}>Institutional clearance required to access the identity vault audit.</p>
         </div>
      </div>
    );
  }

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.username || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", position: "relative" }}>
      
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
           <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Administrative Audit</p>
           <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
             Identity <span style={{ color: "#3b82f6" }}>Vault</span>
           </h1>
           <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#64748b", maxWidth: "600px", lineHeight: "1.6" }}>
             Audit student identity dossiers and verify compliance for institutional records. Manage digital signatures and legal documentation.
           </p>
        </div>
        <div style={{ textAlign: "right", background: "#f8fafc", padding: "1.25rem 2rem", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
           <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Vault Statistics</p>
           <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", justifyContent: "flex-end" }}>
             <span style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b" }}>{students.length}</span>
             <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8" }}>Indexed Profiles</span>
           </div>
        </div>
      </div>

      <ProcessGuide 
         title="Digital Vault Verification Protocol"
         steps={[
            { title: "Identity Selection", desc: "Locate the student node within the repository index to access their dossier.", icon: <User size={16} /> },
            { title: "Node Audit", desc: "Select a specific document to initialize the secure audit viewport.", icon: <FileSearch size={16} /> },
            { title: "Data Review", desc: "Analyze payload for authenticity, clarity, and institutional compliance.", icon: <Eye size={16} /> },
            { title: "Verdict Issuance", desc: "Log administrative remarks and finalize verification in the ledger.", icon: <ShieldCheck size={16} /> }
         ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "350px 1fr", gap: "2.5rem", alignItems: "start" }}>
        
        {/* STUDENT REPOSITORY INDEX */}
        <aside style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", position: "sticky", top: "2rem" }}>
            <div style={{ padding: "2.5rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
               <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Database size={20} color="#3b82f6" /> Identity Index
               </h3>
               <div style={{ position: "relative" }}>
                  <Search size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input 
                    placeholder="Search name or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "1.15rem 1rem 1.15rem 3.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600", color: "#1e293b", outline: "none" }}
                  />
               </div>
            </div>
            
            <div style={{ maxHeight: "65vh", overflowY: "auto" }}>
               {filteredStudents.map(student => (
                  <button 
                    key={student.id}
                    onClick={() => setSelectedStudent(student)}
                    style={{ 
                      width: "100%", 
                      padding: "1.75rem 2.5rem", 
                      background: selectedStudent?.id === student.id ? "#f8fafc" : "transparent",
                      border: "none",
                      borderBottom: "1px solid #f1f5f9",
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "1.25rem",
                      transition: "all 0.2s",
                      position: "relative"
                    }}
                  >
                    {selectedStudent?.id === student.id && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "#3b82f6" }} />}
                    <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: selectedStudent?.id === student.id ? "#eff6ff" : "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", color: selectedStudent?.id === student.id ? "#3b82f6" : "#94a3b8", border: "1px solid", borderColor: selectedStudent?.id === student.id ? "#dbeafe" : "#f1f5f9" }}>
                       <User size={20} />
                    </div>
                    <div>
                       <p style={{ fontSize: "0.9rem", fontWeight: "800", color: selectedStudent?.id === student.id ? "#3b82f6" : "#1e293b", marginBottom: "0.2rem" }}>{student.name}</p>
                       <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b" }}>ID: {student.username || student.studentId || "PENDING"}</p>
                    </div>
                  </button>
               ))}
               {filteredStudents.length === 0 && (
                  <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
                     <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#94a3b8" }}>No records found.</p>
                  </div>
               )}
            </div>
        </aside>

        {/* AUDIT CONSOLE */}
        <main>
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div 
                key={selectedStudent.id}
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
                style={{ display: "grid", gap: "2rem" }}
              >
                {/* Profile Overview */}
                <div style={{ background: "white", borderRadius: "24px", padding: "2.5rem 3rem", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                         <div style={{ width: "72px", height: "72px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                            <ShieldCheck size={36} />
                         </div>
                         <div>
                            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>{selectedStudent.name}</h2>
                            <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                               <p style={{ color: "#3b82f6", fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>ROLE: {selectedStudent.role}</p>
                               <p style={{ color: "#94a3b8", fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>SID: {selectedStudent.username || "N/A"}</p>
                            </div>
                         </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                         <p style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b" }}>{Object.keys(selectedStudent.vault || {}).length}</p>
                         <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Vault Files</p>
                      </div>
                   </div>
                </div>

                {/* Document Grid */}
                <div style={{ display: "grid", gap: "1rem" }}>
                  {Object.entries(selectedStudent.vault || {}).map(([name, info]: [string, any]) => {
                    const isVerified = info.status === "Verified";
                    return (
                      <motion.div 
                        key={name} 
                        whileHover={{ x: 4 }}
                        style={{ background: "white", borderRadius: "20px", border: "1px solid #f1f5f9", padding: "1.5rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.01)" }}
                      >
                        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                          <div style={{ width: "48px", height: "48px", background: "#f8fafc", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: isVerified ? "#10b981" : "#3b82f6", border: "1px solid #e2e8f0" }}>
                            <FileText size={22} />
                          </div>
                          <div>
                            <p style={{ fontWeight: "900", fontSize: "1rem", color: "#1e293b" }}>{name}</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.25rem" }}>
                               <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8" }}>Stamped: {info.date}</span>
                               <span style={{ fontSize: "0.7rem", fontWeight: "900", color: isVerified ? "#10b981" : "#f59e0b", background: isVerified ? "#f0fdf4" : "#fff7ed", padding: "0.25rem 0.75rem", borderRadius: "20px", border: "1px solid", borderColor: isVerified ? "#dcfce7" : "#ffedd5" }}>
                                 {(info.status || "PENDING").toUpperCase()}
                               </span>
                            </div>
                          </div>
                        </div>
                        <button 
                           onClick={() => handleOpenPreview(name, selectedStudent)}
                           style={{ padding: "0.85rem 1.75rem", fontSize: "0.85rem", fontWeight: "800", background: "#111827", color: "white", border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem" }}
                        >
                           <Eye size={18} /> Audit Node
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Audit Viewport (Inline) */}
                <AnimatePresence>
                  {selectedDoc && previewDoc && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      exit={{ opacity: 0, scale: 0.98 }} 
                      style={{ 
                        background: "white", 
                        borderRadius: "32px", 
                        border: "1px solid #3b82f6", 
                        display: "grid", 
                        gridTemplateColumns: "1fr 380px",
                        gap: "3rem", 
                        padding: "3rem",
                        boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.15)",
                        marginTop: "1rem"
                      }}
                    >
                      {/* Document Preview */}
                      <div style={{ background: "#f8fafc", borderRadius: "24px", border: "1px solid #f1f5f9", padding: "3rem", color: "#1e293b", minHeight: "500px", position: "relative", overflow: "hidden" }}>
                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "2px solid #e2e8f0", paddingBottom: "1rem" }}>
                            <span style={{ fontSize: "0.8rem", fontWeight: "900", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em" }}>Secure Audit: {previewDoc.name}</span>
                            <span style={{ fontSize: "0.8rem", fontWeight: "900", color: "#94a3b8" }}>#{selectedStudent.id.substr(0,8).toUpperCase()}</span>
                         </div>
                         
                         <div style={{ overflowY: "auto", maxHeight: "400px" }}>
                           {previewDoc.type === "Image" ? (
                             <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                               <img src={previewDoc.content} style={{ maxWidth: "300px", borderRadius: "12px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", border: "4px solid white" }} />
                             </div>
                           ) : (
                             <div style={{ whiteSpace: "pre-wrap", fontSize: "1rem", lineHeight: "1.8", color: "#334155", fontWeight: "500", padding: "1rem" }}>
                               {previewDoc.content}
                             </div>
                           )}
                         </div>

                         <div style={{ position: "absolute", bottom: "2rem", left: "3rem", right: "3rem", padding: "1rem 2rem", background: "white", border: "1px solid #f1f5f9", borderRadius: "16px", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                            <Database size={20} color="#3b82f6" /> 
                            <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "#1e293b" }}>INSTITUTIONAL REPOSITORY ACCESS</p>
                         </div>
                      </div>

                      {/* Feedback Panel */}
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                          <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.01em" }}>Audit Verdict</h3>
                          <button onClick={() => setSelectedDoc(null)} style={{ background: "#f8fafc", border: "1px solid #f1f5f9", color: "#94a3b8", cursor: "pointer", width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={22} /></button>
                        </div>

                        <div style={{ marginBottom: "2.5rem" }}>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Administrative Remarks</label>
                          <textarea 
                            value={remark}
                            onChange={e => setRemark(e.target.value)}
                            placeholder="Enter institutional feedback..."
                            style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", border: "1px solid #f1f5f9", background: "#f8fafc", borderRadius: "16px", outline: "none", resize: "none", lineHeight: "1.6" }}
                            rows={5}
                          />
                        </div>

                        <div style={{ display: "grid", gap: "1rem" }}>
                          <button 
                             onClick={() => handleVerify("Verified")}
                             style={{ padding: "1.25rem", borderRadius: "14px", background: "#10b981", color: "white", border: "none", fontSize: "0.95rem", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)" }}
                          >
                             <CheckCircle size={20} /> APPROVE & VERIFY
                          </button>
                          <button 
                             onClick={() => handleVerify("For Re-upload")}
                             style={{ padding: "1.25rem", borderRadius: "14px", background: "white", border: "1px solid #f59e0b", color: "#d97706", fontSize: "0.95rem", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer" }}
                          >
                             <RotateCcw size={20} /> REQUEST RE-UPLOAD
                          </button>
                          <button 
                             onClick={() => handleVerify("Wrong Document")}
                             style={{ padding: "1.25rem", borderRadius: "14px", background: "white", border: "1px solid #fee2e2", color: "#ef4444", fontSize: "0.95rem", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer" }}
                          >
                             <AlertTriangle size={20} /> WRONG DOCUMENT
                          </button>
                        </div>
                        
                        <button onClick={() => setSelectedDoc(null)} style={{ width: "100%", marginTop: "2rem", padding: "1rem", background: "transparent", border: "none", color: "#94a3b8", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer" }}>Discard Audit Session</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div style={{ height: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#cbd5e1", background: "white", borderRadius: "32px", border: "1px dashed #e2e8f0" }}>
                 <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f1f5f9", marginBottom: "2rem" }}>
                    <Layers size={48} />
                 </div>
                 <p style={{ fontSize: "1rem", fontWeight: "800", color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" }}>Select Student Node to Begin Audit</p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
