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
