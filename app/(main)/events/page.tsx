"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  Megaphone, 
  Calendar, 
  Trash2, 
  User, 
  ArrowRight, 
  Filter,
  Info,
  AlertTriangle,
  Radio,
  Activity,
  GraduationCap,
  Clock,
  Bell
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";
import ProcessGuide from "@/components/ProcessGuide";

export default function EventsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement, currentUser } = useGlobalState();
  const [activeTab, setActiveTab] = useState<"Feed" | "Admin">("Feed");
  
  // Admin Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState<"News" | "Event" | "Alert" | "Academic" | "System" | "Urgent">("News");

  const isOSAS = currentUser?.role === "OSAS_DIRECTOR" || currentUser?.role === "SYSTEM_ADMIN";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    addAnnouncement(title, content, category);
    setTitle("");
    setContent("");
    setCategory("News");
    setActiveTab("Feed");
  };

  const getCategoryColor = (cat: string) => {
     switch(cat) {
        case "Urgent": return "#ef4444";
        case "Alert": return "#f59e0b";
        case "System": return "#10b981";
        case "Academic": return "#3b82f6";
        case "Event": return "#8b5cf6";
        default: return "#64748b";
     }
  };
  
  const getCategoryBgColor = (cat: string) => {
     switch(cat) {
        case "Urgent": return "#fef2f2";
        case "Alert": return "#fffbeb";
        case "System": return "#f0fdf4";
        case "Academic": return "#eff6ff";
        case "Event": return "#f5f3ff";
        default: return "#f8fafc";
     }
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Modern Analytics Header */}
      <div style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem" }}>
        <div>
          <p style={{ color: "#3b82f6", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.15em", marginBottom: "0.5rem", textTransform: "uppercase" }}>Communication</p>
          <h1 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: "900", letterSpacing: "-0.03em", color: "#111827" }}>
            Announce<span style={{ color: "#3b82f6" }}>ments</span>
          </h1>
          <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#6b7280", maxWidth: "450px", lineHeight: "1.5" }}>Stay updated with the latest news, events, and alerts from the OSAS office.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", background: "#f1f5f9", padding: "0.5rem", borderRadius: "12px" }}>
          {["Feed", "Admin"].map((tab) => (
            (tab === "Admin" && !isOSAS) ? null : (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)} 
                style={{ 
                  padding: "0.75rem 1.5rem", 
                  fontSize: "0.85rem", 
                  fontWeight: "700", 
                  background: activeTab === tab ? "white" : "transparent", 
                  color: activeTab === tab ? "#3b82f6" : "#64748b", 
                  border: "none", 
                  borderRadius: "8px", 
                  boxShadow: activeTab === tab ? "0 2px 4px rgba(0,0,0,0.05)" : "none", 
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
              >
                {tab === "Feed" ? "All Announcements" : "Create New"}
              </button>
            )
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "Feed" ? (
          <motion.div key="feed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div style={{ display: "grid", gap: "2rem" }}>
              {announcements.length === 0 ? (
                <div style={{ padding: "6rem", textAlign: "center", background: "white", borderRadius: "16px", border: "1px dashed #cbd5e1" }}>
                   <Radio size={48} color="#cbd5e1" style={{ margin: "0 auto 1.5rem", opacity: 0.5 }} />
                   <h3 style={{ fontSize: "1.25rem", fontWeight: "800", color: "#1e293b", marginBottom: "0.5rem" }}>No announcements yet</h3>
                   <p style={{ fontSize: "0.9rem", fontWeight: "500", color: "#64748b" }}>Check back later for updates from OSAS.</p>
                </div>
              ) : announcements.map((ann, i) => (
                <motion.div 
                  key={ann.id} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{ 
                    background: "white",
                    padding: "3rem", 
                    borderRadius: "16px",
                    border: "1px solid #f3f4f6",
                    borderLeft: `6px solid ${getCategoryColor(ann.category)}`,
                    boxShadow: "0 4px 6px rgba(0,0,0,0.02)",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                      <span style={{ 
                        padding: "0.4rem 1rem", 
                        fontSize: "0.75rem", 
                        fontWeight: "800", 
                        background: getCategoryBgColor(ann.category), 
                        color: getCategoryColor(ann.category),
                        borderRadius: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        {ann.category === "Urgent" && <Radio size={14} className="animate-pulse" />}
                        {ann.category === "Alert" && <AlertTriangle size={14} />}
                        {ann.category === "Academic" && <GraduationCap size={14} />}
                        {ann.category === "System" && <Activity size={14} />}
                        {ann.category === "Event" && <Calendar size={14} />}
                        {ann.category === "News" && <Megaphone size={14} />}
                        {ann.category}
                      </span>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#94a3b8" }}>
                         <Clock size={14} />
                         <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>{ann.date}</span>
                      </div>
                    </div>
                  </div>

                  <h3 style={{ fontSize: "1.75rem", fontWeight: "800", marginBottom: "1rem", color: "#1e293b", lineHeight: "1.3" }}>{ann.title}</h3>
                  <p style={{ color: "#475569", lineHeight: "1.8", marginBottom: "2.5rem", fontSize: "1rem", fontWeight: "500", maxWidth: "900px" }}>{ann.content}</p>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", color: "#64748b", fontSize: "0.85rem", fontWeight: "600" }}>
                      <User size={16} color="#3b82f6" /> Posted by: <strong style={{ color: "#1e293b" }}>{ann.author}</strong>
                    </div>
                    {isOSAS && (
                      <button 
                        onClick={() => deleteAnnouncement(ann.id)}
                        style={{ padding: "0.5rem 1rem", background: "white", border: "1px solid #fecaca", color: "#ef4444", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem", transition: "all 0.2s" }}
                      >
                        <Trash2 size={16} /> Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="admin" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <ProcessGuide 
                title="How to Post an Announcement"
                steps={[
                   { title: "Pick a Category", desc: "Choose the type: News, Event, Academic, Alert, etc.", icon: <Filter size={16} /> },
                   { title: "Write a Title", desc: "Create a clear, descriptive title for your announcement.", icon: <Megaphone size={16} /> },
                   { title: "Add Details", desc: "Write the full message with any relevant details.", icon: <Info size={16} /> },
                   { title: "Post It", desc: "Hit the post button to publish it for everyone to see.", icon: <Radio size={16} /> }
                ]}
             />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "3rem", alignItems: "start" }}>
              {/* COMPOSER */}
              <div style={{ background: "white", padding: "3rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)" }}>
                <div style={{ marginBottom: "2.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid #f1f5f9" }}>
                   <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#1e293b", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      New Announcement
                   </h2>
                   <p style={{ fontSize: "0.9rem", color: "#64748b", marginTop: "0.5rem", fontWeight: "500" }}>Compose and broadcast a message to the campus community.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: "2rem" }}>
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Category</label>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.5rem" }}>
                      {["News", "Event", "Academic", "System", "Alert", "Urgent"].map((cat) => {
                         const isSelected = category === cat;
                         return (
                           <button 
                             key={cat}
                             type="button"
                             onClick={() => setCategory(cat as any)}
                             style={{ 
                               padding: "1rem", 
                               fontSize: "0.85rem", 
                               fontWeight: "700",
                               background: isSelected ? getCategoryBgColor(cat) : "#f8fafc",
                               color: isSelected ? getCategoryColor(cat) : "#64748b",
                               border: isSelected ? `1px solid ${getCategoryColor(cat)}` : "1px solid #e2e8f0",
                               borderRadius: "8px",
                               cursor: "pointer",
                               transition: "all 0.2s"
                             }}
                           >
                             {cat}
                           </button>
                         )
                      })}
                    </div>
                  </div>
                  
                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Title</label>
                    <input 
                      required value={title} onChange={e => setTitle(e.target.value)} 
                      placeholder="Enter a descriptive title..."
                      style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b" }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "0.85rem", fontWeight: "700", color: "#475569" }}>Message Content</label>
                    <textarea 
                      required value={content} onChange={e => setContent(e.target.value)} 
                      placeholder="Write your announcement details here..." rows={8}
                      style={{ width: "100%", padding: "1.25rem", fontSize: "0.95rem", fontWeight: "500", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "12px", outline: "none", color: "#1e293b", lineHeight: "1.8", resize: "vertical" }} 
                    />
                  </div>

                  <button type="submit" style={{ padding: "1.25rem", width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: "12px", fontSize: "1rem", fontWeight: "800", cursor: "pointer", boxShadow: "0 4px 6px rgba(59, 130, 246, 0.2)", marginTop: "1rem" }}>
                    Post Announcement <ArrowRight size={18} />
                  </button>
                </form>
              </div>

              {/* ACTIVE TRANSMISSIONS MONITOR */}
              <div style={{ background: "white", padding: "2.5rem", borderRadius: "16px", border: "1px solid #f3f4f6", boxShadow: "0 4px 6px rgba(0,0,0,0.02)", position: "sticky", top: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                   <h3 style={{ fontSize: "1.1rem", fontWeight: "800", color: "#1e293b" }}>Published Announcements</h3>
                   <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#10b981", display: "flex", alignItems: "center", gap: "0.5rem", background: "#f0fdf4", padding: "0.3rem 0.8rem", borderRadius: "20px" }}>
                      <Activity size={12} /> Live
                   </span>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {announcements.length === 0 ? (
                    <div style={{ padding: "3rem", textAlign: "center", background: "#f8fafc", borderRadius: "12px", border: "1px dashed #cbd5e1" }}>
                       <p style={{ fontSize: "0.85rem", fontWeight: "600", color: "#64748b" }}>No announcements posted yet.</p>
                    </div>
                  ) : announcements.map(ann => (
                    <div key={ann.id} style={{ background: "#f8fafc", padding: "1.25rem", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #e2e8f0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                         <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: getCategoryColor(ann.category) }} />
                         <div>
                            <h4 style={{ fontWeight: "800", fontSize: "0.95rem", color: "#1e293b", marginBottom: "0.25rem" }}>{ann.title}</h4>
                            <p style={{ fontSize: "0.75rem", fontWeight: "600", color: "#64748b" }}>{ann.date} · {ann.category}</p>
                         </div>
                      </div>
                      <button 
                        onClick={() => deleteAnnouncement(ann.id)}
                        style={{ padding: "0.5rem", background: "white", border: "1px solid #fecaca", color: "#ef4444", cursor: "pointer", borderRadius: "8px", transition: "all 0.2s" }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "3rem", background: "#f8fafc", padding: "1.5rem", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                   <p style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}><Info size={14} /> Note</p>
                   <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500", lineHeight: "1.6" }}>
                      All announcements are visible to the entire campus community. Urgent alerts are highlighted with a red badge.
                   </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
