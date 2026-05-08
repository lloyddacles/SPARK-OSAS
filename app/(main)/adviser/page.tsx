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
  ArrowRight,
  CalendarDays,
  Info,
  X,
  ChevronRight,
  TrendingUp,
  FileSignature
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function AdviserDashboard() {
  const { currentUser, organizations, activities, referrals, addReferral, updateActivityStatus } = useGlobalState();
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [newReferral, setNewReferral] = useState({ studentName: "", reason: "" });

  // Filter data for this adviser
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
    const comments = prompt("What changes should they make?");
    if (comments) {
      await updateActivityStatus(id, { status: "Revision Requested", comments });
    }
  };

  // Access check
  if (currentUser?.role !== "ADVISER" && currentUser?.role !== "SYSTEM_ADMIN") {
    return (
      <div style={{ padding: "8rem 2rem", textAlign: "center", background: "white", minHeight: "80vh", borderRadius: "24px" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", border: "1px solid #fee2e2" }}>
          <AlertTriangle size={40} color="#ef4444" />
        </div>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#111827", marginBottom: "1rem" }}>Access Restricted</h2>
        <p style={{ fontSize: "1rem", color: "#64748b", maxWidth: "400px", margin: "0 auto", fontWeight: "500" }}>
          This administrative portal is exclusively reserved for **Faculty Advisers** and System Administrators.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
          Faculty Governance
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
          Adviser <span style={{ color: "#3b82f6" }}>Console</span>
        </h1>
        <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#64748b", maxWidth: "600px", lineHeight: "1.6" }}>
          Endorse student activity proposals, manage organization health, and file guidance referrals for your advisees.
        </p>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {[
          { label: "My Organizations", value: advisedOrgs.length, icon: <Building2 size={24} />, color: "#6366f1", sub: "Active Registered Orgs" },
          { label: "Pending Proposals", value: pendingProposals.length, icon: <FileSignature size={24} />, color: "#f59e0b", sub: "Waiting for Endorsement" },
          { label: "Student Referrals", value: filedReferrals.length, icon: <MessageSquare size={24} />, color: "#3b82f6", sub: "Cases in Guidance Review" }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{ padding: "2rem", background: "white", border: "1px solid #f1f5f9", borderRadius: "20px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: `${stat.color}15`, display: "flex", alignItems: "center", justifyContent: "center", color: stat.color }}>
                {stat.icon}
              </div>
              <ArrowRight size={18} color="#cbd5e1" />
            </div>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#111827", marginBottom: "0.5rem" }}>{stat.value}</h2>
            <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>{stat.label}</p>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2.5rem", alignItems: "start" }}>

        <main style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

          {/* ── Proposals Waiting for Review ── */}
          <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "2rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FileText size={20} color="#3b82f6" /> Activity Proposals <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", background: "white", padding: "0.25rem 0.75rem", borderRadius: "20px", border: "1px solid #e2e8f0" }}>{pendingProposals.length}</span>
              </h3>
              <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.05em" }}>Review Pipeline</span>
            </div>

            <div style={{ padding: "0" }}>
              {pendingProposals.length > 0 ? pendingProposals.map((act, i) => (
                <motion.div 
                  key={act.id} 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ padding: "2rem", borderBottom: i !== pendingProposals.length - 1 ? "1px solid #f1f5f9" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}
                  className="hover:bg-slate-50"
                >
                  <div style={{ flex: 1, minWidth: "300px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                       <span style={{ fontSize: "0.7rem", fontWeight: "800", color: "#3b82f6", background: "#eff6ff", padding: "0.3rem 0.75rem", borderRadius: "6px", border: "1px solid #dbeafe" }}>
                          {advisedOrgs.find(o => o.id === act.orgId)?.acronym}
                       </span>
                       <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>Ref: #{act.id.slice(-6)}</span>
                    </div>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#111827", marginBottom: "0.75rem" }}>{act.title}</h4>
                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>
                        <CalendarDays size={14} color="#94a3b8" /> {act.date}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "#64748b", fontWeight: "600" }}>
                        <Users size={14} color="#94a3b8" /> {act.participants} Target
                      </div>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    <button
                      onClick={() => handleRequestRevision(act.id)}
                      style={{ padding: "0.75rem 1.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#475569", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", transition: "all 0.2s" }}
                      className="hover:border-amber-200 hover:text-amber-600"
                    >
                      Request Revisions
                    </button>
                    <button
                      onClick={() => handleApproveProposal(act.id)}
                      style={{ padding: "0.75rem 1.5rem", background: "#3b82f6", border: "none", borderRadius: "10px", color: "white", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}
                    >
                      Endorse to OSAS
                    </button>
                  </div>
                </motion.div>
              )) : (
                <div style={{ padding: "5rem 2rem", textAlign: "center" }}>
                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", border: "1px solid #dcfce7" }}>
                    <CheckCircle2 size={32} color="#10b981" />
                  </div>
                  <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "#111827" }}>Operational Excellence</h4>
                  <p style={{ fontSize: "0.85rem", fontWeight: "500", color: "#64748b", marginTop: "0.5rem" }}>
                    All proposals have been reviewed and forwarded.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ── Student Referrals ── */}
          <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <div style={{ padding: "2rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <MessageSquare size={20} color="#3b82f6" /> Student Referrals
              </h3>
              <button
                onClick={() => setIsReferralModalOpen(true)}
                style={{ padding: "0.75rem 1.5rem", background: "#111827", border: "none", borderRadius: "10px", color: "white", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <FilePlus size={16} /> File New Case
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              {filedReferrals.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ textAlign: "left", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "800", background: "#f8fafc", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      <th style={{ padding: "1.25rem 2rem" }}>Student Identity</th>
                      <th style={{ padding: "1.25rem 2rem" }}>Case Status</th>
                      <th style={{ padding: "1.25rem 2rem" }}>Timeline</th>
                      <th style={{ padding: "1.25rem 2rem" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filedReferrals.map((ref, i) => (
                      <tr key={ref.id} style={{ borderBottom: i !== filedReferrals.length - 1 ? "1px solid #f1f5f9" : "none" }} className="hover:bg-slate-50">
                        <td style={{ padding: "1.5rem 2rem" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                             <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#3b82f6", fontSize: "0.9rem" }}>
                                {ref.studentName.charAt(0)}
                             </div>
                             <div>
                                <p style={{ fontWeight: "800", color: "#1e293b", fontSize: "0.95rem" }}>{ref.studentName}</p>
                                <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>UID: {ref.id.slice(-8)}</p>
                             </div>
                          </div>
                        </td>
                        <td style={{ padding: "1.5rem 2rem" }}>
                          <span style={{
                            fontSize: "0.7rem",
                            fontWeight: "800",
                            padding: "0.4rem 1rem",
                            borderRadius: "20px",
                            background: ref.status === "Sanctioned" ? "#fef2f2" : ref.status === "Dismissed" ? "#f0fdf4" : "#eff6ff",
                            color: ref.status === "Sanctioned" ? "#ef4444" : ref.status === "Dismissed" ? "#10b981" : "#3b82f6",
                            border: `1px solid ${ref.status === "Sanctioned" ? "#fee2e2" : ref.status === "Dismissed" ? "#dcfce7" : "#dbeafe"}`
                          }}>
                            {ref.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={{ padding: "1.5rem 2rem" }}>
                          <p style={{ fontSize: "0.85rem", color: "#475569", fontWeight: "600" }}>{new Date(ref.dateFiled).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                        </td>
                        <td style={{ padding: "1.5rem 2rem" }}>
                           <button style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#94a3b8", cursor: "pointer" }}><ChevronRight size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: "5rem 2rem", textAlign: "center" }}>
                   <MessageSquare size={48} color="#cbd5e1" style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                   <p style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "600" }}>No disciplinary or guidance referrals recorded.</p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* My Organizations */}
          <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", padding: "2rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Building2 size={20} color="#3b82f6" /> Governed Entities
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {advisedOrgs.map(org => (
                <motion.div 
                  key={org.id} 
                  whileHover={{ x: 4 }}
                  style={{ padding: "1.25rem", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9", display: "flex", gap: "1rem", alignItems: "center" }}
                >
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "white", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#3b82f6", fontSize: "0.8rem" }}>
                    {org.acronym.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>{org.acronym}</p>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "600" }}>{org.category}</p>
                  </div>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} />
                </motion.div>
              ))}
              {advisedOrgs.length === 0 && (
                <div style={{ padding: "2rem", textAlign: "center", background: "#f8fafc", borderRadius: "16px", border: "1px dashed #e2e8f0" }}>
                  <p style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: "600" }}>No organizational assignments detected.</p>
                </div>
              )}
            </div>
          </div>

          {/* Institutional Guide */}
          <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", padding: "2rem", position: "relative", overflow: "hidden", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "4px", background: "#3b82f6" }} />
            <h3 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Info size={20} color="#3b82f6" /> Advisory Protocol
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: "1.7", fontWeight: "500" }}>
              Faculty Advisers must validate all student activity budgets and risk assessments before institutional endorsement is granted by OSAS.
            </p>
            <div style={{ marginTop: "2rem", display: "grid", gap: "0.75rem" }}>
              <button style={{ padding: "0.85rem", width: "100%", background: "#eff6ff", border: "1px solid #dbeafe", color: "#3b82f6", fontSize: "0.85rem", fontWeight: "800", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}>
                <TrendingUp size={16} /> Performance Metrics
              </button>
              <button style={{ padding: "0.85rem", width: "100%", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", color: "#475569", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer" }}>
                Governance Handbook
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── New Referral Modal ── */}
      <AnimatePresence>
        {isReferralModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{ width: "100%", maxWidth: "520px", background: "white", borderRadius: "24px", padding: "2.5rem", border: "1px solid #e2e8f0", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#111827" }}>Initiate Student Referral</h3>
                <button onClick={() => setIsReferralModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleFileReferral} style={{ display: "grid", gap: "1.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "#475569", marginBottom: "0.75rem" }}>Student Identity</label>
                  <input
                    required
                    value={newReferral.studentName}
                    onChange={e => setNewReferral({ ...newReferral, studentName: e.target.value })}
                    placeholder="Full legal name or Student ID"
                    style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", background: "#f8fafc" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "#475569", marginBottom: "0.75rem" }}>Case Narrative / Rationale</label>
                  <textarea
                    required
                    value={newReferral.reason}
                    onChange={e => setNewReferral({ ...newReferral, reason: e.target.value })}
                    placeholder="Provide specific details regarding the incident or behavioral pattern..."
                    style={{ width: "100%", padding: "1rem", minHeight: "140px", fontSize: "0.95rem", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", resize: "none", background: "#f8fafc", lineHeight: "1.6" }}
                  />
                </div>
                <div style={{ padding: "1.25rem", background: "#fffbeb", borderRadius: "12px", border: "1px solid #fef3c7", display: "flex", gap: "1rem" }}>
                   <Zap size={20} color="#d97706" />
                   <p style={{ fontSize: "0.85rem", color: "#92400e", fontWeight: "600", lineHeight: "1.5" }}>Referrals are encrypted and forwarded directly to the Guidance Office for immediate processing.</p>
                </div>
                <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsReferralModalOpen(false)}
                    style={{ flex: 1, padding: "1rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#64748b", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ flex: 2, padding: "1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}
                  >
                    <Send size={18} /> File Referral
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
