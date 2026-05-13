"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  ShieldAlert, 
  MessageSquare, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  UserCheck,
  Calendar,
  AlertCircle,
  FileDown,
  ExternalLink
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { generateInstitutionalPassport } from "@/lib/utils/pdfGenerator";

export default function StudentInstitutionalRecord() {
  const { referrals, appointments, currentUser, scholarshipApps, requests } = useGlobalState();

  // Filter institutional telemetry for this student
  const myReferrals = (referrals || []).filter(ref => 
    ref.studentName.toLowerCase() === currentUser?.name?.toLowerCase() ||
    ref.studentId === currentUser?.id
  );

  const myAppointments = (appointments || []).filter(appt => 
    appt.studentId === currentUser?.id || appt.studentName === currentUser?.name
  );

  const myScholarships = (scholarshipApps || []).filter(app => 
    app.studentName.toLowerCase() === currentUser?.name?.toLowerCase()
  );

  const myRequests = (requests || []).filter(req => 
    req.studentName.toLowerCase() === currentUser?.name?.toLowerCase()
  );

  if (myReferrals.length === 0 && myAppointments.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ marginBottom: "3rem" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
         <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444" }}>
               <ShieldAlert size={22} />
            </div>
            <div>
               <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>My Institutional Guidance Record</h3>
               <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>Referrals and active counseling interventions</p>
            </div>
         </div>

         <button 
            onClick={() => generateInstitutionalPassport(currentUser, myScholarships, myRequests, myReferrals)}
            style={{
               display: "flex",
               alignItems: "center",
               gap: "0.75rem",
               padding: "0.85rem 1.5rem",
               background: "#1e293b",
               color: "white",
               borderRadius: "12px",
               fontSize: "0.85rem",
               fontWeight: "800",
               cursor: "pointer",
               border: "none",
               boxShadow: "0 10px 15px -3px rgba(30, 41, 59, 0.2)"
            }}
         >
            <FileDown size={18} color="#00e5ff" />
            DOWNLOAD OFFICIAL RECORD
         </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "1.5rem" }}>
         
         {/* Active Referrals */}
         <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
               <h4 style={{ fontSize: "0.95rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <AlertCircle size={18} color="#ef4444" /> Referral History
               </h4>
               <span style={{ fontSize: "0.7rem", fontWeight: "900", color: "#64748b", background: "#f8fafc", padding: "0.3rem 0.8rem", borderRadius: "8px" }}>{myReferrals.length} RECORDS</span>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
               {myReferrals.length > 0 ? myReferrals.map((ref, i) => (
                  <div key={ref.id} style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div>
                        <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e293b" }}>{ref.reason || "General Consultation Referral"}</p>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginTop: "0.25rem" }}>Filed by {ref.adviserName || "Faculty Adviser"} • {new Date(ref.dateFiled).toLocaleDateString()}</p>
                     </div>
                     <span style={{ 
                        fontSize: "0.65rem", 
                        fontWeight: "900", 
                        padding: "0.4rem 1rem", 
                        borderRadius: "20px",
                        background: ref.status === "Closed" ? "#f0fdf4" : "#eff6ff",
                        color: ref.status === "Closed" ? "#16a34a" : "#3b82f6",
                        border: `1px solid ${ref.status === "Closed" ? "#dcfce7" : "#dbeafe"}`
                     }}>
                        {ref.status.toUpperCase()}
                     </span>
                  </div>
               )) : (
                  <div style={{ padding: "2rem", textAlign: "center", opacity: 0.5 }}>
                     <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8" }}>No referral records found.</p>
                  </div>
               )}
            </div>
         </div>

         {/* Scheduled Interventions */}
         <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", padding: "2.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
               <h4 style={{ fontSize: "0.95rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <Calendar size={18} color="#3b82f6" /> Scheduled Sessions
               </h4>
            </div>

            <div style={{ display: "grid", gap: "1rem" }}>
               {myAppointments.length > 0 ? myAppointments.map((appt, i) => (
                  <div key={appt.id} style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ width: "42px", height: "42px", borderRadius: "10px", background: "white", border: "1px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                           <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "#ef4444" }}>MAY</span>
                           <span style={{ fontSize: "0.9rem", fontWeight: "900", color: "#1e293b" }}>14</span>
                        </div>
                        <div>
                           <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e293b" }}>{appt.type || "Guidance Session"}</p>
                           <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", marginTop: "0.25rem" }}>{appt.startTime} • Room 204</p>
                        </div>
                     </div>
                     <span style={{ 
                        fontSize: "0.65rem", 
                        fontWeight: "900", 
                        padding: "0.4rem 1rem", 
                        borderRadius: "20px",
                        background: appt.status === "APPROVED" ? "#f0fdf4" : "#fffbeb",
                        color: appt.status === "APPROVED" ? "#16a34a" : "#f59e0b",
                        border: `1px solid ${appt.status === "APPROVED" ? "#dcfce7" : "#fef3c7"}`
                     }}>
                        {appt.status}
                     </span>
                  </div>
               )) : (
                  <div style={{ padding: "2rem", textAlign: "center", opacity: 0.5 }}>
                     <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#94a3b8" }}>No upcoming sessions.</p>
                  </div>
               )}
            </div>
         </div>

      </div>
    </motion.div>
  );
}
