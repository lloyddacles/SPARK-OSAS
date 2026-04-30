"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  Users, 
  Database, 
  Shield,
  ShieldAlert, 
  RefreshCcw, 
  Download, 
  Trash2, 
  Search,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Cpu,
  Fingerprint,
  Activity,
  ArrowRight,
  Clock,
  History,
  FileSearch,
  Archive
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { getAllUsers, updateUser, toggleUserArchive, clearAllAppointments, getSystemHealth, createUser, deleteUser, performAnnualArchive } from "@/lib/actions/adminActions";
import ConfirmModal from "@/components/ConfirmModal";

export default function AdminCenterPage() {
  const { currentUser, auditLogs, logAudit } = useGlobalState();
  const [users, setUsers] = useState<any[]>([]);
  const [health, setHealth] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"Directory" | "Health" | "Audit">("Directory");
  
  // Registration States
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUserName, setNewUserName] = useState("");
  const [newUserUsername, setNewUserUsername] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserRole, setNewUserRole] = useState("STUDENT_APPLICANT");
  const [newUserDept, setNewUserDept] = useState("");
  const [newUserContact, setNewUserContact] = useState("");

  // Editing States
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editDept, setEditDept] = useState("");
  const [editContact, setEditContact] = useState("");
  
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: "danger" | "warning";
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
    type: "warning"
  });

  const isAuth = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";

  useEffect(() => {
    if (isAuth) {
      fetchData();
    }
  }, [isAuth]);

  if (!isAuth) {
    return (
      <div style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "2rem" }}>
         <ShieldAlert size={64} color="#ef4444" />
         <div style={{ textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-main)" }}>UNAUTHORIZED ACCESS</h2>
            <p style={{ color: "var(--text-dim)", fontWeight: "700", marginTop: "0.5rem" }}>INSTITUTIONAL NODE LOCKDOWN ACTIVE: AUTHORIZED PERSONNEL ONLY.</p>
         </div>
      </div>
    );
  }

  const fetchData = async () => {
    try {
      const [u, h] = await Promise.all([getAllUsers(), getSystemHealth()]);
      setUsers(u || []);
      setHealth(h);
    } catch (error: any) {
      console.error("ADMIN_FETCH_FAIL:", error);
      setMessage(`SYSTEM_DATA_SYNC_FAILED: ${error.message}`);
    }
  };

  const startEdit = (user: any) => {
    setEditName(user.name);
    setEditUsername(user.username || "");
    setEditPassword(user.password || "");
    setEditRole(user.role);
    setEditDept(user.department || "");
    setEditContact(user.contactNumber || "");
    setIsEditingUser(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    try {
      const updated = await updateUser(selectedUser.id, { 
        name: editName, 
        username: editUsername, 
        password: editPassword, 
        role: editRole,
        department: editDept,
        contactNumber: editContact
      });
      setIsEditingUser(false);
      setSelectedUser(updated);
      logAudit("IDENTITY_MODIFIED", `User ${selectedUser.name} identity updated by Admin.`, "MEDIUM");
      setMessage("IDENTITY_UPDATED: SUCCESS");
      fetchData();
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`ERROR: ${err.message}`);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUser({ 
          name: newUserName, 
          username: newUserUsername, 
          password: newUserPassword, 
          role: newUserRole,
          department: newUserDept,
          contactNumber: newUserContact
      });

      if (res.success) {
        logAudit("IDENTITY_PROVISIONED", `New identity '${newUserName}' created.`, "LOW");
        setMessage("IDENTITY_CREATED: SUCCESS");
        setNewUserName("");
        setNewUserUsername("");
        setNewUserPassword("");
        setNewUserDept("");
        setNewUserContact("");
        setIsAddingUser(false);
        fetchData();
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage(`PROVISIONING_FAILED: ${res.message}`);
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (err: any) {
      console.error("Provisioning Error:", err);
      setMessage(`CRITICAL_ERROR: ${err.message || "SYSTEM_DISRUPTION"}`);
      setTimeout(() => setMessage(""), 5000);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    setConfirmConfig({
      isOpen: true,
      title: "Confirm Deletion",
      message: "Are you sure you want to permanently delete this user identity? This action cannot be undone.",
      type: "danger",
      onConfirm: async () => {
        await deleteUser(userId);
        logAudit("IDENTITY_PURGED", `Identity ID ${userId} removed from system.`, "HIGH");
        setMessage("IDENTITY_DELETED: SUCCESS");
        setSelectedUser(null);
        fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    });
  };

  const handleToggleArchive = async (userId: string) => {
    const updated = await toggleUserArchive(userId);
    logAudit("IDENTITY_STATUS_CHANGE", `Archive status toggled for user ${userId}.`, "LOW");
    setMessage("IDENTITY_STATUS_UPDATED: SUCCESS");
    if (selectedUser?.id === userId) {
      setSelectedUser(updated);
    }
    fetchData();
    setTimeout(() => setMessage(""), 3000);
  };

  const handleClearAppointments = async () => {
    setConfirmConfig({
      isOpen: true,
      title: "Wipe Database",
      message: "You are about to purge all appointment records from the system. Do you wish to proceed?",
      type: "danger",
      onConfirm: async () => {
        await clearAllAppointments();
        logAudit("DATABASE_PURGE", "All appointment records cleared by Admin.", "CRITICAL");
        setMessage("DATABASE_PURGE: COMPLETED");
        fetchData();
        setTimeout(() => setMessage(""), 3000);
      }
    });
  };

  const handleAnnualArchive = async () => {
    setConfirmConfig({
      isOpen: true,
      title: "Annual Archive Protocol",
      message: "This will vault all completed service requests, appointments, referrals, and scholarship applications, starting the system with a clean slate for the new academic term. Do you wish to proceed?",
      type: "danger",
      onConfirm: async () => {
        const stats = await performAnnualArchive();
        logAudit("ANNUAL_ARCHIVE", `Annual archive executed. Vaulted ${stats.archivedRequests} requests, ${stats.archivedAppointments} appointments, ${stats.archivedReferrals} referrals, and ${stats.archivedScholarships} scholarships.`, "CRITICAL");
        setMessage("ANNUAL ARCHIVE: COMPLETED");
        fetchData();
        setTimeout(() => setMessage(""), 5000);
      }
    });
  };

  const getSeverityColor = (sev: string) => {
    switch(sev) {
       case "CRITICAL": return "#ef4444";
       case "HIGH": return "#f59e0b";
       case "MEDIUM": return "var(--primary)";
       default: return "var(--text-dim)";
    }
  };



  return (
    <div style={{ width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "4rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>STATUS: ACTIVE</p>
          <h1 style={{ fontSize: "3rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
            SYSTEM <span style={{ color: "var(--primary)" }}>ADMIN</span>
          </h1>
        </div>
        <div style={{ display: "flex", gap: "2rem" }}>
           <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>SYSTEM STATUS</p>
              <p style={{ fontSize: "1rem", fontWeight: "900", color: "#10b981" }}>HEALTHY</p>
           </div>
        </div>
      </div>

      {/* Control Tabs */}
      <div style={{ display: "flex", gap: "1px", background: "var(--border-dim)", border: "1px solid var(--border-dim)", marginBottom: "3rem" }}>
        {["Directory", "Health", "Audit"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            style={{ 
              flex: 1, 
              padding: "1.25rem", 
              background: activeTab === tab ? "var(--primary)" : "var(--bg-surface)", 
              color: activeTab === tab ? "var(--text-dark)" : "var(--text-dim)",
              border: "none",
              fontSize: "0.7rem",
              fontWeight: "900",
              cursor: "pointer",
              letterSpacing: "0.1em"
            }}
          >
            {tab === "Directory" ? "USER DIRECTORY" : tab === "Health" ? "SYSTEM INSIGHTS" : "GOVERNANCE AUDIT LEDGER"}
          </button>
        ))}
      </div>

      {message && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} style={{ padding: "1rem", background: "rgba(0, 229, 255, 0.05)", border: "1px solid var(--primary)", color: "var(--primary)", marginBottom: "3rem", fontSize: "0.7rem", fontWeight: "900", letterSpacing: "0.1em", textAlign: "center" }}>
          {message}
        </motion.div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "3rem", alignItems: "start" }}>
        
        {/* TAB VIEWPORT */}
        <main>
          <AnimatePresence mode="wait">
            {activeTab === "Directory" && (
              <motion.div key="directory" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                <div className="sapphire-card" style={{ padding: "0" }}>
                  <div style={{ padding: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-dim)" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
                        <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <Users size={18} color="var(--primary)" /> IDENTITY DIRECTORY
                        </h2>
                        <button onClick={() => setIsAddingUser(true)} style={{ padding: "0.5rem 1.5rem", background: "var(--primary)", border: "none", color: "var(--text-dark)", fontSize: "0.6rem", fontWeight: "900", cursor: "pointer" }}>REGISTER IDENTITY</button>
                    </div>
                    <div style={{ position: "relative", width: "280px" }}>
                        <Search size={14} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-dim)" }} />
                        <input 
                          placeholder="SEARCH USER IDENTIFIER..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          style={{ width: "100%", padding: "0.6rem 0.6rem 0.6rem 2.5rem", fontSize: "0.65rem", fontWeight: "800", textTransform: "uppercase" }}
                        />
                    </div>
                  </div>

                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr style={{ textAlign: "left", fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "900", letterSpacing: "0.1em", background: "var(--bg-accent)" }}>
                        <th style={{ padding: "1.5rem 2rem", fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", textAlign: "left", letterSpacing: "0.1em" }}>IDENTIFIER / NAME</th>
                        <th style={{ padding: "1.5rem 2rem", fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", textAlign: "left", letterSpacing: "0.1em" }}>AUTHORIZATION</th>
                        <th style={{ padding: "1.5rem 2rem", fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", textAlign: "left", letterSpacing: "0.1em" }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "0.75rem" }}>
                      {(() => {
                        const filtered = (users || []).filter(u => (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()));
                        if (filtered.length === 0) {
                          return (
                            <tr>
                              <td colSpan={3} style={{ padding: "4rem", textAlign: "center", color: "var(--text-dim)" }}>
                                <Users size={40} style={{ margin: "0 auto 1.5rem", opacity: 0.2 }} />
                                <p style={{ fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.1em" }}>NO IDENTITY RECORDS MATCHING SEARCH</p>
                              </td>
                            </tr>
                          );
                        }
                        return filtered.map((user) => (
                          <tr 
                            key={user.id} 
                            onClick={() => setSelectedUser(user)}
                            style={{ 
                              borderBottom: "1px solid var(--border-dim)", 
                              cursor: "pointer", 
                              background: selectedUser?.id === user.id ? "rgba(0, 229, 255, 0.05)" : "transparent",
                              transition: "all 0.2s"
                            }}
                          >
                            <td style={{ padding: "1.25rem 2rem" }}>
                              <p style={{ fontWeight: "800", color: "var(--text-main)" }}>{user.name?.toUpperCase()}</p>
                              <p style={{ fontSize: "0.55rem", color: "var(--text-dim)", fontWeight: "700" }}>USER: {user.username || "NOT SET"}</p>
                            </td>
                            <td style={{ padding: "1.25rem 2rem" }}>
                              <span style={{ fontSize: "0.55rem", fontWeight: "900", padding: "0.3rem 0.75rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--primary)" }}>
                                {user.role?.replace(/_/g, " ")}
                              </span>
                            </td>
                            <td style={{ padding: "1.25rem 2rem" }}>
                              <span style={{ fontSize: "0.55rem", fontWeight: "900", color: user.status === "Archived" ? "#ef4444" : "#10b981" }}>
                                {(user.status || "Active").toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>

                <AnimatePresence>
                  {isAddingUser && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="sapphire-card" style={{ marginTop: "2rem", padding: "3rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2.5rem" }}>
                          <h3 style={{ fontSize: "0.85rem", fontWeight: "900" }}>REGISTER NEW IDENTITY</h3>
                          <button onClick={() => setIsAddingUser(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}>X</button>
                      </div>
                        <form onSubmit={handleCreateUser} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>FULL NAME</label>
                            <input required value={newUserName} onChange={e => setNewUserName(e.target.value)} placeholder="E.G. JOHN DOE..." style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>USERNAME / ID</label>
                            <input required value={newUserUsername} onChange={e => setNewUserUsername(e.target.value)} placeholder="E.G. JD_2026..." style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>INITIAL PASSWORD</label>
                            <input required type="password" value={newUserPassword} onChange={e => setNewUserPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>SYSTEM AUTHORIZATION</label>
                            <select value={newUserRole} onChange={e => setNewUserRole(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}>
                                <option value="STUDENT_APPLICANT">STUDENT</option>
                                <option value="STUDENT_LEADER">STUDENT LEADER</option>
                                <option value="OSAS_DIRECTOR">OSAS DIRECTOR</option>
                                <option value="GUIDANCE_COUNSELOR">GUIDANCE COUNSELOR</option>
                                <option value="ADVISER">FACULTY ADVISER</option>
                            </select>
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>DEPARTMENT / COLLEGE (OPTIONAL)</label>
                            <input value={newUserDept} onChange={e => setNewUserDept(e.target.value)} placeholder="E.G. CAS, CBA, COT..." style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                          </div>
                          <div>
                            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>CONTACT NUMBER (OPTIONAL)</label>
                            <input value={newUserContact} onChange={e => setNewUserContact(e.target.value)} placeholder="E.G. 09XX XXX XXXX..." style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                          </div>
                          <button type="submit" className="btn-cyan" style={{ padding: "1.1rem", gridColumn: "span 2" }}>PROVISION USER IDENTITY</button>
                        </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {activeTab === "Audit" && (
              <motion.div key="audit" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                 <div className="sapphire-card" style={{ padding: "0" }}>
                    <div style={{ padding: "2rem", borderBottom: "1px solid var(--border-dim)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                       <h2 style={{ fontSize: "0.85rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <History size={18} color="var(--primary)" /> GOVERNANCE AUDIT LEDGER
                       </h2>
                       <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>ENCRYPTED LOGS</p>
                    </div>

                    <div style={{ maxHeight: "70vh", overflowY: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
                          <tr style={{ textAlign: "left", fontSize: "0.6rem", color: "var(--text-dim)", fontWeight: "900", letterSpacing: "0.1em", background: "var(--bg-accent)" }}>
                            <th style={{ padding: "1.25rem 2rem" }}>STAMP</th>
                            <th style={{ padding: "1.25rem 2rem" }}>AGENT</th>
                            <th style={{ padding: "1.25rem 2rem" }}>ACTION_ID</th>
                            <th style={{ padding: "1.25rem 2rem" }}>PAYLOAD_DETAILS</th>
                            <th style={{ padding: "1.25rem 2rem" }}>SEV</th>
                          </tr>
                        </thead>
                        <tbody style={{ fontSize: "0.65rem" }}>
                          {auditLogs.map((log: any) => (
                            <tr key={log.id} style={{ borderBottom: "1px solid var(--border-dim)", background: log.severity === "CRITICAL" ? "rgba(239, 68, 68, 0.03)" : "transparent" }}>
                              <td style={{ padding: "1.25rem 2rem", whiteSpace: "nowrap" }}>
                                 <p style={{ fontWeight: "700", color: "var(--text-main)" }}>{log.timestamp.split(",")[0]}</p>
                                 <p style={{ fontSize: "0.5rem", color: "var(--text-dim)", fontWeight: "900" }}>{log.timestamp.split(",")[1]}</p>
                              </td>
                              <td style={{ padding: "1.25rem 2rem" }}>
                                 <p style={{ fontWeight: "900", color: "var(--text-main)" }}>{log.user.toUpperCase()}</p>
                                 <p style={{ fontSize: "0.5rem", color: "var(--primary)", fontWeight: "900" }}>{log.role}</p>
                              </td>
                              <td style={{ padding: "1.25rem 2rem" }}>
                                 <span style={{ fontWeight: "900", color: "var(--text-main)", letterSpacing: "0.05em" }}>{log.action}</span>
                              </td>
                              <td style={{ padding: "1.25rem 2rem", color: "var(--text-dim)", fontWeight: "600", fontSize: "0.6rem" }}>
                                 {log.details}
                              </td>
                              <td style={{ padding: "1.25rem 2rem" }}>
                                 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: getSeverityColor(log.severity), boxShadow: `0 0 8px ${getSeverityColor(log.severity)}` }} className={log.severity === "CRITICAL" ? "animate-pulse" : ""} />
                                    <span style={{ fontWeight: "900", color: getSeverityColor(log.severity), fontSize: "0.55rem" }}>{log.severity}</span>
                                 </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "Health" && (
              <motion.div key="health" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                    <div className="sapphire-card">
                       <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <Cpu size={18} color="var(--primary)" /> COMPUTE HEALTH
                       </h3>
                       <div style={{ display: "grid", gap: "1.5rem" }}>
                          {[
                            { label: "MEMORY_USAGE", value: "342MB", status: "STABLE" },
                            { label: "API_LATENCY", value: "24ms", status: "OPTIMAL" },
                            { label: "DATABASE_IO", value: "89%", status: "NOMINAL" }
                          ].map(s => (
                            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                               <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>{s.label}</span>
                               <span style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-main)" }}>{s.value} <span style={{ color: "#10b981", fontSize: "0.5rem", marginLeft: "0.5rem" }}>[{s.status}]</span></span>
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="sapphire-card">
                       <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
                          <Lock size={18} color="var(--primary)" /> SECURITY STATUS
                       </h3>
                       <div style={{ display: "grid", gap: "1.5rem" }}>
                          {[
                            { label: "ENCRYPTION", value: "AES-256", status: "ACTIVE" },
                            { label: "AUTH_PROTOCOL", value: "CRED_HARDENED", status: "ENABLED" },
                            { label: "IDENTITY_AUDIT", value: "LIVE_LEDGER", status: "SYNCED" }
                          ].map(s => (
                            <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                               <span style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>{s.label}</span>
                               <span style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-main)" }}>{s.value} <span style={{ color: "var(--primary)", fontSize: "0.5rem", marginLeft: "0.5rem" }}>[{s.status}]</span></span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* SYSTEM TELEMETRY */}
        <aside>
          <div className="sapphire-card" style={{ marginBottom: "2rem" }}>
             <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem", color: "#10b981" }}>
               <Activity size={18} /> SYSTEM INSIGHTS
             </h3>
             {health && (
               <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {[
                    { label: "TOTAL IDENTITY NODES", value: health.userCount },
                    { label: "SCHOLARSHIP ASSETS", value: health.appCount },
                    { label: "SERVICE PROTOCOL LOGS", value: health.reqCount }
                  ].map((stat) => (
                    <div key={stat.label}>
                       <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "0.5rem" }}>{stat.label}</p>
                       <p style={{ fontSize: "1.25rem", fontWeight: "900", color: "var(--text-main)" }}>{stat.value}</p>
                    </div>
                  ))}
               </div>
             )}
          </div>

          <div className="sapphire-card" style={{ borderTop: "4px solid var(--primary)" }}>
            <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem" }}>USER ACTIONS</h3>
            {selectedUser ? (
              <div style={{ display: "grid", gap: "1rem" }}>
                  <div style={{ padding: "1.25rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
                    <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>SELECTED USER</p>
                    <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)" }}>{selectedUser.name.toUpperCase()}</p>
                    <p style={{ fontSize: "0.6rem", fontWeight: "700", color: "var(--primary)", marginTop: "0.25rem" }}>ID: {selectedUser.username || "UNSET"}</p>
                  </div>

                  <div style={{ display: "grid", gap: "0.75rem", marginTop: "1rem" }}>
                    <button onClick={() => startEdit(selectedUser)} style={{ width: "100%", padding: "1rem", background: "var(--primary)", border: "none", color: "var(--text-dark)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>
                       EDIT IDENTITY
                    </button>
                    <button onClick={() => handleToggleArchive(selectedUser.id)} style={{ width: "100%", padding: "1rem", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>
                      {selectedUser.status === "Archived" ? "RESTORE IDENTITY" : "ARCHIVE IDENTITY"}
                    </button>
                    <button onClick={() => setSelectedUser(null)} style={{ width: "100%", padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-dim)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>DESELECT</button>
                    <button onClick={() => handleDeleteUser(selectedUser.id)} style={{ width: "100%", padding: "1rem", background: "rgba(239, 68, 68, 0.05)", border: "1px solid #ef4444", color: "#ef4444", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>PURGE IDENTITY</button>
                  </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "4rem", color: "var(--text-dim)" }}>
                  <Shield size={40} style={{ margin: "0 auto 1.5rem", opacity: 0.1 }} />
                  <p style={{ fontSize: "0.6rem", fontWeight: "900", letterSpacing: "0.1em" }}>SELECT A USER TO EDIT</p>
              </div>
            )}
          </div>

          <div className="sapphire-card" style={{ marginTop: "2rem" }}>
             <h3 style={{ fontSize: "0.75rem", fontWeight: "900", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
               <Database size={18} color="var(--primary)" /> DATA MANAGEMENT
             </h3>
             <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
                {[
                  { label: "EXPORT DATA JSON", icon: <Download size={14} />, action: () => {} },
                  { label: "REFRESH GLOBAL STATE", icon: <RefreshCcw size={14} />, action: fetchData },
                ].map((tool) => (
                  <button 
                    key={tool.label}
                    onClick={tool.action}
                    style={{ width: "100%", padding: "1rem", background: "var(--bg-surface)", border: "none", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", transition: "all 0.2s" }}
                  >
                    <span style={{ color: "var(--primary)" }}>{tool.icon}</span> {tool.label}
                  </button>
                ))}
                <div style={{ height: "1px", background: "var(--border-dim)" }} />
                <button 
                  onClick={handleClearAppointments}
                  style={{ width: "100%", padding: "1.25rem 1rem", background: "rgba(239, 68, 68, 0.05)", border: "none", color: "#ef4444", fontSize: "0.65rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer", borderBottom: "1px solid var(--border-dim)" }}
                >
                  <Trash2 size={14} /> WIPE APPOINTMENT DATA
                </button>
                <button 
                  onClick={handleAnnualArchive}
                  style={{ width: "100%", padding: "1.25rem 1rem", background: "rgba(245, 158, 11, 0.05)", border: "none", color: "#f59e0b", fontSize: "0.65rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}
                >
                  <Archive size={14} /> EXECUTE ANNUAL ARCHIVE
                </button>
             </div>
          </div>
        </aside>

      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditingUser && (
           <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(10px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} style={{ width: "100%", maxWidth: "600px", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", padding: "3rem" }}>
                 <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3rem" }}>
                    <h3 style={{ fontSize: "0.85rem", fontWeight: "900" }}>IDENTITY MODIFICATION TERMINAL</h3>
                    <button onClick={() => setIsEditingUser(false)} style={{ background: "none", border: "none", color: "var(--text-dim)", cursor: "pointer" }}><Lock size={18} /></button>
                 </div>
                 <form onSubmit={handleUpdateUser} style={{ display: "grid", gap: "2rem" }}>
                    <div>
                       <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>FULL NAME</label>
                       <input value={editName} onChange={e => setEditName(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                    </div>
                    <div>
                       <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>USERNAME / ID</label>
                       <input value={editUsername} onChange={e => setEditUsername(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                    </div>
                    <div>
                       <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>AUTHORIZATION LEVEL</label>
                       <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)" }}>
                          <option value="STUDENT_APPLICANT">STUDENT</option>
                          <option value="STUDENT_LEADER">STUDENT LEADER</option>
                          <option value="OSAS_DIRECTOR">OSAS DIRECTOR</option>
                          <option value="GUIDANCE_COUNSELOR">GUIDANCE COUNSELOR</option>
                          <option value="ADVISER">FACULTY ADVISER</option>
                          <option value="SYSTEM_ADMIN">SYSTEM ADMIN</option>
                       </select>
                    </div>
                    <div>
                       <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>RESET PASSWORD</label>
                       <input type="password" value={editPassword} onChange={e => setEditPassword(e.target.value)} placeholder="••••••••" style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                    </div>
                    <div>
                       <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>DEPARTMENT</label>
                       <input value={editDept} onChange={e => setEditDept(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                    </div>
                    <div>
                       <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>CONTACT</label>
                       <input value={editContact} onChange={e => setEditContact(e.target.value)} style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700" }} />
                    </div>
                    <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                       <button onClick={() => setIsEditingUser(false)} type="button" style={{ flex: 1, padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", color: "var(--text-main)", fontSize: "0.65rem", fontWeight: "900", cursor: "pointer" }}>CANCEL</button>
                       <button type="submit" className="btn-cyan" style={{ flex: 2, padding: "1rem" }}>COMMIT CHANGES</button>
                    </div>
                 </form>
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
