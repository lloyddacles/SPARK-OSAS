"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  UploadCloud, 
  Settings, 
  HelpCircle, 
  Search,
  PackageCheck,
  FileSearch,
  CheckSquare,
  Activity,
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

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* Analytics Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Student Services</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            Service <span style={{ color: "#3b82f6" }}>Requests</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "500px", lineHeight: "1.5" }}>Request documents like Good Moral certificates, clearances, and other OSAS services.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", background: "#f1f5f9", padding: "0.5rem", borderRadius: "12px" }}>
          <button onClick={() => setActiveTab("Student")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "700", background: activeTab === "Student" ? "white" : "transparent", color: activeTab === "Student" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "8px", boxShadow: activeTab === "Student" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
            For Students
          </button>
          {isStaff && (
            <button onClick={() => setActiveTab("OSAS")} style={{ padding: "0.75rem 1.5rem", fontSize: "0.85rem", fontWeight: "700", background: activeTab === "OSAS" ? "white" : "transparent", color: activeTab === "OSAS" ? "#3b82f6" : "#64748b", border: "none", borderRadius: "8px", boxShadow: activeTab === "OSAS" ? "0 2px 4px rgba(0,0,0,0.05)" : "none", cursor: "pointer", transition: "all 0.2s" }}>
              For Staff
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Student" && (
          <motion.div key="student" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            {!isApplying ? (
              <div>
                <ProcessGuide 
                  title="How to Request a Document or Service"
                  steps={[
                    { title: "Start a Request", desc: "Click the 'New Request' button below to begin.", icon: <Plus size={16} /> },
                    { title: "Pick a Service", desc: "Choose the document you need (e.g. Good Moral, Clearance) from the dropdown.", icon: <FileText size={16} /> },
                    { title: "Check Requirements", desc: "Confirm you have the needed clearances checked off before submitting.", icon: <CheckCircle2 size={16} /> },
                    { title: "Wait & Download", desc: "Once OSAS processes your request, you can download the certificate from the list.", icon: <Download size={16} /> }
                  ]}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                    <Activity size={20} color="#3b82f6" /> My Requests
                  </h2>
                  <button onClick={() => { setIsApplying(true); setIsSuccess(false); }} style={{ padding: "0.75rem 1.5rem", background: "#3b82f6", color: "white", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", border: "none", boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)" }}>
                    <Plus size={16} /> New Request
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {(serviceRequests || []).filter(r => isStudent ? r.studentName === currentUser?.name : true).length === 0 ? (
                     <div style={{ padding: "4rem", textAlign: "center", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                        <FileText size={32} color="#cbd5e1" style={{ margin: "0 auto 1rem" }} />
                        <p style={{ fontSize: "0.9rem", fontWeight: "600", color: "#64748b" }}>You haven't made any requests yet.</p>
                     </div>
                  ) : (serviceRequests || []).filter(r => isStudent ? r.studentName === currentUser?.name : true).reverse().map((req) => {
                    const cert = (issuedCertificates || []).find(c => c.requestId === req.id);
                    return (
                      <div key={req.id} style={{ background: "white", padding: "1.5rem 2rem", borderRadius: "12px", border: "1px solid #f3f4f6", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                          <div style={{ width: "48px", height: "48px", background: "#eff6ff", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", border: "1px solid #bfdbfe" }}>
                            <FileText size={20} />
                          </div>
                          <div>
                            <h3 style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.25rem" }}>{req.type}</h3>
                            <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b" }}>ID: {req.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "3rem" }}>
                          <div style={{ textAlign: "right" }}>
                            <p style={{ fontSize: "0.7rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "0.25rem" }}>Date Requested</p>
                            <p style={{ fontSize: "0.85rem", fontWeight: "700", color: "#1e293b" }}>{req.date}</p>
                          </div>
                          <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "0.5rem",
                            color: req.status === "Completed" ? "#10b981" : req.status === "Ready for Pickup" ? "#3b82f6" : "#f59e0b",
                            background: req.status === "Completed" ? "#f0fdf4" : req.status === "Ready for Pickup" ? "#eff6ff" : "#fffbeb",
                            border: `1px solid ${req.status === "Completed" ? "#bbf7d0" : req.status === "Ready for Pickup" ? "#bfdbfe" : "#fde68a"}`,
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: "800",
                          }}>
                            {req.status === "Completed" ? <CheckCircle2 size={16} /> : <Clock size={16} />}
                            {req.status}
                          </div>
                          {cert && (
                            <button style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", borderRadius: "8px", border: "none", fontSize: "0.75rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <Download size={14} /> Download Certificate
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
                <button onClick={() => setIsApplying(false)} style={{ color: "#64748b", background: "none", border: "none", marginBottom: "2rem", fontWeight: "700", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                  <ArrowLeft size={16} /> Return to list
                </button>

                {isSuccess ? (
                  <div style={{ background: "white", borderRadius: "16px", padding: "6rem 3rem", textAlign: "center", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                    <div style={{ width: "80px", height: "80px", background: "#f0fdf4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem" }}>
                       <CheckCircle2 size={40} color="#10b981" />
                    </div>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: "900", color: "#1e293b", marginBottom: "1rem" }}>Request Submitted!</h2>
                    <p style={{ color: "#64748b", fontSize: "1rem", fontWeight: "500", maxWidth: "500px", margin: "0 auto", lineHeight: "1.6" }}>
                      Your request has been successfully submitted. You will be notified when it is ready for pickup or download.
                    </p>
                  </div>
                ) : (
                  <div style={{ background: "white", borderRadius: "16px", maxWidth: "800px", margin: "0 auto", padding: "3.5rem", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                    <h2 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "0.5rem", color: "#1e293b" }}>Submit a Service Request</h2>
                    <p style={{ color: "#64748b", fontSize: "0.9rem", fontWeight: "500", marginBottom: "3rem" }}>Choose the service you need and verify the requirements below.</p>
                    
                    <form onSubmit={handleApply}>
                      <div style={{ marginBottom: "2.5rem" }}>
                        <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Service Type</label>
                        <select 
                          required 
                          value={selectedServiceId} 
                          onChange={e => {
                            setSelectedServiceId(e.target.value);
                            setFormRequirements({});
                          }}
                          style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "600", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", outline: "none" }}
                        >
                          <option value="">-- Select a service --</option>
                          {(serviceTypes || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                      </div>

                      {selectedService && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ overflow: "hidden" }}>
                          <h3 style={{ fontSize: "0.9rem", fontWeight: "800", marginBottom: "1.5rem", color: "#1e293b" }}>Required Documents Verification</h3>
                          <div style={{ display: "grid", gap: "0.75rem", marginBottom: "3rem" }}>
                            {selectedService.requiredDocs.map((doc) => (
                              <label key={doc} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }} className="hover:border-blue-300">
                                <input 
                                  type="checkbox" 
                                  required
                                  checked={formRequirements[doc] || false} 
                                  onChange={(e) => setFormRequirements({ ...formRequirements, [doc]: e.target.checked })}
                                  style={{ width: "18px", height: "18px", accentColor: "#3b82f6", cursor: "pointer" }}
                                />
                                <span style={{ fontWeight: "600", fontSize: "0.9rem", color: "#1e293b" }}>{doc}</span>
                              </label>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      <button type="submit" style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                        <UploadCloud size={20} /> Submit Request
                      </button>
                    </form>
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "OSAS" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            
            <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem", borderBottom: "1px solid #e2e8f0" }}>
               <button onClick={() => setOsasSubTab("Queue")} style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "700", background: "none", border: "none", color: osasSubTab === "Queue" ? "#3b82f6" : "#64748b", borderBottom: osasSubTab === "Queue" ? "2px solid #3b82f6" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>Pending Requests</button>
               {isGuidance && <button onClick={() => setOsasSubTab("Protocol")} style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "700", background: "none", border: "none", color: osasSubTab === "Protocol" ? "#3b82f6" : "#64748b", borderBottom: osasSubTab === "Protocol" ? "2px solid #3b82f6" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>Good Moral Certificates</button>}
               {!isGuidance && <button onClick={() => setOsasSubTab("Definitions")} style={{ padding: "1rem 1.5rem", fontSize: "0.9rem", fontWeight: "700", background: "none", border: "none", color: osasSubTab === "Definitions" ? "#3b82f6" : "#64748b", borderBottom: osasSubTab === "Definitions" ? "2px solid #3b82f6" : "2px solid transparent", cursor: "pointer", transition: "all 0.2s" }}>Service Types</button>}
            </div>

            <AnimatePresence mode="wait">
               {osasSubTab === "Queue" ? (
                 <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2.5rem", alignItems: "start" }}>
                       {/* QUEUE */}
                       <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
                          <div style={{ padding: "2rem", borderBottom: "1px solid #f1f5f9", background: "#f8fafc" }}>
                             <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                                <Clock size={18} color="#3b82f6" /> Active Pending Requests
                             </h3>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column" }}>
                             {(serviceRequests || []).filter(r => r.status !== "Completed").length === 0 ? (
                               <div style={{ padding: "4rem", textAlign: "center" }}>
                                  <CheckSquare size={32} color="#cbd5e1" style={{ margin: "0 auto 1rem" }} />
                                  <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500" }}>No pending requests in the queue.</p>
                               </div>
                             ) : (serviceRequests || []).filter(r => r.status !== "Completed").reverse().map((req, index) => (
                               <div 
                                 key={req.id} 
                                 onClick={() => setSelectedRequestId(req.id)}
                                 style={{ 
                                   padding: "1.5rem 2rem", 
                                   background: selectedRequestId === req.id ? "#eff6ff" : "white",
                                   cursor: "pointer", 
                                   borderBottom: index !== (serviceRequests || []).filter(r => r.status !== "Completed").length - 1 ? "1px solid #f1f5f9" : "none",
                                   borderLeft: selectedRequestId === req.id ? "4px solid #3b82f6" : "4px solid transparent",
                                   transition: "all 0.2s"
                                 }}
                               >
                                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                                   <h4 style={{ fontWeight: "800", fontSize: "1rem", color: "#1e293b" }}>{req.type}</h4>
                                   <span style={{ fontSize: "0.75rem", fontWeight: "800", padding: "0.3rem 0.8rem", borderRadius: "20px", background: req.status === "Ready for Pickup" ? "#eff6ff" : "#fffbeb", color: req.status === "Ready for Pickup" ? "#3b82f6" : "#d97706", border: `1px solid ${req.status === "Ready for Pickup" ? "#bfdbfe" : "#fde68a"}` }}>
                                     {req.status}
                                   </span>
                                 </div>
                                 <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>{req.studentName} • {req.date}</p>
                               </div>
                             ))}
                          </div>
                       </div>

                       {/* CONTROL PANEL */}
                       <div>
                          {selectedRequestId ? (
                            <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", position: "sticky", top: "2rem" }}>
                               <h3 style={{ fontSize: "1rem", fontWeight: "800", marginBottom: "2rem", color: "#1e293b" }}>Request Processing</h3>
                               
                               {isGoodMoralReq && isGuidance && (
                                 <div style={{ marginBottom: "2.5rem", padding: "1.5rem", background: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe" }}>
                                    <p style={{ fontSize: "0.85rem", fontWeight: "800", marginBottom: "1rem", color: "#1e293b" }}>Good Moral Workflow</p>
                                    <div style={{ display: "grid", gap: "0.75rem" }}>
                                      <button onClick={() => {}} style={{ width: "100%", padding: "1rem", background: "white", border: "1px solid #3b82f6", color: "#3b82f6", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer" }}>
                                         <Download size={16} /> Download Draft PDF
                                      </button>
                                      <button onClick={() => setIsIssuing(true)} style={{ width: "100%", padding: "1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", cursor: "pointer" }}>
                                         <FileUp size={16} /> Upload Signed PDF
                                      </button>
                                    </div>
                                 </div>
                               )}

                               <div style={{ padding: "1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "2.5rem" }}>
                                 <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "0.5rem" }}>Current Status</p>
                                 <p style={{ fontWeight: "800", color: "#3b82f6", fontSize: "1.1rem" }}>{((serviceRequests || []).find(r => r.id === selectedRequestId)?.status || "Unknown")}</p>
                               </div>

                               <div style={{ display: "grid", gap: "0.75rem" }}>
                                 {[
                                   { status: "In Progress", icon: <FileSearch size={16} />, label: "Mark In Progress" },
                                   { status: "Ready for Pickup", icon: <PackageCheck size={16} />, label: "Mark Ready for Pickup" },
                                   { status: "Completed", icon: <CheckCircle2 size={16} />, label: "Mark Completed" }
                                 ].map((btn) => (
                                   <button 
                                     key={btn.status}
                                     onClick={() => {
                                       updateRequestStatus(selectedRequestId, btn.status as any);
                                       setSelectedRequestId(null);
                                     }}
                                     style={{ width: "100%", padding: "1.25rem", background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontSize: "0.9rem", fontWeight: "700", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", transition: "all 0.2s" }}
                                     className="hover:border-blue-300 hover:bg-slate-50"
                                   >
                                     <span style={{ color: "#3b82f6" }}>{btn.icon}</span> {btn.label}
                                   </button>
                                 ))}
                                 <button onClick={() => setSelectedRequestId(null)} style={{ width: "100%", padding: "1rem", background: "none", border: "none", color: "#64748b", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", marginTop: "0.5rem" }}>Cancel</button>
                               </div>
                            </div>
                          ) : (
                            <div style={{ background: "white", padding: "4rem", borderRadius: "16px", border: "1px dashed #cbd5e1", textAlign: "center", color: "#64748b" }}>
                               <CheckSquare size={48} style={{ margin: "0 auto 1.5rem", opacity: 0.3 }} />
                               <p style={{ fontSize: "0.9rem", fontWeight: "600" }}>Select a request from the queue to process it.</p>
                            </div>
                          )}
                       </div>
                    </div>
                 </motion.div>
               ) : osasSubTab === "Protocol" ? (
                 <motion.div key="protocol" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2.5rem" }}>
                       {/* TEMPLATE EDITOR */}
                       <div style={{ background: "white", padding: "3rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                          <h3 style={{ fontSize: "1.25rem", fontWeight: "800", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                             <Printer size={20} color="#3b82f6" /> Certificate Template
                          </h3>
                          <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500", marginBottom: "2.5rem", lineHeight: "1.6" }}>
                             Edit the body text of the Good Moral certificate. Use <strong style={{ color: "#3b82f6" }}>[STUDENT_NAME]</strong> as a placeholder for the student name.
                          </p>
                          <textarea 
                             value={gmContent}
                             onChange={e => setGmContent(e.target.value)}
                             style={{ width: "100%", minHeight: "350px", padding: "2rem", fontSize: "0.95rem", lineHeight: "1.8", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", color: "#1e293b", fontWeight: "500", fontFamily: "Georgia, serif", outline: "none", resize: "vertical" }}
                          />
                          <button 
                             onClick={() => updateGoodMoralConfig({ content: gmContent, signatories })}
                             style={{ width: "100%", marginTop: "2rem", padding: "1.25rem", background: "#3b82f6", color: "white", borderRadius: "12px", border: "none", fontSize: "1rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}
                          >
                             <Save size={18} /> Save Template
                          </button>
                       </div>

                       {/* SIGNATORIES */}
                       <div>
                          <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", marginBottom: "2.5rem" }}>
                             <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                                <UserCheck size={20} color="#3b82f6" /> Signatories
                             </h3>
                             <div style={{ display: "grid", gap: "1rem", marginBottom: "2rem" }}>
                                {signatories.map(s => (
                                  <div key={s.id} style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                     <div>
                                        <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#1e293b" }}>{s.name}</p>
                                        <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#3b82f6", marginTop: "0.25rem" }}>{s.position}</p>
                                     </div>
                                     <button onClick={() => handleRemoveSignatory(s.id)} style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: "0.5rem" }}><Trash2 size={16} /></button>
                                  </div>
                                ))}
                                {signatories.length === 0 && (
                                  <p style={{ fontSize: "0.85rem", color: "#64748b", textAlign: "center", padding: "1rem" }}>No signatories added.</p>
                                )}
                             </div>
                             <div style={{ display: "grid", gap: "0.75rem", padding: "1.5rem", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px" }}>
                                <input placeholder="Full Name..." value={newSignName} onChange={e => setNewSignName(e.target.value)} style={{ fontSize: "0.85rem", padding: "1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }} />
                                <input placeholder="Position / Title..." value={newSignPos} onChange={e => setNewSignPos(e.target.value)} style={{ fontSize: "0.85rem", padding: "1rem", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none" }} />
                                <button onClick={handleAddSignatory} style={{ padding: "1rem", background: "#1e293b", color: "white", borderRadius: "8px", border: "none", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", marginTop: "0.5rem" }}>Add Signatory</button>
                             </div>
                          </div>

                          <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #bfdbfe", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.05)" }}>
                             <h4 style={{ fontSize: "0.9rem", fontWeight: "800", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                                <Award size={18} color="#3b82f6" /> Template Preview
                             </h4>
                             <div style={{ padding: "1.5rem", border: "1px dashed #cbd5e1", borderRadius: "12px", background: "#f8fafc" }}>
                                <p style={{ fontSize: "0.8rem", color: "#475569", lineHeight: "1.6", fontStyle: "italic", fontFamily: "Georgia, serif" }}>
                                   {gmContent.replace("[STUDENT_NAME]", "JUAN DELA CRUZ").substring(0, 150)}...
                                </p>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
               ) : (
                 <motion.div key="definitions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem" }}>
                       <h2 style={{ fontSize: "1.25rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", color: "#1e293b" }}>
                          <Database size={20} color="#3b82f6" /> Service Type Catalog
                       </h2>
                       <button onClick={() => setIsAddingType(true)} style={{ padding: "0.85rem 1.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "10px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", boxShadow: "0 2px 4px rgba(59, 130, 246, 0.2)" }}>
                          <Plus size={16} /> Add Service
                       </button>
                    </div>

                    {isAddingType && (
                       <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} style={{ overflow: "hidden", marginBottom: "3rem" }}>
                          <div style={{ background: "white", padding: "3rem", borderRadius: "16px", border: "1px solid #bfdbfe", boxShadow: "0 10px 25px rgba(59, 130, 246, 0.05)" }}>
                             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
                                <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b" }}>{editingTypeId ? "Edit Service Type" : "Add New Service Type"}</h3>
                                <button onClick={resetServiceForm} style={{ color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", width: "40px", height: "40px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
                             </div>
                             <form onSubmit={editingTypeId ? (e) => { e.preventDefault(); handleSaveServiceEdit(); } : handleCreateServiceType} style={{ display: "grid", gap: "2rem" }}>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
                                   <div>
                                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Service Name</label>
                                      <input required placeholder="e.g. Good Moral Certificate" value={newTypeName} onChange={e => setNewTypeName(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none" }} />
                                   </div>
                                   <div>
                                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Requirements (comma separated)</label>
                                      <input required placeholder="e.g. ID, Clearance Form" value={newTypeDocs} onChange={e => setNewTypeDocs(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none" }} />
                                   </div>
                                </div>
                                <div>
                                   <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Description</label>
                                   <textarea required placeholder="Brief description of this service..." value={newTypeDesc} onChange={e => setNewTypeDesc(e.target.value)} style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", minHeight: "120px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", resize: "vertical" }} />
                                </div>
                                <button type="submit" style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", borderRadius: "10px", border: "none", fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                                   <Save size={18} /> {editingTypeId ? "Save Changes" : "Add Service Type"}
                                </button>
                             </form>
                          </div>
                       </motion.div>
                    )}

                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "2rem" }}>
                       {(serviceTypes || []).map(type => (
                         <div key={type.id} style={{ background: "white", padding: "2rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                               <div>
                                  <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.25rem" }}>{type.name}</h3>
                                  <p style={{ fontSize: "0.7rem", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.05em", textTransform: "uppercase" }}>ID: {type.id}</p>
                               </div>
                               <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <button onClick={() => startServiceEdit(type)} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "white", color: "#64748b", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}><Edit2 size={14} /></button>
                                  <button onClick={() => {
                                     setConfirmConfig({
                                        isOpen: true,
                                        title: "Delete Service Type",
                                        message: `Are you sure you want to permanently retire the ${type.name} service type? This will prevent new student requests.`,
                                        type: "danger",
                                        onConfirm: () => deleteServiceType(type.id)
                                     });
                                  }} style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#fef2f2", color: "#ef4444", border: "1px solid #fecaca", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "all 0.2s" }}><Trash2 size={14} /></button>
                               </div>
                            </div>
                            <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.6", marginBottom: "2rem", flex: 1 }}>{type.description}</p>
                            <div style={{ paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
                               <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "#1e293b", marginBottom: "1rem" }}>Required Documents:</p>
                               <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                  {type.requiredDocs.map(doc => (
                                    <span key={doc} style={{ fontSize: "0.75rem", fontWeight: "600", padding: "0.4rem 0.8rem", background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "20px" }}>{doc}</span>
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
           <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(8px)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} style={{ background: "white", borderRadius: "24px", maxWidth: "600px", width: "100%", padding: "3rem", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "900", color: "#1e293b" }}>Upload Certificate</h3>
                    <button onClick={() => setIsIssuing(false)} style={{ color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><X size={20} /></button>
                 </div>
                 <p style={{ fontSize: "0.95rem", color: "#64748b", fontWeight: "500", marginBottom: "3rem", lineHeight: "1.6" }}>
                    Upload the signed Good Moral certificate for <strong style={{ color: "#3b82f6" }}>{selectedRequest?.studentName}</strong>.
                 </p>
                 
                 <div style={{ border: "2px dashed #cbd5e1", borderRadius: "16px", padding: "4rem", textAlign: "center", marginBottom: "3rem", background: "#f8fafc", cursor: "pointer", transition: "all 0.2s" }} className="hover:border-blue-400 hover:bg-blue-50">
                    <FileUp size={48} style={{ margin: "0 auto 1.5rem", color: "#3b82f6" }} />
                    <p style={{ fontSize: "1rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>Select signed PDF file</p>
                    <p style={{ fontSize: "0.85rem", fontWeight: "500", color: "#64748b" }}>Drag and drop or click to browse</p>
                 </div>

                 <button onClick={handleIssueCertificate} style={{ width: "100%", padding: "1.25rem", background: "#10b981", color: "white", borderRadius: "12px", border: "none", fontSize: "1rem", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(16, 185, 129, 0.2)" }}>
                    <CheckCircle2 size={18} /> Finalize and Release
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
