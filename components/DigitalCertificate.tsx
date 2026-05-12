"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Printer, 
  Download, 
  Share2, 
  CheckCircle2, 
  FileText,
  Clock,
  Fingerprint
} from "lucide-react";

type CertificateProps = {
  type: "GOOD_MORAL" | "ORG_RECOGNITION";
  recipientName: string;
  dateIssued: string;
  referenceId: string;
  metadata?: any;
  onClose: () => void;
};

export default function DigitalCertificate({ type, recipientName, dateIssued, referenceId, metadata, onClose }: CertificateProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const isGoodMoral = type === "GOOD_MORAL";

  return (
    <div className="certificate-overlay" style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 23, 42, 0.9)", backdropFilter: "blur(12px)", padding: "2rem" }}>
      
      {/* ── Action Toolbar (Hidden on Print) ── */}
      <div className="no-print" style={{ position: "absolute", top: "2rem", right: "2rem", display: "flex", gap: "1rem" }}>
         <button onClick={handlePrint} style={{ padding: "0.85rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.3)" }}>
            <Printer size={18} /> Print Certificate
         </button>
         <button onClick={onClose} style={{ padding: "0.85rem 1.5rem", background: "white", color: "#1e293b", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer" }}>Close</button>
      </div>

      {/* ── The Certificate (The Canvas) ── */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        style={{ 
          width: "210mm", 
          height: "297mm", 
          background: "white", 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          padding: "60px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          color: "#1e293b",
          fontFamily: "'Inter', sans-serif"
        }}
      >
        {/* Subtle Guilloche Border (CSS) */}
        <div style={{ position: "absolute", inset: "20px", border: "1px solid #e2e8f0", pointerEvents: "none" }} />
        <div style={{ position: "absolute", inset: "25px", border: "4px double #cbd5e1", pointerEvents: "none" }} />

        {/* ── Institutional Header ── */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
           <div style={{ width: "80px", height: "80px", background: "#3b82f6", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <ShieldCheck size={40} />
           </div>
           <h1 style={{ fontSize: "1.5rem", fontWeight: "900", letterSpacing: "0.1em", textTransform: "uppercase", color: "#1e293b", marginBottom: "5px" }}>SPARK University</h1>
           <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.2em" }}>Office of Student Affairs & Services</p>
           <div style={{ width: "40px", height: "2px", background: "#3b82f6", margin: "20px auto" }} />
        </div>

        {/* ── Title ── */}
        <div style={{ textAlign: "center", marginBottom: "60px" }}>
           <h2 style={{ fontSize: "3.5rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.04em", marginBottom: "10px" }}>
             {isGoodMoral ? "Certificate of Good Moral" : "Certificate of Recognition"}
           </h2>
           <p style={{ fontSize: "1.1rem", color: "#64748b", fontWeight: "500", fontStyle: "italic" }}>This document serves as an official institutional verification.</p>
        </div>

        {/* ── Recipient ── */}
        <div style={{ textAlign: "center", marginBottom: "80px" }}>
           <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "20px" }}>Awarded to</p>
           <h3 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#1e293b", borderBottom: "2px solid #f1f5f9", display: "inline-block", paddingBottom: "10px", paddingLeft: "40px", paddingRight: "40px" }}>{recipientName}</h3>
           <p style={{ fontSize: "1rem", color: "#1e293b", fontWeight: "700", marginTop: "15px" }}>{isGoodMoral ? "Student ID: ST-2024-0812" : "For exemplary organizational governance"}</p>
        </div>

        {/* ── Body Text ── */}
        <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 80px", lineHeight: "1.8", color: "#334155", fontSize: "1.1rem", fontWeight: "500" }}>
           {isGoodMoral ? (
             <p>This is to certify that the above-named student has maintained a clean disciplinary record and has demonstrated exemplary character during their tenure at SPARK University. This certification is issued upon the request of the interested party for whatever legal purposes it may serve.</p>
           ) : (
             <p>This is to certify that <strong>{metadata?.orgName || "The Organization"}</strong> is a duly recognized student organization for the Academic Year 2023-2024, having satisfied all the requirements for accreditation as prescribed by the OSAS Institutional Protocol.</p>
           )}
        </div>

        {/* ── Signatories & Verification ── */}
        <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
           
           {/* Digital Verification QR */}
           <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", alignItems: "center" }}>
              <div style={{ width: "100px", height: "100px", background: "white", padding: "8px", border: "1px solid #e2e8f0", display: "flex", flexWrap: "wrap", gap: "2px" }}>
                 {/* MOCK QR CODE GENERATED VIA CSS GRIDS */}
                 {[...Array(64)].map((_, i) => (
                    <div key={i} style={{ width: "10px", height: "10px", background: Math.random() > 0.5 ? "#1e293b" : "transparent" }} />
                 ))}
              </div>
              <div>
                 <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Digital Verification</p>
                 <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#1e293b", marginTop: "2px" }}>REF: {referenceId}</p>
                 <p style={{ fontSize: "0.6rem", color: "#94a3b8", marginTop: "2px" }}>Scan to verify authenticity via SPARK Pulse</p>
              </div>
           </div>

           {/* Signature Line */}
           <div style={{ textAlign: "center" }}>
              <div style={{ width: "220px", borderBottom: "1px solid #1e293b", marginBottom: "10px" }} />
              <p style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", textTransform: "uppercase" }}>Dr. Lloyd Dacles</p>
              <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>OSAS Executive Director</p>
              <p style={{ fontSize: "0.65rem", color: "#94a3b8", marginTop: "10px" }}>Issued on: {dateIssued}</p>
           </div>
        </div>

        {/* Decorative Bottom Pattern */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "10px", background: "linear-gradient(90deg, #3b82f6, #10b981, #6366f1)" }} />
      </motion.div>

      {/* ── Global Print Styles ── */}
      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          .certificate-overlay { background: white !important; padding: 0 !important; }
          body * { visibility: hidden; }
          .certificate-overlay, .certificate-overlay * { visibility: visible; }
          .certificate-overlay { position: absolute; left: 0; top: 0; }
        }
      `}</style>
    </div>
  );
}
