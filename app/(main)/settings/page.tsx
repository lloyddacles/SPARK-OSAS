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
  ArrowRight
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import { useState } from "react";

export default function SettingsPage() {
  const { theme, toggleTheme, currentUser, updateProfile, addNotification } = useGlobalState();
  const [activeSection, setActiveSection] = useState("PERSONALIZATION");

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
    addNotification("Profile Updated", "Your institutional contact details have been securely updated.");
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const themes = [
    { 
      id: "midnight", 
      label: "SAPPHIRE DARK", 
      desc: "High-density command interface with Cyan accents.", 
      colors: ["#05070a", "#00e5ff", "#0a0c1b"],
      icon: <Moon size={18} />
    },
    { 
      id: "ivory", 
      label: "IVORY LIGHT", 
      desc: "High-contrast academic mode for document auditing.", 
      colors: ["#f8fafc", "#2563eb", "#ffffff"],
      icon: <Sun size={18} />
    }
  ];

  const sections = [
    { label: "PERSONALIZATION", icon: <Palette size={16} /> },
    { label: "MY PROFILE", icon: <User size={16} /> },
    { label: "SECURITY VAULT", icon: <Shield size={16} /> },
    { label: "SYSTEM NODES", icon: <Database size={16} /> }
  ];

  return (
    <div style={{ width: "100%" }}>
      
      {/* Sapphire Header */}
      <div style={{ marginBottom: "4rem" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>SYSTEM: CONFIGURATION</p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
          USER <span style={{ color: "var(--primary)" }}>PREFERENCES</span>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "4rem" }}>
        
        {/* Settings Navigation */}
        <aside>
          <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "var(--border-dim)" }}>
            {sections.map((item) => (
              <button 
                key={item.label}
                onClick={() => setActiveSection(item.label)}
                style={{ 
                  width: "100%", 
                  textAlign: "left", 
                  padding: "1.25rem 1.5rem", 
                  background: activeSection === item.label ? "rgba(0, 229, 255, 0.05)" : "var(--bg-surface)",
                  color: activeSection === item.label ? "var(--primary)" : "var(--text-dim)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1.25rem",
                  fontWeight: "900",
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  border: "none",
                  borderLeft: activeSection === item.label ? "2px solid var(--primary)" : "2px solid transparent",
                  transition: "all 0.2s",
                  cursor: "pointer"
                }}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </div>

          <div style={{ marginTop: "3rem", padding: "1.5rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
             <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em" }}>SYSTEM INTEGRITY</p>
             <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
                <div style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%" }} />
                <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--text-main)" }}>ENCRYPTION: ACTIVE</p>
             </div>
          </div>
        </aside>

        {/* Settings Content */}
        <main style={{ minWidth: 0 }}>
          
          {activeSection === "PERSONALIZATION" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <section className="sapphire-card" style={{ marginBottom: "2rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
                  <div style={{ width: "40px", height: "40px", background: "rgba(0, 229, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", border: "1px solid var(--border-dim)" }}>
                    <Palette size={18} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: "1rem", fontWeight: "900", color: "var(--text-main)" }}>VISUAL ENVIRONMENT</h2>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", marginTop: "0.25rem" }}>Configure the aesthetic core of your SPARK command center.</p>
                  </div>
                </div>

                <div style={{ display: "grid", gap: "1px", background: "var(--border-dim)" }}>
                  {themes.map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => toggleTheme()}
                      style={{ 
                        width: "100%", 
                        textAlign: "left", 
                        padding: "1.5rem", 
                        background: "var(--bg-surface)", 
                        display: "flex",
                        alignItems: "center",
                        gap: "2rem",
                        cursor: "pointer",
                        border: "none",
                        transition: "all 0.2s"
                      }}
                    >
                      <div style={{ width: "48px", height: "48px", background: t.colors[0], border: "1px solid var(--border-dim)", display: "flex", alignItems: "center", justifyContent: "center", color: t.colors[1] }}>
                         {t.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                         <h3 style={{ fontWeight: "900", fontSize: "0.8rem", color: "var(--text-main)" }}>{t.label}</h3>
                         <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", marginTop: "0.25rem" }}>{t.desc}</p>
                      </div>
                      <div style={{ display: "flex", gap: "0.4rem" }}>
                        {t.colors.map(c => <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c, border: "1px solid var(--border-dim)" }} />)}
                      </div>
                      {theme === t.id && (
                        <div style={{ marginLeft: "1.5rem", color: "var(--primary)" }}>
                          <Check size={20} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </section>
            </motion.div>
          )}

          {activeSection === "MY PROFILE" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <section className="sapphire-card">
                 <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "3rem" }}>
                    <div style={{ width: "40px", height: "40px", background: "rgba(0, 229, 255, 0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)", border: "1px solid var(--border-dim)" }}>
                      <User size={18} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: "1rem", fontWeight: "900", color: "var(--text-main)" }}>MY PROFILE</h2>
                      <p style={{ fontSize: "0.65rem", color: "var(--text-dim)", fontWeight: "700", marginTop: "0.25rem" }}>Update your personal and institutional contact details.</p>
                    </div>
                 </div>

                 <form onSubmit={handleSaveProfile} style={{ display: "grid", gap: "2rem" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>FULL LEGAL NAME</label>
                          <div style={{ padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", fontSize: "0.85rem", fontWeight: "800", color: "var(--text-main)" }}>
                             {currentUser?.name.toUpperCase() || "UNIDENTIFIED USER"}
                          </div>
                       </div>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>INSTITUTIONAL ROLE</label>
                          <div style={{ padding: "1rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)", fontSize: "0.85rem", fontWeight: "800", color: "var(--primary)" }}>
                             {currentUser?.role?.replace("_", " ").toUpperCase() || "NO ROLE ASSIGNED"}
                          </div>
                       </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>EMAIL ADDRESS</label>
                          <input 
                            required type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})}
                            placeholder="Enter your email address"
                            style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", outline: "none" }}
                          />
                       </div>
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>CONTACT NUMBER</label>
                          <input 
                            required type="tel" value={profileData.contactNumber} onChange={e => setProfileData({...profileData, contactNumber: e.target.value})}
                            placeholder="e.g., 09123456789"
                            style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", outline: "none" }}
                          />
                       </div>
                    </div>

                    {(currentUser?.role === "STUDENT_APPLICANT" || currentUser?.role === "STUDENT_LEADER") && (
                       <div>
                          <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>COMPLETE ADDRESS (For Home Visitation Protocol)</label>
                          <textarea 
                            required value={profileData.address} onChange={e => setProfileData({...profileData, address: e.target.value})}
                            placeholder="Enter your full residential address..." rows={3}
                            style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", outline: "none" }}
                          />
                       </div>
                    )}

                    {currentUser?.role === "ADVISER" && (
                       <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                          <div>
                             <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>DEPARTMENT / COLLEGE</label>
                             <input 
                               required value={profileData.department} onChange={e => setProfileData({...profileData, department: e.target.value})}
                               placeholder="e.g., College of Engineering"
                               style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", outline: "none" }}
                             />
                          </div>
                          <div>
                             <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.6rem", fontWeight: "900", color: "var(--text-dim)" }}>ADVISORY SECTION</label>
                             <input 
                               required value={profileData.advisorySection} onChange={e => setProfileData({...profileData, advisorySection: e.target.value})}
                               placeholder="e.g., BSCS 3A"
                               style={{ width: "100%", padding: "1rem", fontSize: "0.8rem", fontWeight: "700", background: "var(--bg-surface)", border: "1px solid var(--border-dim)", color: "var(--text-main)", outline: "none" }}
                             />
                          </div>
                       </div>
                    )}

                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "1rem" }}>
                      <button type="submit" disabled={isSaving} className="btn-cyan" style={{ padding: "1rem 2rem" }}>
                         {isSaving ? "SAVING..." : "SAVE PROFILE DETAILS"}
                      </button>
                      {saveSuccess && (
                         <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "#10b981", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <Check size={16} /> PROFILE UPDATED SUCCESSFULLY
                         </span>
                      )}
                    </div>
                 </form>
              </section>
            </motion.div>
          )}

          {activeSection === "SECURITY VAULT" && (
            <div style={{ padding: "4rem", textAlign: "center" }}>
               <Shield size={48} style={{ color: "var(--text-dim)", opacity: 0.1, marginBottom: "1rem" }} />
               <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)" }}>SECURITY MODULE RESTRICTED</p>
            </div>
          )}

          {activeSection === "SYSTEM NODES" && (
            <div style={{ padding: "4rem", textAlign: "center" }}>
               <Database size={48} style={{ color: "var(--text-dim)", opacity: 0.1, marginBottom: "1rem" }} />
               <p style={{ fontSize: "0.7rem", fontWeight: "900", color: "var(--text-dim)" }}>SYSTEM TELEMETRY LOCKED</p>
            </div>
          )}
        </main>

      </div>
    </div>
  );
}
