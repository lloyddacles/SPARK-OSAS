"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FileText, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Clock, 
  ShieldCheck, 
  FileStack, 
  ArrowRight,
  Lock,
  Calendar,
  X,
  MoreVertical,
  Check,
  CloudUpload,
  Info,
  Download,
  Terminal,
  Activity,
  Layers,
  Search
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function SubmissionsPage() {
  const { currentUser, uploadToVault } = useGlobalState();
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleGenerateTemplate = async (docName: string) => {
    const { generateTemplate } = await import("@/lib/actions/templateActions");
    const template = await generateTemplate(docName, currentUser?.name || "Student");
    setActiveTemplate(template);
    setTemplateName(docName);
  };

  const essentialDocs = [
    { name: "IDENTIFICATION PHOTO 1X1", label: "ID Photo (1x1)", icon: <ImageIcon size={20} />, desc: "Used for IDs and Official Forms.", type: "Image" },
    { name: "INSTITUTIONAL ID COPY", label: "School ID Copy", icon: <FileText size={20} />, desc: "Valid Student or Government ID.", type: "PDF" },
    { name: "LETTER OF INTENT", label: "Application Letter", icon: <FileText size={20} />, desc: "Formal letter expressing scholarship interest.", type: "Template" },
    { name: "HOUSE LOCATION SKETCH", label: "House Map Sketch", icon: <ImageIcon size={20} />, desc: "Location map of your current residence.", type: "Template" },
    { name: "RESIDENCE PHOTOGRAPHS", label: "Home Photos", icon: <ImageIcon size={20} />, desc: "Photos of home interior/exterior.", type: "PDF" },
    { name: "PSA BIRTH CERTIFICATE", label: "Birth Certificate", icon: <FileStack size={20} />, desc: "PSA copy of your birth certificate.", type: "PDF" },
    { name: "ACADEMIC REPORT CARD", label: "Report Card (Grades)", icon: <FileText size={20} />, desc: "Latest copy of your grades.", type: "PDF" },
  ];

  if (!currentUser) return null;

  const uploadedCount = essentialDocs.filter(d => currentUser?.vault?.[d.name]?.uploaded).length;
  const progress = Math.round((uploadedCount / essentialDocs.length) * 100);

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "4rem 2rem", position: "relative" }}>
      
      {/* --- TEMPLATE_PREVIEW_MODAL --- */}
      <AnimatePresence>
        {activeTemplate && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(3, 7, 18, 0.98)", backdropFilter: "blur(20px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ width: "100%", maxWidth: "900px", background: "var(--bg-surface)", border: "1px solid var(--primary)", borderRadius: "2px", boxShadow: "0 0 50px rgba(0, 229, 255, 0.1)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ padding: "1.5rem 2rem", background: "var(--bg-accent)", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Terminal size={18} color="var(--primary)" />
                    <p style={{ fontWeight: "900", fontSize: "0.7rem", letterSpacing: "0.2em", color: "var(--primary)" }}>Document Preview</p>
                 </div>
                 <button onClick={() => setActiveTemplate(null)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer", display: "flex", alignItems: "center" }}><X size={20} /></button>
              </div>
              
              <div style={{ padding: "3rem", background: "white", color: "#1e293b", margin: "2rem", borderRadius: "2px", maxHeight: "60vh", overflowY: "auto", boxShadow: "inset 0 0 10px rgba(0,0,0,0.05)" }}>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.9rem", lineHeight: "1.8", color: "#334155" }}>
                  {activeTemplate}
                </pre>
              </div>

              <div style={{ padding: "2rem", background: "var(--bg-accent)", borderTop: "1px solid var(--border-dim)", display: "flex", gap: "1rem" }}>
                <button 
                  onClick={() => { window.print(); }}
                  style={{ flex: 1, background: "var(--bg-surface)", color: "var(--text-main)", padding: "1.25rem", border: "1px solid var(--border-dim)", fontWeight: "900", fontSize: "0.7rem", letterSpacing: "0.1em", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}
                >
                  <Download size={16} /> PRINT AND SIGN
                </button>
                <button 
                  onClick={() => { uploadToVault(templateName); setActiveTemplate(null); }}
                  className="btn-cyan"
                  style={{ flex: 1, padding: "1.25rem", fontWeight: "900", fontSize: "0.7rem", letterSpacing: "0.1em" }}
                >
                  Save & Upload <Check size={18} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER_AND_TELEMETRY --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "5rem" }}>
        <header>
          <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Document Upload Center</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "var(--text-main)" }}>
            <span style={{ color: "var(--primary)" }}>My Documents</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Upload and manage your required documents for OSAS processing.</p>
        </header>

        <div style={{ textAlign: "right", width: "340px" }}>
          {(currentUser.role === "SYSTEM_ADMIN" || currentUser.role === "OSAS_DIRECTOR") && (
            <motion.a 
              href="/submissions/verify"
              whileHover={{ x: 5 }}
              style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "flex-end", color: "var(--primary)", fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.15em", marginBottom: "2rem", textDecoration: "none" }}
            >
              Go to Document Verification <ArrowRight size={14} />
            </motion.a>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.1em" }}>
            <span style={{ color: "var(--text-dim)" }}>Upload Progress</span>
            <span style={{ color: "var(--primary)" }}>{progress}% Complete</span>
          </div>
          <div style={{ height: "4px", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", overflow: "hidden" }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ height: "100%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }}
            />
          </div>
        </div>
      </div>

      {/* --- PROTOCOL_OVERVIEW --- */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)", marginBottom: "4rem" }}>
          {[
            { icon: <Activity size={18} />, label: "File Tracking", desc: "We check your files to make sure they are correct." },
            { icon: <ShieldCheck size={18} />, label: "Secure Storage", desc: "Your personal data is kept safe and private." },
            { icon: <Layers size={18} />, label: "Review Process", desc: "Directly reviewed by the student affairs office." }
          ].map((p) => (
           <div key={p.label} style={{ background: "var(--bg-surface)", padding: "2rem", display: "flex", gap: "1.5rem" }}>
              <div style={{ color: "var(--primary)" }}>{p.icon}</div>
              <div>
                 <p style={{ fontWeight: "900", fontSize: "0.75rem", marginBottom: "0.5rem", color: "var(--text-main)" }}>{p.label}</p>
                 <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.5" }}>{p.desc.toUpperCase()}</p>
              </div>
           </div>
         ))}
      </div>

      {/* --- GRID_HEADER --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <FileStack size={18} color="var(--primary)" />
            <h2 style={{ fontSize: "0.85rem", fontWeight: "900", letterSpacing: "0.1em" }}>Required Documents</h2>
         </div>
          <div style={{ position: "relative", width: "280px" }}>
            <Search size={14} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
            <input 
              placeholder="Search documents..." 
              style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", fontSize: "0.65rem", fontWeight: "900", color: "white" }}
            />
          </div>
      </div>

      {/* --- DOCUMENTS_GRID --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)" }}>
        {essentialDocs.map((doc, i) => {
          const isUploaded = currentUser?.vault?.[doc.name]?.uploaded;
          const uploadInfo = currentUser?.vault?.[doc.name];
          const isVerified = uploadInfo?.status === "Verified";

          return (
            <motion.div 
              key={doc.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              onHoverStart={() => setIsHovered(doc.name)}
              onHoverEnd={() => setIsHovered(null)}
              style={{ 
                padding: "2.5rem", 
                background: isHovered === doc.name ? "var(--bg-accent)" : "var(--bg-surface)",
                position: "relative",
                transition: "background 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
                 <div style={{ 
                    width: "48px", 
                    height: "48px", 
                    background: isUploaded ? "rgba(0, 229, 255, 0.05)" : "var(--bg-accent)", 
                    border: isUploaded ? "1px solid var(--primary)" : "1px solid var(--border-dim)",
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: isUploaded ? "var(--primary)" : "var(--text-dim)" 
                 }}>
                    {doc.icon}
                 </div>
                 
                 {isUploaded && (
                   <div style={{ 
                     fontSize: "0.55rem", 
                     fontWeight: "900", 
                     padding: "0.4rem 1rem", 
                     background: isVerified ? "rgba(16, 185, 129, 0.05)" : "rgba(0, 229, 255, 0.05)",
                     border: isVerified ? "1px solid #10b981" : "1px solid var(--primary)",
                     color: isVerified ? "#10b981" : "var(--primary)",
                     letterSpacing: "0.1em"
                   }}>
                     {uploadInfo.status?.split('_').join(' ').toUpperCase() || "AWAITING REVIEW"}
                   </div>
                 )}
              </div>
              
              <div>
                <h3 style={{ fontSize: "0.9rem", fontWeight: "900", marginBottom: "0.75rem", color: "var(--text-main)" }}>{doc.label}</h3>
                <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", marginBottom: "2.5rem", minHeight: "2rem", lineHeight: "1.6", fontWeight: "700" }}>{doc.desc}</p>
                
                {isUploaded && uploadInfo.remarks && (
                  <div style={{ marginBottom: "2rem", padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", borderLeft: "2px solid var(--primary)", fontSize: "0.65rem", display: "flex", gap: "1rem" }}>
                     <Info size={16} color="var(--primary)" style={{ flexShrink: 0 }} />
                     <div>
                        <p style={{ fontWeight: "900", marginBottom: "0.4rem", color: "var(--primary)" }}>Staff Feedback</p>
                        <p style={{ color: "var(--text-main)", fontWeight: "700", lineHeight: "1.4" }}>{uploadInfo.remarks.toUpperCase()}</p>
                     </div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "1px", background: "var(--border-dim)" }}>
                  {doc.type === "Template" && !isUploaded ? (
                    <button 
                      onClick={() => handleGenerateTemplate(doc.name)}
                      style={{ flex: 1, padding: "1rem", background: "var(--primary)", color: "var(--text-dark)", fontSize: "0.7rem", fontWeight: "900", border: "none", cursor: "pointer", letterSpacing: "0.1em" }}
                    >
                      CREATE FORM
                    </button>
                  ) : (
                    <button 
                      onClick={() => uploadToVault(doc.name)}
                      style={{ 
                        flex: 1, 
                        padding: "1rem", 
                        background: isUploaded ? "var(--bg-accent)" : "var(--primary)", 
                        color: isUploaded ? "var(--primary)" : "var(--text-dark)", 
                        fontSize: "0.7rem", 
                        fontWeight: "900", 
                        border: isUploaded ? "1px solid var(--primary)" : "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "0.75rem",
                        letterSpacing: "0.1em"
                      }}
                    >
                      {isUploaded ? <><Check size={16} /> RE-UPLOAD</> : <><CloudUpload size={16} /> UPLOAD FILE</>}
                    </button>
                  )}
                  <button style={{ width: "48px", background: "var(--bg-accent)", color: "var(--text-dim)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MoreVertical size={18} />
                  </button>
                </div>

                {isUploaded && (
                  <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid var(--border-dim)", fontSize: "0.55rem", color: "var(--text-dim)", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "900" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Clock size={12} /> FILED: {uploadInfo.date}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: isVerified ? "#10b981" : "var(--primary)" }}>
                       <ShieldCheck size={12} /> {isVerified ? "Complete" : "PENDING REVIEW"}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* --- SECURITY_PROTOCOL_NODE --- */}
      <div style={{ marginTop: "6rem", padding: "3rem", background: "var(--bg-accent)", border: "1px solid var(--primary)", display: "flex", gap: "3rem", alignItems: "center" }}>
          <div style={{ width: "80px", height: "80px", border: "1px solid var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", background: "rgba(0, 229, 255, 0.03)" }}>
            <ShieldCheck size={40} className="status-pulse" />
         </div>
         <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "0.75rem", color: "var(--text-main)", letterSpacing: "0.1em" }}>Your Files Are Secure</h3>
            <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontWeight: "700", lineHeight: "1.6" }}>
              We use high-security technology to keep your documents safe. 
              Only authorized staff from the OSAS office can view your information.
            </p>
         </div>
         <button className="btn-cyan" style={{ padding: "1rem 2.5rem", fontSize: "0.7rem", fontWeight: "900" }}>Learn More</button>
      </div>
    </div>
  );
}
