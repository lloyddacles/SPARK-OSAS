"use client";

import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  FileText, 
  GraduationCap, 
  Users, 
  Calendar, 
  Printer,
  QrCode,
  MapPin,
  CheckCircle2
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

interface DigitalPassportProps {
  student?: any;
}

export default function DigitalPassport({ student }: DigitalPassportProps) {
  const { currentUser, scholarshipApps, organizations, batchConfigs } = useGlobalState();
  const targetUser = student || currentUser;

  if (!targetUser) return null;

  // Aggregate Data
  const studentScholarships = scholarshipApps.filter(app => app.studentName === targetUser.name && app.status === "Approved");
  const studentOrgs = organizations.filter(org => org.president === targetUser.name || org.adviser === targetUser.name); // Simplified logic
  
  const verifiedDocs = Object.entries(targetUser.vault || {})
    .filter(([_, data]: any) => data.status === "Verified")
    .map(([name]) => name);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="passport-container" style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
      
      {/* ACTION BAR (HIDDEN ON PRINT) */}
      <div className="no-print" style={{ display: "flex", justifyContent: "flex-end", marginBottom: "2rem" }}>
        <button 
          onClick={handlePrint}
          style={{ padding: "0.75rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}
        >
          <Printer size={18} /> EXPORT OFFICIAL DOSSIER
        </button>
      </div>

      {/* THE PASSPORT DOCUMENT */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ 
          background: "white", 
          borderRadius: "0", 
          border: "1px solid #e2e8f0", 
          padding: "4rem", 
          boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
          color: "#1e293b",
          position: "relative"
        }}
      >
        {/* WATERMARK */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.03, pointerEvents: "none" }}>
           <GraduationCap size={400} />
        </div>

        {/* HEADER */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4rem", borderBottom: "2px solid #f1f5f9", paddingBottom: "2rem" }}>
           <div>
              <h1 style={{ fontSize: "1.8rem", fontWeight: "900", letterSpacing: "-0.02em", color: "#0f172a" }}>INSTITUTIONAL <span style={{ color: "#3b82f6" }}>PASSPORT</span></h1>
              <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "700", marginTop: "0.25rem" }}>OFFICIAL STUDENT RECORD // SPARK OSAS ECOSYSTEM</p>
           </div>
           <div style={{ textAlign: "right" }}>
              <QrCode size={80} color="#1e293b" />
              <p style={{ fontSize: "0.6rem", color: "#94a3b8", fontWeight: "800", marginTop: "0.5rem" }}>VERIFY_UID: {targetUser.id.substring(0, 12)}</p>
           </div>
        </div>

        {/* IDENTITY SECTION */}
        <div style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: "3rem", marginBottom: "4rem" }}>
           <div style={{ width: "180px", height: "180px", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", fontWeight: "900", color: "#3b82f6" }}>
              {targetUser.name.charAt(0)}
           </div>
           <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
              <div>
                 <p style={{ fontSize: "0.65rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Full Legal Name</p>
                 <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{targetUser.name}</p>
              </div>
              <div>
                 <p style={{ fontSize: "0.65rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Student Number</p>
                 <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#0f172a" }}>{targetUser.studentId || targetUser.username}</p>
              </div>
              <div>
                 <p style={{ fontSize: "0.65rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Academic Program</p>
                 <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#3b82f6" }}>{targetUser.program || "General Education"}</p>
              </div>
              <div>
                 <p style={{ fontSize: "0.65rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>Institutional Status</p>
                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                    <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#10b981" }}>{targetUser.status || "ACTIVE"}</p>
                 </div>
              </div>
           </div>
        </div>

        {/* DETAILS GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
           
           {/* LEFT: VERIFIED VAULT */}
           <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                 <ShieldCheck size={18} color="#3b82f6" />
                 <h4 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e293b", textTransform: "uppercase" }}>Verified Credentials</h4>
              </div>
              <div style={{ display: "grid", gap: "1rem" }}>
                 {verifiedDocs.length > 0 ? verifiedDocs.map(doc => (
                   <div key={doc} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                      <FileText size={16} color="#64748b" />
                      <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#334155" }}>{doc}</span>
                      <CheckCircle2 size={14} color="#10b981" style={{ marginLeft: "auto" }} />
                   </div>
                 )) : (
                   <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontStyle: "italic" }}>No verified documents in vault.</p>
                 )}
              </div>
           </div>

           {/* RIGHT: INSTITUTIONAL INVOLVEMENT */}
           <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem", borderBottom: "1px solid #f1f5f9", paddingBottom: "0.75rem" }}>
                 <Users size={18} color="#8b5cf6" />
                 <h4 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e293b", textTransform: "uppercase" }}>Institutional Involvement</h4>
              </div>
              
              <div style={{ display: "grid", gap: "1.5rem" }}>
                 {/* Scholarships */}
                 <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Scholarships & Grants</p>
                    {studentScholarships.length > 0 ? studentScholarships.map(app => (
                      <div key={app.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                         <GraduationCap size={16} color="#3b82f6" />
                         <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>Approved Institutional Scholar</span>
                      </div>
                    )) : <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>No active scholarship records.</p>}
                 </div>

                 {/* Organizations */}
                 <div>
                    <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Leadership Roles</p>
                    {studentOrgs.length > 0 ? studentOrgs.map(org => (
                      <div key={org.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                         <Users size={16} color="#8b5cf6" />
                         <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>{org.acronym} Executive Board</span>
                      </div>
                    )) : <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>No leadership records identified.</p>}
                 </div>
              </div>
           </div>
        </div>

        {/* FOOTER / ATTESTATION */}
        <div style={{ marginTop: "6rem", borderTop: "2px solid #f1f5f9", paddingTop: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
           <div>
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", maxWidth: "300px", lineHeight: "1.5" }}>
                 This document is electronically generated and verified through the SPARK OSAS Digital Ledger.
                 Any alterations will invalidate the underlying cryptographic UID.
              </p>
           </div>
           <div style={{ textAlign: "center" }}>
              <div style={{ width: "200px", borderBottom: "1px solid #1e293b", marginBottom: "0.5rem" }} />
              <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "#1e293b" }}>INSTITUTIONAL REGISTRAR</p>
              <p style={{ fontSize: "0.7rem", color: "#64748b", fontWeight: "700" }}>Electronically Signed</p>
           </div>
        </div>

      </motion.div>

      {/* PRINT STYLES */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; margin: 0 !important; padding: 0 !important; }
          .passport-container { max-width: 100% !important; padding: 0 !important; }
          .passport-container > div { border: none !important; box-shadow: none !important; padding: 2rem !important; }
        }
      `}</style>
    </div>
  );
}
