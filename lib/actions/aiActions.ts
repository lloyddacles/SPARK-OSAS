"use server";

import { AuditLog } from "@/lib/GlobalStateContext";
import { generateGeminiContent, generateGeminiJSON, isGeminiAvailable } from "@/lib/gemini";

// ─── Types ────────────────────────────────────────────────────────────────────

type CommandIntent = {
  intent: "NAVIGATE" | "TOGGLE_THEME" | "LOGOUT" | "INFO" | "UNKNOWN";
  path?: string;
  message: string;
  sentiment: "primary" | "success" | "warning" | "danger";
};

type TriageResult = {
  studentName: string;
  severity: "NORMAL" | "HIGH" | "URGENT";
  analysis: string;
  actionPlan: string;
  timestamp: string;
};

type AuditSummaryResult = {
  summary: string;
  stats: { total: number; critical: number; high: number; uniqueUsers: number };
  anomalies: string[];
};

// ─── Task 2a: Audit Log Summarizer ───────────────────────────────────────────

export async function summarizeAuditLogs(logs: AuditLog[]): Promise<AuditSummaryResult> {
  const total = logs.length;
  const critical = logs.filter(l => l.severity === "CRITICAL").length;
  const high = logs.filter(l => l.severity === "HIGH").length;
  const uniqueUsers = new Set(logs.map(l => l.user)).size;

  const stats = { total, critical, high, uniqueUsers };

  // Heuristic anomaly detection (always runs for stats)
  const heuristicAnomalies: string[] = [];
  if (critical > 0) heuristicAnomalies.push(`${critical} critical security event(s) detected.`);
  if (total > 500) heuristicAnomalies.push(`High activity volume: ${total} actions processed.`);

  const userActionCounts: { [key: string]: number } = {};
  logs.slice(0, 50).forEach(l => {
    userActionCounts[l.user] = (userActionCounts[l.user] || 0) + 1;
  });
  Object.entries(userActionCounts).forEach(([user, count]) => {
    if (count > 10) heuristicAnomalies.push(`Activity spike: '${user}' performed ${count} recent actions.`);
  });

  // Attempt Gemini AI summarization
  if (isGeminiAvailable() && logs.length > 0) {
    const recentLogs = logs.slice(0, 30).map(l =>
      `[${l.severity}] ${l.user}: ${l.action} — ${l.details}`
    ).join("\n");

    const prompt = `You are an institutional security analyst for a university student affairs office (OSAS).
Analyze the following recent system audit log entries and produce a concise summary.

LOGS:
${recentLogs}

STATISTICS: Total=${total}, Critical=${critical}, High=${high}, Unique Staff=${uniqueUsers}

Respond with a JSON object:
{
  "summary": "2-3 sentence plain-English summary of system health and activity patterns",
  "anomalies": ["array", "of", "specific", "anomaly", "strings", "or", "empty", "if", "none"]
}`;

    const result = await generateGeminiJSON<{ summary: string; anomalies: string[] }>(prompt);
    if (result?.summary) {
      return {
        summary: result.summary,
        stats,
        anomalies: result.anomalies?.length > 0 ? result.anomalies : ["No anomalies detected."],
      };
    }
  }

  // Fallback: heuristic mode
  return {
    summary: `System activity shows stable operations across ${total} log entries distributed among ${uniqueUsers} authorized staff members.`,
    stats,
    anomalies: heuristicAnomalies.length > 0 ? heuristicAnomalies : ["No anomalies detected."],
  };
}

// ─── Task 2b: Neural Command Palette ─────────────────────────────────────────

