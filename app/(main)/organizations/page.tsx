"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Building2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  TrendingUp,
  FileSignature,
  History,
  Award,
  Edit2,
  Archive,
  Trash2,
  Save,
  X,
  Activity,
  Layers,
  Search,
  Database,
  Settings,
  Calendar,
  Users,
  AlertTriangle
} from "lucide-react";
import { useGlobalState, StudentOrg } from "@/lib/GlobalStateContext";
import ConfirmModal from "@/components/ConfirmModal";
import ProcessGuide from "@/components/ProcessGuide";

export default function OrganizationsPage() {
  const { 
    organizations, 
    activities, 
    proposeActivity, 
    updateActivityStatus, 
    renewOrganization, 
    addOrganization, 
    updateOrganization, 
    deleteOrganization,
    currentUser 
  } = useGlobalState();
  
  const [activeTab, setActiveTab] = useState<"Student" | "OSAS" | "Adviser">("Student");
  const [osasSubTab, setOsasSubTab] = useState<"Activities" | "Manage">("Activities");
  
  // Student Leader State
  const [isProposing, setIsProposing] = useState(false);
  const [actTitle, setActTitle] = useState("");
  const [actDesc, setActDesc] = useState("");
  const [actDate, setActDate] = useState("");
  const [actBudget, setActBudget] = useState("");
  const [actVenue, setActVenue] = useState("");
  const [actParticipants, setActParticipants] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [viewingCert, setViewingCert] = useState(false);
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null);

  // OSAS Admin States
  const [selectedActId, setSelectedActId] = useState<string | null>(null);
  const [isAddingOrg, setIsAddingOrg] = useState(false);
  const [editingOrgId, setEditingOrgId] = useState<string | null>(null);
  
  // Org Form State
  const [orgName, setOrgName] = useState("");
  const [orgAcronym, setOrgAcronym] = useState("");
  const [orgCategory, setOrgCategory] = useState<StudentOrg["category"]>("Academic");
  const [orgPresident, setOrgPresident] = useState("");
  const [orgAdviser, setOrgAdviser] = useState("");
  const [orgLogo, setOrgLogo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingOrg, setViewingOrg] = useState<StudentOrg | null>(null);

  const resetOrgForm = () => {
    setOrgName("");
    setOrgAcronym("");
    setOrgCategory("Academic");
    setOrgPresident("");
    setOrgAdviser("");
    setOrgLogo("");
  };

  const startEdit = (org: StudentOrg) => {
    setEditingOrgId(org.id);
    setOrgName(org.name);
    setOrgAcronym(org.acronym);
    setOrgCategory(org.category);
    setOrgPresident(org.president);
    setOrgAdviser(org.adviser);
    setOrgLogo(org.logo || "");
  };

  const handleAddOrg = (e: React.FormEvent) => {
    e.preventDefault();
    addOrganization({
      name: orgName,
      acronym: orgAcronym,
      category: orgCategory,
      president: orgPresident,
      adviser: orgAdviser,
      logo: orgLogo,
      status: "Recognized",
      renewalDate: new Date().toISOString().split('T')[0]
    });
    setIsAddingOrg(false);
    resetOrgForm();
  };

  const handleSaveEdit = () => {
    if (!editingOrgId) return;
    updateOrganization(editingOrgId, {
      name: orgName,
      acronym: orgAcronym,
      category: orgCategory,
      president: orgPresident,
      adviser: orgAdviser,
      logo: orgLogo
    });
    setEditingOrgId(null);
    resetOrgForm();
  };

  const filteredOrgs = organizations.filter(o => 
    o.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.acronym.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "danger" | "warning" | "success" | "info";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning"
  });

  const isOSAS = currentUser?.role === "OSAS_DIRECTOR" || currentUser?.role === "SYSTEM_ADMIN";
  const isAdviser = currentUser?.role === "ADVISER";
  
  const userOrg = organizations.find(o => o.president === currentUser?.name);
  const adviserOrgs = organizations.filter(o => o.adviser === currentUser?.name);

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userOrg) return;
    proposeActivity(userOrg.id, {
      title: actTitle,
      description: actDesc,
      date: actDate,
      budget: actBudget,
      venue: actVenue,
      participants: actParticipants
    });
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setIsProposing(false);
      setActTitle("");
      setActDesc("");
      setActDate("");
      setActBudget("");
      setActVenue("");
      setActParticipants("");
    }, 2000);
  };

  const selectedAct = activities.find(a => a.id === selectedActId);
  const proposingOrg = organizations.find(o => o.id === selectedAct?.orgId);

  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto", position: "relative" }}>
      
      {/* Modern Analytics Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Life</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            Organi<span style={{ color: "#3b82f6" }}>zations</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Manage student clubs, propose activities, and track approvals.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", background: "#f1f5f9", padding: "0.5rem", borderRadius: "12px" }}>
          <button onClick={() => setActiveTab("Student")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "700", background: activeTab === "Student" ? "white" : "transparent", color: activeTab === "Student" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "8px", boxShadow: activeTab === "Student" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
            My Organization
          </button>
          {isAdviser && (
            <button onClick={() => setActiveTab("Adviser")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "700", background: activeTab === "Adviser" ? "white" : "transparent", color: activeTab === "Adviser" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "8px", boxShadow: activeTab === "Adviser" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
              Adviser View
            </button>
          )}
          {isOSAS && (
            <button onClick={() => setActiveTab("OSAS")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "700", background: activeTab === "OSAS" ? "white" : "transparent", color: activeTab === "OSAS" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "8px", boxShadow: activeTab === "OSAS" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
              OSAS Review
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Student" && (
          <motion.div key="student" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <ProcessGuide 
                title="How Activity Proposals Work"
                steps={[
                   { title: "View Your Org", desc: "Access your organization's page to see activities and propose new ones.", icon: <Building2 size={16} /> },
                   { title: "Submit a Proposal", desc: "Fill in the activity details — title, date, budget, and venue.", icon: <FileText size={16} /> },
                   { title: "Adviser Review", desc: "Your faculty adviser reviews and endorses the proposal.", icon: <ShieldCheck size={16} /> },
                   { title: "OSAS Approval", desc: "OSAS gives the final approval for your activity to proceed.", icon: <CheckCircle2 size={16} /> }
                ]}
             />
             {!userOrg ? (
               <div style={{ padding: "6rem", textAlign: "center", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                  <Building2 size={48} style={{ margin: "0 auto 1.5rem", opacity: 0.3, color: "#64748b" }} />
                  <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b" }}>No organization found</h3>
                  <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "0.75rem", fontWeight: "500" }}>You are not registered as a president of any recognized organization.</p>
               </div>
             ) : (
               <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "2.5rem" }}>
                  <div style={{ display: "grid", gap: "2.5rem" }}>
                     {/* Org Hero */}
                     <div style={{ background: "white", padding: "3rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                           {userOrg.logo ? (
                              <div style={{ width: "90px", height: "90px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                                 <img src={userOrg.logo} alt={userOrg.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </div>
                           ) : (
                              <div style={{ width: "90px", height: "90px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 4px rgba(59, 130, 246, 0.1)" }}>
                                 <Building2 size={36} color="#3b82f6" />
                              </div>
                           )}
                           <div>
                              <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{userOrg.category} Organization</p>
                              <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.25rem" }}>{userOrg.name}</h2>
                              <p style={{ fontSize: "1rem", fontWeight: "700", color: "#64748b" }}>{userOrg.acronym}</p>
                           </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                           <span style={{ fontSize: "0.75rem", fontWeight: "800", padding: "0.4rem 1rem", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: "20px" }}>
                              RECOGNIZED
                           </span>
                           <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "1rem", fontWeight: "600" }}>Renewal: {userOrg.renewalDate}</p>
                        </div>
                     </div>

                     {/* Activity Timeline */}
                     <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                        <div style={{ padding: "2rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
                           <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                              <History size={18} color="#3b82f6" /> Activity History
                           </h3>
                           <button onClick={() => setIsProposing(true)} style={{ padding: "0.75rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)" }}>
                              <Plus size={16} /> New Activity
                           </button>
                        </div>
                        <div style={{ padding: "0" }}>
                           {activities.filter(a => a.orgId === userOrg.id).length === 0 ? (
                             <div style={{ padding: "4rem", textAlign: "center" }}>
                                <FileText size={32} color="#cbd5e1" style={{ margin: "0 auto 1rem" }} />
                                <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500" }}>No activities recorded in the registry.</p>
                             </div>
                           ) : (
                             <div style={{ display: "flex", flexDirection: "column" }}>
                               {activities.filter(a => a.orgId === userOrg.id).map((act, index) => (
                                 <div key={act.id} style={{ padding: "1.5rem 2rem", borderBottom: index !== activities.filter(a => a.orgId === userOrg.id).length - 1 ? "1px solid #f1f5f9" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s", cursor: "default" }} className="hover:bg-slate-50">
                                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                       <div style={{ width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", background: act.status === "Approved" ? "#f0fdf4" : act.status === "Completed" ? "#eff6ff" : "#fffbeb", color: act.status === "Approved" ? "#16a34a" : act.status === "Completed" ? "#2563eb" : "#d97706" }}>
                                          {act.status === "Approved" ? <CheckCircle2 size={20} /> : act.status === "Completed" ? <TrendingUp size={20} /> : <Clock size={20} />}
                                       </div>
                                       <div>
                                          <p style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.25rem" }}>{act.title}</p>
                                          <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                             <Calendar size={12} /> {act.date}
                                          </p>
                                       </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                       <p style={{ fontSize: "0.8rem", fontWeight: "800", color: act.status === "Approved" ? "#16a34a" : act.status === "Completed" ? "#2563eb" : "#d97706" }}>{act.status}</p>
                                       {act.osasComments && (
                                          <p style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: "0.4rem", fontWeight: "600" }}>Remarks: {act.osasComments}</p>
                                       )}
                                    </div>
                                 </div>
                               ))}
                             </div>
                           )}
                        </div>
                     </div>
                  </div>

                  <div style={{ display: "grid", gap: "2.5rem", alignContent: "start" }}>
                     <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                           <Award size={20} color="#3b82f6" /> Recognition
                        </h3>
                        <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", textAlign: "center" }}>
                           <ShieldCheck size={32} color="#10b981" style={{ margin: "0 auto 1rem" }} />
                           <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", marginBottom: "0.25rem", textTransform: "uppercase" }}>Status</p>
                           <p style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>Recognized Student Org</p>
                           <button onClick={() => setViewingCert(true)} style={{ marginTop: "1.5rem", width: "100%", padding: "0.85rem", background: "white", border: "1px solid #3b82f6", color: "#3b82f6", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
                              View Certificate
                           </button>
                        </div>
                     </div>

                     <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                        <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                           <Activity size={20} color="#3b82f6" /> Activity Stats
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                           <div style={{ textAlign: "center", padding: "1.5rem", background: "#f0fdf4", borderRadius: "12px", border: "1px solid #bbf7d0" }}>
                              <p style={{ fontSize: "1.75rem", fontWeight: "900", color: "#166534" }}>{activities.filter(a => a.orgId === userOrg.id && a.status === "Approved").length}</p>
                              <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#15803d", marginTop: "0.25rem" }}>APPROVED</p>
                           </div>
                           <div style={{ textAlign: "center", padding: "1.5rem", background: "#fffbeb", borderRadius: "12px", border: "1px solid #fde68a" }}>
                              <p style={{ fontSize: "1.75rem", fontWeight: "900", color: "#92400e" }}>{activities.filter(a => a.orgId === userOrg.id && a.status === "Pending OSAS Approval").length}</p>
                              <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#b45309", marginTop: "0.25rem" }}>PENDING</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </motion.div>
        )}

        {activeTab === "OSAS" && (
          <motion.div key="osas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", borderBottom: "1px solid #e2e8f0" }}>
                <button onClick={() => setOsasSubTab("Activities")} style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "700", background: "none", border: "none", color: osasSubTab === "Activities" ? "#3b82f6" : "#64748b", borderBottom: osasSubTab === "Activities" ? "2px solid #3b82f6" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>Activity Review</button>
                <button onClick={() => setOsasSubTab("Manage")} style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "700", background: "none", border: "none", color: osasSubTab === "Manage" ? "#3b82f6" : "#64748b", borderBottom: osasSubTab === "Manage" ? "2px solid #3b82f6" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>All Organizations</button>
             </div>

             <ProcessGuide 
                title="OSAS Organization Protocol"
                steps={[
                   { title: "Monitor Queue", desc: "Review pending proposals and registration requests.", icon: <History size={16} /> },
                   { title: "Audit Details", desc: "Verify budget, venue, and adviser endorsements.", icon: <Search size={16} /> },
                   { title: "Execute Verdict", desc: "Approve, request revision, or reject proposals.", icon: <FileSignature size={16} /> },
                   { title: "Registry", desc: "Maintain the official University RSO Directory.", icon: <Database size={16} /> }
                ]}
             />

             <AnimatePresence mode="wait">
               {osasSubTab === "Activities" ? (
                 <motion.div key="acts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "2.5rem", alignItems: "start" }}>
                       <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                          <div style={{ padding: "2rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                             <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <Clock size={18} color="#3b82f6" /> Pending Proposals
                             </h3>
                          </div>
                          <div style={{ padding: "0" }}>
                             {activities.filter(a => a.status === "Pending OSAS Approval").length === 0 ? (
                               <div style={{ padding: "4rem", textAlign: "center" }}>
                                  <CheckCircle2 size={40} color="#cbd5e1" style={{ margin: "0 auto 1rem" }} />
                                  <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600" }}>No proposals awaiting OSAS review.</p>
                               </div>
                             ) : (
                               <div style={{ display: "flex", flexDirection: "column" }}>
                                  {activities.filter(a => a.status === "Pending OSAS Approval").map((act, index) => {
                                    const org = organizations.find(o => o.id === act.orgId);
                                    const isSelected = selectedActId === act.id;
                                    return (
                                      <div key={act.id} onClick={() => setSelectedActId(act.id)} style={{ padding: "1.5rem 2rem", borderBottom: index !== activities.filter(a => a.status === "Pending OSAS Approval").length - 1 ? "1px solid #f1f5f9" : "none", background: isSelected ? "#eff6ff" : "white", cursor: "pointer", transition: "all 0.2s" }}>
                                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                               <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", marginBottom: "0.4rem", textTransform: "uppercase" }}>{org?.acronym || "UNKNOWN"}</p>
                                               <p style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>{act.title}</p>
                                            </div>
                                            <ArrowRight size={16} color={isSelected ? "#2563eb" : "#94a3b8"} />
                                         </div>
                                      </div>
                                    );
                                  })}
                               </div>
                             )}
                          </div>
                       </div>

                       <div>
                          {selectedAct ? (
                            <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", position: "sticky", top: "2rem" }}>
                               <div style={{ marginBottom: "2.5rem" }}>
                                  <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", textTransform: "uppercase", marginBottom: "0.5rem" }}>Proposal Details</p>
                                  <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", lineHeight: "1.2" }}>{selectedAct.title}</h3>
                                  <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600", marginTop: "0.75rem" }}>Submitted by <strong>{proposingOrg?.name}</strong></p>
                               </div>

                               <div style={{ display: "grid", gap: "1.5rem", marginBottom: "3rem" }}>
                                  <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                     <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", marginBottom: "0.75rem", textTransform: "uppercase" }}>Project Description</p>
                                     <p style={{ fontSize: "0.9rem", lineHeight: "1.6", color: "#1e293b", fontWeight: "500" }}>{selectedAct.description}</p>
                                  </div>

                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                     <div style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                        <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>Date</p>
                                        <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>{selectedAct.date}</p>
                                     </div>
                                     <div style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                        <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>Budget</p>
                                        <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>₱{selectedAct.budget}</p>
                                     </div>
                                  </div>
                                  
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                     <div style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                        <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>Venue</p>
                                        <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>{selectedAct.venue}</p>
                                     </div>
                                     <div style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                        <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", marginBottom: "0.25rem" }}>Target Pax</p>
                                        <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>{selectedAct.participants}</p>
                                     </div>
                                  </div>
                               </div>

                               <div style={{ marginBottom: "2.5rem" }}>
                                  <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#1e293b" }}>OSAS Feedback</label>
                                  <textarea 
                                     id="osas-remarks"
                                     placeholder="Enter feedback or requirements for the organization..."
                                     style={{ width: "100%", padding: "1.25rem", fontSize: "0.9rem", fontWeight: "500", minHeight: "120px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b", resize: "vertical" }}
                                  />
                               </div>

                               <div style={{ display: "grid", gap: "1rem" }}>
                                  <button onClick={() => { 
                                    const remarks = (document.getElementById("osas-remarks") as HTMLTextAreaElement).value;
                                    setConfirmConfig({
                                      isOpen: true,
                                      title: "Approve Activity",
                                      message: "Are you sure you want to approve this activity proposal?",
                                      type: "success",
                                      onConfirm: () => {
                                        if (selectedActId) updateActivityStatus(selectedActId, { status: "Approved", comments: remarks }); 
                                        setSelectedActId(null); 
                                      }
                                    });
                                  }} style={{ width: "100%", padding: "1.25rem", background: "#10b981", color: "white", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "800", border: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                                     <CheckCircle2 size={18} /> Approve Activity
                                  </button>
                                  
                                  <button onClick={() => { 
                                    const remarks = (document.getElementById("osas-remarks") as HTMLTextAreaElement).value;
                                    setConfirmConfig({
                                      isOpen: true,
                                      title: "Request Revision",
                                      message: "This will send the proposal back to the organization for changes. Continue?",
                                      type: "warning",
                                      onConfirm: () => {
                                        if (selectedActId) updateActivityStatus(selectedActId, { status: "Revision Requested", comments: remarks }); 
                                        setSelectedActId(null); 
                                      }
                                    });
                                  }} style={{ width: "100%", padding: "1.25rem", background: "white", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", transition: "all 0.2s" }}>
                                     <AlertTriangle size={18} /> Request Revision
                                  </button>
                                  
                                  <button onClick={() => { 
                                    const remarks = (document.getElementById("osas-remarks") as HTMLTextAreaElement).value;
                                    setConfirmConfig({
                                      isOpen: true,
                                      title: "Reject Proposal",
                                      message: "Warning: Rejecting this proposal is a final action. Are you sure?",
                                      type: "danger",
                                      onConfirm: () => {
                                        if (selectedActId) updateActivityStatus(selectedActId, { status: "Rejected", comments: remarks }); 
                                        setSelectedActId(null); 
                                      }
                                    });
                                  }} style={{ width: "100%", padding: "1.25rem", background: "#fff1f2", border: "1px solid #fecaca", color: "#e11d48", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", transition: "all 0.2s" }}>
                                     <X size={18} /> Reject Proposal
                                  </button>
                               </div>
                            </div>
                          ) : (
                            <div style={{ background: "white", padding: "4rem", borderRadius: "16px", border: "1px dashed #cbd5e1", textAlign: "center", color: "#64748b" }}>
                               <FileSignature size={48} style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                               <p style={{ fontSize: "0.9rem", fontWeight: "700" }}>Select a proposal from the queue to review its details.</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", gap: "2rem", flexWrap: "wrap" }}>
                       <div style={{ position: "relative", flex: 1, minWidth: "300px" }}>
                          <Search size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                          <input 
                            placeholder="Search organizations by name or acronym..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "1.25rem 1.25rem 1.25rem 3.5rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "0.9rem", fontWeight: "500", outline: "none", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }} 
                          />
                       </div>
                       <button onClick={() => { setIsAddingOrg(true); resetOrgForm(); }} style={{ padding: "1.25rem 2rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.95rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)", whiteSpace: "nowrap" }}>
                          <Plus size={18} /> Add Organization
                       </button>
                    </div>

                    {/* ADD/EDIT FORM */}
                    {(isAddingOrg || editingOrgId) && (
                       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ background: "white", padding: "3rem", borderRadius: "16px", border: "1px solid #bfdbfe", marginBottom: "3rem", boxShadow: "0 10px 25px rgba(59, 130, 246, 0.05)", overflow: "hidden" }}>
                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                            <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                               <Building2 size={24} color="#3b82f6" /> {editingOrgId ? "Edit Organization" : "Register New Organization"}
                            </h3>
                            <button onClick={() => { setIsAddingOrg(false); setEditingOrgId(null); }} style={{ color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
                         </div>
                         <form onSubmit={editingOrgId ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleAddOrg} style={{ display: "grid", gap: "2rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                               <div>
                                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Organization Name</label>
                                  <input required placeholder="e.g. Computer Science Society" value={orgName} onChange={e => setOrgName(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                               </div>
                               <div>
                                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Acronym</label>
                                  <input required placeholder="e.g. CSS" value={orgAcronym} onChange={e => setOrgAcronym(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                               </div>
                               <div>
                                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Category</label>
                                  <select value={orgCategory} onChange={e => setOrgCategory(e.target.value as any)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }}>
                                     <option value="Academic">Academic</option>
                                     <option value="Council">Council</option>
                                     <option value="Religious">Religious</option>
                                     <option value="Special Interest">Special Interest</option>
                                  </select>
                               </div>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem" }}>
                               <div>
                                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>President Name</label>
                                  <input required placeholder="Full name of president" value={orgPresident} onChange={e => setOrgPresident(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                               </div>
                               <div>
                                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Faculty Adviser</label>
                                  <input required placeholder="Full name of adviser" value={orgAdviser} onChange={e => setOrgAdviser(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                               </div>
                               <div>
                                  <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Logo URL (Optional)</label>
                                  <input placeholder="https://..." value={orgLogo} onChange={e => setOrgLogo(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", outline: "none", color: "#1e293b" }} />
                               </div>
                            </div>
                            <button type="submit" style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", borderRadius: "10px", border: "none", fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>
                               <Save size={18} /> {editingOrgId ? "Save Changes" : "Register Organization"}
                            </button>
                         </form>
                       </motion.div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
                       {(isAdviser ? filteredOrgs.filter(o => o.adviser === currentUser?.name) : filteredOrgs).map(org => (
                         <div key={org.id} onClick={() => setViewingOrg(org)} style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", padding: "2rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", opacity: org.status === "Archived" ? 0.6 : 1, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.2s" }} className="hover:shadow-lg hover:-translate-y-1">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                               <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                                  {org.logo ? (
                                     <div style={{ width: "50px", height: "50px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
                                        <img src={org.logo} alt={org.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                     </div>
                                  ) : (
                                     <div style={{ width: "50px", height: "50px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Building2 size={24} color="#3b82f6" />
                                     </div>
                                  )}
                                  <div>
                                     <h4 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#1e293b" }}>{org.acronym}</h4>
                                     <p style={{ fontSize: "0.7rem", color: "#3b82f6", fontWeight: "700", textTransform: "uppercase" }}>{org.category} Unit</p>
                                  </div>
                               </div>
                               <div style={{ display: "flex", gap: "0.5rem" }} onClick={e => e.stopPropagation()}>
                                  <button onClick={() => startEdit(org)} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}><Edit2 size={14} /></button>
                                  <button onClick={() => updateOrganization(org.id, { status: org.status === "Archived" ? "Recognized" : "Archived" })} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "white", color: "#3b82f6", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}><Archive size={14} /></button>
                                  <button 
                                     onClick={() => setConfirmConfig({
                                       isOpen: true,
                                       title: "Delete Organization",
                                       message: `Are you sure you want to permanently delete ${org.name}? This will remove all associated activities.`,
                                       type: "danger",
                                       onConfirm: () => deleteOrganization(org.id)
                                     })} 
                                     style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                                  >
                                     <Trash2 size={14} />
                                  </button>
                               </div>
                            </div>
                            <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b", marginBottom: "1rem", lineHeight: "1.4" }}>{org.name}</p>
                            <div style={{ display: "grid", gap: "0.5rem", marginBottom: "1.5rem" }}>
                               <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "500" }}>President: <strong>{org.president}</strong></p>
                               <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "500" }}>Adviser: <strong>{org.adviser}</strong></p>
                            </div>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
                               <span style={{ fontSize: "0.75rem", fontWeight: "800", padding: "0.3rem 0.8rem", borderRadius: "20px", background: org.status === "Recognized" ? "#f0fdf4" : "#fef2f2", color: org.status === "Recognized" ? "#16a34a" : "#e11d48", border: org.status === "Recognized" ? "1px solid #bbf7d0" : "1px solid #fecaca" }}>
                                  {org.status}
                               </span>
                               <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>ID: {org.id}</span>
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        )}

        {activeTab === "Adviser" && (
          <motion.div key="adviser" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "2.5rem" }}>
                {adviserOrgs.map(org => (
                  <div key={org.id} style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", padding: "2.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                           {org.logo ? (
                              <div style={{ width: "48px", height: "48px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px" }}>
                                 <img src={org.logo} alt={org.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </div>
                           ) : (
                              <div style={{ width: "48px", height: "48px", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                 <Building2 size={24} color="#3b82f6" />
                              </div>
                           )}
                           <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b" }}>{org.acronym}</h3>
                        </div>
                        <Settings size={20} color="#94a3b8" />
                     </div>
                     <p style={{ fontSize: "1rem", fontWeight: "700", color: "#475569", marginBottom: "2rem" }}>{org.name}</p>
                     
                     <div style={{ display: "grid", gap: "1rem" }}>
                        <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" }}>
                           <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>Pending Endorsements</span>
                           <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#d97706", background: "#fef3c7", padding: "0.2rem 0.8rem", borderRadius: "20px" }}>{activities.filter(a => a.orgId === org.id && a.status === "Pending Adviser Review").length}</span>
                        </div>
                        <div style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" }}>
                           <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>Active Activities</span>
                           <span style={{ fontSize: "1.1rem", fontWeight: "900", color: "#16a34a", background: "#f0fdf4", padding: "0.2rem 0.8rem", borderRadius: "20px" }}>{activities.filter(a => a.orgId === org.id && a.status === "Approved").length}</span>
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
         {viewingOrg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ width: "100%", maxWidth: "800px", background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                  <div style={{ padding: "3rem", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                        {viewingOrg.logo ? (
                           <div style={{ width: "100px", height: "100px", background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <img src={viewingOrg.logo} alt={viewingOrg.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                           </div>
                        ) : (
                           <div style={{ width: "100px", height: "100px", background: "white", border: "1px solid #e2e8f0", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                              <Building2 size={40} color="#3b82f6" />
                           </div>
                        )}
                        <div>
                           <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.5rem" }}>{viewingOrg.acronym} • {viewingOrg.category} Unit</p>
                           <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", lineHeight: "1.2" }}>{viewingOrg.name}</h2>
                        </div>
                     </div>
                     <button onClick={() => setViewingOrg(null)} style={{ background: "white", border: "1px solid #e2e8f0", color: "#64748b", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
                  </div>
                  <div style={{ padding: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                     <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "800", marginBottom: "1.5rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.5rem" }}><Users size={18} color="#3b82f6" /> Leadership</h4>
                        <div style={{ display: "grid", gap: "1rem" }}>
                           <div style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                              <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", marginBottom: "0.25rem" }}>President</p>
                              <p style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>{viewingOrg.president}</p>
                           </div>
                           <div style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                              <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", marginBottom: "0.25rem" }}>Faculty Adviser</p>
                              <p style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b" }}>{viewingOrg.adviser}</p>
                           </div>
                        </div>
                     </div>
                     <div>
                        <h4 style={{ fontSize: "0.9rem", fontWeight: "800", marginBottom: "1.5rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.5rem" }}><History size={18} color="#3b82f6" /> Recent Activities</h4>
                        <div style={{ display: "grid", gap: "0.75rem" }}>
                           {activities.filter(a => a.orgId === viewingOrg.id).slice(0, 4).map(act => (
                              <div key={act.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                 <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e293b" }}>{act.title}</p>
                                 <span style={{ fontSize: "0.7rem", fontWeight: "800", padding: "0.3rem 0.8rem", borderRadius: "20px", background: act.status === "Approved" ? "#f0fdf4" : act.status === "Completed" ? "#eff6ff" : "#fffbeb", color: act.status === "Approved" ? "#16a34a" : act.status === "Completed" ? "#2563eb" : "#d97706" }}>
                                    {act.status}
                                 </span>
                              </div>
                           ))}
                           {activities.filter(a => a.orgId === viewingOrg.id).length === 0 && (
                              <div style={{ padding: "2rem", textAlign: "center", background: "#f8fafc", border: "1px dashed #cbd5e1", borderRadius: "12px" }}>
                                 <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>No recorded activities.</p>
                              </div>
                           )}
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Certificate Modal */}
      <AnimatePresence>
         {viewingCert && userOrg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: "100%", maxWidth: "800px", background: "white", padding: "4rem", color: "#0f172a", position: "relative", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", borderRadius: "8px" }}>
                  <button onClick={() => setViewingCert(false)} style={{ position: "absolute", top: "2rem", right: "2rem", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#64748b", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
                  
                  <div style={{ border: "2px solid #e2e8f0", outline: "4px solid #f8fafc", outlineOffset: "-10px", padding: "4rem", textAlign: "center", background: "#ffffff" }}>
                     <Building2 size={56} color="#3b82f6" style={{ margin: "0 auto 2rem" }} />
                     <p style={{ fontSize: "0.85rem", fontWeight: "800", letterSpacing: "0.2em", marginBottom: "1rem", color: "#475569" }}>OFFICE OF THE STUDENT AFFAIRS & SERVICES</p>
                     <h2 style={{ fontSize: "2.5rem", fontWeight: "900", marginBottom: "3rem", fontFamily: "Georgia, serif", color: "#1e293b" }}>CERTIFICATE OF RECOGNITION</h2>
                     
                     <p style={{ fontSize: "1.1rem", lineHeight: "2", marginBottom: "4rem", color: "#334155" }}>
                        This is to certify that <br />
                        <span style={{ fontSize: "1.75rem", fontWeight: "900", borderBottom: "2px solid #cbd5e1", padding: "0 2rem", color: "#0f172a", display: "inline-block", marginTop: "0.5rem", marginBottom: "0.5rem" }}>{userOrg.name}</span> <br />
                        is a duly recognized <strong>{userOrg.category.toUpperCase()} ORGANIZATION</strong> <br />
                        of the University for the Academic Year 2026-2027.
                     </p>

                     <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4rem", padding: "0 2rem" }}>
                        <div style={{ textAlign: "center", width: "250px" }}>
                           <p style={{ fontWeight: "800", borderTop: "2px solid #1e293b", paddingTop: "0.75rem", fontSize: "0.85rem", color: "#1e293b" }}>OSAS COORDINATOR</p>
                        </div>
                        <div style={{ textAlign: "center", width: "250px" }}>
                           <p style={{ fontWeight: "800", borderTop: "2px solid #1e293b", paddingTop: "0.75rem", fontSize: "0.85rem", color: "#1e293b" }}>UNIVERSITY PRESIDENT</p>
                        </div>
                     </div>
                     
                     <p style={{ marginTop: "4rem", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>VERIFICATION ID: {userOrg.id.split('-')[1].toUpperCase()}-CERT-2026</p>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
      
      {/* Proposal Modal */}
      <AnimatePresence>
         {isProposing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ width: "100%", maxWidth: "700px", background: "white", borderRadius: "24px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                  <div style={{ padding: "2.5rem 3rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
                     <div>
                        <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Activity Proposal</p>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b" }}>Propose a New Activity</h2>
                     </div>
                     <button onClick={() => setIsProposing(false)} style={{ background: "white", border: "1px solid #e2e8f0", color: "#64748b", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
                  </div>

                  {isSuccess ? (
                     <div style={{ textAlign: "center", padding: "6rem 3rem" }}>
                        <div style={{ width: "80px", height: "80px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                           <CheckCircle2 size={40} color="#10b981" />
                        </div>
                        <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", marginBottom: "1rem" }}>Proposal Submitted!</h3>
                        <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "500" }}>Your activity has been queued for Adviser and OSAS review.</p>
                     </div>
                  ) : (
                     <form onSubmit={handlePropose} style={{ padding: "3rem", display: "grid", gap: "1.5rem" }}>
                        <div>
                           <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Activity Title</label>
                           <input required placeholder="e.g. Annual General Assembly" value={actTitle} onChange={e => setActTitle(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                        </div>
                        <div>
                           <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Project Description & Objectives</label>
                           <textarea required placeholder="Describe the purpose and goals of this activity..." value={actDesc} onChange={e => setActDesc(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", minHeight: "150px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b", resize: "vertical" }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Target Date</label>
                              <input required type="date" value={actDate} onChange={e => setActDate(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Project Budget (₱)</label>
                              <input required placeholder="e.g. 5000" value={actBudget} onChange={e => setActBudget(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Target Venue</label>
                              <input required placeholder="e.g. University Gym" value={actVenue} onChange={e => setActVenue(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Expected Participants</label>
                              <input required placeholder="e.g. 150 members" value={actParticipants} onChange={e => setActParticipants(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                           </div>
                        </div>
                        <button type="submit" style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", borderRadius: "12px", border: "none", fontSize: "1rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>
                           <FileSignature size={18} /> Submit Proposal
                        </button>
                     </form>
                  )}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
        onConfirm={confirmConfig.onConfirm}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type as any}
      />
    </div>
  );
}
