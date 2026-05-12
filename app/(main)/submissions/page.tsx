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
  Search,
  RefreshCw
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function SubmissionsPage() {
  const { currentUser, uploadToVault } = useGlobalState();
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [isHovered, setIsHovered] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);

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
            style={{ position: "fixed", inset: 0, background: "rgba(255, 255, 255, 0.9)", backdropFilter: "blur(20px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ width: "100%", maxWidth: "900px", background: "white", border: "1px solid #e5e7eb", borderRadius: "16px", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", overflow: "hidden", display: "flex", flexDirection: "column" }}
            >
              <div style={{ padding: "1.5rem 2rem", background: "#f9fafb", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <FileText size={20} color="#3b82f6" />
                    <p style={{ fontWeight: "800", fontSize: "0.9rem", color: "#111827" }}>Document Preview</p>
                 </div>
                 <button onClick={() => setActiveTemplate(null)} style={{ background: "none", border: "none", color: "#9ca3af", cursor: "pointer", display: "flex", alignItems: "center" }}><X size={20} /></button>
              </div>
              
              <div style={{ padding: "3rem", background: "white", color: "#1f2937", margin: "0", maxHeight: "60vh", overflowY: "auto" }}>
                <pre style={{ whiteSpace: "pre-wrap", fontFamily: "'Inter', sans-serif", fontSize: "0.95rem", lineHeight: "1.8", color: "#374151" }}>
                  {activeTemplate}
                </pre>
              </div>

              <div style={{ padding: "1.5rem 2rem", background: "#f9fafb", borderTop: "1px solid #f3f4f6", display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                <button 
                  onClick={() => { window.print(); }}
                  style={{ padding: "0.85rem 1.5rem", background: "white", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <Download size={16} /> Print & Sign
                </button>
                <button 
                  onClick={() => { uploadToVault(templateName); setActiveTemplate(null); }}
                  style={{ padding: "0.85rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
                >
                  Save & Upload <Check size={16} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER_AND_TELEMETRY --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem", flexWrap: "wrap", gap: "2rem" }}>
        <header>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Document Upload Center</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            My <span style={{ color: "#3b82f6" }}>Documents</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Upload and manage your required documents for OSAS processing.</p>
        </header>

        <div style={{ width: "340px", maxWidth: "100%" }}>
          {(currentUser.role === "SYSTEM_ADMIN" || currentUser.role === "OSAS_DIRECTOR") && (
            <motion.a 
              href="/submissions/verify"
              whileHover={{ x: 5 }}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "flex-end", color: "#3b82f6", fontSize: "0.85rem", fontWeight: "700", marginBottom: "1.5rem", textDecoration: "none" }}
            >
              Go to Document Verification <ArrowRight size={16} />
            </motion.a>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700" }}>
            <span style={{ color: "#6b7280" }}>Upload Progress</span>
            <span style={{ color: "#3b82f6" }}>{progress}% Complete</span>
          </div>
          <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              style={{ height: "100%", background: "#3b82f6" }}
            />
          </div>
        </div>
      </div>

      {/* --- PROTOCOL_OVERVIEW --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginBottom: "4rem" }}>
          {[
            { icon: <Activity size={20} />, label: "File Tracking", desc: "We check your files to make sure they are correct.", color: "#6366f1" },
            { icon: <ShieldCheck size={20} />, label: "Secure Storage", desc: "Your personal data is kept safe and private.", color: "#10b981" },
            { icon: <Layers size={20} />, label: "Review Process", desc: "Directly reviewed by the student affairs office.", color: "#f59e0b" }
          ].map((p) => (
           <div key={p.label} style={{ background: "white", padding: "1.5rem", display: "flex", gap: "1.25rem", borderRadius: "14px", border: "1px solid #f3f4f6", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${p.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: p.color, flexShrink: 0 }}>{p.icon}</div>
              <div>
                 <p style={{ fontWeight: "800", fontSize: "0.95rem", color: "#111827", marginBottom: "0.25rem" }}>{p.label}</p>
                 <p style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: "1.4" }}>{p.desc}</p>
              </div>
           </div>
         ))}
      </div>

      {/* --- GRID_HEADER --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <FileStack size={22} color="#3b82f6" />
            <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#111827" }}>Required Documents</h2>
         </div>
          <div style={{ position: "relative", width: "100%", maxWidth: "320px" }}>
            <Search size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
            <input 
              placeholder="Search documents..." 
              style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.5rem", background: "white", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "0.85rem", color: "#111827", outline: "none" }}
            />
          </div>
      </div>

      {/* --- DOCUMENTS_GRID --- */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "1.5rem" }}>
        {essentialDocs.map((doc, i) => {
          const isUploaded = currentUser?.vault?.[doc.name]?.uploaded;
          const uploadInfo = currentUser?.vault?.[doc.name];
          const isVerified = uploadInfo?.status === "Verified";

          return (
            <motion.div 
              key={doc.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
              style={{ 
                padding: "2rem", 
                background: "white",
                borderRadius: "16px",
                border: "1px solid #f3f4f6",
                boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                display: "flex",
                flexDirection: "column",
                position: "relative"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", alignItems: "flex-start" }}>
                 <div style={{ 
                    width: "52px", 
                    height: "52px", 
                    borderRadius: "14px",
                    background: isUploaded ? "rgba(16, 185, 129, 0.1)" : "#f3f4f6", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    color: isUploaded ? "#10b981" : "#6b7280" 
                 }}>
                    {doc.icon}
                 </div>
                 
                 {isUploaded && (
                   <div style={{ 
                     fontSize: "0.7rem", 
                     fontWeight: "700", 
                     padding: "0.4rem 0.8rem", 
                     borderRadius: "20px",
                     background: isVerified ? "#f0fdf4" : "#fefce8",
                     color: isVerified ? "#16a34a" : "#ca8a04",
                     display: "flex",
                     alignItems: "center"
                   }}>
                     {uploadInfo.status?.split('_').join(' ') || "Pending Review"}
                   </div>
                 )}
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#111827", marginBottom: "0.4rem" }}>{doc.label}</h3>
                <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "2rem", lineHeight: "1.5" }}>{doc.desc}</p>
                
                {isUploaded && uploadInfo.remarks && (
                  <div style={{ marginBottom: "1.5rem", padding: "1rem", background: "#f8fafc", borderRadius: "8px", borderLeft: "3px solid #3b82f6", fontSize: "0.8rem", display: "flex", gap: "0.75rem" }}>
                     <Info size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: "0.1rem" }} />
                     <div>
                        <p style={{ fontWeight: "700", color: "#1e293b", marginBottom: "0.2rem" }}>Staff Feedback</p>
                        <p style={{ color: "#475569", lineHeight: "1.4" }}>{uploadInfo.remarks}</p>
                     </div>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                {doc.type === "Template" && !isUploaded ? (
                  <button 
                    onClick={() => handleGenerateTemplate(doc.name)}
                    style={{ flex: 1, padding: "0.85rem", background: "#3b82f6", color: "white", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", border: "none", cursor: "pointer" }}
                  >
                    Create Form
                  </button>
                ) : (
                  <button 
                    disabled={uploadingDoc === doc.name}
                    onClick={async () => {
                      setUploadingDoc(doc.name);
                      // Simulate File Selection Delay
                      setTimeout(async () => {
                        await uploadToVault(doc.name);
                        setUploadingDoc(null);
                      }, 1500);
                    }}
                    style={{ 
                      flex: 1, 
                      padding: "0.85rem", 
                      background: uploadingDoc === doc.name ? "#f3f4f6" : isUploaded ? "#f9fafb" : "#3b82f6", 
                      color: uploadingDoc === doc.name ? "#94a3b8" : isUploaded ? "#374151" : "white", 
                      borderRadius: "8px",
                      fontSize: "0.85rem", 
                      fontWeight: "700", 
                      border: isUploaded ? "1px solid #e5e7eb" : "none",
                      cursor: uploadingDoc === doc.name ? "not-allowed" : "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem"
                    }}
                  >
                    {uploadingDoc === doc.name ? (
                      <><RefreshCw className="animate-spin" size={16} /> Encrypting...</>
                    ) : isUploaded ? (
                      <><CloudUpload size={16} /> Update File</>
                    ) : (
                      <><CloudUpload size={16} /> Upload File</>
                    )}
                  </button>
                )}
                <button style={{ width: "42px", borderRadius: "8px", background: "white", border: "1px solid #e5e7eb", color: "#6b7280", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MoreVertical size={18} />
                </button>
              </div>

              {isUploaded && (
                <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid #f3f4f6", fontSize: "0.75rem", color: "#9ca3af", display: "flex", justifyContent: "space-between", alignItems: "center", fontWeight: "600" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Clock size={14} /> Filed: {uploadInfo.date}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: isVerified ? "#10b981" : "#f59e0b" }}>
                     <ShieldCheck size={14} /> {isVerified ? "Complete" : "Under Review"}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* --- SECURITY_PROTOCOL_NODE --- */}
      <div style={{ marginTop: "4rem", padding: "2.5rem 3rem", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", display: "flex", gap: "2.5rem", alignItems: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", flexWrap: "wrap" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(16, 185, 129, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#10b981", flexShrink: 0 }}>
            <ShieldCheck size={32} />
         </div>
         <div style={{ flex: 1, minWidth: "250px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.5rem", color: "#111827" }}>Your Files Are Secure</h3>
            <p style={{ color: "#6b7280", fontSize: "0.9rem", lineHeight: "1.6" }}>
              We use high-security technology to keep your documents safe. 
              Only authorized staff from the OSAS office can view your information.
            </p>
         </div>
         <button style={{ padding: "0.85rem 2rem", background: "white", color: "#374151", border: "1px solid #d1d5db", borderRadius: "8px", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", whiteSpace: "nowrap" }}>Learn More</button>
      </div>
    </div>
  );
}
