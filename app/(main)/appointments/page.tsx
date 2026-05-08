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
import ProcessGuide from "@/components/ProcessGuide";

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
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* Modern Analytics Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Guidance & Support</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            Appoint<span style={{ color: "#3b82f6" }}>ments</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "450px", lineHeight: "1.5" }}>Schedule a consultation with the OSAS or Guidance office.</p>
        </div>
        {!isAdmin && !isBooking && (
          <button onClick={() => setIsBooking(true)} style={{ padding: "1rem 2rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
            Book Appointment <Plus size={18} />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isBooking ? (
          <motion.div key="booking-form" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {isSuccess ? (
              <div style={{ background: "white", padding: "6rem 3rem", textAlign: "center", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <div style={{ width: "80px", height: "80px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                   <CheckCircle2 size={40} color="#10b981" />
                </div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", marginBottom: "1rem" }}>Appointment Booked!</h2>
                <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "500", marginTop: "1rem" }}>Your appointment request has been submitted. You will be notified once it is confirmed.</p>
              </div>
            ) : (
              <div style={{ background: "white", maxWidth: "800px", margin: "0 auto", padding: "3.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                  <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b" }}>Book an Appointment</h2>
                  <button onClick={() => setIsBooking(false)} style={{ color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
                </div>
                
                <form onSubmit={handleBooking} style={{ display: "grid", gap: "2rem" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>What is this about?</label>
                      <input required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Academic advising" style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Appointment Type</label>
                      <select value={type} onChange={e => setType(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }}>
                        <option>Counseling</option>
                        <option>Scholarship</option>
                        <option>Disciplinary</option>
                        <option>General Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Preferred Date</label>
                      <input required type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Choose a Time Slot</label>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {timeSlots.map(t => {
                          const isSelected = startTime === t;
                          return (
                            <button 
                              key={t}
                              type="button"
                              onClick={() => setStartTime(t)}
                              style={{ 
                                padding: "0.75rem 1rem", 
                                fontSize: "0.85rem", 
                                fontWeight: "700",
                                background: isSelected ? "#eff6ff" : "#f8fafc",
                                color: isSelected ? "#3b82f6" : "#64748b",
                                border: isSelected ? "1px solid #3b82f6" : "1px solid #e2e8f0",
                                borderRadius: "8px",
                                cursor: "pointer",
                                transition: "all 0.2s"
                              }}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Additional Notes</label>
                    <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={5} placeholder="Briefly describe what you need help with..." style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b", resize: "vertical" }} />
                  </div>

                  <button type="submit" style={{ padding: "1.25rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>
                    Submit Appointment <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="appt-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {isAdmin && (
               <ProcessGuide 
                  title="How Appointments Work"
                  steps={[
                     { title: "Office Hours", desc: "Set the days and times when students can book appointments.", icon: <Clock size={16} /> },
                     { title: "View Requests", desc: "See all incoming appointment requests from students.", icon: <Search size={16} /> },
                     { title: "Approve or Cancel", desc: "Accept or decline appointments based on availability.", icon: <CalendarCheck size={16} /> },
                     { title: "Complete Session", desc: "After the meeting, mark the appointment as completed.", icon: <Activity size={16} /> }
                  ]}
               />
            )}
            
            {/* TELEMETRY ROW */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
              {[
                { label: "Approved", value: appointments.filter(a => a.status === "APPROVED").length, color: "#3b82f6", bg: "#eff6ff" },
                { label: "Pending", value: appointments.filter(a => a.status === "PENDING").length, color: "#f59e0b", bg: "#fffbeb" },
                { label: "Completed", value: appointments.filter(a => a.status === "COMPLETED").length, color: "#10b981", bg: "#f0fdf4" }
              ].map((stat, i) => (
                <div key={i} style={{ background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase" }}>{stat.label}</p>
                  <h2 style={{ fontSize: "2.5rem", fontWeight: "900", color: stat.color, marginTop: "0.5rem" }}>{stat.value}</h2>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isAdmin ? "1fr 380px" : "1fr", gap: "3rem", alignItems: "start" }}>
              
              {/* SESSION STREAM */}
              <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "2rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                   <h2 style={{ fontSize: "1.1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                      <Calendar size={20} color="#3b82f6" /> {isAdmin ? "All Appointments" : "My Appointments"}
                   </h2>
                   <button style={{ color: "#64748b", background: "white", border: "1px solid #e2e8f0", padding: "0.5rem", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><Filter size={18} /></button>
                </div>

                <div style={{ display: "flex", flexDirection: "column" }}>
                   {appointments.length === 0 ? (
                     <div style={{ padding: "5rem", textAlign: "center" }}>
                        <CalendarCheck size={48} color="#cbd5e1" style={{ margin: "0 auto 1.5rem" }} />
                        <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b" }}>No appointments found.</p>
                     </div>
                   ) : (
                     appointments.map((appt, index) => (
                        <div key={appt.id} style={{ background: "white", padding: "1.5rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderLeft: appt.status === "APPROVED" ? "4px solid #10b981" : "4px solid transparent", borderBottom: index !== appointments.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                           <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
                              <div style={{ width: "80px", textAlign: "center", background: "#f8fafc", padding: "1rem 0.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                                 <p style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.25rem" }}>{appt.startTime.split(' ')[0]}</p>
                                 <p style={{ fontSize: "0.8rem", fontWeight: "800", color: "#3b82f6" }}>{appt.startTime.split(' ')[1]}</p>
                              </div>
                              <div>
                                 <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                                    <h4 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#1e293b" }}>{appt.title || "Untitled Session"}</h4>
                                    <span style={{ fontSize: "0.7rem", fontWeight: "800", padding: "0.3rem 0.8rem", background: "#eff6ff", color: "#3b82f6", border: "1px solid #bfdbfe", borderRadius: "20px" }}>{appt.type || "General"}</span>
                                 </div>
                                 <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "1.5rem" }}>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><User size={14} color="#3b82f6" /> {appt.studentName || "Unknown"}</span>
                                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}><Calendar size={14} color="#3b82f6" /> {appt.date}</span>
                                 </p>
                              </div>
                           </div>
                           
                           <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                              {isAdmin && appt.status === "PENDING" ? (
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                   <button onClick={() => updateApptStatus(appt.id, "APPROVED")} style={{ padding: "0.6rem 1.25rem", background: "#10b981", color: "white", borderRadius: "8px", border: "none", fontSize: "0.8rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 2px 4px rgba(16, 185, 129, 0.2)" }}>Approve</button>
                                   <button onClick={() => updateApptStatus(appt.id, "CANCELLED")} style={{ padding: "0.6rem", background: "white", border: "1px solid #fecaca", color: "#ef4444", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={16} /></button>
                                </div>
                              ) : (
                                <span style={{ fontSize: "0.8rem", fontWeight: "800", color: appt.status === "APPROVED" ? "#10b981" : appt.status === "PENDING" ? "#f59e0b" : "#64748b", padding: "0.4rem 1rem", background: appt.status === "APPROVED" ? "#f0fdf4" : appt.status === "PENDING" ? "#fffbeb" : "#f1f5f9", borderRadius: "20px" }}>
                                   {appt.status || "Pending"}
                                </span>
                              )}
                              <ChevronRight size={18} color="#94a3b8" />
                           </div>
                        </div>
                     ))
                   )}
                </div>
              </div>

              {/* SIDEBAR TOOLS (ADMIN ONLY) */}
              {isAdmin && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                   <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                      <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "1.5rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}><Clock size={18} color="#3b82f6" /> Office Hours</h3>
                      <div style={{ display: "grid", gap: "1rem" }}>
                         {["Mon - Fri: 08:00 - 17:00", "Sat: 08:00 - 12:00", "Sun: Closed"].map(t => (
                           <div key={t} style={{ padding: "1rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "1rem", color: "#475569", fontWeight: "700" }}>
                              <CalendarCheck size={16} color="#3b82f6" /> {t}
                           </div>
                         ))}
                      </div>
                   </div>

                   <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #bfdbfe", boxShadow: "0 10px 25px rgba(59, 130, 246, 0.05)" }}>
                      <Video size={32} color="#3b82f6" style={{ marginBottom: "1.5rem" }} />
                      <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "0.75rem", color: "#1e293b" }}>Virtual Meeting</h3>
                      <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.6", marginBottom: "2rem" }}>Generate an encrypted meeting link for approved online sessions.</p>
                      <button style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                        <Video size={18} /> Start Video Call
                      </button>
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
