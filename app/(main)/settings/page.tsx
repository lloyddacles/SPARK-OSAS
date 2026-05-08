"use client";

import { motion } from "framer-motion";
import { 
  Palette, 
  Moon, 
  Sun, 
  Leaf, 
  Check, 
  Layout, 
  Settings as SettingsIcon,
  Bell,
  Shield,
  User,
  Monitor,
  Fingerprint,
  Database,
  ArrowRight,
  Save
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useState } from "react";

export default function SettingsPage() {
  const { theme, toggleTheme, currentUser, updateProfile, addNotification } = useGlobalState();
  const [activeSection, setActiveSection] = useState("Appearance");

  // Profile State
  const [profileData, setProfileData] = useState({
    email: currentUser?.email || "",
    contactNumber: currentUser?.contactNumber || "",
    address: currentUser?.address || "",
    department: currentUser?.department || "",
    advisorySection: currentUser?.advisorySection || ""
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile(profileData);
    addNotification("Profile Updated", "Your contact details have been saved successfully.");
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const themes = [
    { 
      id: "midnight", 
      label: "Dark Mode", 
      desc: "Easy on the eyes with a dark background and cyan accents.", 
      colors: ["#0f172a", "#38bdf8", "#1e293b"],
      icon: <Moon size={20} />
    },
    { 
      id: "ivory", 
      label: "Light Mode", 
      desc: "Clean and bright — Analytics Dashboard default.", 
      colors: ["#f8fafc", "#3b82f6", "#ffffff"],
      icon: <Sun size={20} />
    }
  ];

  const sections = [
    { label: "Appearance", icon: <Palette size={18} /> },
    { label: "My Profile", icon: <User size={18} /> },
    { label: "Security", icon: <Shield size={18} /> },
    { label: "System", icon: <Database size={18} /> }
  ];

  return (
    <div style={{ width: "100%", maxWidth: "1400px", margin: "0 auto" }}>
      
      {/* Analytics Header */}
      <div style={{ marginBottom: "3rem" }}>
        <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Account</p>
        <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
          Set<span style={{ color: "#3b82f6" }}>tings</span>
        </h1>
        <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "400px", lineHeight: "1.5" }}>Manage your profile, appearance, and account preferences.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "3rem", alignItems: "start" }}>
        
        {/* Settings Navigation */}
        <aside>
          <div style={{ background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", overflow: "hidden" }}>
            {sections.map((item, index) => {
              const isActive = activeSection === item.label;
              return (
                <button 
                  key={item.label}
                  onClick={() => setActiveSection(item.label)}
                  style={{ 
                    width: "100%", 
                    textAlign: "left", 
                    padding: "1.25rem 1.5rem", 
                    background: isActive ? "#eff6ff" : "white",
                    color: isActive ? "#3b82f6" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    fontWeight: "700",
                    fontSize: "0.9rem",
                    border: "none",
                    borderBottom: index !== sections.length - 1 ? "1px solid #f1f5f9" : "none",
                    borderLeft: isActive ? "4px solid #3b82f6" : "4px solid transparent",
                    transition: "all 0.2s",
                    cursor: "pointer"
                  }}
                  className="hover:bg-slate-50"
                >
                  {item.icon} {item.label}
                </button>
              )
            })}
          </div>

          <div style={{ marginTop: "2.5rem", padding: "1.5rem", background: "white", border: "1px solid #f3f4f6", borderRadius: "16px", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
             <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "#1e293b", marginBottom: "1rem" }}>System Status</p>
             <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{ width: "10px", height: "10px", background: "#10b981", borderRadius: "50%", boxShadow: "0 0 0 3px #d1fae5" }} />
                <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>All systems operational</p>
             </div>
          </div>
        </aside>

        {/* Settings Content */}
        <main style={{ minWidth: 0 }}>
          
          {activeSection === "Appearance" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <section style={{ background: "white", padding: "3rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ width: "48px", height: "48px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", border: "1px solid #bfdbfe", borderRadius: "12px" }}>
                    <Palette size={24} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b" }}>Theme Configuration</h2>
                    <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500", marginTop: "0.25rem" }}>Choose how the interface looks for you.</p>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "1rem" }}>
                  {themes.map((t) => {
                    const isSelected = theme === t.id;
                    return (
                      <button 
                        key={t.id}
                        onClick={() => toggleTheme()}
                        style={{ 
                          width: "100%", 
                          textAlign: "left", 
                          padding: "1.5rem", 
                          background: isSelected ? "#f8fafc" : "white", 
                          display: "flex",
                          alignItems: "center",
                          gap: "2rem",
                          cursor: "pointer",
                          border: isSelected ? "2px solid #3b82f6" : "1px solid #e2e8f0",
                          borderRadius: "12px",
                          transition: "all 0.2s"
                        }}
                      >
                        <div style={{ width: "56px", height: "56px", background: t.colors[0], border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: t.colors[1], borderRadius: "12px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
                           {t.icon}
                        </div>
                        <div style={{ flex: 1 }}>
                           <h3 style={{ fontWeight: "800", fontSize: "1.1rem", color: "#1e293b", marginBottom: "0.25rem" }}>{t.label}</h3>
                           <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500" }}>{t.desc}</p>
                        </div>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          {t.colors.map(c => <div key={c} style={{ width: "16px", height: "16px", borderRadius: "50%", background: c, border: "1px solid #e2e8f0", boxShadow: "inset 0 1px 2px rgba(0,0,0,0.1)" }} />)}
                        </div>
                        <div style={{ marginLeft: "1.5rem", color: isSelected ? "#3b82f6" : "transparent" }}>
                          <Check size={24} strokeWidth={3} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {activeSection === "My Profile" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <section style={{ background: "white", padding: "3rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                 <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                    <div style={{ width: "48px", height: "48px", background: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", color: "#3b82f6", border: "1px solid #bfdbfe", borderRadius: "12px" }}>
                      <User size={24} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b" }}>My Profile</h2>
                      <p style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500", marginTop: "0.25rem" }}>Update your personal and contact details.</p>
                    </div>
                 </div>

                 <form onSubmit={handleSaveProfile} style={{ display: "grid", gap: "2rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Full Name</label>
                          <div style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "0.95rem", fontWeight: "600", color: "#1e293b", borderRadius: "12px" }}>
                             {currentUser?.name || "—"}
                          </div>
                       </div>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Role</label>
                          <div style={{ padding: "1.25rem", background: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "0.95rem", fontWeight: "700", color: "#3b82f6", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                             <Shield size={16} /> {currentUser?.role?.split('_').join(' ') || "No role assigned"}
                          </div>
                       </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Email Address</label>
                          <input 
                            required type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})}
                            placeholder="Enter your email address"
                            style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "white", border: "1px solid #cbd5e1", color: "#1e293b", outline: "none", borderRadius: "12px" }}
                          />
                       </div>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Contact Number</label>
                          <input 
                            required type="tel" value={profileData.contactNumber} onChange={e => setProfileData({...profileData, contactNumber: e.target.value})}
                            placeholder="e.g., 09123456789"
                            style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "white", border: "1px solid #cbd5e1", color: "#1e293b", outline: "none", borderRadius: "12px" }}
                          />
                       </div>
                    </div>

                    {(currentUser?.role === "STUDENT_APPLICANT" || currentUser?.role === "STUDENT_LEADER") && (
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Home Address</label>
                          <textarea 
                            required value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})}
                            placeholder="Enter your full residential address..." rows={3}
                            style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "white", border: "1px solid #cbd5e1", color: "#1e293b", outline: "none", borderRadius: "12px", resize: "vertical" }}
                          />
                       </div>
                    )}

                    {currentUser?.role === "ADVISER" && (
                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                          <div>
                             <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Department / College</label>
                             <input 
                               required value={profileData.department} onChange={e => setProfileData({...profileData, department: e.target.value})}
                               placeholder="e.g., College of Engineering"
                               style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "white", border: "1px solid #cbd5e1", color: "#1e293b", outline: "none", borderRadius: "12px" }}
                             />
                          </div>
                          <div>
                             <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Advisory Section</label>
                             <input 
                               required value={profileData.advisorySection} onChange={e => setProfileData({...profileData, advisorySection: e.target.value})}
                               placeholder="e.g., BSCS 3A"
                               style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "white", border: "1px solid #cbd5e1", color: "#1e293b", outline: "none", borderRadius: "12px" }}
                             />
                          </div>
                       </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "1rem", paddingTop: "2rem", borderTop: "1px solid #f1f5f9" }}>
                      <button type="submit" disabled={isSaving} style={{ padding: "1.25rem 2.5rem", background: "#3b82f6", color: "white", borderRadius: "12px", border: "none", fontSize: "1rem", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.75rem", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)" }}>
                         <Save size={18} /> {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                      {saveSuccess && (
                         <span style={{ fontSize: "0.9rem", fontWeight: "700", color: "#10b981", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Check size={18} /> Saved successfully!
                         </span>
                      )}
                    </div>
                 </form>
              </section>
            </motion.div>
          )}

          {activeSection === "Security" && (
            <div style={{ padding: "6rem 2rem", textAlign: "center", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
               <Shield size={64} color="#cbd5e1" style={{ marginBottom: "1.5rem", margin: "0 auto" }} />
               <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>Security Configuration</h2>
               <p style={{ fontSize: "0.95rem", fontWeight: "500", color: "#64748b" }}>Advanced security settings will be available in the next system update.</p>
            </div>
          )}

          {activeSection === "System" && (
            <div style={{ padding: "6rem 2rem", textAlign: "center", background: "white", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
               <Database size={64} color="#cbd5e1" style={{ marginBottom: "1.5rem", margin: "0 auto" }} />
               <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>System Architecture</h2>
               <p style={{ fontSize: "0.95rem", fontWeight: "500", color: "#64748b" }}>System diagnostics and logging details will be available here.</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
