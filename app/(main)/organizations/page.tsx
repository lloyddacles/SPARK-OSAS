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
  AlertTriangle,
  ChevronRight,
  Info,
  MapPin,
  Banknote,
  FilePlus,
  Send
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
      
      {/* ── Page Header ── */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Life & Governance</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            Organi<span style={{ color: "#3b82f6" }}>zations</span>
          </h1>
          <p style={{ marginTop: "0.75rem", fontSize: "1rem", color: "#64748b", maxWidth: "600px", lineHeight: "1.6" }}>
            Manage recognized student organizations, review activity proposals, and monitor institutional engagement.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", background: "#f8fafc", padding: "0.5rem", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
          <button onClick={() => setActiveTab("Student")} style={{ padding: "0.85rem 1.75rem", fontSize: "0.85rem", fontWeight: "800", background: activeTab === "Student" ? "white" : "transparent", color: activeTab === "Student" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "12px", boxShadow: activeTab === "Student" ? "0 4px 6px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
            My Organization
          </button>
          {isAdviser && (
            <button onClick={() => setActiveTab("Adviser")} style={{ padding: "0.85rem 1.75rem", fontSize: "0.85rem", fontWeight: "800", background: activeTab === "Adviser" ? "white" : "transparent", color: activeTab === "Adviser" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "12px", boxShadow: activeTab === "Adviser" ? "0 4px 6px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
              Adviser Console
            </button>
          )}
          {isOSAS && (
            <button onClick={() => setActiveTab("OSAS")} style={{ padding: "0.85rem 1.75rem", fontSize: "0.85rem", fontWeight: "800", background: activeTab === "OSAS" ? "white" : "transparent", color: activeTab === "OSAS" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "12px", boxShadow: activeTab === "OSAS" ? "0 4px 6px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
              OSAS Review
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Student" && (
          <motion.div key="student" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <ProcessGuide 
                title="RSO Activity Endorsement Workflow"
                steps={[
                   { title: "Governance Hub", desc: "Access your RSO profile to monitor status and member engagements.", icon: <Building2 size={16} /> },
                   { title: "Draft Proposal", desc: "Construct an activity plan including budget, venue, and target outcomes.", icon: <FileText size={16} /> },
                   { title: "Advisory Review", desc: "Your faculty adviser must endorse the proposal for institutional review.", icon: <ShieldCheck size={16} /> },
                   { title: "Executive Approval", desc: "OSAS provides final authorization for the activity to proceed.", icon: <CheckCircle2 size={16} /> }
                ]}
             />
             {!userOrg ? (
                <div style={{ padding: "8rem 2rem", textAlign: "center", background: "white", borderRadius: "24px", border: "1px dashed #e2e8f0" }}>
                   <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", border: "1px solid #f1f5f9" }}>
                      <Building2 size={40} color="#94a3b8" />
                   </div>
                   <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b" }}>No Organization Affiliation</h3>
                   <p style={{ color: "#64748b", fontSize: "1rem", marginTop: "1rem", fontWeight: "500", maxWidth: "450px", margin: "1rem auto" }}>You are not registered as a president of any recognized student organization. Contact OSAS to register your unit.</p>
                </div>
             ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2.5rem" }}>
                   <div style={{ display: "grid", gap: "2.5rem" }}>
                      {/* Org Hero */}
                      <div style={{ background: "white", padding: "3rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                         <div style={{ display: "flex", gap: "2.5rem", alignItems: "center" }}>
                            {userOrg.logo ? (
                               <div style={{ width: "100px", height: "100px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", boxShadow: "0 4px 6px rgba(0,0,0,0.04)" }}>
                                  <img src={userOrg.logo} alt={userOrg.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                               </div>
                            ) : (
                               <div style={{ width: "100px", height: "100px", background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.1)" }}>
                                  <Building2 size={42} color="#3b82f6" />
                               </div>
                            )}
                            <div>
                               <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{userOrg.category} Division</p>
                               <h2 style={{ fontSize: "2rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.25rem", letterSpacing: "-0.02em" }}>{userOrg.name}</h2>
                               <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#64748b" }}>{userOrg.acronym}</p>
                            </div>
                         </div>
                         <div style={{ textAlign: "right" }}>
                            <span style={{ fontSize: "0.8rem", fontWeight: "900", padding: "0.6rem 1.5rem", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#16a34a", borderRadius: "20px", letterSpacing: "0.05em" }}>
                               RECOGNIZED
                            </span>
                            <p style={{ fontSize: "0.8rem", color: "#94a3b8", marginTop: "1.25rem", fontWeight: "700" }}>Cycle: {userOrg.renewalDate}</p>
                         </div>
                      </div>

                      {/* Activity Timeline */}
                      <div style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                         <div style={{ padding: "2rem 2.5rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
                            <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                               <History size={20} color="#3b82f6" /> Activity Governance Log
                            </h3>
                            <button onClick={() => setIsProposing(true)} style={{ padding: "0.85rem 1.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                               <Plus size={18} /> Propose Activity
                            </button>
                         </div>
                         <div style={{ padding: "0" }}>
                            {activities.filter(a => a.orgId === userOrg.id).length === 0 ? (
                              <div style={{ padding: "6rem 2rem", textAlign: "center" }}>
                                 <FileText size={48} color="#cbd5e1" style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                                 <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "600" }}>No institutional activities recorded for this cycle.</p>
                              </div>
                            ) : (
                              <div style={{ display: "flex", flexDirection: "column" }}>
                                {activities.filter(a => a.orgId === userOrg.id).map((act, index) => (
                                  <motion.div 
                                    key={act.id} 
                                    initial={{ opacity: 0 }} 
                                    animate={{ opacity: 1 }}
                                    style={{ padding: "2rem 2.5rem", borderBottom: index !== activities.filter(a => a.orgId === userOrg.id).length - 1 ? "1px solid #f1f5f9" : "none", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.2s" }} 
                                    className="hover:bg-slate-50"
                                  >
                                     <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                                        <div style={{ width: "48px", height: "48px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", background: act.status === "Approved" ? "#f0fdf4" : act.status === "Completed" ? "#eff6ff" : "#fffbeb", color: act.status === "Approved" ? "#10b981" : act.status === "Completed" ? "#3b82f6" : "#f59e0b", border: `1px solid ${act.status === "Approved" ? "#dcfce7" : act.status === "Completed" ? "#dbeafe" : "#fef3c7"}` }}>
                                           {act.status === "Approved" ? <CheckCircle2 size={22} /> : act.status === "Completed" ? <TrendingUp size={22} /> : <Clock size={22} />}
                                        </div>
                                        <div>
                                           <p style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.5rem" }}>{act.title}</p>
                                           <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                              <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                 <Calendar size={14} color="#94a3b8" /> {act.date}
                                              </p>
                                              <p style={{ fontSize: "0.8rem", color: "#64748b", fontWeight: "700", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                 <MapPin size={14} color="#94a3b8" /> {act.venue}
                                              </p>
                                           </div>
                                        </div>
                                     </div>
                                     <div style={{ textAlign: "right" }}>
                                        <span style={{ fontSize: "0.75rem", fontWeight: "900", color: act.status === "Approved" ? "#10b981" : act.status === "Completed" ? "#3b82f6" : "#f59e0b", padding: "0.4rem 1rem", background: act.status === "Approved" ? "#f0fdf4" : act.status === "Completed" ? "#eff6ff" : "#fffbeb", borderRadius: "20px", border: `1px solid ${act.status === "Approved" ? "#dcfce7" : act.status === "Completed" ? "#dbeafe" : "#fef3c7"}` }}>
                                           {act.status.toUpperCase()}
                                        </span>
                                        {act.osasComments && (
                                           <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem", justifyContent: "flex-end" }}>
                                              <Info size={14} color="#ef4444" />
                                              <p style={{ fontSize: "0.75rem", color: "#ef4444", fontWeight: "700" }}>OSAS Remarks: {act.osasComments}</p>
                                           </div>
                                        )}
                                     </div>
                                  </motion.div>
                                ))}
                              </div>
                            )}
                         </div>
                      </div>
                   </div>

                   <div style={{ display: "grid", gap: "2.5rem", alignContent: "start" }}>
                      {/* Recognition Card */}
                      <div style={{ background: "white", padding: "2.5rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                         <h3 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                            <Award size={22} color="#3b82f6" /> Institutional Status
                         </h3>
                         <div style={{ padding: "2rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "20px", textAlign: "center" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "white", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.05)" }}>
                               <ShieldCheck size={36} color="#10b981" />
                            </div>
                            <p style={{ fontSize: "0.75rem", fontWeight: "900", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Governance State</p>
                            <p style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>Recognized Student Org</p>
                            <button onClick={() => setViewingCert(true)} style={{ marginTop: "2rem", width: "100%", padding: "1rem", background: "white", border: "1px solid #3b82f6", color: "#3b82f6", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }} className="hover:bg-blue-50">
                               <FileText size={18} /> View Certificate
                            </button>
                         </div>
                      </div>

                      {/* Performance Telemetry */}
                      <div style={{ background: "white", padding: "2.5rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                         <h3 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                            <Activity size={22} color="#3b82f6" /> Engagement Metrics
                         </h3>
                         <div style={{ display: "grid", gap: "1rem" }}>
                            <div style={{ padding: "1.5rem", background: "#f0fdf4", borderRadius: "16px", border: "1px solid #dcfce7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                               <div>
                                  <p style={{ fontSize: "2rem", fontWeight: "900", color: "#166534", lineHeight: 1 }}>{activities.filter(a => a.orgId === userOrg.id && a.status === "Approved").length}</p>
                                  <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#15803d", marginTop: "0.5rem", letterSpacing: "0.05em" }}>APPROVED</p>
                               </div>
                               <CheckCircle2 size={32} color="#10b981" style={{ opacity: 0.2 }} />
                            </div>
                            <div style={{ padding: "1.5rem", background: "#fffbeb", borderRadius: "16px", border: "1px solid #fef3c7", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                               <div>
                                  <p style={{ fontSize: "2rem", fontWeight: "900", color: "#92400e", lineHeight: 1 }}>{activities.filter(a => a.orgId === userOrg.id && a.status.includes("Pending")).length}</p>
                                  <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#b45309", marginTop: "0.5rem", letterSpacing: "0.05em" }}>IN REVIEW</p>
                               </div>
                               <Clock size={32} color="#f59e0b" style={{ opacity: 0.2 }} />
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
             <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", borderBottom: "1px solid #f1f5f9" }}>
                <button onClick={() => setOsasSubTab("Activities")} style={{ padding: "1.25rem 2rem", fontSize: "0.95rem", fontWeight: "800", background: "none", border: "none", color: osasSubTab === "Activities" ? "#3b82f6" : "#64748b", borderBottom: osasSubTab === "Activities" ? "3px solid #3b82f6" : "3px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>Endorsement Queue</button>
                <button onClick={() => setOsasSubTab("Manage")} style={{ padding: "1.25rem 2rem", fontSize: "0.95rem", fontWeight: "800", background: "none", border: "none", color: osasSubTab === "Manage" ? "#3b82f6" : "#64748b", borderBottom: osasSubTab === "Manage" ? "3px solid #3b82f6" : "3px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>Institutional Registry</button>
             </div>

             <ProcessGuide 
                title="OSAS Governance Protocol"
                steps={[
                   { title: "Review Queue", desc: "Monitor incoming activity proposals and registration requests from RSOs.", icon: <History size={16} /> },
                   { title: "Verification", desc: "Audit budget allocations, venue logistics, and adviser endorsements.", icon: <Search size={16} /> },
                   { title: "Governance", desc: "Authorize, request revision, or decline proposals based on policy.", icon: <FileSignature size={16} /> },
                   { title: "Audit Registry", desc: "Maintain the centralized University RSO Database and status logs.", icon: <Database size={16} /> }
                ]}
             />

             <AnimatePresence mode="wait">
               {osasSubTab === "Activities" ? (
                 <motion.div key="acts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 500px", gap: "2.5rem", alignItems: "start" }}>
                       <div style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                          <div style={{ padding: "2rem 2.5rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                             <h3 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <Clock size={20} color="#3b82f6" /> Pending Activity Pipeline
                             </h3>
                          </div>
                          <div style={{ padding: "0" }}>
                             {activities.filter(a => a.status === "Pending OSAS Approval").length === 0 ? (
                               <div style={{ padding: "6rem 2rem", textAlign: "center" }}>
                                  <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f0fdf4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", border: "1px solid #dcfce7" }}>
                                     <CheckCircle2 size={32} color="#10b981" />
                                  </div>
                                  <p style={{ fontSize: "1rem", color: "#64748b", fontWeight: "700" }}>Registry pipeline is currently clear.</p>
                               </div>
                             ) : (
                               <div style={{ display: "flex", flexDirection: "column" }}>
                                  {activities.filter(a => a.status === "Pending OSAS Approval").map((act, index) => {
                                    const org = organizations.find(o => o.id === act.orgId);
                                    const isSelected = selectedActId === act.id;
                                    return (
                                      <motion.div 
                                        key={act.id} 
                                        onClick={() => setSelectedActId(act.id)} 
                                        style={{ padding: "2rem 2.5rem", borderBottom: index !== activities.filter(a => a.status === "Pending OSAS Approval").length - 1 ? "1px solid #f1f5f9" : "none", background: isSelected ? "#eff6ff" : "white", cursor: "pointer", transition: "all 0.2s" }}
                                      >
                                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                               <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: isSelected ? "white" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", color: "#3b82f6", fontSize: "0.8rem", border: isSelected ? "1px solid #dbeafe" : "none" }}>
                                                  {org?.acronym?.charAt(0) || "?"}
                                               </div>
                                               <div>
                                                  <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{org?.acronym || "UNITS"}</p>
                                                  <p style={{ fontSize: "1.05rem", fontWeight: "900", color: "#1e293b" }}>{act.title}</p>
                                               </div>
                                            </div>
                                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: isSelected ? "#3b82f6" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: isSelected ? "white" : "#94a3b8" }}>
                                               <ArrowRight size={18} />
                                            </div>
                                         </div>
                                      </motion.div>
                                    );
                                  })}
                               </div>
                             )}
                          </div>
                       </div>

                       <div style={{ position: "sticky", top: "2rem" }}>
                          {selectedAct ? (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: "white", padding: "3rem", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)" }}>
                               <div style={{ marginBottom: "3rem" }}>
                                  <div style={{ display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
                                     <span style={{ fontSize: "0.7rem", fontWeight: "900", color: "#3b82f6", padding: "0.3rem 0.8rem", background: "#eff6ff", borderRadius: "6px", border: "1px solid #dbeafe", textTransform: "uppercase" }}>Proposal Audit</span>
                                     <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700" }}>ID: {selectedAct.id.slice(-8).toUpperCase()}</span>
                                  </div>
                                  <h3 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", lineHeight: "1.2", letterSpacing: "-0.02em" }}>{selectedAct.title}</h3>
                                  <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "700", marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                     <Building2 size={16} /> {proposingOrg?.name}
                                  </p>
                               </div>

                               <div style={{ display: "grid", gap: "1.5rem", marginBottom: "3rem" }}>
                                  <div style={{ padding: "2rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px" }}>
                                     <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Executive Narrative</p>
                                     <p style={{ fontSize: "1rem", lineHeight: "1.8", color: "#334155", fontWeight: "500" }}>{selectedAct.description}</p>
                                  </div>

                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                     <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", display: "flex", gap: "1rem", alignItems: "center" }}>
                                        <Calendar size={20} color="#3b82f6" />
                                        <div>
                                           <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Schedule</p>
                                           <p style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>{selectedAct.date}</p>
                                        </div>
                                     </div>
                                     <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", display: "flex", gap: "1rem", alignItems: "center" }}>
                                        <Banknote size={20} color="#10b981" />
                                        <div>
                                           <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Budget</p>
                                           <p style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>₱{Number(selectedAct.budget).toLocaleString()}</p>
                                        </div>
                                     </div>
                                  </div>
                                  
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                     <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", display: "flex", gap: "1rem", alignItems: "center" }}>
                                        <MapPin size={20} color="#f43f5e" />
                                        <div>
                                           <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Venue</p>
                                           <p style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>{selectedAct.venue}</p>
                                        </div>
                                     </div>
                                     <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", display: "flex", gap: "1rem", alignItems: "center" }}>
                                        <Users size={20} color="#8b5cf6" />
                                        <div>
                                           <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase" }}>Impact</p>
                                           <p style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b" }}>{selectedAct.participants} Pax</p>
                                        </div>
                                     </div>
                                  </div>
                               </div>

                               <div style={{ marginBottom: "3rem" }}>
                                  <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.9rem", fontWeight: "800", color: "#1e293b" }}>Institutional Remarks</label>
                                  <textarea 
                                     id="osas-remarks"
                                     placeholder="Enter official OSAS feedback or requirements for the organization..."
                                     style={{ width: "100%", padding: "1.5rem", fontSize: "1rem", fontWeight: "500", minHeight: "140px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", color: "#1e293b", resize: "none", lineHeight: "1.6" }}
                                  />
                               </div>

                               <div style={{ display: "grid", gap: "1rem" }}>
                                  <button onClick={() => { 
                                    const remarks = (document.getElementById("osas-remarks") as HTMLTextAreaElement).value;
                                    setConfirmConfig({
                                      isOpen: true,
                                      title: "Approve Activity Proposal",
                                      message: "This will grant final institutional authorization for the activity. Continue?",
                                      type: "success",
                                      onConfirm: () => {
                                        if (selectedActId) updateActivityStatus(selectedActId, { status: "Approved", comments: remarks }); 
                                        setSelectedActId(null); 
                                      }
                                    });
                                  }} style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "900", border: "none", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                                     <CheckCircle2 size={20} /> Authorize Activity
                                  </button>
                                  
                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                     <button onClick={() => { 
                                       const remarks = (document.getElementById("osas-remarks") as HTMLTextAreaElement).value;
                                       setConfirmConfig({
                                         isOpen: true,
                                         title: "Request Revision",
                                         message: "The proposal will be returned to the RSO for adjustments. Proceed?",
                                         type: "warning",
                                         onConfirm: () => {
                                           if (selectedActId) updateActivityStatus(selectedActId, { status: "Revision Requested", comments: remarks }); 
                                           setSelectedActId(null); 
                                         }
                                       });
                                     }} style={{ padding: "1rem", background: "white", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                                        <Edit2 size={16} /> Request Changes
                                     </button>
                                     
                                     <button onClick={() => { 
                                       const remarks = (document.getElementById("osas-remarks") as HTMLTextAreaElement).value;
                                       setConfirmConfig({
                                         isOpen: true,
                                         title: "Reject Proposal",
                                         message: "CRITICAL: This will permanently decline the activity proposal. Are you sure?",
                                         type: "danger",
                                         onConfirm: () => {
                                           if (selectedActId) updateActivityStatus(selectedActId, { status: "Rejected", comments: remarks }); 
                                           setSelectedActId(null); 
                                         }
                                       });
                                     }} style={{ padding: "1rem", background: "#fef2f2", border: "1px solid #fee2e2", color: "#ef4444", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                                        <Trash2 size={16} /> Decline
                                     </button>
                                  </div>
                               </div>
                            </motion.div>
                          ) : (
                            <div style={{ background: "white", padding: "6rem 2rem", borderRadius: "24px", border: "1px dashed #e2e8f0", textAlign: "center", color: "#94a3b8" }}>
                               <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", border: "1px solid #f1f5f9" }}>
                                  <FileSignature size={32} color="#cbd5e1" />
                               </div>
                               <h4 style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.5rem" }}>Review Panel</h4>
                               <p style={{ fontSize: "0.9rem", fontWeight: "600", maxWidth: "250px", margin: "0 auto" }}>Select a proposal from the queue to initiate institutional audit.</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div key="manage" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", gap: "2rem", flexWrap: "wrap" }}>
                       <div style={{ position: "relative", flex: 1, minWidth: "300px" }}>
                          <Search size={20} style={{ position: "absolute", left: "1.5rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                          <input 
                            placeholder="Query RSO Registry by name, acronym, or category..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "1.25rem 1.25rem 1.25rem 4rem", background: "white", border: "1px solid #f1f5f9", borderRadius: "16px", color: "#1e293b", fontSize: "1rem", fontWeight: "600", outline: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }} 
                          />
                       </div>
                       <button onClick={() => { setIsAddingOrg(true); resetOrgForm(); }} style={{ padding: "1.25rem 2.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "16px", fontSize: "1rem", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)", whiteSpace: "nowrap" }}>
                          <Plus size={20} /> Register RSO
                       </button>
                    </div>

                    {/* ADD/EDIT FORM */}
                    <AnimatePresence>
                      {(isAddingOrg || editingOrgId) && (
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} style={{ background: "white", padding: "3rem", borderRadius: "24px", border: "1px solid #dbeafe", marginBottom: "3rem", boxShadow: "0 20px 25px -5px rgba(59, 130, 246, 0.05)", overflow: "hidden" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                             <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                                   <Building2 size={24} />
                                </div>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b" }}>
                                   {editingOrgId ? "Modify RSO Registry" : "Provision New Organization"}
                                </h3>
                             </div>
                             <button onClick={() => { setIsAddingOrg(false); setEditingOrgId(null); }} style={{ color: "#94a3b8", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "10px", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
                          </div>
                          <form onSubmit={editingOrgId ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleAddOrg} style={{ display: "grid", gap: "2.5rem" }}>
                             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                                <div>
                                   <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Institutional Name</label>
                                   <input required placeholder="e.g. Computer Science & Information Technology Society" value={orgName} onChange={e => setOrgName(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                                </div>
                                <div>
                                   <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Acronym / Alias</label>
                                   <input required placeholder="e.g. CSITS" value={orgAcronym} onChange={e => setOrgAcronym(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                                </div>
                                <div>
                                   <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Unit Category</label>
                                   <select value={orgCategory} onChange={e => setOrgCategory(e.target.value as any)} style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "800", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b", cursor: "pointer" }}>
                                      <option value="Academic">Academic</option>
                                      <option value="Council">Council</option>
                                      <option value="Religious">Religious</option>
                                      <option value="Special Interest">Special Interest</option>
                                   </select>
                                </div>
                             </div>
                             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
                                <div>
                                   <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Incumbent President</label>
                                   <input required placeholder="Full name of registered president" value={orgPresident} onChange={e => setOrgPresident(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                                </div>
                                <div>
                                   <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Designated Faculty Adviser</label>
                                   <input required placeholder="Full name of endorsing faculty" value={orgAdviser} onChange={e => setOrgAdviser(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                                </div>
                                <div>
                                   <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Identity Logo (URL)</label>
                                   <input placeholder="https://cloud.storage.edu/org-logo.png" value={orgLogo} onChange={e => setOrgLogo(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "12px", outline: "none", color: "#1e293b" }} />
                                </div>
                             </div>
                             <button type="submit" style={{ width: "100%", padding: "1.5rem", background: "#3b82f6", color: "white", borderRadius: "16px", border: "none", fontSize: "1.1rem", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", cursor: "pointer", boxShadow: "0 10px 15px -3px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>
                                <Save size={20} /> {editingOrgId ? "Update RSO Registry" : "Authorize New Organization"}
                             </button>
                          </form>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))", gap: "2rem" }}>
                       {(isAdviser ? filteredOrgs.filter(o => o.adviser === currentUser?.name) : filteredOrgs).map((org, i) => (
                         <motion.div 
                           key={org.id} 
                           initial={{ opacity: 0, y: 20 }}
                           animate={{ opacity: 1, y: 0 }}
                           transition={{ delay: i * 0.05 }}
                           onClick={() => setViewingOrg(org)} 
                           style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", padding: "2.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", opacity: org.status === "Archived" ? 0.6 : 1, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.3s" }} 
                           className="hover:shadow-xl hover:-translate-y-2 group"
                         >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem" }}>
                               <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                  {org.logo ? (
                                     <div style={{ width: "64px", height: "64px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                                        <img src={org.logo} alt={org.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                     </div>
                                  ) : (
                                     <div style={{ width: "64px", height: "64px", background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Building2 size={28} color="#3b82f6" />
                                     </div>
                                  )}
                                  <div>
                                     <h4 style={{ fontWeight: "900", fontSize: "1.25rem", color: "#1e293b", letterSpacing: "-0.01em" }}>{org.acronym}</h4>
                                     <p style={{ fontSize: "0.75rem", color: "#3b82f6", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.05em" }}>{org.category} Unit</p>
                                  </div>
                               </div>
                               <div style={{ display: "flex", gap: "0.5rem" }} onClick={e => e.stopPropagation()}>
                                  <button onClick={() => startEdit(org)} style={{ width: "36px", height: "36px", borderRadius: "10px", background: "white", color: "#94a3b8", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} className="hover:text-blue-600 hover:border-blue-200"><Edit2 size={16} /></button>
                                  <button onClick={() => updateOrganization(org.id, { status: org.status === "Archived" ? "Recognized" : "Archived" })} style={{ width: "36px", height: "36px", borderRadius: "10px", background: "white", color: "#94a3b8", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }} className="hover:text-amber-600 hover:border-amber-200"><Archive size={16} /></button>
                                  <button 
                                     onClick={() => setConfirmConfig({
                                       isOpen: true,
                                       title: "Deregister Organization",
                                       message: `CRITICAL: This will permanently remove ${org.name} from the University Registry. All data will be lost.`,
                                       type: "danger",
                                       onConfirm: () => deleteOrganization(org.id)
                                     })} 
                                     style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#fff1f2", color: "#ef4444", border: "1px solid #fee2e2", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}
                                     className="hover:bg-red-500 hover:text-white"
                                  >
                                     <Trash2 size={16} />
                                  </button>
                               </div>
                            </div>
                            <p style={{ fontSize: "1.05rem", fontWeight: "900", color: "#1e293b", marginBottom: "1.5rem", lineHeight: "1.4" }}>{org.name}</p>
                            
                            <div style={{ display: "grid", gap: "0.75rem", marginBottom: "2rem" }}>
                               <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                                  <Users size={16} color="#94a3b8" /> President: <span style={{ color: "#334155", fontWeight: "800" }}>{org.president}</span>
                               </div>
                               <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>
                                  <ShieldCheck size={16} color="#94a3b8" /> Adviser: <span style={{ color: "#334155", fontWeight: "800" }}>{org.adviser}</span>
                               </div>
                            </div>

                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto", paddingTop: "2rem", borderTop: "1px solid #f8fafc" }}>
                               <span style={{ fontSize: "0.75rem", fontWeight: "900", padding: "0.5rem 1.25rem", borderRadius: "20px", background: org.status === "Recognized" ? "#f0fdf4" : "#fef2f2", color: org.status === "Recognized" ? "#16a34a" : "#ef4444", border: `1px solid ${org.status === "Recognized" ? "#dcfce7" : "#fee2e2"}` }}>
                                  {org.status.toUpperCase()}
                               </span>
                               <span style={{ fontSize: "0.75rem", color: "#cbd5e1", fontWeight: "800", letterSpacing: "0.05em" }}>UID: {org.id.split('-')[0].toUpperCase()}</span>
                            </div>
                         </motion.div>
                       ))}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        )}

        {activeTab === "Adviser" && (
          <motion.div key="adviser" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))", gap: "2.5rem" }}>
                {adviserOrgs.map(org => (
                  <motion.div key={org.id} whileHover={{ y: -4 }} style={{ background: "white", borderRadius: "24px", border: "1px solid #f1f5f9", padding: "3rem", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                           {org.logo ? (
                              <div style={{ width: "56px", height: "56px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", padding: "8px" }}>
                                 <img src={org.logo} alt={org.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </div>
                           ) : (
                              <div style={{ width: "56px", height: "56px", background: "#eff6ff", border: "1px solid #dbeafe", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                 <Building2 size={28} color="#3b82f6" />
                              </div>
                           )}
                           <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.01em" }}>{org.acronym}</h3>
                        </div>
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #f1f5f9" }}>
                           <Settings size={20} color="#94a3b8" />
                        </div>
                     </div>
                     <p style={{ fontSize: "1.1rem", fontWeight: "800", color: "#475569", marginBottom: "2.5rem", lineHeight: "1.5" }}>{org.name}</p>
                     
                     <div style={{ display: "grid", gap: "1.25rem" }}>
                        <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f1f5f9" }}>
                           <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <Clock size={18} color="#f59e0b" />
                              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#64748b" }}>Pending Endorsements</span>
                           </div>
                           <span style={{ fontSize: "1.25rem", fontWeight: "900", color: "#92400e", background: "#fef3c7", padding: "0.3rem 1rem", borderRadius: "20px", border: "1px solid #fde68a" }}>{activities.filter(a => a.orgId === org.id && a.status === "Pending Adviser Review").length}</span>
                        </div>
                        <div style={{ background: "#f8fafc", padding: "1.5rem", borderRadius: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f1f5f9" }}>
                           <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                              <CheckCircle2 size={18} color="#10b981" />
                              <span style={{ fontSize: "0.95rem", fontWeight: "800", color: "#64748b" }}>Active Program Cycle</span>
                           </div>
                           <span style={{ fontSize: "1.25rem", fontWeight: "900", color: "#166534", background: "#f0fdf4", padding: "0.3rem 1rem", borderRadius: "20px", border: "1px solid #dcfce7" }}>{activities.filter(a => a.orgId === org.id && a.status === "Approved").length}</span>
                        </div>
                     </div>

                     <button onClick={() => setViewingOrg(org)} style={{ marginTop: "2rem", width: "100%", padding: "1rem", background: "white", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }} className="hover:bg-slate-50">
                        Institutional Review <ChevronRight size={18} />
                     </button>
                  </motion.div>
                ))}
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
         {viewingOrg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ width: "100%", maxWidth: "900px", background: "white", borderRadius: "32px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.3)" }}>
                  <div style={{ padding: "4rem", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
                        {viewingOrg.logo ? (
                           <div style={{ width: "120px", height: "120px", background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", padding: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
                              <img src={viewingOrg.logo} alt={viewingOrg.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                           </div>
                        ) : (
                           <div style={{ width: "120px", height: "120px", background: "white", border: "1px solid #f1f5f9", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" }}>
                              <Building2 size={48} color="#3b82f6" />
                           </div>
                        )}
                        <div>
                           <p style={{ fontSize: "0.9rem", fontWeight: "900", color: "#3b82f6", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.75rem" }}>{viewingOrg.acronym} Registry Record</p>
                           <h2 style={{ fontSize: "2.25rem", fontWeight: "900", color: "#1e293b", lineHeight: "1.1", letterSpacing: "-0.03em" }}>{viewingOrg.name}</h2>
                           <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                              <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", background: "white", padding: "0.4rem 1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>{viewingOrg.category} Unit</span>
                              <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#10b981", background: "white", padding: "0.4rem 1rem", borderRadius: "8px", border: "1px solid #dcfce7" }}>Recognized Cycle 2026</span>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => setViewingOrg(null)} style={{ background: "white", border: "1px solid #e2e8f0", color: "#94a3b8", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={24} /></button>
                  </div>
                  <div style={{ padding: "4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem" }}>
                     <div>
                        <h4 style={{ fontSize: "1rem", fontWeight: "900", marginBottom: "2rem", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}><Users size={20} color="#3b82f6" /> Governance Structure</h4>
                        <div style={{ display: "grid", gap: "1.5rem" }}>
                           <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px" }}>
                              <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase" }}>Executive President</p>
                              <p style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>{viewingOrg.president}</p>
                           </div>
                           <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px" }}>
                              <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#94a3b8", marginBottom: "0.5rem", textTransform: "uppercase" }}>Faculty Endorsement</p>
                              <p style={{ fontSize: "1.1rem", fontWeight: "900", color: "#1e293b" }}>{viewingOrg.adviser}</p>
                           </div>
                        </div>
                     </div>
                     <div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                           <h4 style={{ fontSize: "1rem", fontWeight: "900", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}><History size={20} color="#3b82f6" /> Institutional Engagement</h4>
                           <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6" }}>View All</span>
                        </div>
                        <div style={{ display: "grid", gap: "1rem" }}>
                           {activities.filter(a => a.orgId === viewingOrg.id).slice(0, 5).map(act => (
                              <div key={act.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px" }}>
                                 <div>
                                    <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>{act.title}</p>
                                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", marginTop: "0.25rem" }}>{act.date}</p>
                                 </div>
                                 <span style={{ fontSize: "0.7rem", fontWeight: "900", padding: "0.4rem 1rem", borderRadius: "20px", background: act.status === "Approved" ? "#f0fdf4" : act.status === "Completed" ? "#eff6ff" : "#fffbeb", color: act.status === "Approved" ? "#16a34a" : act.status === "Completed" ? "#3b82f6" : "#f59e0b", border: `1px solid ${act.status === "Approved" ? "#dcfce7" : act.status === "Completed" ? "#dbeafe" : "#fef3c7"}` }}>
                                    {act.status.toUpperCase()}
                                 </span>
                              </div>
                           ))}
                           {activities.filter(a => a.orgId === viewingOrg.id).length === 0 && (
                              <div style={{ padding: "4rem 2rem", textAlign: "center", background: "#f8fafc", border: "1px dashed #e2e8f0", borderRadius: "20px" }}>
                                 <FileSignature size={36} color="#cbd5e1" style={{ margin: "0 auto 1.5rem", opacity: 0.5 }} />
                                 <p style={{ fontSize: "0.9rem", color: "#94a3b8", fontWeight: "700" }}>No activity logs found for this registry entry.</p>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", backdropFilter: "blur(12px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.95, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }} style={{ width: "100%", maxWidth: "900px", background: "white", padding: "0", color: "#0f172a", position: "relative", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)", borderRadius: "12px" }}>
                  <button onClick={() => setViewingCert(false)} style={{ position: "absolute", top: "2rem", right: "2rem", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#94a3b8", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 10 }}><X size={24} /></button>
                  
                  <div style={{ padding: "10px", background: "linear-gradient(135deg, #3b82f6, #06b6d4)", borderRadius: "12px" }}>
                    <div style={{ border: "2px solid #e2e8f0", outline: "4px solid #ffffff", outlineOffset: "-15px", padding: "6rem 4rem", textAlign: "center", background: "#ffffff", borderRadius: "8px" }}>
                       <Building2 size={64} color="#3b82f6" style={{ margin: "0 auto 3rem" }} />
                       <p style={{ fontSize: "1rem", fontWeight: "900", letterSpacing: "0.3em", marginBottom: "1.5rem", color: "#64748b" }}>OFFICE OF THE STUDENT AFFAIRS & SERVICES</p>
                       <h2 style={{ fontSize: "3rem", fontWeight: "900", marginBottom: "4rem", fontFamily: "Playfair Display, serif", color: "#0f172a", letterSpacing: "0.02em" }}>CERTIFICATE OF RECOGNITION</h2>
                       
                       <p style={{ fontSize: "1.25rem", lineHeight: "2.2", marginBottom: "5rem", color: "#334155", fontWeight: "500" }}>
                          This document serves as institutional validation that <br />
                          <span style={{ fontSize: "2.25rem", fontWeight: "900", borderBottom: "3px solid #3b82f6", padding: "0 3rem", color: "#0f172a", display: "inline-block", marginTop: "1rem", marginBottom: "1rem", letterSpacing: "-0.01em" }}>{userOrg.name}</span> <br />
                          is a duly recognized and accredited <strong>{userOrg.category.toUpperCase()} ORGANIZATION</strong> <br />
                          of the University for the Academic Cycle 2026-2027.
                       </p>

                       <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6rem", padding: "0 4rem" }}>
                          <div style={{ textAlign: "center", width: "300px" }}>
                             <div style={{ width: "100%", height: "1px", background: "#0f172a", marginBottom: "1rem" }} />
                             <p style={{ fontWeight: "900", fontSize: "0.9rem", color: "#0f172a", letterSpacing: "0.1em" }}>OSAS DIRECTOR</p>
                             <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", marginTop: "0.25rem" }}>Validation Authority</p>
                          </div>
                          <div style={{ textAlign: "center", width: "300px" }}>
                             <div style={{ width: "100%", height: "1px", background: "#0f172a", marginBottom: "1rem" }} />
                             <p style={{ fontWeight: "900", fontSize: "0.9rem", color: "#0f172a", letterSpacing: "0.1em" }}>UNIVERSITY PRESIDENT</p>
                             <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700", marginTop: "0.25rem" }}>Executive Approval</p>
                          </div>
                       </div>
                       
                       <div style={{ marginTop: "6rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "2rem" }}>
                          <div style={{ padding: "1rem 2rem", border: "1px solid #f1f5f9", borderRadius: "12px", background: "#f8fafc" }}>
                             <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "800", textTransform: "uppercase", letterSpacing: "0.1em" }}>Registry Audit ID</p>
                             <p style={{ fontSize: "1rem", color: "#334155", fontWeight: "900", fontFamily: "monospace" }}>OSAS-RSO-{userOrg.id.split('-')[0].toUpperCase()}-2026</p>
                          </div>
                          <ShieldCheck size={48} color="#d1d5db" />
                       </div>
                    </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
      
      {/* Proposal Modal */}
      <AnimatePresence>
         {isProposing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ width: "100%", maxWidth: "800px", background: "white", borderRadius: "32px", overflow: "hidden", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                  <div style={{ padding: "3rem 4rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f8fafc" }}>
                     <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                        <div style={{ width: "56px", height: "56px", borderRadius: "16px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6" }}>
                           <FilePlus size={28} />
                        </div>
                        <div>
                           <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.25rem" }}>Institutional Portal</p>
                           <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.02em" }}>Propose RSO Activity</h2>
                        </div>
                     </div>
                     <button onClick={() => setIsProposing(false)} style={{ background: "white", border: "1px solid #e2e8f0", color: "#94a3b8", width: "48px", height: "48px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={24} /></button>
                  </div>

                  {isSuccess ? (
                     <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} style={{ textAlign: "center", padding: "8rem 4rem" }}>
                        <div style={{ width: "100px", height: "100px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 3rem", border: "1px solid #dcfce7" }}>
                           <CheckCircle2 size={48} color="#10b981" />
                        </div>
                        <h3 style={{ fontSize: "2rem", fontWeight: "900", color: "#1e293b", marginBottom: "1rem", letterSpacing: "-0.03em" }}>Proposal Transmitted</h3>
                        <p style={{ color: "#64748b", fontSize: "1.1rem", fontWeight: "600", maxWidth: "450px", margin: "0 auto", lineHeight: "1.6" }}>Your activity plan has been queued for Adviser review and OSAS institutional audit. Monitor the governance log for status updates.</p>
                     </motion.div>
                  ) : (
                     <form onSubmit={handlePropose} style={{ padding: "4rem", display: "grid", gap: "2.5rem" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                           <div style={{ gridColumn: "span 2" }}>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Executive Activity Title</label>
                              <input required placeholder="e.g. Strategic Planning & Annual General Assembly" value={actTitle} onChange={e => setActTitle(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1.05rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div style={{ gridColumn: "span 2" }}>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Project Rationale & Strategic Objectives</label>
                              <textarea required placeholder="Outline the core objectives, target outcomes, and institutional impact of this activity..." value={actDesc} onChange={e => setActDesc(e.target.value)} style={{ width: "100%", padding: "1.5rem", fontSize: "1.05rem", fontWeight: "600", minHeight: "160px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", color: "#1e293b", resize: "none", lineHeight: "1.6" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Proposed Execution Date</label>
                              <input required type="date" value={actDate} onChange={e => setActDate(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1.05rem", fontWeight: "800", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Allocated Budget (₱)</label>
                              <div style={{ position: "relative" }}>
                                 <span style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", fontWeight: "900", color: "#94a3b8" }}>₱</span>
                                 <input required placeholder="0.00" value={actBudget} onChange={e => setActBudget(e.target.value)} style={{ width: "100%", padding: "1.25rem 1.25rem 1.25rem 2.5rem", fontSize: "1.05rem", fontWeight: "900", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", color: "#1e293b" }} />
                              </div>
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Designated Venue</label>
                              <input required placeholder="e.g. University Multi-Purpose Hall" value={actVenue} onChange={e => setActVenue(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1.05rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", color: "#1e293b" }} />
                           </div>
                           <div>
                              <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "800", color: "#334155" }}>Target Participants (Pax)</label>
                              <input required type="number" placeholder="e.g. 150" value={actParticipants} onChange={e => setActParticipants(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "1.05rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "16px", outline: "none", color: "#1e293b" }} />
                           </div>
                        </div>
                        <button type="submit" style={{ width: "100%", padding: "1.5rem", background: "#3b82f6", color: "white", borderRadius: "16px", border: "none", fontSize: "1.1rem", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem", cursor: "pointer", boxShadow: "0 10px 20px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>
                           <Send size={20} /> Transmit Proposal
                        </button>
                     </form>
                  )}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Confirmation Utility */}
      {confirmConfig.isOpen && (
        <ConfirmModal 
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          type={confirmConfig.type}
          onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
          onConfirm={() => {
            confirmConfig.onConfirm();
            setConfirmConfig({ ...confirmConfig, isOpen: false });
          }}
        />
      )}
    </div>
  );
}
