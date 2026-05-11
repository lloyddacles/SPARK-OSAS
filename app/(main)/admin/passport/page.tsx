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
  Eye,
  Check
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
      await new Promise(r => setTimeout(r, 800));
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
      filename: `STUDENT_PROFILE_${studentName.replace(/\s+/g, '_')}`,
      title: "STUDENT PROFILE",
      sections: sections
    });
    logAudit("STUDENT_PROFILE_EXPORTED", `Student profile exported for ${studentName}`, "MEDIUM");
  };

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto", position: "relative" }}>
      
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
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(20px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem"
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              style={{ width: "64px", height: "64px", border: "3px solid #f3f4f6", borderTopColor: "#3b82f6", borderRadius: "50%" }}
            />
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#111827", letterSpacing: "-0.02em" }}>Searching Records</h2>
              <p style={{ color: "#3b82f6", fontWeight: "700", marginTop: "0.5rem", fontSize: "0.9rem" }}>Retrieving data for {identifier.toUpperCase()}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Records</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            <span style={{ color: "#3b82f6" }}>Student Profile</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Look up any student's full record — scholarships, requests, appointments, and referral history.</p>
        </div>
        <div style={{ textAlign: "right", background: "white", padding: "1rem 1.5rem", borderRadius: "12px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", justifyContent: "flex-end", marginBottom: "0.5rem" }}>
             <ShieldCheck size={16} color="#10b981" />
             <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#10b981" }}>Secure Connection</p>
           </div>
           <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6b7280" }}>OSAS Student Records System</p>
        </div>
      </div>

      {/* Search Bar */}
      <motion.div 
        layout
        style={{ 
          marginBottom: "4rem", 
          padding: "2rem", 
          background: "white", 
          borderRadius: "16px", 
          border: "1px solid #e5e7eb", 
          boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
          position: "relative", 
          overflow: "hidden" 
        }}
      >
         <div style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: "4px", background: "#3b82f6" }} />
         <form onSubmit={handleSearch} style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, position: "relative", minWidth: "250px" }}>
               <Search size={20} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#9ca3af" }} />
               <input 
                 value={identifier}
                 onChange={(e) => setIdentifier(e.target.value)}
                 placeholder="Enter student name or ID..."
                 style={{ 
                   width: "100%", 
                   padding: "1.25rem 1.25rem 1.25rem 3.5rem", 
                   fontSize: "1rem", 
                   fontWeight: "600", 
                   background: "#f8fafc", 
                   border: "1px solid #e2e8f0",
                   borderRadius: "12px",
                   color: "#1e293b",
                   outline: "none"
                 }}
               />
            </div>
            <button type="submit" disabled={isSearching} style={{ padding: "1.25rem 3rem", fontSize: "0.95rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.75rem", background: "#3b82f6", color: "white", borderRadius: "12px", border: "none", cursor: isSearching ? "wait" : "pointer" }}>
               {isSearching ? <Cpu className="animate-spin" size={20} /> : <Search size={20} />}
               {isSearching ? "Searching..." : "Find Student"}
            </button>
         </form>
         {error && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} style={{ marginTop: "1.5rem", color: "#ef4444", fontSize: "0.85rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={18} /> {error}
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
            
            {/* TOP BAR: IDENTITY BLOCK */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2.5rem", marginBottom: "3rem" }}>
               <motion.div 
                 whileHover={{ y: -4, boxShadow: "0 12px 24px rgba(0,0,0,0.06)" }}
                 style={{ 
                   padding: "3rem 2.5rem", 
                   textAlign: "center", 
                   background: "white", 
                   borderRadius: "16px",
                   border: "1px solid #f3f4f6",
                   boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
                 }}
               >
                  <div style={{ width: "120px", height: "120px", margin: "0 auto 2rem", borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid white", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
                     <User size={56} color="#94a3b8" />
                  </div>

                  <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem", letterSpacing: "-0.01em" }}>{passport.identity?.name || passport.scholarships[0]?.studentName}</h2>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#f0f9ff", padding: "0.4rem 1rem", borderRadius: "20px", marginBottom: "2.5rem" }}>
                    <div style={{ width: "6px", height: "6px", background: "#0284c7", borderRadius: "50%" }} />
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#0284c7" }}>{passport.identity?.role?.replace(/_/g, ' ') || "Student"}</span>
                  </div>
                  
                  <div style={{ display: "grid", gap: "1.25rem", textAlign: "left", paddingTop: "2.5rem", borderTop: "1px solid #f1f5f9" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "36px", height: "36px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                           <Fingerprint size={18} color="#64748b" />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8" }}>Student ID</p>
                          <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>{passport.identity?.studentId || "Not Available"}</p>
                        </div>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "36px", height: "36px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                           <MapPin size={18} color="#64748b" />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8" }}>Department</p>
                          <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>{passport.identity?.department || "General"}</p>
                        </div>
                     </div>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <div style={{ width: "36px", height: "36px", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px" }}>
                           <Mail size={18} color="#64748b" />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#94a3b8" }}>Email</p>
                          <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#1e293b" }}>{passport.identity?.email || "N/A"}</p>
                        </div>
                     </div>
                  </div>
               </motion.div>

               <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem" }}>
                    {/* Scholarships */}
                    <div style={{ padding: "2.5rem", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                          <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                             <Star size={20} color="#3b82f6" /> Scholarships
                          </h3>
                       </div>
                       {passport.scholarships.length > 0 ? (
                         <div style={{ display: "grid", gap: "1rem" }}>
                            {passport.scholarships.map((s: any) => (
                              <div key={s.id} style={{ background: "#f8fafc", padding: "1.25rem", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                 <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b", marginBottom: "0.5rem" }}>{s.programName}</p>
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#64748b" }}>{s.batch}</span>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#10b981", background: "#f0fdf4", padding: "0.2rem 0.6rem", borderRadius: "20px" }}>
                                      <CheckCircle size={14} />
                                      <span style={{ fontSize: "0.7rem", fontWeight: "700" }}>{s.status}</span>
                                    </div>
                                 </div>
                              </div>
                            ))}
                         </div>
                       ) : (
                         <div style={{ padding: "3rem 1rem", textAlign: "center", background: "#f8fafc", borderRadius: "12px" }}>
                           <FileText size={32} color="#94a3b8" style={{ margin: "0 auto 1rem" }} />
                           <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>No Records Found</p>
                         </div>
                       )}
                    </div>

                    {/* Behavior */}
                    <div style={{ padding: "2.5rem", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                          <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                             <Activity size={20} color="#f59e0b" /> Behavior Record
                          </h3>
                       </div>
                       <div style={{ textAlign: "center", padding: "1rem" }}>
                          <h4 style={{ fontSize: "4rem", fontWeight: "900", color: passport.referralHistory.length > 0 ? "#f59e0b" : "#10b981", lineHeight: "1" }}>
                             {passport.referralHistory.length > 0 ? passport.referralHistory.length : "0"}
                          </h4>
                          <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b", marginTop: "1rem" }}>Open Referral Cases</p>
                          <div style={{ marginTop: "2rem", height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden" }}>
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: passport.referralHistory.length > 0 ? "40%" : "100%" }}
                               style={{ height: "100%", background: passport.referralHistory.length > 0 ? "#f59e0b" : "#10b981" }} 
                             />
                          </div>
                          <p style={{ fontSize: "0.8rem", fontWeight: "600", color: "#94a3b8", marginTop: "0.75rem" }}>{passport.referralHistory.length > 0 ? "Has open referral cases" : "No behavior concerns"}</p>
                       </div>
                    </div>
                  </div>

                  <div style={{ padding: "2rem 2.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f0fdf4", border: "1px solid #dcfce7", borderRadius: "16px" }}>
                      <div style={{ display: "flex", gap: "4rem" }}>
                         <div>
                            <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#166534", marginBottom: "0.5rem" }}>Last Updated</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Clock size={16} color="#15803d" />
                              <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#14532d" }}>{new Date(passport.lastAudit).toLocaleDateString()}</p>
                            </div>
                         </div>
                         <div>
                            <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#166534", marginBottom: "0.5rem" }}>Data Status</p>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <ShieldCheck size={16} color="#15803d" />
                              <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#14532d" }}>Verified & Secure</p>
                            </div>
                         </div>
                      </div>
                      <button onClick={exportPassport} style={{ padding: "1rem 2rem", fontSize: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.75rem", background: "white", color: "#166534", border: "1px solid #bbf7d0", borderRadius: "8px", cursor: "pointer", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                         <Download size={18} /> Export Profile PDF
                      </button>
                  </div>
               </div>
            </div>

            {/* LOWER SECTION: HISTORY */}
            <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
               <div style={{ padding: "2.5rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "1rem", color: "#1e293b" }}>
                     <History size={24} color="#3b82f6" /> Complete History
                  </h3>
                  <p style={{ fontSize: "0.9rem", fontWeight: "500", color: "#64748b", marginTop: "0.5rem" }}>All records across departments for this student.</p>
               </div>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "#f1f5f9" }}>
                  
                  {/* SERVICE REQUESTS */}
                  <div style={{ background: "white", padding: "3rem" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                        <div style={{ width: "40px", height: "40px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px" }}>
                           <FileText size={20} color="#3b82f6" />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Service Requests</h4>
                     </div>
                     <div style={{ display: "grid", gap: "1rem" }}>
                        {passport.serviceRequests.map((req: any, i: number) => (
                           <motion.div 
                             key={req.id} 
                             initial={{ opacity: 0, x: -10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                           >
                              <div>
                                 <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b" }}>{req.type}</p>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", color: "#64748b" }}>
                                    <Calendar size={14} />
                                    <p style={{ fontSize: "0.8rem", fontWeight: "600" }}>{req.date}</p>
                                 </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: req.status === "Completed" ? "#10b981" : "#3b82f6", background: req.status === "Completed" ? "#f0fdf4" : "#eff6ff", padding: "0.4rem 0.8rem", borderRadius: "20px" }}>
                                  {req.status === "Completed" && <Check size={14} />}
                                  <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>{req.status}</span>
                                </div>
                              </div>
                           </motion.div>
                        ))}
                        {passport.serviceRequests.length === 0 && (
                          <div style={{ padding: "4rem", textAlign: "center", background: "#f8fafc", borderRadius: "12px" }}>
                            <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#94a3b8" }}>No records found</p>
                          </div>
                        )}
                     </div>
                  </div>

                  {/* APPOINTMENT HISTORY */}
                  <div style={{ background: "white", padding: "3rem" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2.5rem" }}>
                        <div style={{ width: "40px", height: "40px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "10px" }}>
                           <Clock size={20} color="#3b82f6" />
                        </div>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Appointment History</h4>
                     </div>
                     <div style={{ display: "grid", gap: "1rem" }}>
                        {passport.appointmentHistory.map((appt: any, i: number) => (
                           <motion.div 
                             key={appt.id} 
                             initial={{ opacity: 0, x: 10 }}
                             animate={{ opacity: 1, x: 0 }}
                             transition={{ delay: i * 0.1 }}
                             style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                           >
                              <div>
                                 <p style={{ fontSize: "0.95rem", fontWeight: "700", color: "#1e293b" }}>{appt.title}</p>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem", color: "#64748b" }}>
                                    <Zap size={14} />
                                    <p style={{ fontSize: "0.8rem", fontWeight: "600" }}>{appt.date} • {appt.startTime}</p>
                                 </div>
                              </div>
                              <div style={{ textAlign: "right" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: appt.status === "COMPLETED" ? "#10b981" : "#f59e0b", background: appt.status === "COMPLETED" ? "#f0fdf4" : "#fffbeb", padding: "0.4rem 0.8rem", borderRadius: "20px" }}>
                                  {appt.status === "COMPLETED" && <Check size={14} />}
                                  <span style={{ fontSize: "0.75rem", fontWeight: "700" }}>{appt.status === "COMPLETED" ? "Completed" : appt.status}</span>
                                </div>
                              </div>
                           </motion.div>
                        ))}
                        {passport.appointmentHistory.length === 0 && (
                          <div style={{ padding: "4rem", textAlign: "center", background: "#f8fafc", borderRadius: "12px" }}>
                            <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#94a3b8" }}>No records found</p>
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
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ textAlign: "center", padding: "8rem 2rem", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}
          >
             <div style={{ width: "80px", height: "80px", margin: "0 auto 2rem", background: "#f8fafc", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <Fingerprint size={40} color="#94a3b8" />
             </div>
             <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b" }}>Search for a Student</h3>
             <p style={{ fontSize: "0.9rem", fontWeight: "500", marginTop: "0.75rem", color: "#64748b" }}>Enter a student name or ID above to view their full profile.</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