export async function processNeuralCommand(query: string): Promise<CommandIntent> {
  // Attempt Gemini-powered intent resolution
  if (isGeminiAvailable()) {
    const prompt = `You are the AI navigation assistant for SPARK OSAS — a university student affairs management system.
The system has these pages: /dashboard, /referrals, /scholarships, /events, /organizations, /submissions,
/guidance/vault-audit, /admin/audit, /admin/passport, /admin/scholars.
Special intents: TOGGLE_THEME (dark/light mode), LOGOUT (sign out).

A user typed this command: "${query}"

Classify the intent and respond ONLY with this JSON:
{
  "intent": "NAVIGATE" | "TOGGLE_THEME" | "LOGOUT" | "INFO" | "UNKNOWN",
  "path": "/path/if/navigate/else/omit",
  "message": "Short action message shown to user (max 10 words)",
  "sentiment": "primary" | "success" | "warning" | "danger"
}`;

    const result = await generateGeminiJSON<CommandIntent>(prompt);
    if (result?.intent) {
      return result;
    }
  }

  // Fallback: keyword-based heuristics
  const q = query.toLowerCase();
  if (q.includes("passport") || q.includes("verify") || q.includes("profile"))
    return { intent: "NAVIGATE", path: "/admin/passport", message: "Opening Student Profiles...", sentiment: "primary" };
  if (q.includes("audit") || q.includes("logs") || q.includes("history"))
    return { intent: "NAVIGATE", path: "/admin/audit", message: "Opening Activity Logs...", sentiment: "primary" };
  if (q.includes("scholar") || q.includes("registry"))
    return { intent: "NAVIGATE", path: "/admin/scholars", message: "Opening Scholar Registry...", sentiment: "primary" };
  if (q.includes("dashboard") || q.includes("home") || q.includes("overview"))
    return { intent: "NAVIGATE", path: "/dashboard", message: "Returning to Dashboard...", sentiment: "primary" };
  if (q.includes("submission") || q.includes("document") || q.includes("vault"))
    return { intent: "NAVIGATE", path: "/submissions", message: "Opening Submissions...", sentiment: "primary" };
  if (q.includes("referral") || q.includes("triage"))
    return { intent: "NAVIGATE", path: "/referrals", message: "Opening Referrals...", sentiment: "primary" };
  if (q.includes("theme") || q.includes("dark") || q.includes("light") || q.includes("mode"))
    return { intent: "TOGGLE_THEME", message: "Switching appearance mode...", sentiment: "success" };
  if (q.includes("logout") || q.includes("exit") || q.includes("sign out"))
    return { intent: "LOGOUT", message: "Signing out securely...", sentiment: "danger" };
  if (q.includes("status") || q.includes("health") || q.includes("system"))
    return { intent: "INFO", message: "All systems online and secure.", sentiment: "success" };
  return { intent: "UNKNOWN", message: "Command not recognized. Try 'go to dashboard'.", sentiment: "warning" };
}

// ─── Task 2c: Referral Triage Engine ─────────────────────────────────────────

export async function triageReferral(studentName: string, reason: string): Promise<TriageResult> {
  // Attempt Gemini AI triage
  if (isGeminiAvailable()) {
    const prompt = `You are a licensed guidance counselor assistant for a Philippine university.
A student named "${studentName}" has been referred for the following reason: "${reason}".

Assess the severity of this referral and produce a response in JSON:
{
  "severity": "NORMAL" | "HIGH" | "URGENT",
  "analysis": "2-3 sentence clinical analysis of the case and risk factors",
  "actionPlan": "1-2 sentence specific recommended action for the counselor"
}

Guidelines:
- URGENT: Any threat to physical safety, self-harm, weapons, violence, bullying crisis
- HIGH: Academic misconduct, substance use, severe behavioral issues, fraud
- NORMAL: Routine absences, tardiness, minor policy violations, personal struggles`;

    const result = await generateGeminiJSON<{ severity: TriageResult["severity"]; analysis: string; actionPlan: string }>(prompt);
    if (result?.severity) {
      return {
        studentName,
        severity: result.severity,
        analysis: result.analysis,
        actionPlan: result.actionPlan,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Fallback: keyword-based heuristics
  const r = reason.toLowerCase();
  let severity: TriageResult["severity"] = "NORMAL";
  let actionPlan = "Schedule a routine consultation session.";
  const riskFactors: string[] = [];

  const urgentKeywords = ["harm", "fight", "bullying", "suicide", "threat", "danger", "weapon", "violence"];
  if (urgentKeywords.some(k => r.includes(k))) {
    severity = "URGENT";
    actionPlan = "IMMEDIATE INTERVENTION REQUIRED. Contact Security and Legal Affairs.";
    riskFactors.push("Safety / Welfare Concern");
  }

  const highKeywords = ["cheat", "plagiarism", "theft", "drunk", "drug", "vandalism", "fraud", "misconduct"];
  if (severity !== "URGENT" && highKeywords.some(k => r.includes(k))) {
    severity = "HIGH";
    actionPlan = "Escalate to Disciplinary Committee. Require a formal written statement.";
    riskFactors.push("Institutional Integrity / Misconduct");
  }

  if (r.includes("absent") || r.includes("tardy") || r.includes("noise") || r.includes("dress code")) {
    riskFactors.push("Administrative / Policy Violation");
  }

  return {
    studentName,
    severity,
    analysis: `Case analyzed as ${severity}. Identified risk factors: ${riskFactors.join(", ") || "General Behavioral"}.`,
    actionPlan,
    timestamp: new Date().toISOString(),
  };
}
