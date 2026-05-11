"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Search, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ArrowRight, 
  X, 
  Info,
  User,
  History,
  ExternalLink,
  MessageSquare,
  Filter,
  CheckCircle,
  Eye,
  FileSearch,
  Check,
  ShieldAlert,
  Zap,
  Activity,
  Layers,
  Building,
  ChevronRight,
  ClipboardCheck,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { getAllStudentVaults, verifyDocument, VaultStatus } from "@/lib/actions/vaultActions";
import ProcessGuide from "@/components/ProcessGuide";

export default function VerificationTerminalPage() {
  const { currentUser, logAudit } = useGlobalState();
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [remarks, setRemarks] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "VERIFIED">("ALL");
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (isAuth) {
      fetchData();
    }
  }, [currentUser]);

  const isAuth = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";

  const fetchData = async () => {
    const data = await getAllStudentVaults();
    setStudents(data);
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
            <p style={{ color: "#64748b", fontWeight: "600", marginTop: "0.5rem" }}>Institutional clearance required to access the verification terminal.</p>
         </div>
         <button onClick={() => window.location.href = "/"} style={{ padding: "1rem 2.5rem", background: "#111827", color: "white", border: "none", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer" }}>Return to Dashboard</button>
      </div>
    );
  }

  const handleVerify = async (status: VaultStatus) => {
    if (!selectedStudent || !activeDoc) return;
    setIsVerifying(true);
    try {
      await verifyDocument(selectedStudent.id, activeDoc, status, remarks);
      logAudit("DOCUMENT_VERIFIED", `Document ${activeDoc} for ${selectedStudent.name} set to ${status}.`, "MEDIUM");
      await fetchData();
      
      const updated = await getAllStudentVaults();
      const newSelected = updated.find(s => s.id === selectedStudent.id);
      setSelectedStudent(newSelected);
      
      setActiveDoc(null);
      setRemarks("");
    } catch (e) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || (s.username || "").toLowerCase().includes(searchTerm.toLowerCase());
    if (filter === "ALL") return matchesSearch;
    const hasPending = Object.values(s.vault || {}).some((v: any) => v.status === "Not Yet Verified");
    if (filter === "PENDING") return matchesSearch && hasPending;
    return matchesSearch && !hasPending;
  });

  const pendingCount = students.filter(s => Object.values(s.vault || {}).some((v: any) => v.status === "Not Yet Verified")).length;

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", position: "relative" }}>
      
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
           <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Institutional Audit</p>
           <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
             Document <span style={{ color: "#3b82f6" }}>Verification</span>
           </h1>
           <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#64748b", maxWidth: "600px", lineHeight: "1.6" }}>
             Review and authorize student document submissions. Manage institutional compliance through a centralized verification terminal.
           </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           <div style={{ textAlign: "right", background: "#eff6ff", padding: "1.25rem 2rem", borderRadius: "16px", border: "1px solid #dbeafe" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.25rem" }}>Pending Review</p>
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", justifyContent: "flex-end" }}>
                <span style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e3a8a" }}>{pendingCount}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#3b82f6" }}>Students</span>
              </div>
           </div>
        </div>
      </div>

      <ProcessGuide 
         title="Institutional Verification Protocol"
         steps={[
            { title: "Target Selection", desc: "Select a student from the repository index to initialize document audit.", icon: <User size={16} /> },
            { title: "Dossier Audit", desc: "Inspect specific documents for authenticity and institutional compliance.", icon: <FileSearch size={16} /> },
            { title: "Status Assignment", desc: "Issue an administrative verdict and log institutional remarks.", icon: <ClipboardCheck size={16} /> },
            { title: "Ledger Update", desc: "Finalize verification and update the student's digital vault records.", icon: <ShieldCheck size={16} /> }
         ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "2.5rem", alignItems: "start" }}>
        
        {/* STUDENT REPOSITORY INDEX */}
        <aside style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", position: "sticky", top: "2rem" }}>
            <div style={{ padding: "2.5rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
               <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Layers size={20} color="#3b82f6" /> Student Index
               </h3>
               <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <Search size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input 
                    placeholder="Search name or ID..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "1.15rem 1rem 1.15rem 3.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "600", color: "#1e293b", outline: "none" }}
                  />
               </div>
               <div style={{ display: "flex", gap: "0.5rem", background: "white", padding: "0.4rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  {["ALL", "PENDING", "VERIFIED"].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f as any)}
                      style={{ flex: 1, padding: "0.75rem", background: filter === f ? "#eff6ff" : "transparent", color: filter === f ? "#3b82f6" : "#64748b", border: "none", fontSize: "0.75rem", fontWeight: "800", cursor: "pointer", borderRadius: "8px", transition: "all 0.2s" }}
                    >
                      {f}
                    </button>
                  ))}
               </div>
            </div>
            
            <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
               {filteredStudents.map(student => {
                  const isPending = Object.values(student.vault || {}).some((v: any) => v.status === "Not Yet Verified");
                  return (
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
                        gap: "1.5rem",
                        transition: "all 0.2s",
                        position: "relative"
                      }}
                    >
                       {selectedStudent?.id === student.id && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: "#3b82f6" }} />}
                       <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: isPending ? "#fff7ed" : "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", color: isPending ? "#f59e0b" : "#10b981", border: "1px solid", borderColor: isPending ? "#ffedd5" : "#dcfce7" }}>
                          <User size={22} />
                       </div>
                       <div style={{ flex: 1 }}>
                          <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.25rem" }}>{student.name}</p>
                          <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#64748b" }}>{student.username || "STUDENT_NODE"}</p>
                       </div>
                       {isPending && (
                          <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#f59e0b", boxShadow: "0 0 10px rgba(245, 158, 11, 0.4)" }} />
                       )}
                    </button>
                  );
               })}
               {filteredStudents.length === 0 && (
                  <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
                     <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#94a3b8" }}>No students matching criteria.</p>
                  </div>
               )}
            </div>
        </aside>

        {/* VERIFICATION VIEWPORT */}
        <main>
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div 
                key={selectedStudent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{ display: "grid", gap: "2.5rem" }}
              >
                {/* STUDENT PROFILE HIGHLIGHT */}
                <div style={{ background: "white", borderRadius: "24px", padding: "3rem", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                         <div style={{ width: "96px", height: "96px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", borderRadius: "20px" }}>
                            <ShieldCheck size={48} />
                         </div>
                         <div>
                            <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Active Dossier</p>
                            <h2 style={{ fontSize: "2rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>{selectedStudent.name}</h2>
                            <p style={{ fontSize: "1rem", fontWeight: "600", color: "#64748b", marginTop: "0.25rem" }}>ID: {selectedStudent.username} • {selectedStudent.department || "General Records"}</p>
                         </div>
                      </div>
                      <div style={{ display: "flex", gap: "1rem" }}>
                         <button style={{ padding: "1rem 2rem", background: "white", border: "1px solid #e2e8f0", color: "#1e293b", fontSize: "0.85rem", fontWeight: "800", borderRadius: "12px", cursor: "pointer" }}>View History</button>
                      </div>
                   </div>

                   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "2rem" }}>
                      {Object.entries(selectedStudent.vault || {}).map(([name, data]: [string, any]) => (
                        <div key={name} style={{ padding: "2.5rem", background: "#f8fafc", borderRadius: "20px", border: "1px solid #f1f5f9", transition: "all 0.2s" }}>
                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                                 <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "white", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", border: "1px solid #e2e8f0" }}>
                                    <FileText size={24} />
                                 </div>
                                 <div>
                                    <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>{name}</h4>
                                    <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#94a3b8", marginTop: "0.25rem" }}>Uploaded: {data.date}</p>
                                 </div>
                              </div>
                              <span style={{ fontSize: "0.75rem", fontWeight: "900", color: data.status === "Verified" ? "#10b981" : data.status === "Not Yet Verified" ? "#f59e0b" : "#ef4444", background: "white", padding: "0.5rem 1.25rem", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
                                 {data.status.toUpperCase()}
                              </span>
                           </div>
                           
                           {data.remarks && (
                              <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "white", borderRadius: "12px", border: "1px solid #f1f5f9" }}>
                                 <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>Administrative Remarks</p>
                                 <p style={{ fontSize: "0.95rem", color: "#1e293b", fontWeight: "600", lineHeight: "1.6" }}>{data.remarks}</p>
                              </div>
                           )}

                           <div style={{ display: "flex", gap: "1rem" }}>
                              <button onClick={() => setActiveDoc(name)} style={{ flex: 1, padding: "1rem", background: "white", border: "1px solid #e2e8f0", color: "#1e293b", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", borderRadius: "12px" }}>
                                 <Eye size={18} /> Inspect Node
                              </button>
                              {data.status !== "Verified" && (
                                <button onClick={() => { setActiveDoc(name); }} style={{ flex: 1, padding: "1rem", background: "#3b82f6", border: "none", color: "white", fontSize: "0.9rem", fontWeight: "900", cursor: "pointer", borderRadius: "12px", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                                   Process Verdict
                                </button>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            ) : (
              <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem", background: "white", borderRadius: "32px", border: "1px dashed #e2e8f0" }}>
                 <div style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f1f5f9" }}>
                    <Users size={48} color="#cbd5e1" />
                 </div>
                 <div style={{ textAlign: "center" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.5rem" }}>Ready for Audit</h3>
                    <p style={{ fontSize: "0.95rem", fontWeight: "600", color: "#94a3b8", maxWidth: "320px" }}>Select a student from the repository index to begin the verification process.</p>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* VERIFICATION MODAL */}
      <AnimatePresence>
        {activeDoc && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
             <motion.div initial={{ scale: 0.95, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 30 }} style={{ width: "100%", maxWidth: "700px", background: "white", borderRadius: "32px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}>
                <div style={{ padding: "3rem 4rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                   <div>
                      <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "#3b82f6", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Audit Viewport</p>
                      <h3 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>{activeDoc}</h3>
                   </div>
                   <button onClick={() => setActiveDoc(null)} style={{ background: "white", border: "1px solid #f1f5f9", color: "#94a3b8", cursor: "pointer", width: "56px", height: "56px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%" }}><X size={24} /></button>
                </div>

                <div style={{ padding: "4rem" }}>
                   <div style={{ marginBottom: "3rem" }}>
                      <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.9rem", fontWeight: "900", color: "#475569" }}>Administrative Remarks</label>
                      <textarea 
                        value={remarks}
                        onChange={e => setRemarks(e.target.value)}
                        placeholder="Log institutional feedback or reasons for re-upload..."
                        style={{ width: "100%", height: "160px", padding: "1.5rem", background: "#f8fafc", border: "1px solid #f1f5f9", color: "#1e293b", fontSize: "1.05rem", fontWeight: "600", borderRadius: "16px", outline: "none", resize: "none", lineHeight: "1.6" }}
                      />
                   </div>

                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                      <button onClick={() => handleVerify("Verified")} style={{ padding: "1.5rem", background: "#10b981", color: "white", border: "none", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", boxShadow: "0 10px 15px -3px rgba(16, 185, 129, 0.2)" }}>
                         <CheckCircle size={22} /> Approve & Verify
                      </button>
                      <button onClick={() => handleVerify("For Re-upload")} style={{ padding: "1.5rem", background: "white", border: "1px solid #f59e0b", color: "#d97706", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                         <RotateCcw size={22} /> Request Re-upload
                      </button>
                      <button onClick={() => handleVerify("Wrong Document")} style={{ padding: "1.5rem", background: "white", border: "1px solid #fee2e2", color: "#ef4444", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                         <AlertTriangle size={22} /> Wrong Document
                      </button>
                      <button onClick={() => handleVerify("Blurred")} style={{ padding: "1.5rem", background: "white", border: "1px solid #e2e8f0", color: "#64748b", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                         <Info size={22} /> Unreadable
                      </button>
                   </div>

                   <button onClick={() => setActiveDoc(null)} style={{ width: "100%", marginTop: "3rem", padding: "1rem", background: "transparent", border: "none", color: "#94a3b8", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer" }}>Discard Audit Session</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
