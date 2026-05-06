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
  X
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { getAllStudentVaults, VaultStatus } from "@/lib/actions/vaultActions";
import ProcessGuide from "@/components/ProcessGuide";

export default function VaultAuditPage() {
  const { verifyDocument, currentUser } = useGlobalState();
  const [students, setStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [remark, setRemark] = useState("");
  const [previewDoc, setPreviewDoc] = useState<{ name: string; content: string; type: string } | null>(null);

  const isAuth = ["OSAS_DIRECTOR", "SYSTEM_ADMIN"].includes(currentUser?.role || "");

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
    
    const updatedData = await getAllStudentVaults();
    setStudents(updatedData);
    const updatedStudent = updatedData.find((s: any) => s.id === selectedStudent.id);
    setSelectedStudent(updatedStudent);
    setSelectedDoc(null);
    setRemark("");
  };

  if (!isAuth) return <div style={{ padding: "4rem", textAlign: "center", fontWeight: "900" }}>ACCESS DENIED: UNAUTHORIZED USER</div>;

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.studentId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "3rem" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>NETWORK: IDENTITY AUDIT</p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            IDENTITY <span style={{ color: "var(--primary)" }}>VAULT</span>
          </h1>
        </div>
      </div>

      <ProcessGuide 
         title="Digital Vault Verification Protocol"
         steps={[
            { title: "Select Identity", desc: "Locate the student node within the vault repository to access their document index.", icon: <User size={14} /> },
            { title: "Audit Node", desc: "Select a specific file to enter the secure audit viewport for live verification.", icon: <Eye size={14} /> },
            { title: "Review Payload", desc: "Analyze the document content for accuracy, clarity, and institutional compliance.", icon: <FileText size={14} /> },
            { title: "Issue Verdict", desc: "Log institutional remarks and update the verification status in the ledger.", icon: <ShieldCheck size={14} /> }
         ]}
      />

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "2rem", alignItems: "start" }}>
        
        {/* STUDENT NAVIGATION NODES */}
        <div className="sapphire-card" style={{ padding: "1.25rem", height: "fit-content" }}>
           <div style={{ position: "relative", marginBottom: "1.5rem" }}>
              <Search size={12} style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
              <input 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="SEARCH ID..." 
                style={{ width: "100%", padding: "0.6rem 0.6rem 0.6rem 2.2rem", fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }} 
              />
           </div>

           <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)", maxHeight: "65vh", overflowY: "auto" }}>
              {filteredStudents.map(student => (
                <button 
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  style={{ 
                    width: "100%", 
                    textAlign: "left", 
                    padding: "0.85rem", 
                    background: selectedStudent?.id === student.id ? "var(--bg-accent)" : "var(--bg-surface)",
                    border: "none",
                    borderLeft: selectedStudent?.id === student.id ? "2px solid var(--primary)" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s"
                  }}
                >
                  <p style={{ fontSize: "0.75rem", fontWeight: "800", color: selectedStudent?.id === student.id ? "var(--primary)" : "var(--text-main)" }}>{student.name.toUpperCase()}</p>
                  <p style={{ fontSize: "0.55rem", fontWeight: "800", color: "var(--text-dim)", marginTop: "0.2rem" }}>SID: {student.studentId || "PENDING"}</p>
                </button>
              ))}
           </div>
        </div>

        {/* DATA AUDIT CONSOLE */}
        <div style={{ minWidth: 0 }}>
          {selectedStudent ? (
            <motion.div 
              initial={{ opacity: 0, x: 10 }} 
              animate={{ opacity: 1, x: 0 }} 
              key={selectedStudent.id}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Profile Card */}
              <div className="sapphire-card" style={{ marginBottom: "1.5rem", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)" }}>{(selectedStudent.name || "Unknown").toUpperCase()}</h2>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
                       <p style={{ color: "var(--primary)", fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.1em" }}>ROLE: {selectedStudent.role}</p>
                       <p style={{ color: "var(--text-dim)", fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.1em" }}>SID: {selectedStudent.studentId || "N/A"}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                     <p style={{ fontSize: "1.1rem", fontWeight: "900", color: "var(--primary)" }}>{Object.keys(selectedStudent.vault || {}).length} FILES</p>
                     <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>INDEX STAMPED</p>
                  </div>
                </div>
              </div>

              {/* Document List */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100%, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
                {Object.entries(selectedStudent.vault || {}).map(([name, info]: [string, any]) => (
                  <div key={name} className="sapphire-card" style={{ padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: "1.25rem", alignItems: "center" }}>
                      <div style={{ width: "36px", height: "36px", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", border: "1px solid var(--border-dim)" }}>
                        <FileText size={16} />
                      </div>
                      <div>
                        <p style={{ fontWeight: "800", fontSize: "0.8rem", color: "var(--text-main)" }}>{name.toUpperCase()}</p>
                        <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.2rem" }}>
                          STAMPED: {info.date} • <span style={{ color: info.status === "Verified" ? "#10b981" : "var(--primary)" }}>{(info.status || "PENDING").toUpperCase()}</span>
                        </p>
                      </div>
                    </div>
                    <button 
                       onClick={() => handleOpenPreview(name, selectedStudent)}
                       className="btn-cyan"
                       style={{ padding: "0.4rem 1.25rem", fontSize: "0.6rem", borderRadius: "4px" }}
                    >
                       AUDIT NODE
                    </button>
                  </div>
                ))}
              </div>

              {/* LIVE AUDIT VIEWPORT */}
              <AnimatePresence>
                {selectedDoc && previewDoc && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: 15 }} 
                    className="sapphire-card" 
                    style={{ 
                      border: "1px solid var(--primary)", 
                      display: "grid", 
                      gridTemplateColumns: "1fr 300px", /* Reduced panel width */
                      gap: "2.5rem", 
                      padding: "2rem",
                      background: "var(--bg-surface)",
                      boxShadow: "0 30px 60px rgba(0,0,0,0.12)"
                    }}
                  >
                    
                    {/* DOCUMENT PREVIEW AREA */}
                    <div style={{ 
                      background: "var(--bg-accent)", 
                      border: "1px solid var(--border-dim)", 
                      padding: "2rem", 
                      color: "var(--text-main)", 
                      minHeight: "450px", 
                      position: "relative",
                      overflow: "hidden" 
                    }}>
                       <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-dim)", paddingBottom: "0.75rem" }}>
                          <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>SECURE VIEWPORT: {previewDoc.name.toUpperCase()}</span>
                          <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)" }}>HEX: {selectedStudent.id.substr(0,8)}</span>
                       </div>
                       
                       <div style={{ overflowY: "auto", maxHeight: "400px" }}>
                         {previewDoc.type === "Image" ? (
                           <div style={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
                             <img src={previewDoc.content} style={{ maxWidth: "200px", border: "1px solid var(--primary)", boxShadow: "0 0 20px var(--primary-glow)" }} />
                           </div>
                         ) : (
                           <pre style={{ whiteSpace: "pre-wrap", fontFamily: "inherit", fontSize: "0.8rem", lineHeight: "1.8", color: "var(--text-main)" }}>
                             {previewDoc.content}
                           </pre>
                         )}
                       </div>

                       <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem", right: "1.25rem", padding: "0.75rem", background: "rgba(0,0,0,0.05)", border: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <Database size={18} color="var(--primary)" /> DOCUMENT REPOSITORY
                   </h2>
                       </div>
                    </div>

                    {/* FEEDBACK PROTOCOL */}
                    <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                        <h3 style={{ fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.1em" }}>AUDIT PROTOCOL</h3>
                        <button onClick={() => setSelectedDoc(null)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><X size={18} /></button>
                      </div>

                      <div style={{ marginBottom: "2rem" }}>
                        <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)" }}>
                      <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem" }}>VAULT CONTROLS</h3>
                      <button className="btn-cyan" style={{ width: "100%", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
                         <Plus size={16} /> REQUEST DOCUMENT
                      </button>
                      <button className="btn-cyan" style={{ width: "100%", padding: "1rem", display: "flex", alignItems: "center", gap: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}>
                         <Download size={16} color="var(--primary)" /> EXPORT REGISTRY
                      </button>
                   </div>
                        <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>INSTITUTIONAL REMARKS</label>
                        <textarea 
                          value={remark}
                          onChange={e => setRemark(e.target.value)}
                          placeholder="ENTER AUDIT LOG..."
                          rows={4} 
                          style={{ width: "100%", padding: "0.75rem", fontSize: "0.7rem", fontWeight: "700", border: "1px solid var(--border-dim)", background: "var(--bg-accent)" }} 
                        />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {[
                          { status: "Verified", color: "#10b981", icon: <CheckCircle2 size={12} /> },
                          { status: "For Re-upload", color: "var(--primary)", icon: <Clock size={12} /> },
                          { status: "Wrong Document", color: "#ef4444", icon: <AlertCircle size={12} /> },
                        ].map((btn) => (
                          <button 
                            key={btn.status}
                            onClick={() => handleVerify(btn.status as any)}
                            style={{ 
                              padding: "0.85rem", 
                              borderRadius: "4px", 
                              background: "var(--bg-surface)", 
                              border: `1px solid ${btn.color}`, 
                              color: btn.color, 
                              fontSize: "0.65rem", 
                              fontWeight: "900",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              gap: "0.5rem",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {btn.icon} {btn.status.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="sapphire-card" style={{ height: "400px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "var(--text-dim)" }}>
               <Database size={40} style={{ opacity: 0.1, marginBottom: "1.5rem" }} />
               <p style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.2em" }}>SELECT_VAULT_NODE_TO_BEGIN</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
