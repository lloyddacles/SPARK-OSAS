"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  FileCheck, 
  CalendarClock, 
  GraduationCap,
  TrendingUp,
  ArrowUpRight,
  Download
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

type DashboardStats = {
  studentsCount: number;
  requestsCount: number;
  appointmentsCount: number;
  scholarshipsCount: number;
};

export default function DashboardClient() {
  const { stats: statsData } = useGlobalState();

  const stats = [
    { label: "Total Students", value: statsData.studentsCount.toString(), change: "+12%", icon: <Users size={24} />, color: "#3b82f6" },
    { label: "Service Requests", value: statsData.requestsCount.toString(), change: "+5.4%", icon: <FileCheck size={24} />, color: "#10b981" },
    { label: "Appointments", value: statsData.appointmentsCount.toString(), change: "-2%", icon: <CalendarClock size={24} />, color: "#f59e0b" },
    { label: "Scholarships", value: statsData.scholarshipsCount.toString(), change: "+8%", icon: <GraduationCap size={24} />, color: "#8b5cf6" },
  ];

  const handleDownloadCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Students,${statsData.studentsCount}\n`
      + `Service Requests,${statsData.requestsCount}\n`
      + `Appointments,${statsData.appointmentsCount}\n`
      + `Scholarships,${statsData.scholarshipsCount}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "osas_dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "3rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>
            Welcome back, <span className="gradient-text">Director</span>
          </h1>
          <p style={{ color: "var(--muted-foreground)" }}>Here's what's happening across OSAS today.</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button onClick={handleDownloadCSV} className="glass" style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.25rem", fontWeight: "600", fontSize: "0.875rem", background: "var(--primary)", color: "var(--primary-foreground)" }}>
            <Download size={16} /> Download CSV Report
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem", marginBottom: "3rem" }}>
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="card glass"
            style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "1.5rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ 
                width: "48px", 
                height: "48px", 
                background: `${stat.color}15`, 
                borderRadius: "12px", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center",
                color: stat.color
              }}>
                {stat.icon}
              </div>
              <span style={{ 
                fontSize: "0.75rem", 
                fontWeight: "700", 
                color: stat.change.startsWith("+") ? "#10b981" : "#ef4444",
                background: stat.change.startsWith("+") ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                padding: "0.25rem 0.5rem",
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem"
              }}>
                {stat.change} <TrendingUp size={12} />
              </span>
            </div>
            <div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>{stat.label}</p>
              <h3 style={{ fontSize: "1.875rem", fontWeight: "700" }}>{stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem" }}>
        {/* Main Chart Area Mockup */}
        <div className="glass" style={{ padding: "2rem", minHeight: "400px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Service Utilization Trend</h3>
            <select style={{ background: "transparent", color: "var(--foreground)", border: "1px solid var(--border)", padding: "0.5rem", borderRadius: "8px" }}>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div style={{ 
            height: "250px", 
            width: "100%", 
            background: "linear-gradient(to top, rgba(59, 130, 246, 0.1), transparent)", 
            borderRadius: "12px",
            border: "1px dashed var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Interactive SVG Chart */}
            <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "100%" }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              
              {/* Background Fill Area */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                d="M0,250 L0,150 Q100,100 200,140 T400,100 T600,120 T800,60 T1000,100 L1200,80 L1200,250 Z"
                fill="url(#gradient)"
              />
              
              {/* Animated Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                d="M0,150 Q100,100 200,140 T400,100 T600,120 T800,60 T1000,100 L1200,80"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data Points */}
              {[
                { x: 200, y: 140 },
                { x: 400, y: 100 },
                { x: 600, y: 120 },
                { x: 800, y: 60 },
                { x: 1000, y: 100 }
              ].map((point, i) => (
                <motion.circle
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1.5 + (i * 0.1), type: "spring" }}
                  cx={point.x}
                  cy={point.y}
                  r="6"
                  fill="var(--background)"
                  stroke="var(--primary)"
                  strokeWidth="3"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Recent Activity List */}
        <div className="glass" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "1.5rem" }}>Recent Activity</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div style={{ 
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  background: i % 2 === 0 ? "var(--primary)" : "var(--accent)",
                  marginTop: "0.5rem"
                }} />
                <div>
                  <p style={{ fontSize: "0.875rem", fontWeight: "600" }}>
                    {i % 2 === 0 ? "Scholarship Application" : "Counseling Request"}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>
                    Student ID: 2024-000{i} • 2h ago
                  </p>
                </div>
                <button style={{ marginLeft: "auto", color: "var(--muted-foreground)" }}>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BarChart3(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}
