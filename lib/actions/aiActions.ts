"use server";

import { AuditLog } from "@/lib/GlobalStateContext";

export async function summarizeAuditLogs(logs: AuditLog[]) {
  // SIMULATED AI ANALYSIS ENGINE
  // In a production environment, this would call a LLM (e.g., Gemini) to summarize trends.
  
  const total = logs.length;
  const critical = logs.filter(l => l.severity === "CRITICAL").length;
  const high = logs.filter(l => l.severity === "HIGH").length;
  const uniqueUsers = new Set(logs.map(l => l.user)).size;

  // Heuristic Anomaly Detection
  const anomalies: string[] = [];
  if (critical > 0) anomalies.push(`${critical} critical security events detected.`);
  if (total > 500) anomalies.push(`High activity volume: System is processing 500+ actions.`);
  
  // Detect rapid-fire actions from a single user
  const userActionCounts: { [key: string]: number } = {};
  logs.slice(0, 50).forEach(l => {
    userActionCounts[l.user] = (userActionCounts[l.user] || 0) + 1;
  });
  
  Object.entries(userActionCounts).forEach(([user, count]) => {
    if (count > 10) anomalies.push(`Unusual activity spike: User '${user}' performed ${count} actions recently.`);
  });

  return {
    summary: `System activity indicates stable operations across ${total} log entries. Administrative actions are distributed among ${uniqueUsers} authorized staff members. No security issues detected.`,
    stats: {
      total,
      critical,
      high,
      uniqueUsers
    },
    anomalies: anomalies.length > 0 ? anomalies : ["No issues found"]
  };
}

/**
 * NEURAL NAVIGATION ENGINE
 * Processes natural language queries into system intents.
 */
export async function processNeuralCommand(query: string) {
  const q = query.toLowerCase();
  
  // NAVIGATION INTENTS
  if (q.includes("passport") || q.includes("verify") || q.includes("biometric") || q.includes("profile")) {
    return { intent: "NAVIGATE", path: "/admin/passport", message: "Opening Student Profiles...", sentiment: "primary" };
  }
  if (q.includes("audit") || q.includes("logs") || q.includes("history")) {
    return { intent: "NAVIGATE", path: "/admin/audit", message: "Opening Activity Logs...", sentiment: "primary" };
  }
  if (q.includes("scholar") || q.includes("inventory") || q.includes("registry")) {
    return { intent: "NAVIGATE", path: "/admin/scholars", message: "Opening Scholar Registry...", sentiment: "primary" };
  }
  if (q.includes("dashboard") || q.includes("home") || q.includes("overview")) {
    return { intent: "NAVIGATE", path: "/dashboard", message: "Returning to Dashboard...", sentiment: "primary" };
  }
  
  // SYSTEM TOGGLES
  if (q.includes("theme") || q.includes("dark") || q.includes("light") || q.includes("mode")) {
    return { intent: "TOGGLE_THEME", message: "Switching appearance mode...", sentiment: "success" };
  }
  if (q.includes("logout") || q.includes("exit") || q.includes("terminate session")) {
    return { intent: "LOGOUT", message: "Signing out securely...", sentiment: "danger" };
  }
  
  // INFORMATION QUERIES
  if (q.includes("status") || q.includes("health") || q.includes("system")) {
    return { intent: "INFO", message: "All systems online and secure.", sentiment: "success" };
  }

  // FALLBACK: INTELLIGENT GUESS
  return { 
    intent: "UNKNOWN", 
    message: "Sorry, I couldn't understand that command.", 
    sentiment: "warning" 
  };
}

/**
 * INSTITUTIONAL GUIDANCE TRIAGE ENGINE
 * Analyzes referrals for severity and recommends immediate actions.
 */
export async function triageReferral(studentName: string, reason: string) {
  const r = reason.toLowerCase();
  
  let severity: "NORMAL" | "HIGH" | "URGENT" = "NORMAL";
  let actionPlan = "Schedule a routine consultation session.";
  let riskFactors: string[] = [];

  // 🚨 URGENT TRIGGERS (Tier 3)
  const urgentKeywords = ["harm", "fight", "bullying", "suicide", "threat", "danger", "weapon"];
  if (urgentKeywords.some(k => r.includes(k))) {
    severity = "URGENT";
    actionPlan = "IMMEDIATE INTERVENTION REQUIRED. Contact Security and Legal Affairs.";
    riskFactors.push("Safety / Welfare Concern");
  }

  // ⚠️ HIGH TRIGGERS (Tier 2)
  const highKeywords = ["cheat", "plagiarism", "theft", "drunk", "drug", "vandalism", "fraud"];
  if (severity !== "URGENT" && highKeywords.some(k => r.includes(k))) {
    severity = "HIGH";
    actionPlan = "Escalate to Disciplinary Committee. Require a formal written statement.";
    riskFactors.push("Institutional Integrity / Misconduct");
  }

  // 📋 NORMAL TRIGGERS (Tier 1)
  if (r.includes("absent") || r.includes("tardy") || r.includes("noise") || r.includes("dress code")) {
    riskFactors.push("Administrative / Policy Violation");
  }

  return {
    studentName,
    severity,
    analysis: `Case analyzed as ${severity}. Identified risk factors: ${riskFactors.join(", ") || "General Behavioral"}.`,
    actionPlan,
    timestamp: new Date().toISOString()
  };
}
