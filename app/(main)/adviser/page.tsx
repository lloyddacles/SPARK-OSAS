"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Users, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  Building2,
  FilePlus,
  Send,
  Search,
  MessageSquare,
  ShieldCheck,
  Zap,
  Radio,
  ArrowRight
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function AdviserDashboard() {
  const { currentUser, organizations, activities, referrals, addReferral, updateActivityStatus } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState("");
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [newReferral, setNewReferral] = useState({ studentName: "", reason: "" });

  // Isolation Logic: Filter data specifically for this adviser
  const advisedOrgs = organizations.filter(org => org.adviserId === currentUser?.id || org.adviser === currentUser?.name);
  const orgIds = advisedOrgs.map(o => o.id);
  const relevantActivities = activities.filter(act => orgIds.includes(act.orgId));
  const filedReferrals = referrals.filter(ref => ref.adviserId === currentUser?.id || ref.adviserName === currentUser?.name);

  const pendingProposals = relevantActivities.filter(a => a.status === "Pending Adviser Review");

  const handleFileReferral = (e: React.FormEvent) => {
    e.preventDefault();
    addReferral(newReferral.studentName, newReferral.reason);
    setNewReferral({ studentName: "", reason: "" });
    setIsReferralModalOpen(false);
  };

  const handleApproveProposal = async (id: string) => {
    await updateActivityStatus(id, { status: "Pending OSAS Approval" });
  };

  const handleRequestRevision = async (id: string) => {
    const comments = prompt("Enter revision requirements:");
    if (comments) {
      await updateActivityStatus(id, { status: "Revision Requested", comments });
    }
  };

  if (currentUser?.role !== "ADVISER" && currentUser?.role !== "SYSTEM_ADMIN") {
     return (
        <div style={{ padding: "10rem", textAlign: "center" }}>
           <AlertTriangle size={48} color="#ef4444" style={{ margin: "0 auto 2rem", opacity: 0.2 }} />
           <p style={{ fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.2em", color: "#ef4444" }}>ACCESS RESTRICTED: FACULTY ADVISER CREDENTIALS REQUIRED</p>
        </div>
     );
  }

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>STATION: FACULTY_ADVISER</p>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            ADVISORY <span style={{ color: "var(--primary)" }}>COMMAND</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>ADVISED ENTITIES</p>
              <p style={{ fontSize: "1rem", fontWeight: "900", color: "var(--text-main)" }}>{advisedOrgs.length} ORGS</p>
           </div>
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>ACTIVE REFERRALS</p>
              <p style={{ fontSize: "1rem", fontWeight: "900", color: "var(--primary)" }}>{filedReferrals.length} CASES</p>
           </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem", alignItems: "start" }}>
        
        <main style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          
          {/* PROPOSAL QUEUE */}
          <div className="sapphire-card" style={{ padding: "0" }}>
             <div style={{ padding: "2rem", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <Radio size={18} color="var(--primary)" /> ACTIVITY PROPOSAL QUEUE
                </h3>
                <span style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>{pendingProposals.length} PENDING REVIEW</span>
             </div>
             
             <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                {pendingProposals.length > 0 ? pendingProposals.map((act) => (
                  <div key={act.id} style={{ background: "var(--bg-surface)", padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div>
                        <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.5rem" }}>{advisedOrgs.find(o => o.id === act.orgId)?.name.toUpperCase()}</p>
                        <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "var(--text-main)" }}>{act.title.toUpperCase()}</h4>
                        <div style={{ display: "flex", gap: "1.5rem", marginTop: "1rem" }}>
                           <span style={{ fontSize: "0.6rem", fontWeight: "800", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.5rem" }}><Clock size={12} /> {act.date}</span>
                           <span style={{ fontSize: "0.6rem", fontWeight: "800", color: "var(--text-dim)", display: "flex", alignItems: "center", gap: "0.5rem" }}><Users size={12} /> {act.participants} PARTICIPANTS</span>
                        </div>
                     </div>
                     <div style={{ display: "flex", gap: "1rem" }}>
                        <button onClick={() => handleRequestRevision(act.id)} style={{ padding: "0.75rem 1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-dim)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>REQUEST_REVISION</button>
                        <button onClick={() => handleApproveProposal(act.id)} style={{ padding: "0.75rem 1.5rem", background: "var(--primary)", border: "none", color: "var(--text-dark)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>ENDORSE_TO_OSAS</button>
                     </div>
                  </div>
                )) : (
                  <div style={{ padding: "4rem", textAlign: "center", background: "var(--bg-surface)" }}>
                     <ShieldCheck size={40} color="var(--primary)" style={{ opacity: 0.1, marginBottom: "1.5rem" }} />
                     <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>NO PROPOSALS AWAITING REVIEW</p>
                  </div>
                )}
             </div>
          </div>

          {/* REFERRAL HISTORY */}
          <div className="sapphire-card" style={{ padding: "0" }}>
             <div style={{ padding: "2rem", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <MessageSquare size={18} color="var(--primary)" /> STUDENT DISCIPLINARY REFERRALS
                </h3>
                <button onClick={() => setIsReferralModalOpen(true)} className="btn-cyan" style={{ padding: "0.6rem 1.25rem", fontSize: "0.6rem" }}>INITIATE REFERRAL</button>
             </div>
             
             <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                   <tr style={{ textAlign: "left", fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "900", background: "var(--bg-accent)" }}>
                      <th style={{ padding: "1.5rem 2rem" }}>STUDENT IDENTIFIER</th>
                      <th style={{ padding: "1.5rem 2rem" }}>GOVERNANCE STATUS</th>
                      <th style={{ padding: "1.5rem 2rem" }}>STAMP</th>
                   </tr>
                </thead>
                <tbody style={{ fontSize: "0.75rem" }}>
                   {filedReferrals.map((ref) => (
                      <tr key={ref.id} style={{ borderBottom: "1px solid var(--border-dim)" }}>
                         <td style={{ padding: "1.25rem 2rem" }}>
                            <p style={{ fontWeight: "800", color: "var(--text-main)" }}>{ref.studentName.toUpperCase()}</p>
                            <p style={{ fontSize: "0.55rem", color: "var(--text-dim)", fontWeight: "700" }}>CASE_ID: {ref.id}</p>
                         </td>
                         <td style={{ padding: "1.25rem 2rem" }}>
                            <span style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.3rem 0.75rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--primary)" }}>
                               {ref.status.toUpperCase()}
                            </span>
                         </td>
                         <td style={{ padding: "1.25rem 2rem" }}>
                            <p style={{ fontSize: "0.65rem", fontWeight: "800", color: "var(--text-dim)" }}>{new Date(ref.dateFiled).toLocaleDateString()}</p>
                         </td>
                      </tr>
                   ))}
                   {filedReferrals.length === 0 && (
                      <tr>
                         <td colSpan={3} style={{ padding: "4rem", textAlign: "center", color: "var(--text-dim)", fontSize: "0.65rem", fontWeight: "900" }}>NO REFERRALS FILED IN THIS STATION</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>

        </main>

        <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          
          {/* ADVISED ORGANIZATIONS */}
          <div className="sapphire-card">
             <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                <Building2 size={18} color="var(--primary)" /> ADVISED ORGANIZATIONS
             </h3>
             <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {advisedOrgs.map(org => (
                  <div key={org.id} style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                     <p style={{ fontSize: "0.85rem", fontWeight: "900", color: "var(--text-main)" }}>{org.name.toUpperCase()}</p>
                     <p style={{ fontSize: "0.6rem", fontWeight: "800", color: "var(--primary)", marginTop: "0.25rem" }}>{org.acronym} • {org.category.toUpperCase()}</p>
                     <div style={{ marginTop: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.5rem", fontWeight: "900", color: "#10b981" }}>RECOGNIZED</span>
                        <button style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><ArrowRight size={14} /></button>
                     </div>
                  </div>
                ))}
                {advisedOrgs.length === 0 && (
                   <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", textAlign: "center", padding: "2rem" }}>NO ORGANIZATIONS ASSIGNED</p>
                )}
             </div>
          </div>

          <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)" }}>
             <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "1.5rem" }}>ADVISER PROTOCOLS</h3>
             <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", lineHeight: "1.6", fontWeight: "600" }}>
                As a Faculty Adviser, you are the first line of governance for student organizations. All activity proposals must be reviewed and endorsed by your station before reaching OSAS.
             </p>
             <div style={{ marginTop: "2rem", display: "grid", gap: "0.75rem" }}>
                <button className="btn-cyan" style={{ padding: "1rem", width: "100%", fontSize: "0.65rem" }}>DOWNLOAD GUIDELINES</button>
                <button style={{ padding: "1rem", width: "100%", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>VIEW ACADEMIC CALENDAR</button>
             </div>
          </div>

        </aside>

      </div>

      {/* REFERRAL MODAL */}
      <AnimatePresence>
        {isReferralModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="sapphire-card" style={{ width: "100%", maxWidth: "500px", padding: "3rem" }}>
               <h3 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "2.5rem" }}>INITIATE DISCIPLINARY REFERRAL</h3>
               <form onSubmit={handleFileReferral} style={{ display: "grid", gap: "2rem" }}>
                  <div>
                     <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.75rem" }}>STUDENT FULL NAME</label>
                     <input 
                        required 
                        value={newReferral.studentName} 
                        onChange={e => setNewReferral({...newReferral, studentName: e.target.value})}
                        placeholder="E.G. JOHN DOE..." 
                        style={{ width: "100%", padding: "1rem", fontSize: "0.85rem", fontWeight: "700" }} 
                     />
                  </div>
                  <div>
                     <label style={{ display: "block", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.75rem" }}>REASON FOR REFERRAL</label>
                     <textarea 
                        required 
                        value={newReferral.reason} 
                        onChange={e => setNewReferral({...newReferral, reason: e.target.value})}
                        placeholder="DESCRIBE THE INCIDENT OR BEHAVIOR..." 
                        style={{ width: "100%", padding: "1rem", minHeight: "120px", fontSize: "0.85rem", fontWeight: "700", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }} 
                     />
                  </div>
                  <div style={{ display: "flex", gap: "1.5rem" }}>
                     <button type="button" onClick={() => setIsReferralModalOpen(false)} style={{ flex: 1, padding: "1.1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-dim)", fontSize: "0.7rem", fontWeight: "900", cursor: "pointer" }}>CANCEL</button>
                     <button type="submit" className="btn-cyan" style={{ flex: 2, padding: "1.1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                        <Send size={16} /> TRANSMIT REFERRAL
                     </button>
                  </div>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
