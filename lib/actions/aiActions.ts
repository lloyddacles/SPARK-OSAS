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
  if (critical > 0) anomalies.push(`${critical} CRITICAL_SECURITY_EVENTS detected in current buffer.`);
  if (total > 500) anomalies.push(`HIGH_VOLUME_TELEMETRY: System is processing 500+ nodes in a single cycle.`);
  
  // Detect rapid-fire actions from a single user
  const userActionCounts: { [key: string]: number } = {};
  logs.slice(0, 50).forEach(l => {
    userActionCounts[l.user] = (userActionCounts[l.user] || 0) + 1;
  });
  
  Object.entries(userActionCounts).forEach(([user, count]) => {
    if (count > 10) anomalies.push(`ANOMALOUS_BURST: User '${user}' performed ${count} actions in recent window.`);
  });

  return {
    summary: `System telemetry indicates stable governance across ${total} nodes. Administrative activity is distributed across ${uniqueUsers} authorized personnel. No structural integrity compromises detected.`,
    stats: {
      total,
      critical,
      high,
      uniqueUsers
    },
    anomalies: anomalies.length > 0 ? anomalies : ["NO_ANOMALIES_DETECTED"]
  };
}

/**
 * NEURAL NAVIGATION ENGINE
 * Processes natural language queries into system intents.
 */
export async function processNeuralCommand(query: string) {
  const q = query.toLowerCase();
  
  // NAVIGATION INTENTS
  if (q.includes("passport") || q.includes("verify") || q.includes("biometric")) {
    return { intent: "NAVIGATE", path: "/admin/passport", message: "ACCESSING_IDENTITY_TERMINAL...", sentiment: "primary" };
  }
  if (q.includes("audit") || q.includes("logs") || q.includes("history")) {
    return { intent: "NAVIGATE", path: "/admin/audit", message: "INITIALIZING_TELEMETRY_ARCHIVE...", sentiment: "primary" };
  }
  if (q.includes("scholar") || q.includes("inventory") || q.includes("registry")) {
    return { intent: "NAVIGATE", path: "/admin/scholars", message: "OPENING_SCHOLAR_REGISTRY...", sentiment: "primary" };
  }
  if (q.includes("dashboard") || q.includes("home") || q.includes("overview")) {
    return { intent: "NAVIGATE", path: "/dashboard", message: "RETURNING_TO_COMMAND_CENTER...", sentiment: "primary" };
  }
  
  // SYSTEM TOGGLES
  if (q.includes("theme") || q.includes("dark") || q.includes("light") || q.includes("mode")) {
    return { intent: "TOGGLE_THEME", message: "SYNCHRONIZING_VISUAL_POLARITY...", sentiment: "success" };
  }
  if (q.includes("logout") || q.includes("exit") || q.includes("terminate session")) {
    return { intent: "LOGOUT", message: "TERMINATING_SECURE_SESSION...", sentiment: "danger" };
  }
  
  // INFORMATION QUERIES
  if (q.includes("status") || q.includes("health") || q.includes("system")) {
    return { intent: "INFO", message: "SYSTEM_INTEGRITY: 100% | NODES_ACTIVE: ONLINE | SECURITY_POSTURE: ELITE", sentiment: "success" };
  }

  // FALLBACK: INTELLIGENT GUESS
  return { 
    intent: "UNKNOWN", 
    message: "QUERY_NOT_RECOGNIZED. PLEASE_USE_GOVERNANCE_TERMINOLOGY.", 
    sentiment: "warning" 
  };
}
