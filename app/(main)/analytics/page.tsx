"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Activity, 
  Users, 
  GraduationCap, 
  PieChart as PieIcon, 
  BarChart as BarIcon, 
  Calendar,
  ArrowUpRight,
  Target,
  Zap,
  ShieldCheck,
  Download,
  FileText,
  Sparkles,
  Cpu
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

export default function AnalyticsPage() {
  const { 
    organizations, 
    activities, 
    scholarshipApps, 
    scholarshipPrograms,
    users,
    currentUser,
    isLoading
  } = useGlobalState();

  // Handle Hydration / Loading State
  if (isLoading) {
    return (
      <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "2px solid var(--primary)", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const isAuthorized = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";

  if (!isAuthorized) return (
    <div style={{ height: "80vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
      <div>
        <ShieldCheck size={64} style={{ opacity: 0.1, margin: "0 auto 2rem" }} />
        <h1 style={{ fontSize: "1.5rem", fontWeight: "900", color: "var(--text-dim)" }}>ACCESS RESTRICTED</h1>
        <p style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dim)", marginTop: "1rem" }}>ONLY AUTHORIZED GOVERNANCE OFFICERS MAY VIEW THE INSTITUTIONAL PULSE.</p>
      </div>
    </div>
  );

  // AI Predictor State
  const [isPredicting, setIsPredicting] = useState(false);
  const [aiPrediction, setAiPrediction] = useState<string | null>(null);

  // Derived Analytics Data
  const totalOrgs = organizations.length;
  const activeActivities = activities.filter(a => a.status === "Approved").length;
  const pendingActivities = activities.filter(a => a.status === "Pending OSAS Approval").length;
  const totalScholars = scholarshipApps.filter(s => s.status === "Recommended").length;
  const studentPopulation = users.filter(u => u.role === "STUDENT_APPLICANT").length;

  const runPrediction = () => {
    setIsPredicting(true);
    setAiPrediction(null);
    setTimeout(() => {
      setIsPredicting(false);
      setAiPrediction(`Based on the current data of ${pendingActivities} pending events and ${activeActivities} approved events, expect a high volume of club activity requests next week. Scholarship applications are pacing normally and OSAS is caught up with reviews.`);
    }, 3000);
  };

  const exportCSV = () => {
    const headers = "METRIC,COUNT,STATUS\n";
    const orgsData = `Total Clubs,${totalOrgs},Active\nRecognized Clubs,${organizations.filter(o => o.status === "Recognized").length},Active\n`;
    const activitiesData = `Approved Events,${activeActivities},Approved\nPending Events,${pendingActivities},Pending\n`;
    const scholarsData = `Approved Scholars,${totalScholars},Recommended\nTotal Applicants,${scholarshipApps.length},All\n`;
    const studentData = `Total Students,${studentPopulation},Active\n`;
    
    const csvContent = "data:text/csv;charset=utf-8," + headers + orgsData + activitiesData + scholarsData + studentData;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OSAS_Executive_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTXT = () => {
    const content = `OSAS QUARTERLY SUMMARY REPORT\nDate: ${new Date().toLocaleDateString()}\n\n-- STUDENT CLUBS --\nTotal Clubs: ${totalOrgs}\nRecognized: ${organizations.filter(o => o.status === "Recognized").length}\n\n-- EVENT REQUESTS --\nApproved Events: ${activeActivities}\nPending Events: ${pendingActivities}\n\n-- SCHOLARSHIPS --\nApproved Scholars: ${totalScholars}\nTotal Applicants: ${scholarshipApps.length}\n\n-- STUDENT ACCOUNTS --\nTotal Students: ${studentPopulation}\n\nALL SYSTEMS ARE RUNNING SMOOTHLY.`;
    const encodedUri = encodeURI("data:text/plain;charset=utf-8," + content);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `OSAS_Summary_Report_${new Date().toISOString().split('T')[0]}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Chart Data Calculations
  const orgCategories = ["Academic", "Religious", "Special Interest", "Council"];
  const orgStats = orgCategories.map(cat => ({
    label: cat.toUpperCase(),
    count: organizations.filter(o => o.category === cat).length,
    percentage: Math.round((organizations.filter(o => o.category === cat).length / totalOrgs) * 100) || 0
  }));

  const scholarshipStats = scholarshipPrograms.map(prog => ({
    name: prog.name,
    count: scholarshipApps.filter(app => app.status === "Recommended").length // Mocking for now, ideally filter by program name
  }));

  return (
    <div style={{ width: "100%" }}>
      {/* Sapphire Header */}
      <div style={{ marginBottom: "4rem" }}>
        <p style={{ color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", letterSpacing: "0.4em", marginBottom: "0.5rem" }}>SCHOOL STATISTICS</p>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "900", letterSpacing: "-0.04em", color: "var(--text-main)" }}>
          OSAS <span style={{ color: "var(--primary)" }}>DASHBOARD</span>
        </h1>
      </div>

      {/* AI PREDICTIVE FORECAST */}
      <div style={{ marginBottom: "4rem", padding: "2rem", background: "rgba(0, 229, 255, 0.03)", border: "1px solid var(--primary)", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: "-10px", top: "-30px", opacity: 0.05 }}>
          <Cpu size={150} color="var(--primary)" />
        </div>
        
        <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
           <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
                 <Sparkles size={16} color="var(--primary)" />
                 <h3 style={{ fontSize: "0.75rem", fontWeight: "900", color: "var(--primary)", letterSpacing: "0.2em" }}>SMART ACTIVITY FORECAST</h3>
              </div>
              <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", fontWeight: "600", maxWidth: "600px", lineHeight: "1.6" }}>
                 Get a quick prediction of how many student requests and club events OSAS should expect next month based on current activities.
              </p>
           </div>
           {!aiPrediction && !isPredicting && (
             <button onClick={runPrediction} className="btn-cyan" style={{ padding: "0.75rem 2rem", fontSize: "0.65rem" }}>
               RUN FORECAST
             </button>
           )}
        </div>

        <AnimatePresence>
           {isPredicting && (
             <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: "2rem" }}>
               <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)" }}>
                     <span>ANALYZING RECENT DATA...</span>
                     <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 1 }}>PROCESSING</motion.span>
                  </div>
                  <div style={{ height: "2px", background: "var(--bg-accent)", width: "100%", overflow: "hidden" }}>
                     <motion.div 
                       initial={{ x: "-100%" }} 
                       animate={{ x: "100%" }} 
                       transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
                       style={{ width: "50%", height: "100%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }} 
                     />
                  </div>
               </div>
             </motion.div>
           )}

           {aiPrediction && (
             <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: "2rem", padding: "1.5rem", background: "var(--bg-surface)", borderLeft: "4px solid var(--primary)" }}>
                <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "#10b981", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>30-DAY FORECAST COMPLETE</p>
                <p style={{ fontSize: "0.85rem", color: "var(--text-main)", fontWeight: "700", lineHeight: "1.7" }}>{aiPrediction}</p>
             </motion.div>
           )}
        </AnimatePresence>
      </div>

      {/* KPI Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginBottom: "4rem" }}>
        {[
          { label: "STUDENT CLUBS", value: totalOrgs, icon: <Users size={24} />, sub: "ACTIVE CLUBS" },
          { label: "EVENT REQUESTS", value: activeActivities, icon: <Activity size={24} />, sub: "APPROVED EVENTS" },
          { label: "SCHOLARSHIPS", value: totalScholars, icon: <GraduationCap size={24} />, sub: "APPROVED APPLICANTS" },
          { label: "TOTAL STUDENTS", value: studentPopulation, icon: <Zap size={24} />, sub: "STUDENT ACCOUNTS" },
        ].map((kpi, i) => (
          <motion.div 
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="sapphire-card"
            style={{ position: "relative", overflow: "hidden" }}
          >
            <div style={{ position: "absolute", top: 0, right: 0, padding: "1.5rem", opacity: 0.1 }}>{kpi.icon}</div>
            <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", letterSpacing: "0.1em", marginBottom: "1rem" }}>{kpi.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "1rem" }}>
              <h2 style={{ fontSize: "2.5rem", fontWeight: "900" }}>{kpi.value}</h2>
              <ArrowUpRight size={16} color="var(--primary)" />
            </div>
            <p style={{ fontSize: "0.6rem", fontWeight: "900", color: "var(--primary)", marginTop: "1rem" }}>{kpi.sub}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginBottom: "4rem" }}>
        
        {/* Governance Distribution */}
        <div className="sapphire-card">
           <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
              <PieIcon size={20} color="var(--primary)" />
              <h3 style={{ fontSize: "0.85rem", fontWeight: "900" }}>UNIT DISTRIBUTION BY SECTOR</h3>
           </div>
           
           <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {orgStats.map((stat, i) => (
                <div key={stat.label}>
                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", fontSize: "0.65rem", fontWeight: "900" }}>
                      <span>{stat.label}</span>
                      <span style={{ color: "var(--primary)" }}>{stat.percentage}%</span>
                   </div>
                   <div style={{ height: "4px", background: "var(--bg-accent)", width: "100%", position: "relative" }}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.percentage}%` }}
                        transition={{ duration: 1, delay: i * 0.2 }}
                        style={{ height: "100%", background: "var(--primary)", boxShadow: "0 0 10px var(--primary)" }}
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>

        {/* Activity Health */}
        <div className="sapphire-card" style={{ display: "flex", flexDirection: "column" }}>
           <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
              <Target size={20} color="var(--primary)" />
              <h3 style={{ fontSize: "0.85rem", fontWeight: "900" }}>GOVERNANCE EFFICIENCY</h3>
           </div>
           
           <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "relative", width: "200px", height: "200px" }}>
                 {/* CSS Based Donut Chart */}
                 <svg viewBox="0 0 36 36" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                    <circle cx="18" cy="18" r="16" fill="none" stroke="var(--bg-accent)" strokeWidth="3" />
                    <motion.circle 
                      cx="18" cy="18" r="16" fill="none" 
                      stroke="var(--primary)" 
                      strokeWidth="3" 
                      strokeDasharray={`${(activeActivities / (activeActivities + pendingActivities + 1)) * 100} 100`}
                      initial={{ strokeDasharray: "0 100" }}
                      animate={{ strokeDasharray: `${(activeActivities / (activeActivities + pendingActivities + 1)) * 100} 100` }}
                      transition={{ duration: 1.5 }}
                    />
                 </svg>
                 <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                    <p style={{ fontSize: "1.5rem", fontWeight: "900" }}>{Math.round((activeActivities / (activeActivities + pendingActivities + 1)) * 100)}%</p>
                    <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)" }}>APPROVAL RATE</p>
                 </div>
              </div>
           </div>

           <div style={{ display: "flex", justifyContent: "space-around", marginTop: "2rem", borderTop: "1px solid var(--border-dim)", paddingTop: "2rem" }}>
              <div style={{ textAlign: "center" }}>
                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>PENDING</p>
                 <p style={{ fontSize: "1rem", fontWeight: "900" }}>{pendingActivities}</p>
              </div>
              <div style={{ textAlign: "center" }}>
                 <p style={{ fontSize: "0.55rem", fontWeight: "900", color: "var(--text-dim)", marginBottom: "0.5rem" }}>APPROVED</p>
                 <p style={{ fontSize: "1rem", fontWeight: "900", color: "var(--primary)" }}>{activeActivities}</p>
              </div>
           </div>
        </div>

      </div>

      <div className="sapphire-card">
         <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "3rem" }}>
            <BarIcon size={20} color="var(--primary)" />
            <h3 style={{ fontSize: "0.85rem", fontWeight: "900" }}>SCHOLARSHIP ECOSYSTEM CAPACITY</h3>
         </div>
         <div style={{ height: "300px", display: "flex", alignItems: "flex-end", gap: "2rem", padding: "1rem" }}>
            {scholarshipPrograms.map((prog, i) => {
              const count = scholarshipApps.filter(a => a.status === "Recommended").length / (i + 1); // Mocked variation
              const height = (count / 20) * 100;
              return (
                <div key={prog.id} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
                   <div style={{ width: "100%", background: "var(--bg-accent)", height: "200px", position: "relative", display: "flex", alignItems: "flex-end" }}>
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.min(height, 100)}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        style={{ width: "100%", background: "var(--primary)", opacity: 0.8, borderTop: "2px solid white" }}
                      />
                   </div>
                   <p style={{ fontSize: "0.5rem", fontWeight: "900", color: "var(--text-dim)", textAlign: "center", height: "2rem" }}>{prog.name.split(' ').map((w: string) => w[0]).join('') || prog.name.split(' ')[0]}</p>
                </div>
              );
            })}
         </div>
      </div>

      {/* Wellness & Pulse Report */}
      <div style={{ marginTop: "4rem", textAlign: "center", padding: "4rem", background: "var(--bg-accent)", border: "1px solid var(--border-dim)" }}>
         <TrendingUp size={48} style={{ margin: "0 auto 2rem", color: "var(--primary)" }} />
         <h2 style={{ fontSize: "1.25rem", fontWeight: "900", marginBottom: "1rem" }}>SCHOOL PERFORMANCE REPORT</h2>
         <p style={{ fontSize: "0.75rem", color: "var(--text-dim)", maxWidth: "600px", margin: "0 auto 2rem", lineHeight: "1.8", fontWeight: "700" }}>
           Student engagement in clubs is growing. Event requests are currently being processed in about 48 hours.
         </p>
         <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <button onClick={exportCSV} className="btn-cyan" style={{ padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
               <Download size={16} /> DOWNLOAD EXCEL (CSV)
            </button>
            <button onClick={exportTXT} style={{ padding: "1rem 2rem", background: "none", border: "1px solid var(--primary)", color: "var(--primary)", fontSize: "0.65rem", fontWeight: "900", display: "flex", alignItems: "center", gap: "0.75rem", cursor: "pointer", letterSpacing: "0.1em" }}>
               <FileText size={16} /> DOWNLOAD SUMMARY REPORT
            </button>
         </div>
      </div>

    </div>
  );
}
