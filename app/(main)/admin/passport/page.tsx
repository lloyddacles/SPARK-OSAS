"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Fingerprint, 
  Search, 
  ShieldCheck, 
  GraduationCap, 
  FileText, 
  Calendar, 
  AlertTriangle, 
  History,
  Download,
  ExternalLink,
  Activity,
  Cpu,
  User,
  Star,
  Clock,
  MapPin,
  Mail,
  Phone
} from "lucide-react";
import { getStudentPassport } from "@/lib/actions/adminActions";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { generateInstitutionalPDF } from "@/lib/utils/pdfGenerator";

export default function StudentPassportPage() {
  const { logAudit } = useGlobalState();
  const [identifier, setIdentifier] = useState("");
  const [passport, setPassport] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;

    setIsSearching(true);
    setError("");
    setPassport(null);

    try {
      const data = await getStudentPassport(identifier);
      if (data && (data.identity || data.scholarships.length > 0)) {
        setPassport(data);
        logAudit("PASSPORT_ACCESS", `Digital Passport accessed for identifier: ${identifier}`, "LOW");
      } else {
        setError("NO_IDENTITY_FOUND: Verification failed for the provided identifier.");
      }
    } catch (err) {
      setError("SYSTEM_REJECTION: Data aggregation failed.");
    } finally {
      setIsSearching(false);
    }
  };

  const exportPassport = () => {
    if (!passport) return;
    const studentName = passport.identity?.name || passport.scholarships[0]?.studentName || "STUDENT";
    
    // Prepare data for PDF
    const sections = [
      {
        title: "IDENTITY PROFILE",
        data: [
          ["FIELD", "VALUE"],
          ["NAME", studentName],
          ["STUDENT_ID", passport.identity?.studentId || "N/A"],
          ["ROLE", passport.identity?.role || "N/A"],
          ["DEPARTMENT", passport.identity?.department || "N/A"],
          ["EMAIL", passport.identity?.email || "N/A"]
        ]
      },
      {
        title: "SCHOLARSHIP REGISTRY",
        data: [
          ["PROGRAM", "BATCH", "STATUS"],
          ...passport.scholarships.map((s: any) => [s.programName, s.batch, s.status])
        ]
      },
      {
        title: "SERVICE REQUEST LOGS",
        data: [
          ["TYPE", "DATE", "STATUS"],
          ...passport.serviceRequests.map((r: any) => [r.type, r.date, r.status])
        ]
      }
    ];

    generateInstitutionalPDF(
      `DIGITAL_PASSPORT_${studentName.replace(/\s+/g, '_')}`,
      "STUDENT IDENTITY PASSPORT",
      sections
    );
    logAudit("PASSPORT_EXPORT", `Digital Passport exported for ${studentName}`, "MEDIUM");
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>GOVERNANCE: IDENTITY TERMINAL</p>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            STUDENT <span style={{ color: "var(--primary)" }}>PASSPORT</span>
          </h1>
        </div>
        <div style={{ textAlign: "right" }}>
           <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>TERMINAL STATUS</p>
           <p style={{ fontSize: "1rem", fontWeight: "900", color: "#10b981" }}>ENCRYPTED_SYNC</p>
        </div>
      </div>

      {/* Search Command */}
      <div className="sapphire-card" style={{ marginBottom: "4rem", padding: "3rem", borderTop: "4px solid var(--primary)" }}>
         <form onSubmit={handleSearch} style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ flex: 1, position: "relative" }}>
               <Search size={20} style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
               <input 
                 value={identifier}
                 onChange={(e) => setIdentifier(e.target.value)}
                 placeholder="ENTER STUDENT ID OR FULL NAME TO INITIALIZE..."
                 style={{ width: "100%", padding: "1.25rem 1.25rem 1.25rem 3.5rem", fontSize: "0.9rem", fontWeight: "700", background: "var(--bg-accent)", textTransform: "uppercase" }}
               />
            </div>
            <button type="submit" disabled={isSearching} className="btn-cyan" style={{ padding: "0 3rem", fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "1rem" }}>
               {isSearching ? <Cpu className="animate-spin" size={18} /> : <Fingerprint size={18} />}
               {isSearching ? "ANALYZING..." : "INITIALIZE SCAN"}
            </button>
         </form>
         {error && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: "1.5rem", color: "#ef4444", fontSize: "0.7rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <AlertTriangle size={14} /> {error}
           </motion.div>
         )}
      </div>

      <AnimatePresence mode="wait">
        {passport ? (
          <motion.div key="passport" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            
            {/* TOP BAR: IDENTITY BLOCK */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", marginBottom: "3rem" }}>
               <div className="sapphire-card" style={{ padding: "3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ width: "120px", height: "120px", borderRadius: "50%", background: "var(--bg-accent)", margin: "0 auto 2rem", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid var(--primary)", boxShadow: "0 0 20px rgba(0, 229, 255, 0.2)" }}>
                     <User size={60} color="var(--primary)" />
                  </div>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "0.5rem" }}>{passport.identity?.name?.toUpperCase() || passport.scholarships[0]?.studentName.toUpperCase()}</h2>
                  <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "2rem" }}>{passport.identity?.role?.replace(/_/g, ' ') || "STUDENT_REGISTRY_RECORD"}</p>
                  
                  <div style={{ display: "grid", gap: "1rem", textAlign: "left", paddingTop: "2rem", borderTop: "1px solid var(--border-dim)" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <Fingerprint size={14} color="var(--text-dim)" />
                        <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-main)" }}>ID: {passport.identity?.studentId || "UNVERIFIED"}</span>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <MapPin size={14} color="var(--text-dim)" />
                        <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-main)" }}>DEPT: {passport.identity?.department || "NOT_SET"}</span>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <Mail size={14} color="var(--text-dim)" />
                        <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-main)" }}>{passport.identity?.email || "N/A"}</span>
                     </div>
                  </div>
               </div>

               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                  <div className="sapphire-card" style={{ padding: "2.5rem" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "1rem" }}>
                           <Star size={16} color="var(--primary)" /> SCHOLARSHIP STATUS
                        </h3>
                     </div>
                     {passport.scholarships.length > 0 ? (
                       <div style={{ display: "grid", gap: "1.5rem" }}>
                          {passport.scholarships.map((s: any) => (
                            <div key={s.id}>
                               <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--text-main)" }}>{s.programName}</p>
                               <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
                                  <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>{s.batch}</span>
                                  <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "#10b981" }}>{s.status.toUpperCase()}</span>
                               </div>
                            </div>
                          ))}
                       </div>
                     ) : (
                       <p style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--text-dim)" }}>NO ACTIVE SCHOLARSHIP RECORDS FOUND.</p>
                     )}
                  </div>

                  <div className="sapphire-card" style={{ padding: "2.5rem" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <h3 style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "1rem" }}>
                           <Activity size={16} color="var(--primary)" /> BEHAVIORAL LEDGER
                        </h3>
                     </div>
                     <div style={{ textAlign: "center", padding: "1rem" }}>
                        <h4 style={{ fontSize: "1.5rem", fontWeight: "900", color: passport.referralHistory.length > 0 ? "#f59e0b" : "#10b981" }}>
                           {passport.referralHistory.length > 0 ? passport.referralHistory.length : "ZERO"}
                        </h4>
                        <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.5rem" }}>PENDING REFERRALS</p>
                        <div style={{ marginTop: "1.5rem", height: "4px", background: "var(--bg-accent)", borderRadius: "2px", overflow: "hidden" }}>
                           <div style={{ width: passport.referralHistory.length > 0 ? "30%" : "100%", height: "100%", background: passport.referralHistory.length > 0 ? "#f59e0b" : "#10b981" }} />
                        </div>
                     </div>
                  </div>

                  <div className="sapphire-card" style={{ gridColumn: "span 2", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", gap: "3rem" }}>
                         <div>
                            <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>LAST SYSTEM SCAN</p>
                            <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--text-main)" }}>{new Date(passport.lastAudit).toLocaleString()}</p>
                         </div>
                         <div>
                            <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>DATA INTEGRITY</p>
                            <p style={{ fontSize: "0.8rem", fontWeight: "900", color: "#10b981" }}>VERIFIED_ENCRYPTED</p>
                         </div>
                      </div>
                      <button onClick={exportPassport} className="btn-cyan" style={{ padding: "0.75rem 2rem", fontSize: "0.6rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                         <Download size={14} /> EXPORT_IDENTITY_PDF
                      </button>
                  </div>
               </div>
            </div>

            {/* LOWER SECTION: TABS / LOGS */}
            <div className="sapphire-card" style={{ padding: "0" }}>
               <div style={{ padding: "2rem", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                     <History size={18} color="var(--primary)" /> INSTITUTIONAL TRANSACTION LOGS
                  </h3>
               </div>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border-dim)" }}>
                  
                  {/* SERVICE REQUESTS */}
                  <div style={{ background: "var(--bg-surface)", padding: "2.5rem" }}>
                     <h4 style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", marginBottom: "2rem", letterSpacing: "0.2em" }}>01_SERVICE_REQUESTS</h4>
                     <div style={{ display: "grid", gap: "1rem" }}>
                        {passport.serviceRequests.map((req: any) => (
                           <div key={req.id} style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                 <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-main)" }}>{req.type.toUpperCase()}</p>
                                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.25rem" }}>{req.date}</p>
                              </div>
                              <span style={{ fontSize: "0.55rem", fontWeight: "900", color: req.status === "Completed" ? "#10b981" : "var(--primary)" }}>{req.status.toUpperCase()}</span>
                           </div>
                        ))}
                        {passport.serviceRequests.length === 0 && <p style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>NO SERVICE REQUESTS ON FILE.</p>}
                     </div>
                  </div>

                  {/* APPOINTMENT HISTORY */}
                  <div style={{ background: "var(--bg-surface)", padding: "2.5rem" }}>
                     <h4 style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", marginBottom: "2rem", letterSpacing: "0.2em" }}>02_APPOINTMENT_RECORDS</h4>
                     <div style={{ display: "grid", gap: "1rem" }}>
                        {passport.appointmentHistory.map((appt: any) => (
                           <div key={appt.id} style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <div>
                                 <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-main)" }}>{appt.title.toUpperCase()}</p>
                                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.25rem" }}>{appt.date} • {appt.startTime}</p>
                              </div>
                              <span style={{ fontSize: "0.55rem", fontWeight: "900", color: appt.status === "COMPLETED" ? "#10b981" : "#f59e0b" }}>{appt.status}</span>
                           </div>
                        ))}
                        {passport.appointmentHistory.length === 0 && <p style={{ fontSize: "0.65rem", color: "var(--text-dim)" }}>NO APPOINTMENT RECORDS DETECTED.</p>}
                     </div>
                  </div>

               </div>
            </div>

          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", padding: "10rem 2rem", opacity: 0.3 }}>
             <Fingerprint size={80} style={{ margin: "0 auto 2rem" }} />
             <h3 style={{ fontSize: "1rem", fontWeight: "900", letterSpacing: "0.2em" }}>AWAITING_IDENTITY_SCAN</h3>
             <p style={{ fontSize: "0.7rem", fontWeight: "700", marginTop: "1rem" }}>ENTER A VALID STUDENT IDENTIFIER TO ACTIVATE THE PASSPORT TERMINAL.</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
