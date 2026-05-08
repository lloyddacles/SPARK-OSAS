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
  X
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
      <div style={{ padding: "6rem", textAlign: "center" }}>
        <AlertTriangle size={40} color="#ef4444" style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
        <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#ef4444" }}>
          This page is only available for Faculty Advisers.
        </p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>

      {/* ── Page Header ── */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>
          Faculty Adviser
        </p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
          My <span style={{ color: "var(--primary)" }}>Advisees</span>
        </h1>
        <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#6b7280", maxWidth: "550px", lineHeight: "1.6" }}>
          Review activity proposals from your organizations and manage student referrals.
        </p>
      </div>

      {/* ── Quick Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.25rem", marginBottom: "3rem" }}>
        <div style={{ padding: "1.5rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "12px", borderTop: "3px solid #6366f1" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", marginBottom: "0.5rem" }}>My Organizations</p>
          <p style={{ fontSize: "2rem", fontWeight: "900", color: "#111827" }}>{advisedOrgs.length}</p>
        </div>
        <div style={{ padding: "1.5rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "12px", borderTop: "3px solid #f59e0b" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", marginBottom: "0.5rem" }}>Pending Proposals</p>
          <p style={{ fontSize: "2rem", fontWeight: "900", color: "#111827" }}>{pendingProposals.length}</p>
        </div>
        <div style={{ padding: "1.5rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "12px", borderTop: "3px solid var(--primary)" }}>
          <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#6b7280", marginBottom: "0.5rem" }}>Student Referrals</p>
          <p style={{ fontSize: "2rem", fontWeight: "900", color: "#111827" }}>{filedReferrals.length}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr minmax(300px, 380px)", gap: "2rem", alignItems: "start" }}>

        <main style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

          {/* ── Proposals Waiting for Review ── */}
          <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <FileText size={18} color="var(--primary)" /> Proposals Waiting for Review
              </h3>
              <span style={{ fontSize: "0.75rem", fontWeight: "600", color: "#9ca3af" }}>
                {pendingProposals.length} pending
              </span>
            </div>

            {pendingProposals.length > 0 ? pendingProposals.map((act) => (
              <div key={act.id} style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: "700", color: "var(--primary)", marginBottom: "0.35rem" }}>
                    {advisedOrgs.find(o => o.id === act.orgId)?.name}
                  </p>
                  <h4 style={{ fontSize: "1rem", fontWeight: "800", color: "#111827" }}>{act.title}</h4>
                  <div style={{ display: "flex", gap: "1.25rem", marginTop: "0.5rem", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "0.7rem", fontWeight: "600", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <CalendarDays size={12} /> {act.date}
                    </span>
                    <span style={{ fontSize: "0.7rem", fontWeight: "600", color: "#9ca3af", display: "flex", alignItems: "center", gap: "0.35rem" }}>
                      <Users size={12} /> {act.participants} participants
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => handleRequestRevision(act.id)}
                    style={{ padding: "0.6rem 1.25rem", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#374151", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}
                  >
                    Request Changes
                  </button>
                  <button
                    onClick={() => handleApproveProposal(act.id)}
                    style={{ padding: "0.6rem 1.25rem", background: "var(--primary)", border: "none", borderRadius: "8px", color: "white", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}
                  >
                    Approve & Send to OSAS
                  </button>
                </div>
              </div>
            )) : (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <CheckCircle2 size={32} color="#10b981" style={{ opacity: 0.2, marginBottom: "1rem" }} />
                <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#9ca3af" }}>
                  All caught up! No proposals waiting for your review.
                </p>
              </div>
            )}
          </div>

          {/* ── Student Referrals ── */}
          <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "1.5rem 2rem", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <MessageSquare size={18} color="var(--primary)" /> Student Referrals
              </h3>
              <button
                onClick={() => setIsReferralModalOpen(true)}
                style={{ padding: "0.5rem 1.25rem", background: "var(--primary)", border: "none", borderRadius: "8px", color: "white", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer" }}
              >
                + New Referral
              </button>
            </div>

            {filedReferrals.length > 0 ? (
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", fontSize: "0.7rem", color: "#9ca3af", fontWeight: "700", background: "#fafafa" }}>
                    <th style={{ padding: "1rem 2rem" }}>Student Name</th>
                    <th style={{ padding: "1rem 2rem" }}>Status</th>
                    <th style={{ padding: "1rem 2rem" }}>Date Filed</th>
                  </tr>
                </thead>
                <tbody>
                  {filedReferrals.map((ref) => (
                    <tr key={ref.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      <td style={{ padding: "1rem 2rem" }}>
                        <p style={{ fontWeight: "700", color: "#111827", fontSize: "0.85rem" }}>{ref.studentName}</p>
                        <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.15rem" }}>Ref #{ref.id.slice(-6)}</p>
                      </td>
                      <td style={{ padding: "1rem 2rem" }}>
                        <span style={{
                          fontSize: "0.7rem",
                          fontWeight: "700",
                          padding: "0.3rem 0.75rem",
                          borderRadius: "6px",
                          background: ref.status === "Sanctioned" ? "#fef2f2" : ref.status === "Dismissed" ? "#f0fdf4" : "#eff6ff",
                          color: ref.status === "Sanctioned" ? "#dc2626" : ref.status === "Dismissed" ? "#16a34a" : "#2563eb",
                        }}>
                          {ref.status}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 2rem" }}>
                        <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>{new Date(ref.dateFiled).toLocaleDateString()}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: "3rem", textAlign: "center" }}>
                <p style={{ fontSize: "0.85rem", color: "#9ca3af" }}>No referrals filed yet.</p>
              </div>
            )}
          </div>
        </main>

        {/* ── Right Sidebar ── */}
        <aside style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          {/* My Organizations */}
          <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "1.5rem" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#111827", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Building2 size={18} color="var(--primary)" /> My Organizations
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {advisedOrgs.map(org => (
                <div key={org.id} style={{ padding: "1rem 1.25rem", background: "#f9fafb", borderRadius: "10px", border: "1px solid #f3f4f6" }}>
                  <p style={{ fontSize: "0.9rem", fontWeight: "700", color: "#111827" }}>{org.name}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.35rem" }}>
                    <p style={{ fontSize: "0.75rem", color: "#6b7280" }}>{org.acronym} · {org.category}</p>
                    <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#10b981" }}>Active</span>
                  </div>
                </div>
              ))}
              {advisedOrgs.length === 0 && (
                <p style={{ fontSize: "0.85rem", color: "#9ca3af", textAlign: "center", padding: "1.5rem 0" }}>
                  No organizations assigned yet.
                </p>
              )}
            </div>
          </div>

          {/* Quick Guide */}
          <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "1.5rem", borderTop: "3px solid var(--primary)" }}>
            <h3 style={{ fontSize: "0.9rem", fontWeight: "800", color: "#111827", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Info size={18} color="var(--primary)" /> Quick Guide
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#6b7280", lineHeight: "1.6" }}>
              As a Faculty Adviser, you review and approve activity proposals from your organizations before they go to OSAS. You can also file student referrals for guidance or disciplinary review.
            </p>
            <div style={{ marginTop: "1.25rem", display: "grid", gap: "0.5rem" }}>
              <button className="btn-cyan" style={{ padding: "0.75rem", width: "100%", fontSize: "0.8rem", borderRadius: "8px" }}>
                Download Guidelines
              </button>
              <button style={{ padding: "0.75rem", width: "100%", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#374151", fontSize: "0.8rem", fontWeight: "700", cursor: "pointer" }}>
                View Academic Calendar
              </button>
            </div>
          </div>
        </aside>
      </div>

      {/* ── New Referral Modal ── */}
      <AnimatePresence>
        {isReferralModalOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{ width: "100%", maxWidth: "480px", background: "white", borderRadius: "16px", padding: "2rem", boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#111827" }}>New Student Referral</h3>
                <button onClick={() => setIsReferralModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af" }}>
                  <X size={20} />
                </button>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1.5rem" }}>
                Submit a referral to the Guidance Office for review.
              </p>
              <form onSubmit={handleFileReferral} style={{ display: "grid", gap: "1.25rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#374151", marginBottom: "0.5rem" }}>Student's Full Name</label>
                  <input
                    required
                    value={newReferral.studentName}
                    onChange={e => setNewReferral({ ...newReferral, studentName: e.target.value })}
                    placeholder="e.g. Juan Dela Cruz"
                    style={{ width: "100%", padding: "0.75rem 1rem", fontSize: "0.9rem", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: "700", color: "#374151", marginBottom: "0.5rem" }}>Reason for Referral</label>
                  <textarea
                    required
                    value={newReferral.reason}
                    onChange={e => setNewReferral({ ...newReferral, reason: e.target.value })}
                    placeholder="Describe the incident or concern..."
                    style={{ width: "100%", padding: "0.75rem 1rem", minHeight: "100px", fontSize: "0.9rem", border: "1px solid #e5e7eb", borderRadius: "8px", outline: "none", resize: "vertical" }}
                  />
                </div>
                <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setIsReferralModalOpen(false)}
                    style={{ flex: 1, padding: "0.75rem", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "8px", color: "#374151", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-cyan"
                    style={{ flex: 2, padding: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", borderRadius: "8px", fontSize: "0.85rem" }}
                  >
                    <Send size={14} /> Submit Referral
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
