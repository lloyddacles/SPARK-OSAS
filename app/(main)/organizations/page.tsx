"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Building2, 
  Plus, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ShieldCheck, 
  ArrowRight, 
  Calendar, 
  FileText, 
  Users, 
  TrendingUp,
  FileSignature,
  History,
  AlertTriangle,
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
  ArrowLeft,
  Settings
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
      renewalDate: new Date().toISOString()
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
    <div style={{ width: "100%" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Life</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "var(--text-main)" }}>
            <span style={{ color: "var(--primary)" }}>Organizations</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Manage student clubs, propose activities, and track approvals.</p>
        </div>
        <div style={{ display: "flex", gap: "1px", background: "var(--border-dim)", padding: "1px" }}>
          <button onClick={() => setActiveTab("Student")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.65rem", fontWeight: "900", background: activeTab === "Student" ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", color: activeTab === "Student" ? "var(--primary)" : "var(--text-dim)", border: "none", borderBottom: activeTab === "Student" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>
            My Organization
          </button>
          {isAdviser && (
            <button onClick={() => setActiveTab("Adviser")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.65rem", fontWeight: "900", background: activeTab === "Adviser" ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", color: activeTab === "Adviser" ? "var(--primary)" : "var(--text-dim)", border: "none", borderBottom: activeTab === "Adviser" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>
              Adviser View
            </button>
          )}
          {isOSAS && (
            <button onClick={() => setActiveTab("OSAS")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.65rem", fontWeight: "900", background: activeTab === "OSAS" ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", color: activeTab === "OSAS" ? "var(--primary)" : "var(--text-dim)", border: "none", borderBottom: activeTab === "OSAS" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>
              OSAS Review
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Student" && (
          <motion.div key="student" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
             <ProcessGuide 
                title="How Activity Proposals Work"
                steps={[
                   { title: "View Your Org", desc: "Access your organization's page to see activities and propose new ones.", icon: <Building2 size={14} /> },
                   { title: "Submit a Proposal", desc: "Fill in the activity details — title, date, budget, and venue.", icon: <FileText size={14} /> },
                   { title: "Adviser Review", desc: "Your faculty adviser reviews and endorses the proposal.", icon: <ShieldCheck size={14} /> },
                   { title: "OSAS Approval", desc: "OSAS gives the final approval for your activity to proceed.", icon: <CheckCircle2 size={14} /> }
                ]}
             />
             {!userOrg ? (
               <div className="sapphire-card" style={{ padding: "4rem", textAlign: "center" }}>
                  <Building2 size={48} style={{ margin: "0 auto 2rem", opacity: 0.1 }} />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: "900" }}>No organization found</h3>
                  <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", marginTop: "1rem" }}>You are not registered as a president of any recognized organization.</p>
               </div>
             ) : (
               <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2.5rem" }}>
                  <div style={{ display: "grid", gap: "2.5rem" }}>
                     {/* Org Hero */}
                     <div className="sapphire-card" style={{ padding: "3rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                           {userOrg.logo ? (
                              <div style={{ width: "80px", height: "80px", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                                 <img src={userOrg.logo} alt={userOrg.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </div>
                           ) : (
                              <div style={{ width: "80px", height: "80px", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                 <Building2 size={32} color="var(--primary)" />
                              </div>
                           )}
                           <div>
                              <h2 style={{ fontSize: "1.5rem", fontWeight: "900" }}>{userOrg.name.toUpperCase()}</h2>
                              <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>{userOrg.acronym} | {userOrg.category} Organization</p>
                           </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                           <span style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.4rem 1rem", background: "rgba(16, 185, 129, 0.05)", border: "1px solid #10b981", color: "#10b981", letterSpacing: "0.1em" }}>RECOGNIZED</span>
                           <p style={{ fontSize: "0.6rem", color: "var(--text-dim)", marginTop: "0.75rem", fontWeight: "700" }}>RENEWAL: {userOrg.renewalDate}</p>
                        </div>
                     </div>

                     {/* Activity Timeline */}
                     <div className="sapphire-card">
                        <div style={{ padding: "2rem", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <h3 style={{ fontSize: "0.85rem", fontWeight: "900" }}>Activity History</h3>
                           <button onClick={() => setIsProposing(true)} className="btn-cyan" style={{ padding: "0.5rem 1.25rem", fontSize: "0.65rem" }}>
                              <Plus size={14} /> New Activity
                           </button>
                        </div>
                        <div style={{ padding: "1rem" }}>
                           {activities.filter(a => a.orgId === userOrg.id).length === 0 ? (
                             <p style={{ padding: "3rem", textAlign: "center", fontSize: "0.7rem", color: "var(--text-dim)" }}>No activities recorded in the registry.</p>
                           ) : (
                             <div style={{ display: "grid", gap: "1px", background: "var(--border-dim)" }}>
                               {activities.filter(a => a.orgId === userOrg.id).map(act => (
                                 <div key={act.id} style={{ background: "var(--bg-surface)", padding: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                       <div style={{ color: act.status === "Approved" ? "#10b981" : act.status === "Completed" ? "var(--primary)" : "#f59e0b" }}>
                                          {act.status === "Approved" ? <CheckCircle2 size={18} /> : act.status === "Completed" ? <TrendingUp size={18} /> : <Clock size={18} />}
                                       </div>
                                       <div>
                                          <p style={{ fontSize: "0.8rem", fontWeight: "900" }}>{act.title}</p>
                                          <p style={{ fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "700" }}>DATE: {act.date}</p>
                                       </div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                       <p style={{ fontSize: "0.55rem", fontWeight: "900", color: act.status === "Approved" ? "#10b981" : "#f59e0b" }}>{act.status.toUpperCase()}</p>
                                       {act.osasComments && (
                                          <p style={{ fontSize: "0.55rem", color: "#ef4444", marginTop: "0.25rem", fontWeight: "700" }}>REMARKS: {act.osasComments}</p>
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
                     <div className="sapphire-card" style={{ padding: "2rem" }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                           <Award size={18} color="var(--primary)" /> Recognition
                        </h3>
                        <div style={{ display: "grid", gap: "1.5rem" }}>
                           <div style={{ padding: "1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", borderRadius: "4px" }}>
                              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.5rem" }}>Status</p>
                              <p style={{ fontSize: "0.85rem", fontWeight: "900" }}>Recognized Student Org</p>
                              <button onClick={() => setViewingCert(true)} style={{ marginTop: "1.5rem", width: "100%", padding: "0.75rem", background: "none", border: "1px solid var(--primary)", color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>View Certificate</button>
                           </div>
                        </div>
                     </div>

                     <div className="sapphire-card" style={{ padding: "2rem" }}>
                        <h3 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                           <Activity size={18} color="var(--primary)" /> Activity Stats
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                           <div style={{ textAlign: "center", padding: "1.5rem", background: "var(--bg-accent)" }}>
                              <p style={{ fontSize: "1.25rem", fontWeight: "900" }}>{activities.filter(a => a.orgId === userOrg.id && a.status === "Approved").length}</p>
                              <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>APPROVED</p>
                           </div>
                           <div style={{ textAlign: "center", padding: "1.5rem", background: "var(--bg-accent)" }}>
                              <p style={{ fontSize: "1.25rem", fontWeight: "900" }}>{activities.filter(a => a.orgId === userOrg.id && a.status === "Pending OSAS Approval").length}</p>
                              <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>PENDING</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
             )}
          </motion.div>
        )}

        {activeTab === "OSAS" && (
          <motion.div key="osas" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
             <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", borderBottom: "1px solid var(--border-dim)" }}>
                <button onClick={() => setOsasSubTab("Activities")} style={{ padding: "1rem 2rem", fontSize: "0.7rem", fontWeight: "900", background: "none", border: "none", color: osasSubTab === "Activities" ? "var(--primary)" : "var(--text-dim)", borderBottom: osasSubTab === "Activities" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>ACTIVITY REVIEW</button>
                <button onClick={() => setOsasSubTab("Manage")} style={{ padding: "1rem 2rem", fontSize: "0.7rem", fontWeight: "900", background: "none", border: "none", color: osasSubTab === "Manage" ? "var(--primary)" : "var(--text-dim)", borderBottom: osasSubTab === "Manage" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>ALL ORGANIZATIONS</button>
             </div>

             <ProcessGuide 
                title="OSAS Organization Protocol"
                steps={[
                   { title: "Monitor Queue", desc: "Review pending activity proposals and RSO registration requests in real-time.", icon: <History size={14} /> },
                   { title: "Audit Details", desc: "Verify budget alignment, venue availability, and faculty adviser endorsements.", icon: <Search size={14} /> },
                   { title: "Execute Verdict", desc: "Approve, request revision, or reject proposals with detailed executive remarks.", icon: <FileSignature size={14} /> },
                   { title: "Registry Management", desc: "Maintain the official University RSO Directory and status definitions.", icon: <Database size={14} /> }
                ]}
             />

             <AnimatePresence mode="wait">
               {osasSubTab === "Activities" ? (
                 <motion.div key="acts" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 450px", gap: "2.5rem" }}>
                       <div className="sapphire-card">
                          <div style={{ padding: "2rem", borderBottom: "1px solid var(--border-dim)" }}>
                             <h3 style={{ fontSize: "0.85rem", fontWeight: "900" }}>PENDING PROPOSALS</h3>
                          </div>
                          <div style={{ padding: "1rem" }}>
                             {activities.filter(a => a.status === "Pending OSAS Approval").length === 0 ? (
                               <p style={{ padding: "4rem", textAlign: "center", fontSize: "0.7rem", color: "var(--text-dim)" }}>No proposals awaiting OSAS review.</p>
                             ) : (
                               <div style={{ display: "grid", gap: "1rem" }}>
                                  {activities.filter(a => a.status === "Pending OSAS Approval").map(act => {
                                    const org = organizations.find(o => o.id === act.orgId);
                                    return (
                                      <div key={act.id} onClick={() => setSelectedActId(act.id)} className={`sapphire-card ${selectedActId === act.id ? "active" : ""}`} style={{ cursor: "pointer", background: selectedActId === act.id ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", border: selectedActId === act.id ? "1px solid var(--primary)" : "1px solid var(--border-dim)" }}>
                                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                            <div>
                                               <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", marginBottom: "0.25rem" }}>{org?.acronym || "UNKNOWN"}</p>
                                               <p style={{ fontSize: "0.85rem", fontWeight: "900" }}>{act.title}</p>
                                            </div>
                                            <ArrowRight size={14} color="var(--text-dim)" />
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
                            <div className="sapphire-card" style={{ padding: "2.5rem", position: "sticky", top: "2rem" }}>
                               <div style={{ marginBottom: "2.5rem" }}>
                                  <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em", marginBottom: "0.5rem" }}>Proposal Details</p>
                                  <h3 style={{ fontSize: "1.25rem", fontWeight: "900" }}>{selectedAct.title}</h3>
                                  <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: "700", marginTop: "0.5rem" }}>Submitted by {proposingOrg?.name}</p>
                               </div>

                               <div style={{ display: "grid", gap: "1.5rem", marginBottom: "3rem" }}>
                                  <div style={{ padding: "1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                                     <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "1rem" }}>PROJECT DESCRIPTION</p>
                                     <p style={{ fontSize: "0.75rem", lineHeight: "1.8", color: "var(--text-main)", fontWeight: "700" }}>{selectedAct.description}</p>
                                  </div>

                                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                                     <div style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                                        <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>DATE</p>
                                        <p style={{ fontSize: "0.8rem", fontWeight: "900" }}>{selectedAct.date}</p>
                                     </div>
                                     <div style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                                        <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>BUDGET</p>
                                        <p style={{ fontSize: "0.8rem", fontWeight: "900" }}>₱{selectedAct.budget}</p>
                                     </div>
                                  </div>
                               </div>

                               <div style={{ marginBottom: "2.5rem" }}>
                                  <label style={{ display: "block", marginBottom: "1rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>Your feedback</label>
                                  <textarea 
                                     id="osas-remarks"
                                     placeholder="ENTER FEEDBACK FOR THE ORGANIZATION..."
                                     style={{ width: "100%", padding: "1rem", fontSize: "0.75rem", fontWeight: "700", minHeight: "100px" }}
                                  />
                               </div>

                               <div style={{ display: "grid", gap: "0.75rem" }}>
                                  <button onClick={() => { 
                                    const remarks = (document.getElementById("osas-remarks") as HTMLTextAreaElement).value;
                                    setConfirmConfig({
                                      isOpen: true,
                                      title: "Approve Activity",
                                      message: "Are you sure you want to approve this activity proposal? A notification will be sent to the organization.",
                                      type: "success",
                                      onConfirm: () => {
                                        if (selectedActId) updateActivityStatus(selectedActId, { status: "Approved", comments: remarks }); 
                                        setSelectedActId(null); 
                                      }
                                    });
                                  }} className="btn-cyan" style={{ width: "100%", padding: "1rem" }}>APPROVE ACTIVITY</button>
                                  
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
                                  }} style={{ width: "100%", padding: "1rem", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>REQUEST REVISION</button>
                                  
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
                                  }} style={{ width: "100%", padding: "1rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid #ef4444", color: "#ef4444", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>REJECT PROPOSAL</button>
                               </div>
                            </div>
                          ) : (
                            <div className="sapphire-card" style={{ textAlign: "center", padding: "4rem", color: "var(--text-dim)" }}>
                               <FileSignature size={40} style={{ margin: "0 auto 1.5rem", opacity: 0.1 }} />
                               <p style={{ fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.1em" }}>SELECT PROPOSAL TO REVIEW</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div key="manage" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", gap: "2rem" }}>
                       <div style={{ position: "relative", flex: 1 }}>
                          <Search size={18} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                          <input 
                            placeholder="Search organizations by name or acronym..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "1rem 1rem 1rem 3.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.75rem", fontWeight: "900" }} 
                          />
                       </div>
                       <button onClick={() => { setIsAddingOrg(true); resetOrgForm(); }} className="btn-cyan" style={{ padding: "1rem 2rem", whiteSpace: "nowrap" }}>
                          <Plus size={16} /> Add Organization
                       </button>
                    </div>

                    {/* ADD/EDIT FORM */}
                    {(isAddingOrg || editingOrgId) && (
                       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="sapphire-card" style={{ padding: "3rem", marginBottom: "3rem", border: "1px solid var(--primary)" }}>
                         <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
                            <h3 style={{ fontSize: "1rem", fontWeight: "900" }}>{editingOrgId ? "Edit Organization" : "Add New Organization"}</h3>
                            <button onClick={() => { setIsAddingOrg(false); setEditingOrgId(null); }} style={{ color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                         </div>
                         <form onSubmit={editingOrgId ? (e) => { e.preventDefault(); handleSaveEdit(); } : handleAddOrg} style={{ display: "grid", gap: "2.5rem" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
                               <input required placeholder="Organization name..." value={orgName} onChange={e => setOrgName(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                               <input required placeholder="ACRONYM..." value={orgAcronym} onChange={e => setOrgAcronym(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                               <select value={orgCategory} onChange={e => setOrgCategory(e.target.value as any)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}>
                                  <option value="Academic">Academic</option>
                                  <option value="Council">Council</option>
                                  <option value="Religious">Religious</option>
                                  <option value="Special Interest">Special Interest</option>
                               </select>
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "2rem" }}>
                               <input required placeholder="PRESIDENT NAME..." value={orgPresident} onChange={e => setOrgPresident(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                               <input required placeholder="FACULTY ADVISER..." value={orgAdviser} onChange={e => setOrgAdviser(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                               <div style={{ position: "relative" }}>
                                  <Layers size={16} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--primary)" }} />
                                  <input placeholder="LOGO URL (OPTIONAL)..." value={orgLogo} onChange={e => setOrgLogo(e.target.value)} style={{ width: "100%", padding: "1rem 1rem 1rem 3rem", fontSize: "0.8rem", fontWeight: "700" }} />
                               </div>
                            </div>
                            <button type="submit" className="btn-cyan" style={{ width: "100%", padding: "1.25rem" }}>
                               <Save size={18} /> {editingOrgId ? "Save Changes" : "Add Organization"}
                            </button>
                         </form>
                       </motion.div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "2rem" }}>
                       {(isAdviser ? filteredOrgs.filter(o => o.adviser === currentUser?.name) : filteredOrgs).map(org => (
                         <div key={org.id} onClick={() => setViewingOrg(org)} className="sapphire-card" style={{ opacity: org.status === "Archived" ? 0.5 : 1, cursor: "pointer", position: "relative", overflow: "hidden" }}>
                            {org.logo && (
                               <div style={{ position: "absolute", top: "-10px", right: "-10px", width: "80px", height: "80px", opacity: 0.05 }}>
                                  <img src={org.logo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                               </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1.5rem", position: "relative", zIndex: 1 }}>
                               <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                                  {org.logo ? (
                                     <div style={{ width: "45px", height: "45px", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px" }}>
                                        <img src={org.logo} alt={org.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                                     </div>
                                  ) : (
                                     <div style={{ width: "45px", height: "45px", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <Building2 size={20} color="var(--primary)" />
                                     </div>
                                  )}
                                  <div>
                                     <h4 style={{ fontWeight: "900", fontSize: "1.1rem", color: "var(--text-main)" }}>{org.acronym}</h4>
                                     <p style={{ fontSize: "0.55rem", color: "var(--text-dim)", fontWeight: "900", letterSpacing: "0.1em" }}>{org.category.toUpperCase()} UNIT</p>
                                  </div>
                               </div>
                               <div style={{ display: "flex", gap: "0.5rem" }} onClick={e => e.stopPropagation()}>
                                  <button onClick={() => startEdit(org)} style={{ padding: "0.5rem", background: "var(--bg-accent)", color: "var(--primary)", border: "1px solid var(--border-dim)", cursor: "pointer" }}><Edit2 size={14} /></button>
                                  <button onClick={() => updateOrganization(org.id, { status: org.status === "Archived" ? "Recognized" : "Archived" })} style={{ padding: "0.5rem", background: "var(--bg-accent)", color: "#3b82f6", border: "1px solid var(--border-dim)", cursor: "pointer" }}><Archive size={14} /></button>
                                  <button 
                                     onClick={() => setConfirmConfig({
                                       isOpen: true,
                                       title: "Delete Organization",
                                       message: `Are you sure you want to permanently delete the ${org.name}? This will remove all associated activities.`,
                                       type: "danger",
                                       onConfirm: () => deleteOrganization(org.id)
                                     })} 
                                     style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.05)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", cursor: "pointer" }}
                                  >
                                     <Trash2 size={14} />
                                  </button>
                               </div>
                            </div>
                            <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "0.5rem" }}>{org.name.toUpperCase()}</p>
                            <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", marginBottom: "0.25rem" }}>PRESIDENT: {org.president.toUpperCase()}</p>
                            <p style={{ fontSize: "0.6rem", color: "var(--primary)", fontWeight: "900", marginBottom: "1.5rem" }}>ADVISER: {org.adviser.toUpperCase()}</p>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                               <span style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.25rem 0.6rem", background: org.status === "Recognized" ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)", border: org.status === "Recognized" ? "1px solid #10b981" : "1px solid #ef4444", color: org.status === "Recognized" ? "#10b981" : "#ef4444", letterSpacing: "0.05em" }}>
                                  {org.status.toUpperCase()}
                               </span>
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
          <motion.div key="adviser" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
             <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2.5rem" }}>
                {adviserOrgs.map(org => (
                  <div key={org.id} className="sapphire-card">
                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                        <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                           {org.logo ? (
                              <div style={{ width: "40px", height: "40px", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center", padding: "5px" }}>
                                 <img src={org.logo} alt={org.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                              </div>
                           ) : (
                              <div style={{ width: "40px", height: "40px", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                 <Building2 size={18} color="var(--primary)" />
                              </div>
                           )}
                           <h3 style={{ fontSize: "1rem", fontWeight: "900" }}>{org.acronym}</h3>
                        </div>
                        <Settings size={16} color="var(--text-dim)" />
                     </div>
                     <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "var(--text-main)", marginBottom: "1.5rem" }}>{org.name.toUpperCase()}</p>
                     
                     <div style={{ display: "grid", gap: "1px", background: "var(--border-dim)" }}>
                        <div style={{ background: "var(--bg-surface)", padding: "1rem", display: "flex", justifyContent: "space-between" }}>
                           <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>PENDING ACTIONS</span>
                           <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "#f59e0b" }}>{activities.filter(a => a.orgId === org.id && a.status === "Pending Adviser Review").length}</span>
                        </div>
                        <div style={{ background: "var(--bg-surface)", padding: "1rem", display: "flex", justifyContent: "space-between" }}>
                           <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>ACTIVE ACTIVITIES</span>
                           <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "#10b981" }}>{activities.filter(a => a.orgId === org.id && a.status === "Approved").length}</span>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: "100%", maxWidth: "800px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", overflow: "hidden" }}>
                  <div style={{ padding: "3rem", background: "var(--bg-accent)", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                     <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                        {viewingOrg.logo ? (
                           <div style={{ width: "100px", height: "100px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px" }}>
                              <img src={viewingOrg.logo} alt={viewingOrg.acronym} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                           </div>
                        ) : (
                           <div style={{ width: "100px", height: "100px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Building2 size={48} color="var(--primary)" />
                           </div>
                        )}
                        <div>
                           <h2 style={{ fontSize: "1.75rem", fontWeight: "900" }}>{viewingOrg.name.toUpperCase()}</h2>
                           <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.3em" }}>{viewingOrg.acronym} | {viewingOrg.category.toUpperCase()} UNIT</p>
                        </div>
                     </div>
                     <button onClick={() => setViewingOrg(null)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><X size={24} /></button>
                  </div>
                  <div style={{ padding: "3rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                     <div>
                        <h4 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "1.5rem", color: "var(--text-dim)" }}>Leadership</h4>
                        <div style={{ display: "grid", gap: "1rem" }}>
                           <div style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                              <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>PRESIDENT</p>
                              <p style={{ fontSize: "0.85rem", fontWeight: "900" }}>{viewingOrg.president.toUpperCase()}</p>
                           </div>
                           <div style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                              <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>FACULTY ADVISER</p>
                              <p style={{ fontSize: "0.85rem", fontWeight: "900" }}>{viewingOrg.adviser.toUpperCase()}</p>
                           </div>
                        </div>
                     </div>
                     <div>
                        <h4 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "1.5rem", color: "var(--text-dim)" }}>Recent Activities</h4>
                        <div style={{ display: "grid", gap: "0.5rem" }}>
                           {activities.filter(a => a.orgId === viewingOrg.id).slice(0, 4).map(act => (
                              <div key={act.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", borderBottom: "1px solid var(--border-dim)" }}>
                                 <p style={{ fontSize: "0.7rem", fontWeight: "700" }}>{act.title}</p>
                                 <span style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--primary)" }}>{act.status.toUpperCase()}</span>
                              </div>
                           ))}
                           {activities.filter(a => a.orgId === viewingOrg.id).length === 0 && (
                              <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontStyle: "italic" }}>No recorded activity in the current ledger.</p>
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ width: "100%", maxWidth: "800px", background: "white", padding: "4rem", color: "#1a1a1a", position: "relative", boxShadow: "0 0 100px rgba(0, 229, 255, 0.2)" }}>
                  <button onClick={() => setViewingCert(false)} style={{ position: "absolute", top: "2rem", right: "2rem", background: "none", border: "none", color: "#888", cursor: "pointer" }}><X size={24} /></button>
                  
                  <div style={{ border: "2px solid #1a1a1a", padding: "2rem", textAlign: "center" }}>
                     <Building2 size={48} color="var(--primary)" style={{ margin: "0 auto 2rem" }} />
                     <p style={{ fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.3em", marginBottom: "1rem" }}>OFFICE OF THE STUDENT AFFAIRS & SERVICES</p>
                     <h2 style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "3rem", fontFamily: "serif" }}>CERTIFICATE OF RECOGNITION</h2>
                     
                     <p style={{ fontSize: "0.9rem", lineHeight: "1.8", marginBottom: "3rem" }}>
                        This is to certify that <br />
                        <span style={{ fontSize: "1.5rem", fontWeight: "900", borderBottom: "2px solid #1a1a1a", padding: "0 2rem" }}>{userOrg.name.toUpperCase()}</span> <br />
                        is a duly recognized <strong>{userOrg.category.toUpperCase()} ORGANIZATION</strong> <br />
                        of the University for the Academic Year 2026-2027.
                     </p>

                     <div style={{ display: "flex", justifyContent: "space-between", marginTop: "4rem" }}>
                        <div style={{ textAlign: "center" }}>
                           <p style={{ fontWeight: "900", borderTop: "1px solid #1a1a1a", paddingTop: "0.5rem", marginTop: "2rem", fontSize: "0.75rem" }}>OSAS COORDINATOR</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                           <p style={{ fontWeight: "900", borderTop: "1px solid #1a1a1a", paddingTop: "0.5rem", marginTop: "2rem", fontSize: "0.75rem" }}>UNIVERSITY PRESIDENT</p>
                        </div>
                     </div>
                     
                     <p style={{ marginTop: "3rem", fontSize: "0.6rem", color: "#888" }}>VERIFICATION ID: {userOrg.id.split('-')[1].toUpperCase()}-CERT-2026</p>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
      
      {/* Proposal Modal */}
      <AnimatePresence>
         {isProposing && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
               <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="sapphire-card" style={{ width: "100%", maxWidth: "800px", padding: "4rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3.5rem" }}>
                     <div>
                        <p style={{ fontSize: "0.65rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.3em", marginBottom: "0.5rem" }}>ACTIVITY PROPOSAL</p>
                        <h2 style={{ fontSize: "1.5rem", fontWeight: "900" }}>Propose a New Activity</h2>
                     </div>
                     <button onClick={() => setIsProposing(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><X size={24} /></button>
                  </div>

                  {isSuccess ? (
                     <div style={{ textAlign: "center", padding: "4rem" }}>
                        <CheckCircle2 size={64} color="#10b981" style={{ margin: "0 auto 2rem" }} />
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "900" }}>Proposal Submitted!</h3>
                        <p style={{ color: "var(--text-dim)", marginTop: "1rem", fontSize: "0.8rem" }}>Your activity has been sent for Adviser and OSAS review.</p>
                     </div>
                  ) : (
                     <form onSubmit={handlePropose} style={{ display: "grid", gap: "2rem" }}>
                        <input required placeholder="ACTIVITY TITLE..." value={actTitle} onChange={e => setActTitle(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.85rem", fontWeight: "900" }} />
                        <textarea required placeholder="PROJECT DESCRIPTION & OBJECTIVES..." value={actDesc} onChange={e => setActDesc(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.85rem", fontWeight: "700", minHeight: "150px" }} />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                           <input required type="date" value={actDate} onChange={e => setActDate(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem" }} />
                           <input required placeholder="PROJECT BUDGET (₱)..." value={actBudget} onChange={e => setActBudget(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem" }} />
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                           <input required placeholder="TARGET VENUE..." value={actVenue} onChange={e => setActVenue(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem" }} />
                           <input required placeholder="EXPECTED PARTICIPANTS..." value={actParticipants} onChange={e => setActParticipants(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem" }} />
                        </div>
                        <button type="submit" className="btn-cyan" style={{ width: "100%", padding: "1.5rem", marginTop: "1rem" }}>Submit Proposal</button>
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
