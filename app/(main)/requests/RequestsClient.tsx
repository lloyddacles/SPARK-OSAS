"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  UploadCloud, 
  Settings, 
  HelpCircle, 
  Search,
  PackageCheck,
  FileSearch,
  CheckSquare,
  Activity,
  Layers,
  X,
  Edit2,
  Trash2,
  Save,
  Database,
  Printer,
  UserCheck,
  Download,
  FileUp,
  Award
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import ConfirmModal from "@/components/ConfirmModal";
import ProcessGuide from "@/components/ProcessGuide";

export default function RequestsClient() {
  const { 
    requests: serviceRequests, 
    addRequest, 
    updateRequestStatus, 
    serviceTypes, 
    addServiceType, 
    updateServiceType,
    deleteServiceType,
    goodMoralConfig,
    updateGoodMoralConfig,
    issuedCertificates,
    issueCertificate,
    currentUser 
  } = useGlobalState();

  const [activeTab, setActiveTab] = useState<"Student" | "OSAS">("Student");
  const [osasSubTab, setOsasSubTab] = useState<"Queue" | "Definitions" | "Protocol">("Queue");
  
  // Student Form State
  const [isApplying, setIsApplying] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [formRequirements, setFormRequirements] = useState<{ [key: string]: boolean }>({});
  const [isSuccess, setIsSuccess] = useState(false);

  // OSAS State
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isAddingType, setIsAddingType] = useState(false);
  const [editingTypeId, setEditingTypeId] = useState<string | null>(null);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeDesc, setNewTypeDesc] = useState("");
  const [newTypeDocs, setNewTypeDocs] = useState("");

  // Good Moral Protocol States
  const [gmContent, setGmContent] = useState(goodMoralConfig?.content || "");
  const [signatories, setSignatories] = useState(goodMoralConfig?.signatories || []);
  const [newSignName, setNewSignName] = useState("");
  const [newSignPos, setNewSignPos] = useState("");

  // Issuance State
  const [isIssuing, setIsIssuing] = useState(false);
  const [uploadingCert, setUploadingCert] = useState<string | null>(null);

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

  const isStudent = currentUser?.role === "STUDENT_APPLICANT" || currentUser?.role === "STUDENT_LEADER";
  const isStaff = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR" || currentUser?.role === "GUIDANCE_COUNSELOR";
  const isGuidance = currentUser?.role === "GUIDANCE_COUNSELOR" || currentUser?.role === "SYSTEM_ADMIN";

  const resetServiceForm = () => {
    setNewTypeName("");
    setNewTypeDesc("");
    setNewTypeDocs("");
    setIsAddingType(false);
    setEditingTypeId(null);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const service = (serviceTypes || []).find(s => s.id === selectedServiceId);
    if (!service) return;
    addRequest(service.name, currentUser?.name || "Anonymous Student", formRequirements);
    setIsSuccess(true);
  };

  const handleCreateServiceType = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTypeName || !newTypeDocs) return;
    addServiceType(newTypeName, newTypeDesc, newTypeDocs.split(",").map(d => d.trim()));
    resetServiceForm();
  };

  const handleSaveServiceEdit = () => {
    if (!editingTypeId) return;
    updateServiceType(editingTypeId, {
      name: newTypeName,
      description: newTypeDesc,
      requiredDocs: newTypeDocs.split(",").map(d => d.trim())
    });
    resetServiceForm();
  };

  const startServiceEdit = (type: any) => {
    setEditingTypeId(type.id);
    setNewTypeName(type.name);
    setNewTypeDesc(type.description);
    setNewTypeDocs(type.requiredDocs.join(", "));
    setIsAddingType(true);
  };

  const handleAddSignatory = () => {
    if (!newSignName || !newSignPos) return;
    const newSign = { id: Math.random().toString(36).substr(2, 9), name: newSignName, position: newSignPos };
    const updated = [...signatories, newSign];
    setSignatories(updated);
    setNewSignName("");
    setNewSignPos("");
    updateGoodMoralConfig({ content: gmContent, signatories: updated });
  };

  const handleRemoveSignatory = (id: string) => {
    const updated = signatories.filter(s => s.id !== id);
    setSignatories(updated);
    updateGoodMoralConfig({ content: gmContent, signatories: updated });
  };

  const handleIssueCertificate = () => {
    if (!selectedRequestId) return;
    const req = (serviceRequests || []).find(r => r.id === selectedRequestId);
    if (!req) return;
    
    // Simulate File Upload
    issueCertificate({
      requestId: req.id,
      studentId: req.studentName, // Mock
      signedUrl: "/signed-good-moral.pdf" // Mock
    });
    
    updateRequestStatus(selectedRequestId, "Completed");
    setIsIssuing(false);
    setSelectedRequestId(null);
  };

  const selectedService = (serviceTypes || []).find(s => s.id === selectedServiceId);
  const selectedRequest = (serviceRequests || []).find(r => r.id === selectedRequestId);
  const isGoodMoralReq = selectedRequest?.type.toLowerCase().includes("good moral");
  const issuedCert = (issuedCertificates || []).find(c => c.requestId === selectedRequestId);

  return (
    <div style={{ width: "100%" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>PIPELINE: SERVICE PROTOCOL</p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            INSTITUTIONAL <span style={{ color: "var(--primary)" }}>SERVICES</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "1px", background: "var(--border-dim)", padding: "1px" }}>
          <button onClick={() => setActiveTab("Student")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.65rem", fontWeight: "900", background: activeTab === "Student" ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", color: activeTab === "Student" ? "var(--primary)" : "var(--text-dim)", border: "none", borderBottom: activeTab === "Student" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>
            STUDENT PORTAL
          </button>
          {isStaff && (
            <button onClick={() => setActiveTab("OSAS")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.65rem", fontWeight: "900", background: activeTab === "OSAS" ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)", color: activeTab === "OSAS" ? "var(--primary)" : "var(--text-dim)", border: "none", borderBottom: activeTab === "OSAS" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>
              OSAS ADMIN
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Student" && (
          <motion.div key="student" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
            {!isApplying ? (
              <div>
                <ProcessGuide 
                  title="How to Request Institutional Services (e.g. Good Moral)"
                  steps={[
                    { title: "Initialize Protocol", desc: "Click the 'INITIALIZE PROTOCOL' button below to start a new request.", icon: <Plus size={14} color="var(--text-main)" /> },
                    { title: "Select Service Type", desc: "Choose the exact document or service you need from the OSAS dropdown menu.", icon: <FileText size={14} color="var(--text-main)" /> },
                    { title: "Fulfill Requirements", desc: "Ensure you have all the necessary clearances (e.g. Guidance, Cashier) checked off before submitting.", icon: <CheckCircle2 size={14} color="var(--text-main)" /> },
                    { title: "OSAS Processing & Download", desc: "Wait for the status to change to 'Completed'. Once signed, you can download your official certificate directly from the list below.", icon: <Download size={14} color="var(--text-main)" /> }
                  ]}
                  themeColor="var(--primary)"
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                  <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                    <Activity size={18} color="var(--primary)" /> RECENT IDENTITY REQUESTS
                  </h2>
                  <button onClick={() => { setIsApplying(true); setIsSuccess(false); }} className="btn-cyan" style={{ padding: "0.75rem 2rem" }}>
                    <Plus size={16} /> INITIALIZE PROTOCOL
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                  {(serviceRequests || []).filter(r => isStudent ? r.studentName === currentUser?.name : true).reverse().map((req) => {
                    const cert = (issuedCertificates || []).find(c => c.requestId === req.id);
                    return (
                      <div key={req.id} style={{ background: "var(--bg-surface)", padding: "1.5rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                          <div style={{ width: "40px", height: "40px", background: "var(--bg-accent)", borderRadius: "0px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", border: "1px solid var(--border-dim)" }}>
                            <FileText size={18} />
                          </div>
                          <div>
                            <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.25rem" }}>HEX: {req.id.toUpperCase()}</p>
                            <h3 style={{ fontSize: "0.9rem", fontWeight: "900", color: "var(--text-main)" }}>{req.type.toUpperCase()}</h3>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "4rem" }}>
                          {cert && (
                            <button className="btn-cyan" style={{ padding: "0.5rem 1rem", fontSize: "0.6rem" }}>
                              <Download size={14} /> DOWNLOAD CERTIFICATE
                            </button>
                          )}
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.25rem" }}>TIMESTAMP</p>
                            <p style={{ fontSize: "0.75rem", fontWeight: "800" }}>{req.date}</p>
                          </div>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "0.75rem",
                            color: req.status === "Completed" ? "#10b981" : req.status === "Ready for Pickup" ? "var(--primary)" : "#f59e0b",
                            fontSize: "0.65rem",
                            fontWeight: "900",
                            letterSpacing: "0.05em",
                            minWidth: "160px",
                            justifyContent: "flex-end"
                          }}>
                            {req.status === "Completed" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                            {req.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <button onClick={() => setIsApplying(false)} style={{ color: "var(--text-dim)", background: "none", border: "none", marginBottom: "2rem", fontWeight: "900", fontSize: "0.65rem", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer" }}>
                  <ArrowLeft size={14} /> RETURN TO LIST
                </button>

                {isSuccess ? (
                  <div className="sapphire-card" style={{ padding: "6rem", textAlign: "center" }}>
                    <CheckCircle2 size={64} color="#10b981" style={{ margin: "0 auto 2.5rem" }} />
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)" }}>PROTOCOL LOGGED</h2>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.75rem", fontWeight: "700", marginTop: "1.5rem", maxWidth: "600px", margin: "1.5rem auto 0", lineHeight: "1.8" }}>
                      REQUEST RECEIVED. YOU WILL BE NOTIFIED VIA THE INSTITUTIONAL NETWORK ONCE DISPATCH IS READY.
                    </p>
                  </div>
                ) : (
                  <div className="sapphire-card" style={{ maxWidth: "800px", margin: "0 auto", padding: "3rem" }}>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "900", marginBottom: "0.5rem" }}>INITIALIZE SERVICE REQUEST</h2>
                    <p style={{ color: "var(--text-dim)", fontSize: "0.7rem", fontWeight: "700", marginBottom: "3rem" }}>SELECT PROTOCOL TYPE AND VERIFY REQUIREMENTS.</p>
                    
                    <form onSubmit={handleApply}>
                      <div style={{ marginBottom: "2.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>SERVICE DEFINITION</label>
                        <select 
                          required 
                          value={selectedServiceId} 
                          onChange={e => {
                            setSelectedServiceId(e.target.value);
                            setFormRequirements({});
                          }}
                          style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}
                        >
                          <option value="">-- SELECT DEFINITION --</option>
                          {(serviceTypes || []).map(s => <option key={s.id} value={s.id}>{s.name.toUpperCase()}</option>)}
                        </select>
                      </div>

                      {selectedService && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                          <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "1.5rem", color: "var(--primary)" }}>COMPLIANCE CHECKLIST</h3>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "var(--border-dim)", marginBottom: "3rem" }}>
                            {selectedService.requiredDocs.map((doc) => (
                              <label key={doc} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "var(--bg-surface)", cursor: "pointer" }}>
                                <input 
                                  type="checkbox" 
                                  required
                                  checked={formRequirements[doc] || false} 
                                  onChange={(e) => setFormRequirements({ ...formRequirements, [doc]: e.target.checked })}
                                  style={{ width: "16px", height: "16px", accentColor: "var(--primary)" }}
                                />
                                <span style={{ fontWeight: "700", fontSize: "0.75rem" }}>{doc.toUpperCase()}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <button type="submit" className="btn-cyan" style={{ width: "100%", padding: "1.25rem" }}>
                        <UploadCloud size={18} /> EXECUTE SUBMISSION
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "OSAS" && (
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}>
            
            <div style={{ display: "flex", gap: "2rem", marginBottom: "3rem", borderBottom: "1px solid var(--border-dim)" }}>
               <button onClick={() => setOsasSubTab("Queue")} style={{ padding: "1rem 2rem", fontSize: "0.7rem", fontWeight: "900", background: "none", border: "none", color: osasSubTab === "Queue" ? "var(--primary)" : "var(--text-dim)", borderBottom: osasSubTab === "Queue" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>PROTOCOL QUEUE</button>
               {isGuidance && <button onClick={() => setOsasSubTab("Protocol")} style={{ padding: "1rem 2rem", fontSize: "0.7rem", fontWeight: "900", background: "none", border: "none", color: osasSubTab === "Protocol" ? "var(--primary)" : "var(--text-dim)", borderBottom: osasSubTab === "Protocol" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>GOOD MORAL PROTOCOL</button>}
               {!isGuidance && <button onClick={() => setOsasSubTab("Definitions")} style={{ padding: "1rem 2rem", fontSize: "0.7rem", fontWeight: "900", background: "none", border: "none", color: osasSubTab === "Definitions" ? "var(--primary)" : "var(--text-dim)", borderBottom: osasSubTab === "Definitions" ? "2px solid var(--primary)" : "2px solid transparent", cursor: "pointer" }}>SERVICE DEFINITIONS</button>}
            </div>

            <AnimatePresence mode="wait">
               {osasSubTab === "Queue" ? (
                 <motion.div key="queue" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "3rem", alignItems: "start" }}>
                       {/* QUEUE */}
                       <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
                             <Clock size={18} color="var(--primary)" />
                             <h2 style={{ fontSize: "0.85rem", fontWeight: "900" }}>ACTIVE PROTOCOL QUEUE</h2>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                             {(serviceRequests || []).filter(r => r.status !== "Completed").reverse().map(req => (
                               <div 
                                 key={req.id} 
                                 onClick={() => setSelectedRequestId(req.id)}
                                 style={{ 
                                   padding: "1.5rem 2rem", 
                                   background: selectedRequestId === req.id ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)",
                                   cursor: "pointer", 
                                   borderLeft: selectedRequestId === req.id ? "2px solid var(--primary)" : "2px solid transparent",
                                   transition: "all 0.2s"
                                 }}
                               >
                                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                                   <h4 style={{ fontWeight: "900", fontSize: "0.9rem" }}>{req.type.toUpperCase()}</h4>
                                   <span style={{ fontSize: "0.6rem", fontWeight: "900", padding: "0.2rem 0.5rem", background: "var(--bg-accent)", color: "var(--primary)", border: "1px solid var(--border-dim)" }}>
                                     {req.status.toUpperCase()}
                                   </span>
                                 </div>
                                 <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700" }}>STUDENT: {req.studentName.toUpperCase()} • {req.date}</p>
                               </div>
                             ))}
                             {(serviceRequests || []).filter(r => r.status !== "Completed").length === 0 && (
                               <p style={{ padding: "4rem", textAlign: "center", fontSize: "0.7rem", color: "var(--text-dim)", background: "var(--bg-surface)" }}>No pending requests in the queue.</p>
                             )}
                          </div>
                       </div>

                       {/* CONTROL PANEL */}
                       <div>
                          {selectedRequestId ? (
                            <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)", position: "sticky", top: "2rem" }}>
                               <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "1.5rem" }}>STATUS CONTROL</h3>
                               
                               {isGoodMoralReq && isGuidance && (
                                 <div style={{ marginBottom: "2rem", padding: "1.5rem", background: "rgba(0, 229, 255, 0.05)", border: "1px solid var(--primary)" }}>
                                    <p style={{ fontSize: "0.6rem", fontWeight: "900", marginBottom: "1rem", color: "var(--primary)" }}>GOOD MORAL WORKFLOW</p>
                                    <button onClick={() => {}} className="btn-cyan" style={{ width: "100%", padding: "0.75rem", fontSize: "0.6rem", marginBottom: "0.5rem" }}>
                                       <Download size={14} /> DOWNLOAD DRAFT
                                    </button>
                                    <button onClick={() => setIsIssuing(true)} className="btn-cyan" style={{ width: "100%", padding: "0.75rem", fontSize: "0.6rem", background: "var(--text-main)", color: "var(--bg-surface)" }}>
                                       <FileUp size={14} /> UPLOAD SIGNED PDF
                                    </button>
                                 </div>
                               )}

                               <div style={{ padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", marginBottom: "2rem" }}>
                                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)" }}>CURRENT PROTOCOL STATE</p>
                                 <p style={{ fontWeight: "900", color: "var(--primary)", fontSize: "0.8rem", marginTop: "0.4rem" }}>{((serviceRequests || []).find(r => r.id === selectedRequestId)?.status || "Unknown").toUpperCase()}</p>
                               </div>

                               <div style={{ display: "grid", gap: "0.5rem" }}>
                                 {[
                                   { status: "In Progress", icon: <FileSearch size={14} />, label: "EXECUTE PROCESSING" },
                                   { status: "Ready for Pickup", icon: <PackageCheck size={14} />, label: "READY FOR DISPATCH" },
                                   { status: "Completed", icon: <CheckCircle2 size={14} />, label: "MARK COMPLETED" }
                                 ].map((btn) => (
                                   <button 
                                     key={btn.status}
                                     onClick={() => {
                                       updateRequestStatus(selectedRequestId, btn.status as any);
                                       setSelectedRequestId(null);
                                     }}
                                     style={{ width: "100%", padding: "1rem", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}
                                   >
                                     <span style={{ color: "var(--primary)" }}>{btn.icon}</span> {btn.label}
                                   </button>
                                 ))}
                                 <button onClick={() => setSelectedRequestId(null)} style={{ width: "100%", padding: "1rem", background: "none", border: "none", color: "var(--text-dim)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>CANCEL SELECTION</button>
                               </div>
                            </div>
                          ) : (
                            <div className="sapphire-card" style={{ textAlign: "center", padding: "4rem", color: "var(--text-dim)" }}>
                               <CheckSquare size={40} style={{ margin: "0 auto 1.5rem", opacity: 0.1 }} />
                               <p style={{ fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.1em" }}>SELECT REQUEST TO PROCESS</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ) : osasSubTab === "Protocol" ? (
                 <motion.div key="protocol" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem" }}>
                       {/* TEMPLATE EDITOR */}
                       <div className="sapphire-card" style={{ padding: "3rem" }}>
                          <h3 style={{ fontSize: "0.9rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                             <Printer size={18} color="var(--primary)" /> CERTIFICATE TEMPLATE COMMAND
                          </h3>
                          <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", marginBottom: "2.5rem" }}>
                             DEFINE THE FORMAL CONTENT OF THE GOOD MORAL CERTIFICATE. USE <span style={{ color: "var(--primary)" }}>[STUDENT_NAME]</span> AS A PLACEHOLDER.
                          </p>
                          <textarea 
                             value={gmContent}
                             onChange={e => setGmContent(e.target.value)}
                             style={{ width: "100%", minHeight: "300px", padding: "2rem", fontSize: "0.9rem", lineHeight: "1.8", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontWeight: "600", fontFamily: "serif" }}
                          />
                          <button 
                             onClick={() => updateGoodMoralConfig({ content: gmContent, signatories })}
                             className="btn-cyan" 
                             style={{ width: "100%", marginTop: "2rem", padding: "1.25rem" }}
                          >
                             <Save size={18} /> PERSIST TEMPLATE CHANGES
                          </button>
                       </div>

                       {/* SIGNATORIES */}
                       <div>
                          <div className="sapphire-card" style={{ marginBottom: "2rem" }}>
                             <h3 style={{ fontSize: "0.85rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                                <UserCheck size={18} color="var(--primary)" /> INSTITUTIONAL SIGNATORIES
                             </h3>
                             <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
                                {signatories.map(s => (
                                  <div key={s.id} style={{ padding: "1rem", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                     <div>
                                        <p style={{ fontSize: "0.75rem", fontWeight: "900" }}>{s.name}</p>
                                        <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)" }}>{s.position.toUpperCase()}</p>
                                     </div>
                                     <button onClick={() => handleRemoveSignatory(s.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button>
                                  </div>
                                ))}
                             </div>
                             <div style={{ display: "grid", gap: "0.75rem", padding: "1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                                <input placeholder="NAME..." value={newSignName} onChange={e => setNewSignName(e.target.value)} style={{ fontSize: "0.7rem", padding: "0.75rem" }} />
                                <input placeholder="POSITION..." value={newSignPos} onChange={e => setNewSignPos(e.target.value)} style={{ fontSize: "0.7rem", padding: "0.75rem" }} />
                                <button onClick={handleAddSignatory} className="btn-cyan" style={{ fontSize: "0.6rem", padding: "0.75rem" }}>REGISTER SIGNATORY</button>
                             </div>
                          </div>

                          <div className="sapphire-card" style={{ background: "rgba(0, 229, 255, 0.02)", border: "1px solid var(--primary)" }}>
                             <h4 style={{ fontSize: "0.7rem", fontWeight: "900", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <Award size={14} color="var(--primary)" /> ISSUANCE PREVIEW
                             </h4>
                             <div style={{ padding: "1rem", border: "1px dashed var(--primary)", opacity: 0.7 }}>
                                <p style={{ fontSize: "0.55rem", textAlign: "center", fontWeight: "700" }}>
                                   {gmContent.replace("[STUDENT_NAME]", "JUAN DELA CRUZ").substring(0, 150)}...
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div key="definitions" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                       <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <Database size={18} color="var(--primary)" /> SERVICE DEFINITION CATALOG
                       </h2>
                       <button onClick={() => setIsAddingType(true)} className="btn-cyan" style={{ padding: "0.75rem 2rem" }}>
                          <Plus size={16} /> REGISTER NEW PROTOCOL
                       </button>
                    </div>

                    {isAddingType && (
                       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="sapphire-card" style={{ padding: "3rem", marginBottom: "3rem", border: "1px solid var(--primary)" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2.5rem" }}>
                             <h3 style={{ fontSize: "1rem", fontWeight: "900" }}>{editingTypeId ? "MODIFY PROTOCOL DEFINITION" : "REGISTER NEW SERVICE PROTOCOL"}</h3>
                             <button onClick={resetServiceForm} style={{ color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
                          </div>
                          <form onSubmit={editingTypeId ? (e) => { e.preventDefault(); handleSaveServiceEdit(); } : handleCreateServiceType} style={{ display: "grid", gap: "2rem" }}>
                             <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
                                <input required placeholder="SERVICE NAME..." value={newTypeName} onChange={e => setNewTypeName(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.85rem", fontWeight: "900" }} />
                                <input required placeholder="REQUIREMENTS (COMMA SEPARATED)..." value={newTypeDocs} onChange={e => setNewTypeDocs(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.85rem", fontWeight: "700" }} />
                             </div>
                             <textarea required placeholder="SERVICE DESCRIPTION & INSTITUTIONAL PURPOSE..." value={newTypeDesc} onChange={e => setNewTypeDesc(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.85rem", fontWeight: "700", minHeight: "100px" }} />
                             <button type="submit" className="btn-cyan" style={{ width: "100%", padding: "1.25rem" }}>
                                <Save size={18} /> {editingTypeId ? "PERSIST PROTOCOL MODIFICATIONS" : "EXECUTE PROTOCOL REGISTRATION"}
                             </button>
                          </form>
                       </motion.div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
                       {(serviceTypes || []).map(type => (
                         <div key={type.id} className="sapphire-card">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                               <div>
                                  <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>PROTOCOL ID: {type.id.toUpperCase()}</p>
                                  <h3 style={{ fontSize: "1.1rem", fontWeight: "900" }}>{type.name.toUpperCase()}</h3>
                               </div>
                               <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button onClick={() => startServiceEdit(type)} style={{ padding: "0.5rem", background: "var(--bg-accent)", color: "var(--primary)", border: "1px solid var(--border-dim)", cursor: "pointer" }}><Edit2 size={14} /></button>
                                  <button onClick={() => {
                                     setConfirmConfig({
                                        isOpen: true,
                                        title: "Retire Service Protocol",
                                        message: `Are you sure you want to permanently retire the ${type.name} protocol? This will prevent new student requests.`,
                                        type: "danger",
                                        onConfirm: () => deleteServiceType(type.id)
                                     });
                                  }} style={{ padding: "0.5rem", background: "rgba(239, 68, 68, 0.05)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.2)", cursor: "pointer" }}><Trash2 size={14} /></button>
                               </div>
                            </div>
                            <p style={{ fontSize: "0.7rem", color: "var(--text-dim)", fontWeight: "700", lineHeight: "1.6", marginBottom: "2rem" }}>{type.description}</p>
                            <div>
                               <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-main)", marginBottom: "1rem" }}>REQUIRED COMPLIANCE:</p>
                               <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                  {type.requiredDocs.map(doc => (
                                    <span key={doc} style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.25rem 0.6rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", borderRadius: "2px" }}>{doc.toUpperCase()}</span>
                                  ))}
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </motion.div>
               )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ISSUANCE MODAL */}
      <AnimatePresence>
         {isIssuing && (
           <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="sapphire-card" style={{ maxWidth: "600px", width: "100%", padding: "3rem" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem" }}>
                    <h3 style={{ fontSize: "1.25rem", fontWeight: "900" }}>CERTIFICATE ISSUANCE</h3>
                    <button onClick={() => setIsIssuing(false)} style={{ color: "var(--text-dim)", background: "none", border: "none", cursor: "pointer" }}><X size={24} /></button>
                 </div>
                 <p style={{ fontSize: "0.8rem", color: "var(--text-dim)", fontWeight: "700", marginBottom: "3rem" }}>
                    UPLOAD THE PHYSICALLY SIGNED GOOD MORAL CERTIFICATE FOR <span style={{ color: "var(--primary)" }}>{selectedRequest?.studentName.toUpperCase()}</span>.
                 </p>
                 
                 <div style={{ border: "2px dashed var(--border-dim)", padding: "4rem", textAlign: "center", marginBottom: "3rem", cursor: "pointer" }}>
                    <FileUp size={48} style={{ margin: "0 auto 1.5rem", color: "var(--primary)" }} />
                    <p style={{ fontSize: "0.75rem", fontWeight: "900" }}>SELECT SIGNED PDF FILE</p>
                    <p style={{ fontSize: "0.55rem", fontWeight: "700", color: "var(--text-dim)", marginTop: "0.5rem" }}>DRAG AND DROP OR CLICK TO BROWSE</p>
                 </div>

                 <button onClick={handleIssueCertificate} className="btn-cyan" style={{ width: "100%", padding: "1.25rem" }}>
                    <CheckCircle2 size={18} /> FINALIZE AND RELEASE CERTIFICATE
                 </button>
              </motion.div>
           </div>
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
