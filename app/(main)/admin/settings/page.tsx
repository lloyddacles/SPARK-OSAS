"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Settings, 
  Save, 
  Palette, 
  Globe, 
  User as UserIcon, 
  Calendar, 
  Lock,
  RefreshCw,
  ShieldCheck,
  Bell,
  Zap,
  Activity
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function SystemSettingsPage() {
  const { currentUser, theme } = useGlobalState();
  const [activeTab, setActiveTab] = useState<"general" | "branding" | "security" | "institutional">("general");
  const [isSaving, setIsSaving] = useState(false);

  // Mock settings state (to be replaced with GlobalState later)
  const [config, setConfig] = useState({
    institutionName: "SPARK UNIVERSITY",
    directorName: "Janneth Calubayan",
    schoolYear: "2023-2024",
    semester: "First Semester",
    primaryColor: "#3b82f6",
    allowPublicApps: true,
    maintenanceMode: false
  });

  if (currentUser?.role !== "SYSTEM_ADMIN" && currentUser?.role !== "OSAS_DIRECTOR") {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "70vh", gap: "1.5rem" }}>
         <Lock size={48} color="#ef4444" />
         <h1 style={{ fontSize: "1.5rem", fontWeight: "900" }}>Access Restricted</h1>
         <p style={{ color: "#64748b" }}>Only OSAS Directors and System Administrators can modify institutional protocols.</p>
      </div>
    );
  }

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert("Institutional protocols synchronized successfully.");
    }, 1500);
  };

  const tabs = [
    { id: "general", label: "General", icon: <Globe size={18} /> },
    { id: "branding", label: "Branding", icon: <Palette size={18} /> },
    { id: "institutional", label: "Institutional", icon: <Calendar size={18} /> },
    { id: "security", label: "Security", icon: <Lock size={18} /> },
  ];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "3rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "900", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "0.5rem" }}>System Governance</p>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#111827", letterSpacing: "-0.02em" }}>Institutional <span style={{ color: "#3b82f6" }}>Settings</span></h1>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{ 
            padding: "1rem 2.5rem", 
            background: "#111827", 
            color: "white", 
            border: "none", 
            borderRadius: "14px", 
            fontSize: "0.95rem", 
            fontWeight: "900", 
            cursor: "pointer", 
            display: "flex", 
            alignItems: "center", 
            gap: "0.75rem",
            boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
          }}
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <><Save size={18} /> Sync Protocols</>}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "3rem" }}>
        {/* Sidebar Tabs */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.25rem 1.5rem",
                background: activeTab === tab.id ? "#eff6ff" : "transparent",
                color: activeTab === tab.id ? "#3b82f6" : "#64748b",
                border: "none",
                borderRadius: "16px",
                fontSize: "0.95rem",
                fontWeight: "800",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          style={{ 
            background: "white", 
            padding: "3rem", 
            borderRadius: "32px", 
            border: "1px solid #f1f5f9",
            boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
          }}
        >
          {activeTab === "general" && (
            <div style={{ display: "grid", gap: "2.5rem" }}>
               <div>
                  <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "900", color: "#1e293b" }}>Institution Name</label>
                  <input 
                    value={config.institutionName} 
                    onChange={e => setConfig({...config, institutionName: e.target.value})}
                    style={{ width: "100%", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "1rem", fontWeight: "600", outline: "none" }} 
                  />
               </div>
               <div>
                  <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "900", color: "#1e293b" }}>OSAS Director</label>
                  <input 
                    value={config.directorName} 
                    onChange={e => setConfig({...config, directorName: e.target.value})}
                    style={{ width: "100%", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "1rem", fontWeight: "600", outline: "none" }} 
                  />
               </div>
               <div style={{ padding: "1.5rem", background: "#fef2f2", borderRadius: "16px", border: "1px solid #fee2e2", display: "flex", gap: "1rem", alignItems: "center" }}>
                  <ShieldCheck size={24} color="#ef4444" />
                  <div>
                    <p style={{ fontSize: "0.9rem", fontWeight: "800", color: "#991b1b" }}>Critical Access</p>
                    <p style={{ fontSize: "0.8rem", color: "#b91c1c" }}>Changes to these settings will reflect across all generated institutional reports.</p>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "branding" && (
            <div style={{ display: "grid", gap: "2.5rem" }}>
               <div>
                  <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "900", color: "#1e293b" }}>Primary Institutional Color</label>
                  <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                    <input 
                      type="color"
                      value={config.primaryColor} 
                      onChange={e => setConfig({...config, primaryColor: e.target.value})}
                      style={{ width: "60px", height: "60px", border: "none", background: "none", cursor: "pointer" }} 
                    />
                    <input 
                      value={config.primaryColor} 
                      onChange={e => setConfig({...config, primaryColor: e.target.value})}
                      style={{ flex: 1, padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "1rem", fontWeight: "600", outline: "none" }} 
                    />
                  </div>
               </div>
               <div style={{ padding: "2rem", background: "#f8fafc", borderRadius: "20px", border: "1px dashed #cbd5e1" }}>
                  <p style={{ fontSize: "0.85rem", fontWeight: "800", color: "#64748b", textAlign: "center" }}>Preview of Institutional UI Elements will be updated in Real-time.</p>
               </div>
            </div>
          )}

          {activeTab === "institutional" && (
            <div style={{ display: "grid", gap: "2.5rem" }}>
               <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "900", color: "#1e293b" }}>Academic Year</label>
                    <input 
                      value={config.schoolYear} 
                      onChange={e => setConfig({...config, schoolYear: e.target.value})}
                      style={{ width: "100%", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "1rem", fontWeight: "600", outline: "none" }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "900", color: "#1e293b" }}>Current Semester</label>
                    <select 
                      value={config.semester} 
                      onChange={e => setConfig({...config, semester: e.target.value})}
                      style={{ width: "100%", padding: "1.25rem", borderRadius: "14px", border: "1px solid #e2e8f0", background: "#f8fafc", fontSize: "1rem", fontWeight: "600", outline: "none" }} 
                    >
                      <option>First Semester</option>
                      <option>Second Semester</option>
                      <option>Summer Term</option>
                    </select>
                  </div>
               </div>
            </div>
          )}

          {activeTab === "security" && (
            <div style={{ display: "grid", gap: "2.5rem" }}>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                  <div>
                    <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>Maintenance Mode</p>
                    <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Restrict access to all non-admin users.</p>
                  </div>
                  <button 
                    onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})}
                    style={{ width: "50px", height: "26px", borderRadius: "20px", background: config.maintenanceMode ? "#ef4444" : "#cbd5e1", position: "relative", border: "none", cursor: "pointer", transition: "all 0.3s" }}
                  >
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "3px", left: config.maintenanceMode ? "27px" : "3px", transition: "all 0.3s" }} />
                  </button>
               </div>
               <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", background: "#f8fafc", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                  <div>
                    <p style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1e293b" }}>Public Scholarship Applications</p>
                    <p style={{ fontSize: "0.8rem", color: "#64748b" }}>Allow students to file new applications.</p>
                  </div>
                  <button 
                    onClick={() => setConfig({...config, allowPublicApps: !config.allowPublicApps})}
                    style={{ width: "50px", height: "26px", borderRadius: "20px", background: config.allowPublicApps ? "#10b981" : "#cbd5e1", position: "relative", border: "none", cursor: "pointer", transition: "all 0.3s" }}
                  >
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "white", position: "absolute", top: "3px", left: config.allowPublicApps ? "27px" : "3px", transition: "all 0.3s" }} />
                  </button>
               </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Audit Footnote */}
      <div style={{ marginTop: "4rem", borderTop: "1px solid #f1f5f9", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Activity size={18} color="#94a3b8" />
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", fontWeight: "700" }}>PROTOCOL_LAST_SYNCED: {new Date().toLocaleTimeString()} | ADMIN_ID: {currentUser.id.toUpperCase()}</p>
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
           <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "#3b82f6" }}>CORE_STABLE</span>
           <span style={{ fontSize: "0.75rem", fontWeight: "900", color: "#10b981" }}>ENCRYPTION_ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
