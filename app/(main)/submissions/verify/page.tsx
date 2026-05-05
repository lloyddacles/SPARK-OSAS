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
  Filter
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { getAllStudentVaults, verifyDocument, VaultStatus } from "@/lib/actions/vaultActions";

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
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
         <ShieldCheck size={48} className="status-pulse" color="var(--primary)" />
      </div>
    );
  }

  if (!isAuth) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2.5rem" }}>
         <div style={{ position: "relative" }}>
            <ShieldCheck size={80} color="#ef4444" style={{ opacity: 0.2 }} />
            <X size={32} color="#ef4444" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
         </div>
         <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "-0.02em" }}>ACCESS DENIED</h2>
            <p style={{ color: "var(--text-dim)", fontWeight: "700", marginTop: "0.75rem", fontSize: "0.85rem" }}>INSTITUTIONAL CLEARANCE LEVEL 4 REQUIRED.</p>
            <p style={{ color: "var(--primary)", fontWeight: "900", marginTop: "1rem", fontSize: "0.6rem", letterSpacing: "0.1em" }}>REQUIRED ROLE: OSAS_DIRECTOR | SYSTEM_ADMIN</p>
         </div>
         <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/" style={{ padding: "1rem 2rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", textDecoration: "none", fontSize: "0.7rem", fontWeight: "900" }}>RETURN HOME</a>
            <a href="/login" className="btn-cyan" style={{ padding: "1rem 2rem", textDecoration: "none", fontSize: "0.7rem", fontWeight: "900" }}>AUTHORIZE SESSION</a>
         </div>
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
      
      // Update selected student in local state to reflect changes
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

  return (
    <div style={{ maxWidth: "1600px", margin: "0 auto", padding: "4rem 2rem" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "5rem" }}>
        <div>
           <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>PROTOCOL: DOCUMENT_VERIFICATION</p>
           <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
             VERIFICATION <span style={{ color: "var(--primary)" }}>TERMINAL</span>
           </h1>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>PENDING REVIEW</p>
              <p style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--primary)" }}>
                {students.filter(s => Object.values(s.vault || {}).some((v: any) => v.status === "Not Yet Verified")).length}
              </p>
           </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "400px 1fr", gap: "3rem", alignItems: "start" }}>
        
        {/* STUDENT LIST */}
        <aside>
          <div className="sapphire-card" style={{ padding: "0", maxHeight: "80vh", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "2rem", borderBottom: "1px solid var(--border-dim)" }}>
               <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <Search size={14} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                  <input 
                    placeholder="SEARCH STUDENT..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", fontSize: "0.65rem", fontWeight: "900", color: "var(--text-main)" }}
                  />
               </div>
               <div style={{ display: "flex", gap: "0.5rem" }}>
                  {["ALL", "PENDING", "VERIFIED"].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setFilter(f as any)}
                      style={{ flex: 1, padding: "0.5rem", background: filter === f ? "var(--primary)" : "var(--bg-accent)", color: filter === f ? "var(--text-dark)" : "var(--text-dim)", border: "none", fontSize: "0.55rem", fontWeight: "900", cursor: "pointer", transition: "all 0.2s" }}
                    >
                      {f}
                    </button>
                  ))}
               </div>
            </div>
            
            <div style={{ overflowY: "auto", flex: 1 }}>
               {filteredStudents.map(student => (
                 <button 
                   key={student.id}
                   onClick={() => setSelectedStudent(student)}
                   style={{ 
                     width: "100%", 
                     padding: "1.5rem 2rem", 
                     background: selectedStudent?.id === student.id ? "rgba(0, 229, 255, 0.05)" : "transparent",
                     border: "none",
                     borderBottom: "1px solid var(--border-dim)",
                     textAlign: "left",
                     cursor: "pointer",
                     display: "flex",
                     alignItems: "center",
                     gap: "1.5rem",
                     transition: "all 0.2s"
                   }}
                 >
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", border: "1px solid var(--border-dim)" }}>
                       <User size={18} />
                    </div>
                    <div style={{ flex: 1 }}>
                       <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-main)" }}>{student.name.toUpperCase()}</p>
                       <p style={{ fontSize: "0.55rem", fontWeight: "700", color: "var(--text-dim)" }}>{student.username || "NO_ID"}</p>
                    </div>
                    {Object.values(student.vault || {}).some((v: any) => v.status === "Not Yet Verified") && (
                       <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }} />
                    )}
                 </button>
               ))}
            </div>
          </div>
        </aside>

        {/* VERIFICATION VIEWPORT */}
        <main>
          <AnimatePresence mode="wait">
            {selectedStudent ? (
              <motion.div 
                key={selectedStudent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="sapphire-card" style={{ padding: "3rem", marginBottom: "2rem" }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4rem" }}>
                      <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                         <div style={{ width: "80px", height: "80px", background: "var(--bg-accent)", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                            <ShieldCheck size={40} />
                         </div>
                         <div>
                            <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)" }}>{selectedStudent.name.toUpperCase()}</h2>
                            <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", marginTop: "0.25rem", letterSpacing: "0.1em" }}>ID: {selectedStudent.username} • {selectedStudent.department || "NO_DEPT"}</p>
                         </div>
                      </div>
                      <div style={{ display: "flex", gap: "1rem" }}>
                         <button className="btn-cyan" style={{ padding: "0.75rem 1.5rem", fontSize: "0.6rem" }}>VIEW PROFILE</button>
                      </div>
                   </div>

                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                      {Object.entries(selectedStudent.vault || {}).map(([name, data]: [string, any]) => (
                        <div key={name} className="sapphire-card" style={{ padding: "2rem", background: "var(--bg-accent)", border: data.status === "Not Yet Verified" ? "1px solid var(--primary)" : "1px solid var(--border-dim)" }}>
                           <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                 <FileText size={20} color={data.status === "Verified" ? "#10b981" : "var(--primary)"} />
                                 <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-main)" }}>{name.toUpperCase()}</p>
                              </div>
                              <span style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>{data.date}</span>
                           </div>
                           
                           <div style={{ marginBottom: "2rem" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                                 <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: data.status === "Verified" ? "#10b981" : data.status === "Not Yet Verified" ? "var(--primary)" : "#ef4444" }} />
                                 <p style={{ fontSize: "0.6rem", fontWeight: "900", color: data.status === "Verified" ? "#10b981" : "var(--primary)" }}>{data.status.toUpperCase()}</p>
                              </div>
                              {data.remarks && <p style={{ fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.4" }}>REMARKS: {data.remarks.toUpperCase()}</p>}
                           </div>

                           <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button onClick={() => setActiveDoc(name)} style={{ flex: 1, padding: "0.75rem", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.55rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                                 <ExternalLink size={12} /> INSPECT
                              </button>
                              {data.status !== "Verified" && (
                                <button onClick={() => { setActiveDoc(name); }} style={{ flex: 1, padding: "0.75rem", background: "var(--primary)", border: "none", color: "var(--text-dark)", fontSize: "0.55rem", fontWeight: "900", cursor: "pointer" }}>
                                   VERIFY NOW
                                </button>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            ) : (
              <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem", opacity: 0.5 }}>
                 <Users size={64} color="var(--text-dim)" />
                 <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.2em" }}>SELECT A STUDENT TO INITIALIZE VERIFICATION</p>
              </div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* VERIFICATION MODAL */}
      <AnimatePresence>
        {activeDoc && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
             <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ width: "100%", maxWidth: "600px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", padding: "3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
                   <div>
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--text-main)" }}>DOCUMENT VERIFICATION NODE</h3>
                      <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", marginTop: "0.25rem" }}>TARGET: {activeDoc.toUpperCase()}</p>
                   </div>
                   <button onClick={() => setActiveDoc(null)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><X size={24} /></button>
                </div>

                <div style={{ marginBottom: "2.5rem" }}>
                   <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>OFFICE REMARKS / FEEDBACK</label>
                   <textarea 
                     value={remarks}
                     onChange={e => setRemarks(e.target.value)}
                     placeholder="ENTER REMARKS FOR THE STUDENT..."
                     style={{ width: "100%", height: "120px", padding: "1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.75rem", fontWeight: "700", resize: "none" }}
                   />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                   <div style={{ display: "grid", gap: "1rem" }}>
                      <button onClick={() => handleVerify("Verified")} className="btn-cyan" style={{ padding: "1.25rem", fontSize: "0.65rem", fontWeight: "900" }}>APPROVE & VERIFY</button>
                      <button onClick={() => handleVerify("For Re-upload")} style={{ padding: "1.25rem", background: "rgba(245, 158, 11, 0.05)", border: "1px solid #f59e0b", color: "#f59e0b", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>REQUEST RE-UPLOAD</button>
                   </div>
                   <div style={{ display: "grid", gap: "1rem" }}>
                      <button onClick={() => handleVerify("Wrong Document")} style={{ padding: "1.25rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid #ef4444", color: "#ef4444", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>WRONG DOCUMENT</button>
                      <button onClick={() => handleVerify("Blurred")} style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>BLURRED / UNREADABLE</button>
                   </div>
                </div>

                <button onClick={() => setActiveDoc(null)} style={{ width: "100%", marginTop: "2rem", padding: "1rem", background: "transparent", border: "none", color: "var(--text-dim)", fontSize: "0.6rem", fontWeight: "900", cursor: "pointer" }}>CANCEL EVALUATION</button>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
