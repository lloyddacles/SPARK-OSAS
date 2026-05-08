"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  TrendingUp, Activity, Users, GraduationCap,
  PieChart as PieIcon, BarChart as BarIcon,
  ArrowUpRight, ArrowDownRight, Target, Zap,
  ShieldCheck, Download, FileText, Sparkles,
  Building2, CalendarCheck, ClipboardList,
  MessageSquare, CheckCircle2, Clock, AlertCircle,
  RefreshCw, BookOpen
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function AnalyticsPage() {
  const {
    organizations, activities, scholarshipApps, scholarshipPrograms,
    users, currentUser, isLoading, requests, referrals,
    appointments, announcements, auditLogs, batchConfigs,
    issuedCertificates
  } = useGlobalState();

  const [isPredicting, setIsPredicting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "2px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isAuthorized = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";
  if (!isAuthorized) return (
    <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div>
        <ShieldCheck size={48} style={{ opacity: 0.15, margin: "0 auto 1.5rem" }} />
        <h1 style={{ fontSize: "1.2rem", fontWeight: "800", color: "#6b7280" }}>Access Restricted</h1>
        <p style={{ fontSize: "0.85rem", color: "#9ca3af", marginTop: "0.5rem" }}>Only the OSAS Director and System Admins can view this page.</p>
      </div>
    </div>
  );

  // ── Computed Metrics ──
  const totalOrgs = organizations.length;
  const recognizedOrgs = organizations.filter(o => o.status === "Recognized").length;
  const probationaryOrgs = organizations.filter(o => o.status === "Probationary").length;

  const totalActivities = activities.length;
  const approvedActivities = activities.filter(a => a.status === "Approved" || a.status === "Completed").length;
  const pendingActivities = activities.filter(a => a.status === "Pending OSAS Approval" || a.status === "Pending Adviser Review").length;
  const rejectedActivities = activities.filter(a => a.status === "Rejected").length;
  const approvalRate = totalActivities > 0 ? Math.round((approvedActivities / totalActivities) * 100) : 0;

  const totalScholarApps = scholarshipApps.length;
  const approvedScholars = scholarshipApps.filter(s => s.status === "Approved").length;
  const recommendedScholars = scholarshipApps.filter(s => s.status === "Recommended").length;
  const pendingScholars = scholarshipApps.filter(s => s.status === "For OSAS Review" || s.status === "Pending Requirements").length;

  const totalStudents = users.filter(u => u.role === "STUDENT_APPLICANT" || u.role === "STUDENT_LEADER").length;
  const studentLeaders = users.filter(u => u.role === "STUDENT_LEADER").length;
  const advisers = users.filter(u => u.role === "ADVISER").length;

  const totalRequests = (requests || []).length;
  const pendingRequests = (requests || []).filter(r => r.status === "Pending").length;
  const completedRequests = (requests || []).filter(r => r.status === "Completed" || r.status === "Ready for Pickup").length;

  const totalReferrals = (referrals || []).length;
  const activeReferrals = (referrals || []).filter(r => r.status === "Referred to Guidance" || r.status === "Endorsed to OSAS").length;
  const sanctioned = (referrals || []).filter(r => r.status === "Sanctioned").length;
  const dismissed = (referrals || []).filter(r => r.status === "Dismissed").length;

  const totalAppointments = (appointments || []).length;
  const approvedAppts = (appointments || []).filter(a => a.status === "APPROVED").length;
  const completedAppts = (appointments || []).filter(a => a.status === "COMPLETED").length;

  const certsIssued = (issuedCertificates || []).length;

  const orgCategories = ["Academic", "Religious", "Special Interest", "Council"];
  const orgCategoryData = orgCategories.map(cat => ({
    label: cat,
    count: organizations.filter(o => o.category === cat).length,
    pct: totalOrgs > 0 ? Math.round((organizations.filter(o => o.category === cat).length / totalOrgs) * 100) : 0
  }));
  const categoryColors = ["#6366f1", "#f59e0b", "#10b981", "#ec4899"];

  const runPrediction = () => {
    setIsPredicting(true);
    setAiPrediction(null);
    setTimeout(() => {
      setIsPredicting(false);
      setAiPrediction(`Based on current trends: ${pendingActivities} activity proposals are awaiting review, ${pendingRequests} service requests are in the queue, and ${pendingScholars} scholarship applications need attention. Clubs are ${totalOrgs > 3 ? 'growing steadily' : 'at a manageable level'}. Recommendation: prioritize the ${pendingRequests > pendingActivities ? 'service request backlog' : 'pending activity proposals'} this week.`);
    }, 2500);
  };

  const exportCSV = () => {
    const rows = [
      "OSAS ANALYTICS REPORT",
      `Generated: ${new Date().toLocaleDateString()}`,
      "",
      "SECTION,METRIC,COUNT",
      `Student Clubs,Total Organizations,${totalOrgs}`,
      `Student Clubs,Recognized,${recognizedOrgs}`,
      `Student Clubs,Probationary,${probationaryOrgs}`,
      ...orgCategoryData.map(c => `Student Clubs,${c.label} Clubs,${c.count}`),
      "",
      `Activities,Total Proposals,${totalActivities}`,
      `Activities,Approved / Completed,${approvedActivities}`,
      `Activities,Pending Review,${pendingActivities}`,
      `Activities,Rejected,${rejectedActivities}`,
      `Activities,Approval Rate,${approvalRate}%`,
      "",
      `Scholarships,Total Applications,${totalScholarApps}`,
      `Scholarships,Approved,${approvedScholars}`,
      `Scholarships,Recommended,${recommendedScholars}`,
      `Scholarships,Pending,${pendingScholars}`,
      `Scholarships,Programs Available,${scholarshipPrograms.length}`,
      "",
      `Service Requests,Total Requests,${totalRequests}`,
      `Service Requests,Pending,${pendingRequests}`,
      `Service Requests,Completed,${completedRequests}`,
      `Service Requests,Certificates Issued,${certsIssued}`,
      "",
      `Student Referrals,Total Referrals,${totalReferrals}`,
      `Student Referrals,Active Cases,${activeReferrals}`,
      `Student Referrals,Sanctioned,${sanctioned}`,
      `Student Referrals,Dismissed,${dismissed}`,
      "",
      `Appointments,Total Booked,${totalAppointments}`,
      `Appointments,Approved,${approvedAppts}`,
      `Appointments,Completed,${completedAppts}`,
      "",
      `Users,Total Students,${totalStudents}`,
      `Users,Student Leaders,${studentLeaders}`,
      `Users,Faculty Advisers,${advisers}`,
    ];
    const csv = rows.join("\n");
    const link = document.createElement("a");
    link.href = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
    link.download = `OSAS_Analytics_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ── Helpers ──
  const StatCard = ({ label, value, sub, icon, color, trend }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(0,0,0,0.05)" }}
      style={{ padding: "1.5rem 1.75rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "14px", borderTop: `3px solid ${color}`, position: "relative", overflow: "hidden" }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
        <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: `${color}10`, display: "flex", alignItems: "center", justifyContent: "center", color }}>{icon}</div>
        {trend !== undefined && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: trend >= 0 ? "#10b981" : "#ef4444", fontSize: "0.7rem", fontWeight: "700" }}>
            {trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          </div>
        )}
      </div>
      <h2 style={{ fontSize: "2rem", fontWeight: "900", color: "#111827", lineHeight: 1 }}>{value}</h2>
      <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#374151", marginTop: "0.35rem" }}>{label}</p>
      <p style={{ fontSize: "0.7rem", color: "#9ca3af", marginTop: "0.15rem" }}>{sub}</p>
    </motion.div>
  );

  const BarItem = ({ label, value, max, color }: any) => {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0;
    return (
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "#374151" }}>{label}</span>
          <span style={{ fontSize: "0.8rem", fontWeight: "700", color }}>{value}</span>
        </div>
        <div style={{ height: "6px", background: "#f3f4f6", borderRadius: "3px", overflow: "hidden" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} style={{ height: "100%", background: color, borderRadius: "3px" }} />
        </div>
      </div>
    );
  };

  return (
    <div style={{ width: "100%" }}>
      {/* Header */}
      <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Reports & Insights</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            Analytics <span style={{ color: "var(--primary)" }}>Dashboard</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>
            A complete overview of OSAS operations — clubs, scholarships, requests, referrals, and appointments.
          </p>
        </div>
        <button onClick={exportCSV} style={{ padding: "0.7rem 1.5rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <Download size={16} /> Export Report (CSV)
        </button>
      </div>

      {/* Forecast Banner */}
      <div style={{ marginBottom: "2.5rem", padding: "1.5rem 2rem", background: "linear-gradient(135deg, rgba(99,102,241,0.04), rgba(0,229,255,0.04))", border: "1px solid rgba(99,102,241,0.15)", borderRadius: "14px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <Sparkles size={20} color="#6366f1" />
            <div>
              <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827" }}>AI Activity Forecast</h3>
              <p style={{ fontSize: "0.8rem", color: "#6b7280" }}>Generate a summary of what needs attention this week.</p>
            </div>
          </div>
          {!aiPrediction && !isPredicting && (
            <button onClick={runPrediction} style={{ padding: "0.6rem 1.5rem", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontWeight: "700", fontSize: "0.8rem", cursor: "pointer" }}>Run Forecast</button>
          )}
          {isPredicting && <RefreshCw className="animate-spin" size={20} color="#6366f1" />}
        </div>
        <AnimatePresence>
          {aiPrediction && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ marginTop: "1rem", padding: "1rem 1.25rem", background: "white", borderRadius: "10px", borderLeft: "3px solid #10b981" }}>
              <p style={{ fontSize: "0.7rem", fontWeight: "700", color: "#10b981", marginBottom: "0.35rem" }}>Forecast Complete</p>
              <p style={{ fontSize: "0.85rem", color: "#374151", lineHeight: "1.6" }}>{aiPrediction}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1.25rem", marginBottom: "2.5rem" }}>
        <StatCard label="Student Clubs" value={totalOrgs} sub={`${recognizedOrgs} recognized`} icon={<Building2 size={18} />} color="#6366f1" trend={1} />
        <StatCard label="Activity Proposals" value={totalActivities} sub={`${pendingActivities} pending review`} icon={<Activity size={18} />} color="#f59e0b" trend={pendingActivities > 0 ? -1 : 1} />
        <StatCard label="Scholarship Apps" value={totalScholarApps} sub={`${approvedScholars} approved`} icon={<GraduationCap size={18} />} color="#10b981" trend={1} />
        <StatCard label="Service Requests" value={totalRequests} sub={`${pendingRequests} pending`} icon={<ClipboardList size={18} />} color="#ec4899" trend={pendingRequests > 0 ? -1 : 1} />
        <StatCard label="Student Referrals" value={totalReferrals} sub={`${activeReferrals} active cases`} icon={<MessageSquare size={18} />} color="#ef4444" />
        <StatCard label="Appointments" value={totalAppointments} sub={`${completedAppts} completed`} icon={<CalendarCheck size={18} />} color="#8b5cf6" />
        <StatCard label="Total Students" value={totalStudents} sub={`${studentLeaders} leaders, ${advisers} advisers`} icon={<Users size={18} />} color="#0ea5e9" />
        <StatCard label="Certificates Issued" value={certsIssued} sub="Good moral & others" icon={<FileText size={18} />} color="#14b8a6" />
      </div>

      {/* Two-Column Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>

        {/* Club Distribution */}
        <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <PieIcon size={18} color="var(--primary)" /> Clubs by Category
          </h3>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1.5rem" }}>How student organizations are distributed.</p>
          {orgCategoryData.map((cat, i) => (
            <BarItem key={cat.label} label={cat.label} value={cat.count} max={totalOrgs} color={categoryColors[i]} />
          ))}
          <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", background: "#f9fafb", borderRadius: "8px", fontSize: "0.75rem", color: "#6b7280" }}>
            <strong>{recognizedOrgs}</strong> recognized · <strong>{probationaryOrgs}</strong> probationary · <strong>{totalOrgs}</strong> total
          </div>
        </div>

        {/* Activity Approval Rate */}
        <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Target size={18} color="var(--primary)" /> Activity Approval Rate
          </h3>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1.5rem" }}>How efficiently proposals are being processed.</p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", margin: "1rem 0" }}>
            <div style={{ position: "relative", width: "160px", height: "160px" }}>
              <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="18" cy="18" r="15" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                <motion.circle cx="18" cy="18" r="15" fill="none" stroke={approvalRate > 60 ? "#10b981" : "#f59e0b"} strokeWidth="3" strokeLinecap="round"
                  initial={{ strokeDasharray: "0 100" }} animate={{ strokeDasharray: `${approvalRate} 100` }} transition={{ duration: 1.2 }} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontSize: "1.75rem", fontWeight: "900", color: "#111827" }}>{approvalRate}%</p>
                <p style={{ fontSize: "0.65rem", color: "#9ca3af", fontWeight: "600" }}>Approved</p>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem", marginTop: "1rem" }}>
            {[
              { l: "Approved", v: approvedActivities, c: "#10b981" },
              { l: "Pending", v: pendingActivities, c: "#f59e0b" },
              { l: "Rejected", v: rejectedActivities, c: "#ef4444" },
            ].map(s => (
              <div key={s.l} style={{ textAlign: "center", padding: "0.75rem", background: "#f9fafb", borderRadius: "8px" }}>
                <p style={{ fontSize: "1.25rem", fontWeight: "900", color: s.c }}>{s.v}</p>
                <p style={{ fontSize: "0.7rem", color: "#6b7280" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scholarship + Referral Breakdown */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>

        {/* Scholarship Pipeline */}
        <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827", marginBottom: "0.35rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <GraduationCap size={18} color="#10b981" /> Scholarship Pipeline
          </h3>
          <p style={{ fontSize: "0.75rem", color: "#9ca3af", marginBottom: "1.5rem" }}>Application status breakdown across all programs.</p>
          <BarItem label="Pending Requirements" value={scholarshipApps.filter(s => s.status === "Pending Requirements").length} max={totalScholarApps || 1} color="#9ca3af" />
          <BarItem label="For OSAS Review" value={scholarshipApps.filter(s => s.status === "For OSAS Review").length} max={totalScholarApps || 1} color="#f59e0b" />
          <BarItem label="Recommended" value={recommendedScholars} max={totalScholarApps || 1} color="#6366f1" />
          <BarItem label="Approved" value={approvedScholars} max={totalScholarApps || 1} color="#10b981" />
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#f0fdf4", borderRadius: "8px", fontSize: "0.8rem", color: "#166534", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <BookOpen size={14} /> {scholarshipPrograms.length} scholarship program{scholarshipPrograms.length !== 1 ? "s" : ""} available
          </div>
        </div>

        {/* Referral + Request Summary */}
        <div style={{ background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", padding: "2rem" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "#111827", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <ClipboardList size={18} color="#ec4899" /> Service & Referral Summary
          </h3>

          <div style={{ marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#374151", marginBottom: "0.75rem" }}>Service Requests</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem" }}>
              {[
                { l: "Pending", v: pendingRequests, c: "#f59e0b" },
                { l: "Completed", v: completedRequests, c: "#10b981" },
                { l: "Total", v: totalRequests, c: "#6b7280" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center", padding: "0.6rem", background: "#f9fafb", borderRadius: "8px" }}>
                  <p style={{ fontSize: "1.1rem", fontWeight: "900", color: s.c }}>{s.v}</p>
                  <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#374151", marginBottom: "0.75rem" }}>Student Referrals</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "0.5rem" }}>
              {[
                { l: "Active", v: activeReferrals, c: "#f59e0b" },
                { l: "Sanctioned", v: sanctioned, c: "#ef4444" },
                { l: "Dismissed", v: dismissed, c: "#10b981" },
                { l: "Total", v: totalReferrals, c: "#6b7280" },
              ].map(s => (
                <div key={s.l} style={{ textAlign: "center", padding: "0.6rem", background: "#f9fafb", borderRadius: "8px" }}>
                  <p style={{ fontSize: "1.1rem", fontWeight: "900", color: s.c }}>{s.v}</p>
                  <p style={{ fontSize: "0.65rem", color: "#9ca3af" }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#374151", marginBottom: "0.75rem" }}>Appointments</p>
            <BarItem label="Approved (upcoming)" value={approvedAppts} max={totalAppointments || 1} color="#8b5cf6" />
            <BarItem label="Completed" value={completedAppts} max={totalAppointments || 1} color="#10b981" />
          </div>
        </div>
      </div>

      {/* Quick Print Summary */}
      <div style={{ padding: "2rem", background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: "16px", textAlign: "center" }}>
        <TrendingUp size={36} style={{ margin: "0 auto 1rem", color: "var(--primary)", opacity: 0.3 }} />
        <h2 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#111827", marginBottom: "0.5rem" }}>Ready to export?</h2>
        <p style={{ fontSize: "0.85rem", color: "#6b7280", maxWidth: "500px", margin: "0 auto 1.5rem", lineHeight: "1.5" }}>
          Download a complete CSV report with all the data above — clubs, scholarships, requests, referrals, appointments, and user counts.
        </p>
        <button onClick={exportCSV} style={{ padding: "0.75rem 2rem", background: "var(--primary)", color: "white", border: "none", borderRadius: "10px", fontWeight: "700", fontSize: "0.85rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <Download size={16} /> Download Full Report (CSV)
        </button>
      </div>
    </div>
  );
}
