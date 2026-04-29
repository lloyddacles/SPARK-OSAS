"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { 
  FileUp, FileText, CheckCircle2, Clock, Plus, Users, 
  MessageSquare, Upload, Check, AlertCircle, Send, BellRing
} from "lucide-react";
import { useGlobalState } from "@/lib/GlobalStateContext";

type SubmissionStatus = "ASSIGNED" | "SUBMITTED" | "APPROVED" | "REVISION_NEEDED";

type RequiredDocument = {
  id: string;
  label: string;
};

type Assignment = {
  id: string;
  title: string;
  description: string;
  deadline: string;
  createdAt: string;
  requiredDocs: RequiredDocument[];
};

type UploadedDoc = {
  docId: string;
  fileName: string;
};

type Submission = {
  id: string;
  assignmentId: string;
  clubName: string;
  adviserName: string;
  status: SubmissionStatus;
  uploadedDocs: UploadedDoc[];
  submittedAt?: string;
  feedback?: string;
};

// Advanced Mock Data based on OSAS Coordinator's exact workflow
const initialAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Club Renewal Documents AY 25-26",
    description: "Submit all required compliance documents for the renewal of your Student Organization for this academic year.",
    deadline: "2025-08-30",
    createdAt: "2025-08-01",
    requiredDocs: [
      { id: "d1", label: "Renewal Form" },
      { id: "d2", label: "Student Organization's Constitution and By-Laws" },
      { id: "d3", label: "List of Officers" },
      { id: "d4", label: "List of Members" },
      { id: "d5", label: "Budget for the Year" },
      { id: "d6", label: "Activities/Plans for the Year" },
      { id: "d7", label: "Written Report of the Previous Year" },
      { id: "d8", label: "Financial Reports" }
    ]
  }
];

const initialSubmissions: Submission[] = [
  {
    id: "s1",
    assignmentId: "a1",
    clubName: "Computer Science Society",
    adviserName: "Prof. Alan Turing",
    status: "SUBMITTED",
    uploadedDocs: [
      { docId: "d1", fileName: "Renewal_Form_Signed.pdf" },
      { docId: "d2", fileName: "CBL_2025.pdf" },
      { docId: "d3", fileName: "Officers_List.pdf" },
      { docId: "d4", fileName: "Members_List.pdf" },
      { docId: "d5", fileName: "Budget_25_26.xlsx" },
      { docId: "d6", fileName: "Action_Plan.pdf" },
      { docId: "d7", fileName: "Accomplishment_Report.pdf" },
      { docId: "d8", fileName: "Financial_Clearance.pdf" }
    ],
    submittedAt: "2025-08-28",
  },
  {
    id: "s2",
    assignmentId: "a1",
    clubName: "Arts & Culture Club",
    adviserName: "Dr. Frida Kahlo",
    status: "ASSIGNED",
    uploadedDocs: []
  }
];

