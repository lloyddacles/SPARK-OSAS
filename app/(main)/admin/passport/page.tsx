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
  Phone,
  Zap,
  CheckCircle,
  Eye
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
      // Simulate high-fidelity network latency for "Scanning" feel
      await new Promise(r => setTimeout(r, 1200));
      const data = await getStudentPassport(identifier);
      if (data && (data.identity || data.scholarships.length > 0)) {
        setPassport(data);
        logAudit("STUDENT_PROFILE_VIEWED", `Student profile viewed for identifier: ${identifier}`, "LOW");
      } else {
        setError("Student not found. Please check the name or ID and try again.");
      }
    } catch (err) {
      setError("An error occurred while searching. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const exportPassport = () => {
    if (!passport) return;
    const studentName = passport.identity?.name || passport.scholarships[0]?.studentName || "STUDENT";
    
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

    generateInstitutionalPDF({
      filename: `DIGITAL_PASSPORT_${studentName.replace(/\s+/g, '_')}`,
      title: "STUDENT IDENTITY PASSPORT",
      sections: sections
    });
    logAudit("STUDENT_PROFILE_EXPORTED", `Student profile exported for ${studentName}`, "MEDIUM");
  };

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", position: "relative" }}>
      
      {/* SCANNING OVERLAY */}
      <AnimatePresence>
        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1000,
              background: "rgba(10, 15, 25, 0.9)",
              backdropFilter: "blur(40px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem"
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360]
              }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              style={{ width: "100px", height: "100px", border: "2px dashed var(--primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <Fingerprint size={48} color="var(--primary)" />
            </motion.div>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.2em" }}>Searching Student Records</h2>
              <p style={{ color: "var(--primary)", fontWeight: "700", marginTop: "1rem", fontSize: "0.8rem", letterSpacing: "0.1em" }}>Searching for: {identifier.toUpperCase()}</p>
            </div>
            
            {/* Dynamic Scan Line */}
            <motion.div 
              animate={{ y: ["-100%", "100%", "-100%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ position: "absolute", left: 0, right: 0, height: "100px", background: "linear-gradient(to bottom, transparent, rgba(0, 229, 255, 0.2), transparent)", pointerEvents: "none" }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sapphire Header */}
      <div style={{ marginBottom: "5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Records</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "var(--text-main)" }}>
            <span style={{ color: "var(--primary)" }}>Student Profile</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Look up any student's full record — scholarships, requests, appointments, and referral history.</p>
        </div>
        <div style={{ textAlign: "right" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "1rem", justifyContent: "flex-end", marginBottom: "1rem" }}>
             <Activity size={16} className="animate-pulse" color="var(--primary)" />
             <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em" }}>Connected & Secure</p>
           </div>
           <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>OSAS Student Records System</p>
        </div>
      </div>

      {/* Search Command */}
      <motion.div 
        layout
        className="sapphire-card" 
        style={{ marginBottom: "5rem", padding: "3rem", borderLeft: "4px solid var(--primary)", position: "relative", overflow: "hidden" }}
      >
         <div style={{ position: "absolute", top: 0, right: 0, padding: "0.5rem 1rem", background: "var(--primary)", color: "var(--bg-deep)", fontSize: "0.55rem", fontWeight: "900", letterSpacing: "0.1em" }}>
           Search Required
         </div>
         <form onSubmit={handleSearch} style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ flex: 1, position: "relative" }}>
               <Search size={22} style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", color: "var(--primary)", opacity: 0.5 }} />
               <input 
                 value={identifier}
                 onChange={(e) => setIdentifier(e.target.value)}
                 placeholder="Enter student name or ID..."
                 style={{ 
                   width: "100%", 
                   padding: "1.5rem 1.5rem 1.5rem 4rem", 
                   fontSize: "1rem", 
                   fontWeight: "700", 
                   background: "rgba(255,255,255,0.02)", 
                   border: "1px solid var(--border-dim)",
                   color: "var(--text-main)",
                   textTransform: "uppercase" 
                 }}
               />
            </div>
            <button type="submit" disabled={isSearching} className="btn-cyan" style={{ padding: "0 4rem", fontSize: "0.8rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1.25rem" }}>
               {isSearching ? <Cpu className="animate-spin" size={20} /> : <Fingerprint size={20} />}
               {isSearching ? "ANALYZING..." : "Search Student"}
            </button>
         </form>
         {error && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} style={{ marginTop: "2rem", color: "#ef4444", fontSize: "0.75rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
              <AlertTriangle size={16} /> {error}
           </motion.div>
         )}
      </motion.div>

      <AnimatePresence mode="wait">
        {passport ? (
          <motion.div 
            key="passport-result" 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            
            {/* TOP BAR: HOLOGRAPHIC IDENTITY BLOCK */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "4rem", marginBottom: "4rem" }}>
               <motion.div 
                 whileHover={{ scale: 1.02 }}
                 className="sapphire-card" 
                 style={{ 
                   padding: "4rem 3rem", 
                   textAlign: "center", 
                   position: "relative", 
                   overflow: "hidden", 
                   border: "1px solid var(--primary)",
                   boxShadow: "0 0 40px rgba(0, 229, 255, 0.1)"
                 }}
               >
                  {/* Holographic Watermark */}
                  <div style={{ position: "absolute", top: "-10%", right: "-10%", opacity: 0.05 }}>
                    <ShieldCheck size={200} />
                  </div>

                  <div style={{ position: "relative", width: "160px", height: "160px", margin: "0 auto 2.5rem" }}>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      style={{ position: "absolute", inset: -10, border: "2px dashed var(--primary)", borderRadius: "50%", opacity: 0.3 }}
                    />
                    <div style={{ width: "100%", height: "100%", borderRadius: "50%", background: "var(--bg-accent)", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid var(--primary)", boxShadow: "0 0 30px var(--primary-glow)", position: "relative", overflow: "hidden" }}>
                       <User size={80} color="var(--primary)" />
                       <motion.div 
                         animate={{ x: ["-100%", "200%"] }}
                         transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                         style={{ position: "absolute", top: 0, bottom: 0, width: "20px", background: "rgba(255,255,255,0.1)", skewX: "-20deg" }}
                       />
                    </div>
                  </div>

                  <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>{passport.identity?.name?.toUpperCase() || passport.scholarships[0]?.studentName.toUpperCase()}</h2>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", background: "rgba(0, 229, 255, 0.1)", padding: "0.5rem 1.25rem", borderRadius: "4px", marginBottom: "3rem" }}>
                    <div style={{ width: "6px", height: "6px", background: "var(--primary)", borderRadius: "50%" }} />
                    <span style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>{passport.identity?.role?.replace(/_/g, ' ') || "STUDENT"}</span>
                  </div>
                  
                  <div style={{ display: "grid", gap: "1.5rem", textAlign: "left", paddingTop: "3rem", borderTop: "1px solid var(--border-dim)" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                           <Fingerprint size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>Student ID</p>
                          <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)" }}>{passport.identity?.studentId || "Not Available"}</p>
                        </div>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                           <MapPin size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>Department</p>
                          <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)" }}>{passport.identity?.department || "General"}</p>
                        </div>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                        <div style={{ width: "32px", height: "32px", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                           <Mail size={16} color="var(--primary)" />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>Email</p>
                          <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)" }}>{passport.identity?.email || "N/A"}</p>
                        </div>
                     </div>
                  </div>
               </motion.div>

               <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
                    <div className="sapphire-card" style={{ padding: "3rem", borderTop: "4px solid var(--primary)" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                          <h3 style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "1rem", letterSpacing: "0.1em" }}>
                             <Star size={18} color="var(--primary)" /> Scholarships
                          </h3>
                       </div>
                       {passport.scholarships.length > 0 ? (
                         <div style={{ display: "grid", gap: "2rem" }}>
                            {passport.scholarships.map((s: any) => (
                              <div key={s.id} style={{ background: "rgba(255,255,255,0.02)", padding: "1.5rem", border: "1px solid var(--border-dim)" }}>
                                 <p style={{ fontSize: "1rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "0.5rem" }}>{s.programName}</p>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)" }}>{s.batch}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#10b981" }}>
                                      <CheckCircle size={12} />
                                      <span style={{ fontSize: "0.65rem", fontWeight: "900" }}>{s.status.toUpperCase()}</span>
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                       ) : (
                         <div style={{ padding: "3rem 1rem", textAlign: "center", opacity: 0.3 }}>
                           <FileText size={32} style={{ margin: "0 auto 1.5rem" }} />
                           <p style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.1em" }}>No Records Found</p>
                         </div>
                       )}
                    </div>

                    <div className="sapphire-card" style={{ padding: "3rem", borderTop: "4px solid #f59e0b" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                          <h3 style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "1rem", letterSpacing: "0.1em" }}>
                             <Activity size={18} color="#f59e0b" /> Behavior Record
                          </h3>
                       </div>
                       <div style={{ textAlign: "center", padding: "1rem" }}>
                          <div style={{ position: "relative", display: "inline-block" }}>
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ repeat: Infinity, duration: 2 }}
                              style={{ position: "absolute", inset: -10, borderRadius: "50%", border: "2px solid rgba(245, 158, 11, 0.2)" }} 
                            />
                            <h4 style={{ fontSize: "3rem", fontWeight: "900", color: passport.referralHistory.length > 0 ? "#f59e0b" : "#10b981", position: "relative" }}>
                               {passport.referralHistory.length > 0 ? passport.referralHistory.length : "00"}
                            </h4>
                          </div>
                          <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "1.5rem", letterSpacing: "0.2em" }}>Open Referral Cases</p>
                          <div style={{ marginTop: "2.5rem", height: "6px", background: "var(--bg-accent)", borderRadius: "3px", overflow: "hidden" }}>
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: passport.referralHistory.length > 0 ? "40%" : "100%" }}
                               style={{ height: "100%", background: passport.referralHistory.length > 0 ? "#f59e0b" : "#10b981" }} 
                             />
                          </div>
                          <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "1rem" }}>{passport.referralHistory.length > 0 ? "Has open referral cases" : "No behavior concerns"}</p>
                       </div>
                    </div>
                  </div>

                  <div className="sapphire-card" style={{ padding: "2.5rem 3.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(0, 229, 255, 0.02)", border: "1px solid var(--primary)" }}>
                      <div style={{ display: "flex", gap: "5rem" }}>
                         <div>
                            <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>Last Updated</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <Clock size={14} color="var(--text-dim)" />
                              <p style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--text-main)" }}>{new Date(passport.lastAudit).toLocaleString()}</p>
                            </div>
                         </div>
                         <div>
                            <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "0.75rem" }}>Data Status</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <ShieldCheck size={14} color="#10b981" />
                              <p style={{ fontSize: "0.9rem", fontWeight: "900", color: "#10b981" }}>Verified & Secure</p>
                            </div>
                         </div>
                      </div>
                      <button onClick={exportPassport} className="btn-cyan" style={{ padding: "1.25rem 3rem", fontSize: "0.75rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                         <Download size={18} /> Export Student Profile PDF
                      </button>
                  </div>
               </div>
            </div>

            {/* LOWER SECTION: TRANSACTION LEDGER */}
            <div className="sapphire-card" style={{ padding: "0", overflow: "hidden" }}>
               <div style={{ padding: "3rem", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(255,255,255,0.01)" }}>
                  <div>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1.25rem", color: "var(--text-main)" }}>
                       <History size={24} color="var(--primary)" /> Student History
                    </h3>
                    <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.5rem", letterSpacing: "0.2em" }}>All records across departments</p>
                  </div>
               </div>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border-dim)" }}>
                  
                  {/* SERVICE REQUESTS */}
                  <div style={{ background: "var(--bg-surface)", padding: "4rem" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
                        <div style={{ width: "32px", height: "32px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                           <FileText size={16} color="var(--bg-deep)" />
                        </div>
                        <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.2em" }}>Service Requests</h4>
                     </div>
                     <div style={{ display: "grid", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)" }}>
                        {passport.serviceRequests.map((req: any, i: number) => (
                           <motion.div 
                             key={req.id} 
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             style={{ padding: "2rem", background: "var(--bg-surface)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                           >
                              <div>
                                 <p style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--text-main)" }}>{req.type.toUpperCase()}</p>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem", opacity: 0.5 }}>
                                    <Calendar size={12} />
                                    <p style={{ fontSize: "0.65rem", fontWeight: "900" }}>{req.date}</p>
                                 </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: "0.65rem", fontWeight: "900", color: req.status === "Completed" ? "#10b981" : "var(--primary)", display: "block", marginBottom: "0.25rem" }}>{req.status.toUpperCase()}</span>
                                <div style={{ height: "2px", width: "40px", background: req.status === "Completed" ? "#10b981" : "var(--primary)", marginLeft: "auto", opacity: 0.3 }} />
                              </div>
                           </motion.div>
                        ))}
                        {passport.serviceRequests.length === 0 && (
                          <div style={{ padding: "5rem", textAlign: "center", background: "var(--bg-surface)" }}>
                            <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>No records found</p>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* APPOINTMENT HISTORY */}
                  <div style={{ background: "var(--bg-surface)", padding: "4rem" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
                        <div style={{ width: "32px", height: "32px", background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px" }}>
                           <Clock size={16} color="var(--bg-deep)" />
                        </div>
                        <h4 style={{ fontSize: "0.8rem", fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.2em" }}>Appointment History</h4>
                     </div>
                     <div style={{ display: "grid", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)" }}>
                        {passport.appointmentHistory.map((appt: any, i: number) => (
                           <motion.div 
                             key={appt.id} 
                             initial={{ opacity: 0, x: 10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             style={{ padding: "2rem", background: "var(--bg-surface)", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                           >
                              <div>
                                 <p style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--text-main)" }}>{appt.title.toUpperCase()}</p>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "0.5rem", opacity: 0.5 }}>
                                    <Zap size={12} />
                                    <p style={{ fontSize: "0.65rem", fontWeight: "900" }}>{appt.date} • {appt.startTime}</p>
                                 </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <span style={{ fontSize: "0.65rem", fontWeight: "900", color: appt.status === "COMPLETED" ? "#10b981" : "#f59e0b", display: "block", marginBottom: "0.25rem" }}>{appt.status}</span>
                                <div style={{ height: "2px", width: "40px", background: appt.status === "COMPLETED" ? "#10b981" : "#f59e0b", marginLeft: "auto", opacity: 0.3 }} />
                              </div>
                           </motion.div>
                        ))}
                        {passport.appointmentHistory.length === 0 && (
                          <div style={{ padding: "5rem", textAlign: "center", background: "var(--bg-surface)" }}>
                            <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>No records found</p>
                          </div>
                        )}
                     </div>
                  </div>

               </div>
            </div>

          </motion.div>
        ) : (
          <motion.div 
            key="passport-idle" 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 0.4 }} 
            exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "12rem 2rem" }}
          >
             <div style={{ position: "relative", width: "120px", height: "120px", margin: "0 auto 3rem" }}>
               <motion.div 
                 animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                 transition={{ repeat: Infinity, duration: 4 }}
                 style={{ position: "absolute", inset: 0, border: "2px solid var(--primary)", borderRadius: "50%" }}
               />
               <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <Fingerprint size={80} color="var(--primary)" />
               </div>
             </div>
             <h3 style={{ fontSize: "1.25rem", fontWeight: "900", letterSpacing: "0.4em", color: "var(--text-main)" }}>Search for a Student</h3>
             <p style={{ fontSize: "0.8rem", fontWeight: "700", marginTop: "1.5rem", color: "var(--text-dim)", letterSpacing: "0.1em" }}>Enter a student name or ID above to view their full profile.</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
