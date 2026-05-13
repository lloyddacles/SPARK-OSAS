"use client";

import { useGlobalState } from "@/lib/GlobalStateContext";
import { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Edit2,
  ShieldCheck,
  ShieldAlert,
  ArrowRight,
  ChevronRight,
  MoreHorizontal
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { updateUser, toggleUserArchive, deleteUser, createUser } from "@/lib/actions/adminActions";

export default function UserManagementPage() {
  const { users, currentUser, logAudit, addNotification } = useGlobalState();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const router = useRouter();

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: "",
    username: "",
    email: "",
    role: "STUDENT_APPLICANT",
    program: "",
    password: "Password123!" // Default
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.username?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "ALL" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleToggleArchive = async (userId: string) => {
    try {
      await toggleUserArchive(userId);
      addNotification("Success", "User status updated successfully.");
      logAudit("USER_STATUS_TOGGLE", `Changed status for user ID: ${userId}`, "MEDIUM");
    } catch (e) {
      addNotification("Error", "Failed to update user status.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to permanently delete this user? This action cannot be undone.")) return;
    try {
      await deleteUser(userId);
      addNotification("Success", "User deleted permanently.");
      logAudit("USER_DELETED", `Deleted user ID: ${userId}`, "HIGH");
    } catch (e: any) {
      addNotification("Error", e.message || "Failed to delete user.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createUser(newUser);
      if (res.success) {
        setIsAddingUser(false);
        setNewUser({ name: "", username: "", email: "", role: "STUDENT_APPLICANT", password: "Password123!" });
        addNotification("Success", "User account provisioned successfully.");
        logAudit("USER_CREATED", `Created new user: ${newUser.name} (${newUser.role})`, "MEDIUM");
      } else {
        addNotification("Error", res.message || "Failed to create user.");
      }
    } catch (e) {
      addNotification("Error", "An unexpected error occurred.");
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SYSTEM_ADMIN": return { text: "#ef4444", bg: "#fef2f2", border: "#fecaca" };
      case "OSAS_DIRECTOR": return { text: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe" };
      case "GUIDANCE_COUNSELOR": return { text: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" };
      case "ADVISER": return { text: "#8b5cf6", bg: "#f5f3ff", border: "#ddd6fe" };
      default: return { text: "#64748b", bg: "#f8fafc", border: "#e2e8f0" };
    }
  };

  return (
    <div style={{ padding: "3rem", maxWidth: "1600px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Administration</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            User <span style={{ color: "#3b82f6" }}>Management</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "600px", lineHeight: "1.5" }}>Provision new accounts, manage roles, and monitor user access across the SPARK ecosystem.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
           <button onClick={() => setIsAddingUser(true)} style={{ padding: "1rem 2rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "0.9rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
             <UserPlus size={18} /> Provision User
           </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div style={{ background: "white", padding: "1.25rem", borderRadius: "16px", marginBottom: "2rem", display: "flex", gap: "1rem", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={18} style={{ position: "absolute", left: "1.25rem", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
          <input 
            type="text" 
            placeholder="Search by name, email, or username..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: "100%", 
              background: "#f8fafc", 
              border: "1px solid #e2e8f0", 
              padding: "1rem 1rem 1rem 3rem", 
              borderRadius: "10px",
              color: "#1e293b",
              fontSize: "0.95rem",
              fontWeight: "500",
              outline: "none"
            }} 
          />
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
           {["ALL", "SYSTEM_ADMIN", "OSAS_DIRECTOR", "GUIDANCE_COUNSELOR", "STUDENT_APPLICANT", "ADVISER"].map(role => (
              <button 
                key={role}
                onClick={() => setFilterRole(role)}
                style={{ 
                  padding: "0 1rem", 
                  background: filterRole === role ? "#eff6ff" : "white", 
                  border: filterRole === role ? "1px solid #3b82f6" : "1px solid #e2e8f0", 
                  borderRadius: "10px", 
                  color: filterRole === role ? "#3b82f6" : "#64748b", 
                  fontSize: "0.75rem",
                  fontWeight: "800", 
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {role === "ALL" ? "All Roles" : role.replace('_', ' ')}
              </button>
           ))}
        </div>
      </div>

      {/* USERS TABLE */}
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid #f3f4f6", boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", background: "#f8fafc", borderBottom: "1px solid #f1f5f9" }}>
              <th style={{ padding: "1.5rem 2rem", fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>User Identity</th>
              <th style={{ padding: "1.5rem 2rem", fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Program</th>
              <th style={{ padding: "1.5rem 2rem", fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Access Role</th>
              <th style={{ padding: "1.5rem 2rem", fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Status</th>
              <th style={{ padding: "1.5rem 2rem", fontSize: "0.75rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.map((user, i) => {
                const colors = getRoleColor(user.role);
                const isArchived = (user as any).status === "Archived";
                
                return (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ borderBottom: "1px solid #f1f5f9", transition: "background 0.2s" }}
                    className="hover:bg-slate-50"
                  >
                    <td style={{ padding: "1.5rem 2rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                         <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: colors.bg, display: "flex", alignItems: "center", justifyContent: "center", color: colors.text, fontWeight: "900", fontSize: "1.2rem", border: `1px solid ${colors.border}` }}>
                            {user.name.charAt(0)}
                         </div>
                         <div>
                            <p style={{ fontWeight: "800", color: "#1e293b", fontSize: "1rem" }}>{user.name}</p>
                            <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500" }}>{user.email || user.username}</p>
                         </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.5rem 2rem" }}>
                       {user.program ? (
                         <span style={{ 
                           fontSize: "0.75rem", 
                           fontWeight: "900", 
                           padding: "0.4rem 0.8rem", 
                           background: user.program === "BSE" ? "#7f1d1d15" : 
                                      user.program === "BSIS" ? "#1e3a8a15" :
                                      user.program === "BSTM" ? "#581c8715" :
                                      user.program === "BSCRIM" ? "#7c2d1215" :
                                      (user.program === "BSA" || user.program === "BSAIS") ? "#713f1215" :
                                      user.program === "SHS" ? "#064e3b15" : "#f1f5f9",
                           color: user.program === "BSE" ? "#7f1d1d" : 
                                  user.program === "BSIS" ? "#1e3a8a" :
                                  user.program === "BSTM" ? "#581c87" :
                                  user.program === "BSCRIM" ? "#7c2d12" :
                                  (user.program === "BSA" || user.program === "BSAIS") ? "#713f12" :
                                  user.program === "SHS" ? "#064e3b" : "#64748b",
                           borderRadius: "6px",
                           border: "1px solid currentColor"
                         }}>
                           {user.program}
                         </span>
                       ) : (
                         <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600" }}>No Program</span>
                       )}
                    </td>
                    <td style={{ padding: "1.5rem 2rem" }}>
                       <span style={{ 
                         fontSize: "0.75rem", 
                         fontWeight: "800", 
                         padding: "0.4rem 1rem", 
                         background: colors.bg, 
                         color: colors.text,
                         border: `1px solid ${colors.border}`,
                         borderRadius: "20px",
                         display: "inline-flex",
                         alignItems: "center",
                         gap: "0.5rem"
                       }}>
                         <Shield size={14} /> {user.role.replace('_', ' ')}
                       </span>
                    </td>
                    <td style={{ padding: "1.5rem 2rem" }}>
                       <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isArchived ? "#94a3b8" : "#10b981" }} />
                          <span style={{ fontSize: "0.85rem", fontWeight: "700", color: isArchived ? "#64748b" : "#1e293b" }}>
                            {isArchived ? "Archived" : "Active"}
                          </span>
                       </div>
                    </td>
                    <td style={{ padding: "1.5rem 2rem" }}>
                       <div style={{ display: "flex", gap: "0.75rem" }}>
                          <button onClick={() => setSelectedUser(user)} title="Edit Profile" style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#64748b", cursor: "pointer" }} className="hover:text-blue-600 hover:border-blue-200"><Edit2 size={16} /></button>
                          <button onClick={() => handleToggleArchive(user.id)} title={isArchived ? "Unarchive" : "Archive"} style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: isArchived ? "#3b82f6" : "#f59e0b", cursor: "pointer" }} className="hover:bg-slate-50"><Archive size={16} /></button>
                          <button onClick={() => handleDeleteUser(user.id)} title="Delete" style={{ padding: "0.6rem", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#ef4444", cursor: "pointer" }} className="hover:bg-red-50"><Trash2 size={16} /></button>
                       </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
        {filteredUsers.length === 0 && (
           <div style={{ padding: "6rem 2rem", textAlign: "center" }}>
              <Users size={64} color="#e2e8f0" style={{ margin: "0 auto 1.5rem" }} />
              <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b" }}>No users found</h3>
              <p style={{ color: "#64748b", marginTop: "0.5rem" }}>Try adjusting your search or role filters.</p>
           </div>
        )}
      </div>

      {/* PROVISION MODAL */}
      <AnimatePresence>
        {isAddingUser && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ width: "100%", maxWidth: "500px", background: "white", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)", overflow: "hidden" }}
            >
               <div style={{ padding: "2rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#111827" }}>Provision User</h2>
                  <button onClick={() => setIsAddingUser(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><XCircle size={24} /></button>
               </div>
               <form onSubmit={handleCreateUser} style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Full Name</label>
                    <input required value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="e.g. Juan Dela Cruz" style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Username</label>
                      <input required value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="juandlc" style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Role</label>
                      <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})} style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }}>
                         <option value="STUDENT_APPLICANT">Student</option>
                         <option value="ADVISER">Faculty/Adviser</option>
                         <option value="GUIDANCE_COUNSELOR">Guidance</option>
                         <option value="OSAS_DIRECTOR">OSAS Director</option>
                         <option value="SYSTEM_ADMIN">System Admin</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Institutional Program (for Students)</label>
                    <select value={newUser.program} onChange={e => setNewUser({...newUser, program: e.target.value})} style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }}>
                       <option value="">None / Not Applicable</option>
                       <option value="BSIS">BSIS (Information Systems)</option>
                       <option value="BSE">BSE (Education)</option>
                       <option value="BSTM">BSTM (Tourism Management)</option>
                       <option value="BSCRIM">BSCRIM (Criminology)</option>
                       <option value="BSA">BSA (Accountancy)</option>
                       <option value="BSAIS">BSAIS (Accounting IS)</option>
                       <option value="SHS">SHS (Senior High)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "800", color: "#475569" }}>Email Address</label>
                    <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="juan@university.edu" style={{ width: "100%", padding: "1rem", borderRadius: "10px", border: "1px solid #e2e8f0", background: "#f8fafc", outline: "none" }} />
                  </div>
                  <div style={{ padding: "1.25rem", background: "#eff6ff", borderRadius: "12px", border: "1px solid #bfdbfe", display: "flex", gap: "1rem" }}>
                     <ShieldCheck size={20} color="#3b82f6" />
                     <p style={{ fontSize: "0.85rem", color: "#1e40af", fontWeight: "600", lineHeight: "1.5" }}>Account will be created with default password: <code style={{ fontWeight: "800" }}>Password123!</code>. User should change this upon first login.</p>
                  </div>
                  <button type="submit" style={{ width: "100%", padding: "1.25rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>Provision Account</button>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {selectedUser && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              style={{ width: "100%", maxWidth: "600px", background: "white", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.2)", overflow: "hidden" }}
            >
               <div style={{ padding: "2rem", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#111827" }}>Edit Profile</h2>
                    <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "600" }}>UID: {selectedUser.id}</p>
                  </div>
                  <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer" }}><XCircle size={24} /></button>
               </div>
               
               <div style={{ padding: "2rem" }}>
                  <div style={{ display: "flex", gap: "2rem", marginBottom: "2rem" }}>
                     <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: "900", color: "#3b82f6" }}>
                        {selectedUser.name.charAt(0)}
                     </div>
                     <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#1e293b", marginBottom: "0.5rem" }}>{selectedUser.name}</h3>
                        <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem" }}><Mail size={16} /> {selectedUser.email || "No email provided"}</p>
                        <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.4rem" }}><Shield size={16} /> Role: {selectedUser.role}</p>
                     </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                     <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", marginBottom: "0.5rem" }}>Username</p>
                        <p style={{ fontWeight: "700", color: "#1e293b" }}>{selectedUser.username || "—"}</p>
                     </div>
                     <div style={{ padding: "1.5rem", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                        <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#64748b", marginBottom: "0.5rem" }}>Institutional Program</p>
                        <p style={{ fontWeight: "700", color: selectedUser.program ? "#3b82f6" : "#1e293b" }}>{selectedUser.program || "General Records"}</p>
                     </div>
                  </div>

                  <div style={{ display: "flex", gap: "1rem" }}>
                     <button onClick={() => { setSelectedUser(null); router.push(`/admin/passport?id=${selectedUser.id}`); }} style={{ flex: 1, padding: "1rem", background: "#eff6ff", color: "#3b82f6", border: "1px solid #bfdbfe", borderRadius: "12px", fontWeight: "800", fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem" }}>
                        <Search size={18} /> View Passport
                     </button>
                     <button onClick={() => setSelectedUser(null)} style={{ flex: 1, padding: "1rem", background: "white", border: "1px solid #e2e8f0", color: "#475569", borderRadius: "12px", fontWeight: "800", fontSize: "0.9rem", cursor: "pointer" }}>
                        Close
                     </button>
                  </div>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