export default function SubmissionsClient() {
  const { currentUser } = useGlobalState();
  const isOSAS = currentUser?.role === "SYSTEM_ADMIN" || currentUser?.role === "OSAS_DIRECTOR";
  const isAdviser = currentUser?.role === "ADVISER";

  const [view, setView] = useState<"OSAS" | "ADVISER">(isOSAS ? "OSAS" : "ADVISER");
  const [assignments, setAssignments] = useState(initialAssignments);
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedAssignment, setSelectedAssignment] = useState<string | null>(null);

  // OSAS Actions
  const handleProvideFeedback = (subId: string, status: SubmissionStatus, feedback: string) => {
    if (!isOSAS) return;
    setSubmissions(subs => subs.map(s => 
      s.id === subId ? { ...s, status, feedback } : s
    ));
  };

  const handleNudge = (clubName: string) => {
    if (!isOSAS) return;
    alert(`Follow-up notification sent to ${clubName}!\n\n"good afternoon po. follow up na din po namin mga maam documents ng clubs niyo po this Academic year 25-26..."`);
  };

  // Adviser Actions
  const handleTurnIn = (assignmentId: string, uploadedDocs: UploadedDoc[]) => {
    if (!isAdviser && !isOSAS) return;
    setSubmissions(subs => {
      const existing = subs.find(s => s.assignmentId === assignmentId && s.clubName === "My Demo Club");
      if (existing) {
        return subs.map(s => s.id === existing.id ? { 
          ...s, status: "SUBMITTED", uploadedDocs, submittedAt: new Date().toISOString().split("T")[0] 
        } : s);
      } else {
        return [...subs, {
          id: Math.random().toString(),
          assignmentId,
          clubName: "My Demo Club",
          adviserName: "Demo Adviser",
          status: "SUBMITTED",
          uploadedDocs,
          submittedAt: new Date().toISOString().split("T")[0]
        }];
      }
    });
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: "800", marginBottom: "0.5rem" }}>Document Submissions</h1>
          <p style={{ color: "var(--muted-foreground)" }}>Track and manage club requirements.</p>
        </div>
        
        <div style={{ display: "flex", background: "rgba(0,0,0,0.2)", padding: "0.25rem", borderRadius: "8px", border: "1px solid var(--border)" }}>
          {isOSAS && (
            <button 
              onClick={() => { setView("OSAS"); setSelectedAssignment(null); }}
              style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: view === "OSAS" ? "var(--primary)" : "transparent", color: view === "OSAS" ? "var(--primary-foreground)" : "var(--muted-foreground)", fontWeight: "600", transition: "all 0.2s" }}
            >
              OSAS View (Admin)
            </button>
          )}
          <button 
            onClick={() => { setView("ADVISER"); setSelectedAssignment(null); }}
            style={{ padding: "0.5rem 1rem", borderRadius: "6px", background: view === "ADVISER" ? "var(--accent)" : "transparent", color: view === "ADVISER" ? "var(--foreground)" : "var(--muted-foreground)", fontWeight: "600", transition: "all 0.2s" }}
          >
            Adviser View (Faculty)
          </button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {view === "OSAS" ? (
          <OSASView 
            key="osas"
            assignments={assignments} 
            submissions={submissions}
            selectedAssignment={selectedAssignment}
            setSelectedAssignment={setSelectedAssignment}
            onFeedback={handleProvideFeedback}
            onNudge={handleNudge}
          />
        ) : (
          <AdviserView 
            key="adviser"
            assignments={assignments}
            submissions={submissions}
            selectedAssignment={selectedAssignment}
            setSelectedAssignment={setSelectedAssignment}
            onTurnIn={handleTurnIn}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// OSAS ADMIN VIEW
// ==========================================
function OSASView({ assignments, submissions, selectedAssignment, setSelectedAssignment, onFeedback, onNudge }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {!selectedAssignment ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: "700" }}>Current Requirements</h2>
            <button style={{ display: "flex", alignItems: "center", gap: "0.5rem", background: "var(--primary)", color: "var(--primary-foreground)", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: "600" }}>
              <Plus size={18} /> New Requirement
            </button>
          </div>

          <div style={{ display: "grid", gap: "1rem" }}>
            {assignments.map((a: any) => {
              const subs = submissions.filter((s: any) => s.assignmentId === a.id);
              const submittedCount = subs.filter((s: any) => s.status !== "ASSIGNED").length;
              const totalCount = subs.length; 

              return (
                <div key={a.id} className="card glass" style={{ padding: "1.5rem", cursor: "pointer", transition: "transform 0.2s" }} onClick={() => setSelectedAssignment(a.id)}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div style={{ display: "flex", gap: "1rem" }}>
                      <div style={{ width: "48px", height: "48px", background: "rgba(59, 130, 246, 0.1)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--primary)" }}>
                        <ShieldAlertIcon />
                      </div>
                      <div>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.25rem" }}>{a.title}</h3>
                        <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "1rem" }}>{a.description}</p>
                        <span style={{ fontSize: "0.75rem", fontWeight: "600", padding: "0.25rem 0.75rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "20px" }}>
                          Deadline: {a.deadline}
                        </span>
                      </div>
                    </div>
                    
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "2rem", fontWeight: "800", color: submittedCount === totalCount ? "#10b981" : "var(--foreground)" }}>
                        {submittedCount}<span style={{ fontSize: "1rem", color: "var(--muted-foreground)", fontWeight: "600" }}>/{totalCount}</span>
                      </p>
                      <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Submitted</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <OSASDetailView 
          assignment={assignments.find((a:any) => a.id === selectedAssignment)} 
          submissions={submissions.filter((s:any) => s.assignmentId === selectedAssignment)}
          onBack={() => setSelectedAssignment(null)}
          onFeedback={onFeedback}
          onNudge={onNudge}
        />
      )}
    </motion.div>
  );
}

