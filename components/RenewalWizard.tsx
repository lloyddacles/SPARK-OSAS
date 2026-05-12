"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileCheck, 
  Users, 
  ShieldCheck, 
  FileText, 
  ArrowRight, 
  Check, 
  Upload,
  AlertCircle
} from "lucide-react";

interface RenewalWizardProps {
  organization: any;
}

export default function RenewalWizard({ organization }: RenewalWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);

  const steps = [
    { id: 1, title: "Constitution", desc: "Upload revised by-laws", icon: <FileCheck size={20} /> },
    { id: 2, title: "Officer Roster", desc: "Validate current officers", icon: <Users size={20} /> },
    { id: 3, title: "Advisory Sync", desc: "Confirm faculty adviser", icon: <ShieldCheck size={20} /> },
    { id: 4, title: "Plan of Action", desc: "Submit yearly calendar", icon: <FileText size={20} /> },
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        setIsSubmitting(false);
        setCompleted(true);
      }, 2000);
    }
  };

  if (completed) {
    return (
      <div style={{ padding: "4rem 2rem", textAlign: "center", background: "#f0fdf4", borderRadius: "24px", border: "1px solid #bbf7d0" }}>
        <div style={{ width: "80px", height: "80px", background: "#16a34a", color: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", boxShadow: "0 10px 15px rgba(22, 163, 74, 0.2)" }}>
           <Check size={40} />
        </div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#166534" }}>Renewal Transmitted</h3>
        <p style={{ color: "#15803d", fontWeight: "600", marginTop: "1rem", maxWidth: "400px", margin: "1rem auto" }}>Your institutional recognition papers are now being reviewed by OSAS. You will be notified of the decision within 72 hours.</p>
        <button onClick={() => setCompleted(false)} style={{ marginTop: "2rem", padding: "0.85rem 2rem", background: "white", border: "1px solid #bbf7d0", color: "#166534", borderRadius: "12px", fontWeight: "800", cursor: "pointer" }}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div style={{ background: "white", padding: "3rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
      <div style={{ marginBottom: "3rem" }}>
         <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>Recognition Cycle 2024-2025</p>
         <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b" }}>Organization Renewal</h2>
      </div>

      {/* Stepper UI */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4rem", position: "relative" }}>
         <div style={{ position: "absolute", top: "24px", left: "0", right: "0", height: "2px", background: "#f1f5f9", zIndex: 0 }} />
         <div style={{ position: "absolute", top: "24px", left: "0", width: `${((currentStep - 1) / 3) * 100}%`, height: "2px", background: "#3b82f6", zIndex: 0, transition: "width 0.4s ease" }} />
         
         {steps.map(step => (
            <div key={step.id} style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: "100px" }}>
               <div style={{ 
                 width: "50px", 
                 height: "50px", 
                 borderRadius: "16px", 
                 background: currentStep >= step.id ? "#3b82f6" : "white", 
                 color: currentStep >= step.id ? "white" : "#cbd5e1",
                 border: `2px solid ${currentStep >= step.id ? "#3b82f6" : "#f1f5f9"}`,
                 display: "flex",
                 alignItems: "center",
                 justifyContent: "center",
                 transition: "all 0.3s",
                 boxShadow: currentStep === step.id ? "0 0 15px rgba(59, 130, 246, 0.3)" : "none"
               }}>
                  {currentStep > step.id ? <Check size={24} /> : step.icon}
               </div>
               <p style={{ fontSize: "0.7rem", fontWeight: "900", color: currentStep >= step.id ? "#1e293b" : "#94a3b8", marginTop: "1rem", textTransform: "uppercase" }}>{step.title}</p>
            </div>
         ))}
      </div>

      {/* Step Content */}
      <motion.div 
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        style={{ padding: "3rem", background: "#f8fafc", borderRadius: "20px", border: "1px solid #f1f5f9", marginBottom: "2.5rem" }}
      >
         <h4 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.75rem" }}>{steps[currentStep-1].title}</h4>
         <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "500", marginBottom: "2rem" }}>{steps[currentStep-1].desc}</p>
         
         <div style={{ height: "180px", border: "2px dashed #cbd5e1", borderRadius: "16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white", cursor: "pointer" }}>
            <Upload size={32} color="#94a3b8" />
            <p style={{ marginTop: "1rem", fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>Click or drag PDF to transmit document</p>
         </div>

         <div style={{ marginTop: "2rem", display: "flex", gap: "1rem", alignItems: "center", color: "#92400e", background: "#fffbeb", padding: "1rem", borderRadius: "12px", border: "1px solid #fef3c7" }}>
            <AlertCircle size={18} />
            <p style={{ fontSize: "0.8rem", fontWeight: "700" }}>Ensure all signatures are visible before uploading.</p>
         </div>
      </motion.div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
         <button 
           onClick={handleNext}
           disabled={isSubmitting}
           style={{ padding: "1rem 3rem", background: "#111827", color: "white", border: "none", borderRadius: "14px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 10px 15px rgba(0,0,0,0.1)" }}
         >
            {isSubmitting ? "TRANSMITTING..." : <>{currentStep === 4 ? "Finalize Submission" : "Continue"} <ArrowRight size={20} /></>}
         </button>
      </div>
    </div>
  );
}
