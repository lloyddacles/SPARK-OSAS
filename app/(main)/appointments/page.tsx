"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Calendar, 
  Clock, 
  User, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Plus,
  ArrowRight,
  History,
  CalendarCheck,
  Video,
  ChevronRight,
  Filter,
  Activity,
  Layers,
  Search,
  X
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function AppointmentsPage() {
  const { appointments, bookAppointment, updateApptStatus, currentUser } = useGlobalState();
  const [isBooking, setIsBooking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00 AM");
  const [type, setType] = useState("Counseling");
  const [desc, setDesc] = useState("");

  const isAdmin = ["OSAS_DIRECTOR", "GUIDANCE_COUNSELOR"].includes(currentUser?.role || "");

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    await bookAppointment({
      title,
      date,
      startTime,
      endTime: "", 
      type,
      description: desc,
      studentName: currentUser?.name || "Student"
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsBooking(false);
      setIsSuccess(false);
    }, 2000);
  };

  const timeSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

  return (
    <div style={{ width: "100%" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>NETWORK: CONSULTATION SCHEDULER</p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            CONSULTATION <span style={{ color: "var(--primary)" }}>NETWORK</span>
          </h1>
        </div>
        {!isAdmin && !isBooking && (
          <button onClick={() => setIsBooking(true)} className="btn-cyan" style={{ padding: "0.8rem 2rem" }}>
            INITIALIZE CONSULTATION <Plus size={16} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isBooking ? (
          <motion.div key="booking-form" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
            {isSuccess ? (
              <div className="sapphire-card" style={{ padding: "5rem", textAlign: "center" }}>
                <CheckCircle2 size={64} color="#10b981" style={{ margin: "0 auto 2rem" }} />
                <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)" }}>SESSION INITIALIZED</h2>
                <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontWeight: "700", marginTop: "1rem" }}>YOUR REQUEST HAS BEEN LOGGED TO THE INSTITUTIONAL NETWORK.</p>
              </div>
            ) : (
              <div className="sapphire-card" style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
                  <h2 style={{ fontSize: "1rem", fontWeight: "900", letterSpacing: "0.1em" }}>BOOK CONSULTATION</h2>
                  <button onClick={() => setIsBooking(false)} style={{ color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleBooking} style={{ display: "grid", gap: "2.5rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>SESSION TITLE</label>
                      <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. ACADEMIC ADVISING" style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>PROTOCOL TYPE</label>
                      <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}>
                        <option>Counseling</option>
                        <option>Scholarship</option>
                        <option>Disciplinary</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>TARGET DATE</label>
                      <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>AVAILABILITY SLOTS</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {timeSlots.map(t => (
                          <button 
                            key={t}
                            type="button"
                            onClick={() => setStartTime(t)}
                            style={{ 
                              padding: "0.5rem 0.75rem", 
                              fontSize: "0.65rem", 
                              fontWeight: "900",
                              background: startTime === t ? "var(--primary)" : "var(--bg-accent)",
                              color: startTime === t ? "var(--bg-deep)" : "var(--text-dim)",
                              border: startTime === t ? "1px solid var(--primary)" : "1px solid var(--border-dim)",
                              cursor: "pointer",
                              transition: "all 0.2s"
                            }}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>SESSION DESCRIPTION</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={4} placeholder="BRIEF LOG ENTRANCE..." style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                  </div>

                  <button type="submit" className="btn-cyan" style={{ padding: "1rem", width: "fit-content" }}>
                    EXECUTE BOOKING REQUEST <ArrowRight size={16} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="appt-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            
            {/* TELEMETRY ROW */}
            <div className="card-grid" style={{ marginBottom: "3rem" }}>
              {[
                { label: "ACTIVE SESSIONS", value: appointments.filter(a => a.status === "APPROVED").length, color: "var(--primary)" },
                { label: "PENDING QUEUE", value: appointments.filter(a => a.status === "PENDING").length, color: "#f59e0b" },
                { label: "COMPLETED NODES", value: appointments.filter(a => a.status === "COMPLETED").length, color: "#10b981" }
              ].map((stat, i) => (
                <div key={i} className="sapphire-card">
                  <p style={{ fontSize: "0.55rem", fontWeight: "900", letterSpacing: "0.2em", color: "var(--text-dim)", marginBottom: "1rem" }}>{stat.label}</p>
                  <h2 style={{ fontSize: "2rem", fontWeight: "900", color: stat.color }}>{stat.value}</h2>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 320px" : "1fr", gap: "3rem", alignItems: "start" }}>
              
              {/* SESSION STREAM */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                   <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                      <Activity size={18} color="var(--primary)" /> {isAdmin ? "CONSULTATION QUEUE" : "IDENTITY SESSIONS"}
                   </h2>
                   <button style={{ color: "var(--text-dim)", background: "none", cursor: "pointer" }}><Filter size={16} /></button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                   {appointments.length === 0 ? (
                     <div className="sapphire-card" style={{ padding: "5rem", textAlign: "center" }}>
                        <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)" }}>NO ACTIVE SESSIONS FOUND</p>
                     </div>
                   ) : (
                     appointments.map(appt => (
                        <div key={appt.id} style={{ background: "var(--bg-surface)", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: appt.status === "APPROVED" ? "2px solid #10b981" : "2px solid transparent" }}>
                           <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
                              <div style={{ width: "60px", textAlign: "center" }}>
                                 <p style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)" }}>{appt.startTime.split(' ')[0]}</p>
                                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginTop: "0.2rem" }}>{appt.startTime.split(' ')[1]}</p>
                              </div>
                              <div style={{ height: "40px", width: "1px", background: "var(--border-dim)" }} />
                              <div>
                                 <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                                    <h4 style={{ fontWeight: "900", fontSize: "1rem", color: "var(--text-main)" }}>{(appt.title || "Untitled Session").toUpperCase()}</h4>
                                    <span style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.2rem 0.5rem", background: "var(--bg-accent)", color: "var(--primary)", border: "1px solid var(--border-dim)" }}>{(appt.type || "General").toUpperCase()}</span>
                                 </div>
                                 <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: "700", display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><User size={12} /> {(appt.studentName || "Unknown").toUpperCase()}</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}><Calendar size={12} /> {appt.date}</span>
                                 </p>
                              </div>
                           </div>
                           
                           <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                              {isAdmin && appt.status === "PENDING" ? (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                   <button onClick={() => updateApptStatus(appt.id, "APPROVED")} className="btn-cyan" style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }}>VALIDATE</button>
                                   <button onClick={() => updateApptStatus(appt.id, "CANCELLED")} style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid #ef4444", color: "#ef4444", cursor: "pointer" }}><X size={14} /></button>
                                </div>
                              ) : (
                                <span style={{ fontSize: "0.6rem", fontWeight: "900", color: appt.status === "APPROVED" ? "#10b981" : "var(--text-dim)" }}>
                                   {(appt.status || "Pending").toUpperCase()}
                                </span>
                              )}
                              <ChevronRight size={14} color="var(--text-dim)" />
                           </div>
                        </div>
                     ))
                   )}
                </div>
              </div>

              {/* SIDEBAR TOOLS (ADMIN ONLY) */}
              {isAdmin && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                   <div className="sapphire-card">
                      <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "1.5rem" }}>OFFICE AVAILABILITY</h3>
                      <div style={{ display: "grid", gap: "1rem" }}>
                         {["MON - FRI: 08:00 - 17:00", "SAT: 08:00 - 12:00", "SUN: CLOSED"].map(t => (
                           <div key={t} style={{ fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-dim)", fontWeight: "700" }}>
                              <Clock size={12} /> {t}
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="sapphire-card" style={{ background: "rgba(0, 229, 255, 0.02)", border: "1px solid var(--primary)" }}>
                      <Video size={24} color="var(--primary)" style={{ marginBottom: "1.5rem" }} />
                      <h3 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "0.75rem" }}>VIRTUAL PROTOCOL</h3>
                      <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.6", marginBottom: "2rem" }}>GENERATE ENCRYPTED MEET TOKEN FOR ACTIVE SESSIONS.</p>
                      <button className="btn-cyan" style={{ width: "100%", padding: "0.85rem" }}>INITIALIZE ROOM</button>
                   </div>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