function OSASDetailView({ assignment, submissions, onBack, onFeedback, onNudge }: any) {
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [feedbackText, setFeedbackText] = useState("");

  const pendingClubs = submissions.filter((s:any) => s.status === "ASSIGNED");
  const submittedClubs = submissions.filter((s:any) => s.status !== "ASSIGNED");

  return (
    <div>
      <button onClick={onBack} style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
        ← Back to Tracking
      </button>
      
      <div className="card glass" style={{ padding: "2rem", marginBottom: "2rem", borderLeft: "4px solid var(--primary)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "1.875rem", fontWeight: "800", marginBottom: "0.5rem" }}>{assignment.title}</h2>
          <p style={{ color: "var(--muted-foreground)" }}>Tracking {assignment.requiredDocs.length} required documents per club.</p>
        </div>
        
        {pendingClubs.length > 0 && (
          <button 
            onClick={() => onNudge("All Pending Clubs")}
            style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.5rem", background: "var(--secondary)", color: "var(--foreground)", border: "1px solid var(--primary)", borderRadius: "8px", fontWeight: "700" }}
          >
            <BellRing size={18} color="var(--primary)" /> Send Reminder to All ({pendingClubs.length})
          </button>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        {/* Student List */}
        <div className="card glass" style={{ padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Pending Submission ({pendingClubs.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {pendingClubs.map((s: any) => (
                <div key={s.id} style={{ padding: "1rem", borderRadius: "8px", background: "rgba(239, 68, 68, 0.05)", border: "1px solid rgba(239, 68, 68, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <p style={{ fontWeight: "700" }}>{s.clubName}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{s.adviserName}</p>
                  </div>
                  <button 
                    onClick={() => onNudge(s.clubName)}
                    style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--primary)", display: "flex", alignItems: "center", gap: "0.25rem" }}
                  >
                    <Send size={14} /> Send Reminder
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "1rem", color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "1px" }}>
              Turned In ({submittedClubs.length})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {submittedClubs.map((s: any) => (
                <div 
                  key={s.id} 
                  onClick={() => { setSelectedSub(s); setFeedbackText(s.feedback || ""); }}
                  style={{ 
                    padding: "1rem", borderRadius: "8px", 
                    background: selectedSub?.id === s.id ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${selectedSub?.id === s.id ? "var(--primary)" : "var(--border)"}`,
                    cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}
                >
                  <div>
                    <p style={{ fontWeight: "700" }}>{s.clubName}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>{s.adviserName}</p>
                  </div>
                  <StatusBadge status={s.status} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Grading/Feedback Panel */}
        {selectedSub ? (
          <div className="card glass" style={{ padding: "2rem", display: "flex", flexDirection: "column", height: "fit-content" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.5rem" }}>{selectedSub.clubName}</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.875rem", marginBottom: "2rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              Status: <StatusBadge status={selectedSub.status} />
            </p>

            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "0.875rem", fontWeight: "600", marginBottom: "1rem", color: "var(--muted-foreground)" }}>Submitted Documents Checklist:</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {assignment.requiredDocs.map((req: RequiredDocument) => {
                  const uploaded = selectedSub.uploadedDocs.find((d: UploadedDoc) => d.docId === req.id);
                  return (
                    <div key={req.id} style={{ display: "flex", alignItems: "center", gap: "1rem", fontSize: "0.875rem" }}>
                      <div style={{ color: uploaded ? "#10b981" : "#ef4444" }}>
                        {uploaded ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: "500", color: uploaded ? "var(--foreground)" : "var(--muted-foreground)" }}>{req.label}</p>
                        {uploaded && <p style={{ fontSize: "0.75rem", color: "var(--primary)", marginTop: "0.25rem" }}>{uploaded.fileName}</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <label style={{ fontWeight: "600", fontSize: "0.875rem", marginBottom: "0.5rem", display: "block" }}>OSAS Comments</label>
            <textarea 
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Provide comments to the club adviser..."
              style={{ width: "100%", height: "120px", background: "transparent", border: "1px solid var(--border)", borderRadius: "8px", padding: "1rem", color: "var(--foreground)", resize: "none", marginBottom: "1.5rem" }}
            />

            <div style={{ display: "flex", gap: "1rem", marginTop: "auto" }}>
              <button 
                onClick={() => onFeedback(selectedSub.id, "REVISION_NEEDED", feedbackText)}
                style={{ flex: 1, padding: "0.75rem", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderRadius: "8px", fontWeight: "600", border: "1px solid rgba(239, 68, 68, 0.2)", transition: "all 0.2s" }}
              >
                Return for Revision
              </button>
              <button 
                onClick={() => onFeedback(selectedSub.id, "APPROVED", feedbackText)}
                style={{ flex: 1, padding: "0.75rem", background: "#10b981", color: "white", borderRadius: "8px", fontWeight: "600", transition: "all 0.2s" }}
              >
                Approve Documents
              </button>
            </div>
          </div>
        ) : (
          <div className="card glass" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-foreground)", padding: "4rem" }}>
            Select a submitted club to review their compliance documents
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// ADVISER VIEW
// ==========================================
function AdviserView({ assignments, submissions, selectedAssignment, setSelectedAssignment, onTurnIn }: any) {
  // Find "My Demo Club" submissions
  const mySubmissions = (aId: string) => {
    // If not found, it's ASSIGNED
    const sub = submissions.find((s:any) => s.assignmentId === aId && s.clubName === "My Demo Club");
    return sub || { status: "ASSIGNED", uploadedDocs: [] };
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
      {!selectedAssignment ? (
        <>
          <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1.5rem" }}>My Pending Requirements</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {assignments.map((a: any) => {
              const mySub = mySubmissions(a.id);
              const status = mySub.status;

              return (
                <div key={a.id} className="card glass" style={{ padding: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", transition: "transform 0.2s" }} onClick={() => setSelectedAssignment(a.id)}>
                  <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                    <div style={{ 
                      width: "48px", height: "48px", borderRadius: "50%", 
                      background: status === "APPROVED" ? "rgba(16, 185, 129, 0.1)" : status === "ASSIGNED" ? "rgba(239, 68, 68, 0.1)" : "rgba(245, 158, 11, 0.1)", 
                      color: status === "APPROVED" ? "#10b981" : status === "ASSIGNED" ? "#ef4444" : "#f59e0b",
                      display: "flex", alignItems: "center", justifyContent: "center" 
                    }}>
                      {status === "APPROVED" ? <CheckCircle2 size={24} /> : status === "ASSIGNED" ? <AlertCircle size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: "700", marginBottom: "0.25rem" }}>{a.title}</h3>
                      <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>Deadline: {a.deadline}</p>
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <AdviserDetailView 
          assignment={assignments.find((a:any) => a.id === selectedAssignment)}
          submission={mySubmissions(selectedAssignment)}
          onBack={() => setSelectedAssignment(null)}
          onTurnIn={onTurnIn}
        />
      )}
    </motion.div>
  );
}

function AdviserDetailView({ assignment, submission, onBack, onTurnIn }: any) {
  const status = submission.status;
  
  // Local state to track which documents the adviser has uploaded before hitting turn in
  const [localDocs, setLocalDocs] = useState<UploadedDoc[]>(submission.uploadedDocs || []);

  const handleMockUpload = (docId: string, label: string) => {
    // Just mock that they attached a file
    if (!localDocs.find(d => d.docId === docId)) {
      setLocalDocs([...localDocs, { docId, fileName: `${label.replace(/ /g, "_")}.pdf` }]);
    }
  };

  const isFullyCompliant = localDocs.length === assignment.requiredDocs.length;

  return (
    <div>
      <button onClick={onBack} style={{ color: "var(--muted-foreground)", marginBottom: "1.5rem", fontWeight: "600", fontSize: "0.875rem" }}>
        ← Back to Requirements
      </button>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        
        {/* Left: Details */}
        <div className="card glass" style={{ padding: "2rem", height: "fit-content" }}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "2rem" }}>
            <div style={{ width: "48px", height: "48px", background: "var(--primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
              <ShieldAlertIcon />
            </div>
            <div>
              <h2 style={{ fontSize: "1.875rem", fontWeight: "800", lineHeight: 1.2 }}>{assignment.title}</h2>
              <p style={{ color: "var(--muted-foreground)", fontWeight: "500", marginTop: "0.5rem" }}>OSAS Director • Deadline: {assignment.deadline}</p>
            </div>
          </div>
          
          <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "var(--foreground)", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
            {assignment.description}
          </p>

          {submission.feedback && (
            <div style={{ marginTop: "2rem", padding: "1.5rem", background: "rgba(245, 158, 11, 0.1)", borderRadius: "8px", borderLeft: "4px solid #f59e0b" }}>
              <h4 style={{ fontSize: "1rem", fontWeight: "700", color: "#f59e0b", marginBottom: "0.5rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <MessageSquare size={18} /> OSAS Coordinator Message
              </h4>
              <p style={{ color: "var(--foreground)", fontSize: "0.875rem", lineHeight: 1.6 }}>{submission.feedback}</p>
            </div>
          )}
        </div>

        {/* Right: Your Work Checklist */}
        <div className="card glass" style={{ padding: "2rem", display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: "700" }}>Compliance Checklist</h3>
            <StatusBadge status={status} />
          </div>

          <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", marginBottom: "1.5rem" }}>
            You must upload all required documents below before you can turn in the renewal packet.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
            {assignment.requiredDocs.map((req: RequiredDocument) => {
              const uploaded = localDocs.find(d => d.docId === req.id);
              const isLocked = status === "SUBMITTED" || status === "APPROVED";

              return (
                <div key={req.id} style={{ 
                  display: "flex", alignItems: "center", justifyContent: "space-between", 
                  padding: "1rem", border: "1px solid var(--border)", borderRadius: "8px",
                  background: uploaded ? "rgba(16, 185, 129, 0.05)" : "rgba(255,255,255,0.02)"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <div style={{ color: uploaded ? "#10b981" : "var(--muted-foreground)" }}>
                      {uploaded ? <CheckCircle2 size={20} /> : <FileText size={20} />}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: "600", color: uploaded ? "var(--foreground)" : "var(--muted-foreground)" }}>
                        {req.label}
                      </p>
                      {uploaded && <p style={{ fontSize: "0.75rem", color: "var(--primary)", marginTop: "0.25rem" }}>{uploaded.fileName}</p>}
                    </div>
                  </div>
                  
                  {!uploaded && !isLocked && (
                    <button 
                      onClick={() => handleMockUpload(req.id, req.label)}
                      style={{ fontSize: "0.75rem", fontWeight: "600", color: "var(--primary)", padding: "0.5rem 1rem", background: "rgba(59, 130, 246, 0.1)", borderRadius: "6px" }}
                    >
                      Upload
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {(status === "ASSIGNED" || status === "REVISION_NEEDED") ? (
            <button 
              disabled={!isFullyCompliant}
              onClick={() => onTurnIn(assignment.id, localDocs)}
              style={{ 
                width: "100%", padding: "1rem", 
                background: isFullyCompliant ? "var(--primary)" : "var(--secondary)", 
                color: isFullyCompliant ? "var(--primary-foreground)" : "var(--muted-foreground)", 
                borderRadius: "8px", fontWeight: "700",
                transition: "all 0.2s",
                cursor: isFullyCompliant ? "pointer" : "not-allowed"
              }}
            >
              {isFullyCompliant ? "Submit All Documents" : "Upload all documents to submit"}
            </button>
          ) : (
            <button 
              disabled={status === "APPROVED"}
              style={{ width: "100%", padding: "1rem", background: "transparent", border: "1px solid var(--border)", color: "var(--muted-foreground)", borderRadius: "8px", fontWeight: "700" }}
            >
              {status === "APPROVED" ? "Locked (Approved)" : "Unsubmit"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Utils
function StatusBadge({ status }: { status: SubmissionStatus }) {
  const styles = {
    ASSIGNED: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", text: "Pending" },
    SUBMITTED: { bg: "rgba(245, 158, 11, 0.1)", color: "#f59e0b", text: "Submitted" },
    APPROVED: { bg: "rgba(16, 185, 129, 0.1)", color: "#10b981", text: "Approved" },
    REVISION_NEEDED: { bg: "rgba(239, 68, 68, 0.1)", color: "#ef4444", text: "Needs Revision" },
  };

  const s = styles[status];

  return (
    <span style={{ 
      background: s.bg, 
      color: s.color, 
      padding: "0.25rem 0.75rem", 
      borderRadius: "20px", 
      fontSize: "0.75rem", 
      fontWeight: "700" 
    }}>
      {s.text}
    </span>
  );
}

function ShieldAlertIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M12 8v4"/>
      <path d="M12 16h.01"/>
    </svg>
  )
}
