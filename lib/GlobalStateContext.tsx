"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

import { 
  addOrganization as dbAddOrg, 
  updateOrganization as dbUpdateOrg, 
  deleteOrganization as dbDeleteOrg,
  proposeActivity as dbProposeAct,
  updateActivityStatus as dbUpdateActStatus,
  getOrganizations as dbGetOrgs,
  getActivities as dbGetActivities
} from "@/lib/actions/orgActions";
import { 
  addAnnouncement as dbAddAnn,
  deleteAnnouncement as dbDelAnn,
  getAnnouncements as dbGetAnns,
  addReferral as dbAddRef,
  getReferrals as dbGetRefs,
  updateReferralStatus as dbUpdateRef
} from "@/lib/actions/systemActions";
import {
  getScholarshipPrograms as dbGetProgs,
  addScholarshipProgram as dbAddProg,
  updateScholarshipProgram as dbUpdateProg,
  deleteScholarshipProgram as dbDelProg,
  getScholarshipApps as dbGetApps,
  submitScholarshipApp as dbSubmitApp,
  updateAppStatus as dbUpdateApp,
  getBatchConfigs as dbGetBatches,
  updateBatchTimeline as dbUpdateBatch,
  addBatchConfig as dbAddBatch,
  deleteBatchConfig as dbDelBatch
} from "@/lib/actions/scholarshipActions";
import {
  getServiceRequests as dbGetRequests,
  addServiceRequest as dbAddRequest,
  updateServiceRequestStatus as dbUpdateReqStatus,
  getServiceTypes as dbGetServiceTypes,
  addServiceType as dbAddServiceType,
  updateServiceType as dbUpdateServiceType,
  deleteServiceType as dbDelServiceType,
  getGoodMoralConfig as dbGetGMConfig,
  updateGoodMoralConfig as dbUpdateGMConfig,
  getIssuedCertificates as dbGetIssuedCerts,
  issueCertificate as dbIssueCert
} from "@/lib/actions/requestActions";
import { 
  login as dbLogin, 
  register as dbRegister,
  logout as dbLogout, 
  getSession as dbGetSession,
  updateProfile as dbUpdateProfile 
} from "@/lib/actions/authActions";
import { 
  uploadToVault as dbUploadVault, 
  verifyDocument as dbVerifyDoc,
  getAllStudentVaults as dbGetStudentVaults 
} from "@/lib/actions/vaultActions";
import {
  getAppointments as dbGetAppts,
  bookAppointment as dbBookApp,
  updateAppointmentStatus as dbUpdateAppStatus
} from "@/lib/actions/appointmentActions";
import { 
  getNotifications as dbGetNotifs,
  addNotification as dbAddNotif,
  markNotificationsRead as dbMarkRead,
  getAuditLogs as dbGetAuditLogs,
  addAuditLog as dbAddAudit
} from "@/lib/actions/notificationActions";
import { getAllUsers as dbGetAllUsers } from "@/lib/actions/adminActions";

// Types
export type User = {
  id: string;
  name: string;
  firstName?: string | null;
  middleName?: string | null;
  lastName?: string | null;
  username?: string | null;
  password?: string | null;
  email?: string | null;
  contactNumber?: string | null;
  address?: string | null;
  department?: string | null;
  advisorySection?: string | null;
  role: "SYSTEM_ADMIN" | "OSAS_DIRECTOR" | "GUIDANCE_COUNSELOR" | "STUDENT_APPLICANT" | "STUDENT_LEADER" | "ADVISER";
  vault: { [key: string]: { uploaded: boolean, date: string, status?: string, remarks?: string } };
};

export type ServiceRequest = {
  id: string;
  type: string;
  studentName: string;
  date: string;
  status: "Pending" | "In Progress" | "Completed" | "Ready for Pickup";
  requirements?: { [key: string]: boolean };
};

export type ServiceType = {
  id: string;
  name: string;
  description: string;
  requiredDocs: string[];
};

export type Announcement = {
  id: string;
  title: string;
  content: string;
  category: "News" | "Event" | "Alert" | "Academic" | "System" | "Urgent";
  date: string;
  author: string;
};

export type StudentOrg = {
  id: string;
  name: string;
  acronym: string;
  category: "Academic" | "Religious" | "Special Interest" | "Council";
  status: "Recognized" | "Probationary" | "Expired" | "Archived";
  president: string;
  adviser: string;
  adviserId?: string;
  logo?: string;
  renewalDate?: string;
};

export type OrgActivity = {
  id: string;
  orgId: string;
  title: string;
  date: string;
  status: "Draft" | "Pending Adviser Review" | "Pending OSAS Approval" | "Approved" | "Revision Requested" | "Rejected" | "Completed";
  description: string;
  budget: string;
  venue: string;
  participants: string;
  osasComments?: string;
};

export type Notification = {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
};

export type Appointment = {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  status: "PENDING" | "APPROVED" | "COMPLETED" | "CANCELLED";
  studentName: string;
};

export type DashboardStats = {
  studentsCount: number;
  requestsCount: number;
  appointmentsCount: number;
  scholarshipsCount: number;
};

export type Referral = {
  id: string;
  studentName: string;
  adviserName: string;
  adviserId?: string;
  reason: string;
  status: "Referred to Guidance" | "Endorsed to OSAS" | "Sanctioned" | "Dismissed";
  counselorFindings?: string;
  osasVerdict?: string;
  dateFiled: string;
};

export type ScholarshipProgram = {
  id: string;
  name: string;
  provider: string;
  description: string;
  deadline: string;
  status: "Active" | "Archived";
};

export type ScholarshipApp = {
  id: string;
  studentName: string;
  requirements: { pic1x1: boolean, letter: boolean, sketch: boolean, cor: boolean, grades: boolean, picHouse: boolean };
  status: "Pending Requirements" | "For OSAS Review" | "Recommended" | "Approved";
  recommendationLevel?: "Partial" | "Half" | "Full";
  batchId?: number;
  dateApplied: string; // Use YYYY-MM-DD format for easier comparison
};

export type BatchConfig = {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Inactive" | "Archived";
};

export type GoodMoralConfig = {
  content: string;
  signatories: { name: string; position: string; id: string }[];
};

export type IssuedCertificate = {
  id: string;
  requestId: string;
  studentId: string;
  signedUrl: string;
  dateIssued: string;
};

export type AuditLog = {
  id: string;
  action: string;
  user: string;
  role: string;
  timestamp: string;
  details: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
};

// CONTEXT DEFINITION - HOISTED
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

// Initial Data - Start Empty for SQL Hydration
const initialRequests: ServiceRequest[] = [];
const initialServiceTypes: ServiceType[] = [];
const initialNotifications: Notification[] = [];
const initialStats: DashboardStats = {
  studentsCount: 0,
  requestsCount: 0,
  appointmentsCount: 0,
  scholarshipsCount: 0,
};
const initialAuditLogs: AuditLog[] = [];

const initialReferrals: Referral[] = [];
const initialScholarshipPrograms: ScholarshipProgram[] = [];
const initialScholarshipApps: ScholarshipApp[] = [];
const initialBatches: BatchConfig[] = [];
const initialAnnouncements: Announcement[] = [];
const initialOrgs: StudentOrg[] = [];
const initialActivities: OrgActivity[] = [];

// Context Definition
type GlobalStateContextType = {
  requests: ServiceRequest[];
  addRequest: (type: string, studentName: string, reqs: { [key: string]: boolean }) => void;
  updateRequestStatus: (id: string, status: ServiceRequest["status"]) => void;
  
  serviceTypes: ServiceType[];
  addServiceType: (name: string, description: string, requiredDocs: string[]) => void;
  updateServiceType: (id: string, updates: Partial<ServiceType>) => void;
  deleteServiceType: (id: string) => void;
  
  goodMoralConfig: GoodMoralConfig | null;
  updateGoodMoralConfig: (config: GoodMoralConfig) => void;
  
  issuedCertificates: IssuedCertificate[];
  issueCertificate: (cert: Omit<IssuedCertificate, "id" | "dateIssued">) => void;
  
  notifications: Notification[];
  markNotificationsRead: () => void;
  stats: DashboardStats;
  referrals: Referral[];
  addReferral: (studentName: string, reason: string) => void;
  endorseReferral: (id: string, findings: string) => void;
  verdictReferral: (id: string, status: "Sanctioned" | "Dismissed", notes: string) => void;
  
  scholarshipApps: ScholarshipApp[];
  submitScholarshipApp: (scholarshipId: string, studentName: string, reqs: ScholarshipApp["requirements"]) => void;
  recommendScholarship: (id: string, level: "Partial" | "Half" | "Full", batchId: number) => void;
  bulkRecommendScholarships: (ids: string[], level: "Partial" | "Half" | "Full", batchId: number) => Promise<void>;
  approveBatch: (batchId: number) => void;
  bulkApproveScholarships: (ids: string[]) => Promise<void>;

  scholarshipPrograms: ScholarshipProgram[];
  addScholarshipProgram: (name: string, provider: string, description: string, deadline: string) => void;
  updateScholarshipProgram: (id: string, updates: Partial<ScholarshipProgram>) => void;
  deleteScholarshipProgram: (id: string) => void;
  
  batchConfigs: BatchConfig[];
  addBatchConfig: (name: string, startDate: string, endDate: string) => void;
  updateBatchConfig: (id: number, updates: Partial<BatchConfig>) => void;
  deleteBatchConfig: (id: number) => void;

  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string; user?: any }>;
  register: (formData: { name: string, username: string, password: string }) => Promise<{ success: boolean; message?: string; user?: any }>;
  logout: () => void;
  uploadToVault: (docName: string) => void;

  announcements: Announcement[];
  addAnnouncement: (title: string, content: string, category: Announcement["category"]) => void;
  deleteAnnouncement: (id: string) => void;

  addNotification: (title: string, desc: string) => void;

  organizations: StudentOrg[];
  activities: OrgActivity[];
  addOrganization: (org: Omit<StudentOrg, "id">) => void;
  updateOrganization: (id: string, updates: Partial<StudentOrg>) => void;
  deleteOrganization: (id: string) => void;
  proposeActivity: (orgId: string, details: { title: string, description: string, date: string, budget: string, venue: string, participants: string }) => void;
  updateActivityStatus: (id: string, updates: { status: OrgActivity["status"], comments?: string }) => void;
  renewOrganization: (id: string) => void;

  appointments: Appointment[];
  bookAppointment: (details: any) => void;
  updateApptStatus: (id: string, status: any) => void;
  verifyDocument: (userId: string, docName: string, status: any, remarks?: string) => void;

  auditLogs: AuditLog[];
  logAudit: (action: string, details: string, severity?: AuditLog["severity"]) => Promise<void>;
  theme: string;
  toggleTheme: () => void;
  isLoading: boolean;
  isSyncing: boolean;
  telemetryTier: 0 | 1 | 2;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isMobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
};




export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>(initialRequests);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(initialServiceTypes);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals);
  const [scholarshipApps, setScholarshipApps] = useState<ScholarshipApp[]>(initialScholarshipApps);
  const [scholarshipPrograms, setScholarshipPrograms] = useState<ScholarshipProgram[]>(initialScholarshipPrograms);
  const [batchConfigs, setBatchConfigs] = useState<BatchConfig[]>(initialBatches);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [organizations, setOrganizations] = useState<StudentOrg[]>(initialOrgs);
  const [activities, setActivities] = useState<OrgActivity[]>(initialActivities);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [telemetryTier, setTelemetryTier] = useState<0 | 1 | 2>(0);
  const [theme, setTheme] = useState<string>("light");

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("spark_theme", newTheme);
  };

  // Sync Theme with Document
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // TIERED HYDRATION ENGINE
  const refreshState = async (priorityOnly = false) => {
    setIsSyncing(true);
    try {
      // TIER 1: CRITICAL CORE (Session & Identity)
      const session = await dbGetSession();
      if (session) setCurrentUser(session);
      
      const savedTheme = localStorage.getItem("spark_theme") as any;
      if (savedTheme) setTheme(savedTheme);
      
      setTelemetryTier(1);
      setIsLoading(false); // UI is now interactive

      if (priorityOnly) return;

      // TIER 2: INSTITUTIONAL BACKGROUND (Bulk Data)
      const [dbOrgs, dbAnns, dbRefs, dbProgs, dbApps, dbBatches, dbRequests, dbAppts, dbUsers, dbNotifs, dbLogs, dbTypes, dbGM, dbCerts] = await Promise.all([
        dbGetOrgs().catch(() => []),
        dbGetAnns().catch(() => []),
        dbGetRefs().catch(() => []),
        dbGetProgs().catch(() => []),
        dbGetApps().catch(() => []),
        dbGetBatches().catch(() => []),
        dbGetRequests().catch(() => []),
        dbGetAppts().catch(() => []),
        dbGetAllUsers().catch(() => []),
        dbGetNotifs(session?.id).catch(() => []), 
        dbGetAuditLogs().catch(() => []),
        dbGetServiceTypes().catch(() => []),
        dbGetGMConfig().catch(() => null),
        dbGetIssuedCerts().catch(() => [])
      ]);

      // Atomic UI Updates
      if (dbOrgs?.length) setOrganizations(dbOrgs as any);
      const dbActivities = await dbGetActivities().catch(() => []);
      if (dbActivities?.length) setActivities(dbActivities as any);
      if (dbAnns?.length) setAnnouncements(dbAnns as any);
      if (dbRefs?.length) setReferrals(dbRefs as any);
      if (dbProgs?.length) setScholarshipPrograms(dbProgs as any);
      if (dbApps?.length) setScholarshipApps(dbApps as any);
      if (dbBatches?.length) setBatchConfigs(dbBatches as any);
      if (dbRequests?.length) setRequests(dbRequests as any);
      if (dbAppts?.length) setAppointments(dbAppts as any);
      if (dbUsers?.length) setUsers(dbUsers as any);
      if (dbNotifs?.length) setNotifications(dbNotifs.map((n: any) => ({ ...n, time: new Date(n.createdAt).toLocaleTimeString() })));
      if (dbLogs?.length) setAuditLogs(dbLogs.map((l: any) => ({ ...l, timestamp: new Date(l.timestamp).toLocaleString() })));
      if (dbTypes?.length) setServiceTypes(dbTypes as any);
      if (dbGM) setGoodMoralConfig(dbGM as any);
      if (dbCerts) setIssuedCertificates(dbCerts as any);

      setTelemetryTier(2);
    } catch (error) {
      console.error("Liquid Hydration Interrupted:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshState();
    
    // Near Real-Time Sync: Poll every 30 seconds
    const interval = setInterval(() => refreshState(), 30000);
    return () => clearInterval(interval);
  }, []);

  const login = async (username: string, password: string) => {
    const res = await dbLogin(username, password);
    if (res.success && res.user) {
      setCurrentUser(res.user as any);
      await logAudit("USER_LOGIN", `User ${res.user.name} authenticated via credentials.`, "LOW");
    }
    setIsLoading(false);
    return res;
  };
  
  const register = async (formData: { name: string, username: string, password: string }) => {
    setIsLoading(true);
    const res = await dbRegister(formData);
    if (res.success && res.user) {
      setCurrentUser(res.user as any);
      await logAudit("USER_REGISTER", `New student account created: ${res.user.name}.`, "LOW");
    }
    setIsLoading(false);
    return res;
  };

  const logAudit = async (action: string, details: string, severity: AuditLog["severity"] = "LOW") => {
    const log = {
      action,
      user: currentUser?.name || "SYSTEM",
      role: currentUser?.role || "SYSTEM",
      details,
      severity
    };
    await dbAddAudit(log);
    // Local update for immediate feedback
    setAuditLogs(prev => [{ ...log, id: "TEMP", timestamp: new Date().toLocaleString() } as any, ...prev]);
  };

  const logout = async () => {
    await dbLogout();
    setCurrentUser(null);
  };

  const uploadToVault = async (docName: string) => {
    if (!currentUser) return;
    const updatedUser = await dbUploadVault(currentUser.id, docName);
    if (updatedUser) {
      setCurrentUser(updatedUser as any);
      
      // Add persistent notification
      await dbAddNotif({ 
        title: "Vault Updated", 
        desc: `Document '${docName}' is now awaiting OSAS verification.`,
        targetId: currentUser.id 
      });

      // Refresh scholarship state too
      const updatedApps = await dbGetApps();
      if (updatedApps) setScholarshipApps(updatedApps as any);
    }
  };

  const verifyDocument = async (userId: string, docName: string, status: any, remarks?: string) => {
    const updatedUser = await dbVerifyDoc(userId, docName, status, remarks);
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(updatedUser as any);
    }
    
    // Notify the student
    await dbAddNotif({
      title: "Document Verified",
      desc: `Your '${docName}' has been ${status}. ${remarks || ""}`,
      targetId: userId
    });

    const updatedApps = await dbGetApps();
    if (updatedApps) setScholarshipApps(updatedApps as any);
    await logAudit("DOCUMENT_VERIFIED", `Doc: ${docName} | Status: ${status} | Target: ${updatedUser?.name}`, status === "Rejected" ? "MEDIUM" : "LOW");
  };

  const addAnnouncement = async (title: string, content: string, category: Announcement["category"]) => {
    const ann = await dbAddAnn({ title, content, category, author: currentUser?.name || "OSAS Admin" });
    
    // Add global notification
    await dbAddNotif({ title: "New Announcement", desc: title });
    addNotification("Announcement Published", title);

    setAnnouncements([{ ...ann, date: new Date(ann.createdAt).toLocaleDateString() } as any, ...announcements]);
    await logAudit("BROADCAST_EXECUTED", `Title: ${title} | Category: ${category}`, category === "Urgent" ? "HIGH" : "MEDIUM");
  };

  const deleteAnnouncement = async (id: string) => {
    await dbDelAnn(id);
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const addRequest = async (type: string, studentName: string, reqs: { [key: string]: boolean }) => {
    const req = await dbAddRequest({ type, studentName, requirements: reqs });
    
    // Notify OSAS/Admin
    await dbAddNotif({ title: "New Service Request", desc: `${studentName} requested ${type}.` });
    addNotification("Request Submitted", `Your request for ${type} is being processed.`);

    setRequests([{ ...req, studentName, date: new Date(req.createdAt).toLocaleDateString(), status: "Pending", requirements: reqs } as any, ...requests]);
  };

  const updateRequestStatus = async (id: string, status: ServiceRequest["status"]) => {
    await dbUpdateReqStatus(id, status);
    
    // Find the request to get the student
    const req = requests.find(r => r.id === id);
    if (req) {
      const student = users.find(u => u.name === req.studentName);
      if (student) {
        await dbAddNotif({
          title: "Request Updated",
          desc: `Your request for ${req.type} is now ${status}.`,
          targetId: student.id
        });
      }
    }

    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    addNotification("Status Updated", `Request for ${req?.type || 'Service'} is now ${status}.`);
  };

  const [goodMoralConfig, setGoodMoralConfig] = useState<GoodMoralConfig>({ content: "", signatories: [] });
  const [issuedCertificates, setIssuedCertificates] = useState<IssuedCertificate[]>([]);

  const updateGoodMoralConfig = async (config: GoodMoralConfig) => {
    await dbUpdateGMConfig(config);
    setGoodMoralConfig(config);
  };

  const issueCertificate = async (cert: Omit<IssuedCertificate, "id" | "dateIssued">) => {
    const newCert = await dbIssueCert(cert);
    setIssuedCertificates(prev => [newCert as any, ...prev]);
    logAudit("CERTIFICATE_ISSUED", `Good Moral issued for Request ${cert.requestId}`, "LOW");
  };

  const addServiceType = async (name: string, description: string, requiredDocs: string[]) => {
    const newType = await dbAddServiceType({ name, description, requiredDocs });
    setServiceTypes(prev => [newType as any, ...prev]);
    setNotifications(prev => [{ id: Math.random().toString(), title: "New Service Added", desc: `${name} is now available for student requests.`, time: "Just now", unread: true }, ...prev]);
  };

  const updateServiceType = async (id: string, updates: Partial<ServiceType>) => {
    await dbUpdateServiceType(id, updates);
    setServiceTypes(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteServiceType = async (id: string) => {
    await dbDelServiceType(id);
    setServiceTypes(prev => prev.filter(s => s.id !== id));
  };

  const markNotificationsRead = async () => {
    if (currentUser) {
      await dbMarkRead(currentUser.id);
      setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    }
  };

  const addNotification = (title: string, desc: string) => {
    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      title,
      desc,
      time: "Just now",
      unread: true
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const addReferral = async (studentName: string, reason: string) => {
    const ref = await dbAddRef({ studentName, reason, adviserName: currentUser?.name || "Adviser", adviserId: currentUser?.id || "" });
    
    // Notify Guidance
    await dbAddNotif({ title: "New Referral", desc: `Student ${studentName} referred by ${currentUser?.name}.` });

    setReferrals([{ ...ref, studentName, adviserName: currentUser?.name || "Adviser", dateFiled: new Date(ref.dateFiled).toLocaleDateString() } as any, ...referrals]);
  };

  const endorseReferral = async (id: string, findings: string) => {
    await dbUpdateRef(id, { status: "Endorsed to OSAS", counselorFindings: findings });
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status: "Endorsed to OSAS", counselorFindings: findings } : r));
    addNotification("Case Endorsed", `Referral ${id} has been endorsed to OSAS.`);
  };

  const verdictReferral = async (id: string, status: "Sanctioned" | "Dismissed", notes: string) => {
    await dbUpdateRef(id, { status, osasVerdict: notes });
    setReferrals(prev => prev.map(r => r.id === id ? { ...r, status, osasVerdict: notes } : r));
    addNotification("OSAS Verdict", `Verdict reached for Referral ${id}: ${status}.`);
  };

  const submitScholarshipApp = async (scholarshipId: string, studentName: string, reqs: ScholarshipApp["requirements"]) => {
    const app = await dbSubmitApp({ studentName, scholarshipId, requirements: reqs });
    setScholarshipApps([{ ...app, studentName, requirements: reqs } as any, ...scholarshipApps]);
    logAudit("SCHOLARSHIP_APPLIED", `Student ${studentName} applied for Program ${scholarshipId}`, "LOW");
  };

  const recommendScholarship = async (appId: string, level: string, batchId: number) => {
    await dbUpdateApp(appId, { status: "Recommended", recommendationLevel: level, batchId });
    setScholarshipApps(prev => prev.map(a => a.id === appId ? { ...a, status: "Recommended", recommendationLevel: level as any, batchId } : a));
    addNotification("Application Recommended", `A student has been recommended for ${level} scholarship.`);
    logAudit("SCHOLARSHIP_RECOMMENDED", `AppID: ${appId} | Level: ${level} | Batch: ${batchId}`, "MEDIUM");
  };

  const bulkRecommendScholarships = async (ids: string[], level: string, batchId: number) => {
    await Promise.all(ids.map(id => dbUpdateApp(id, { status: "Recommended", recommendationLevel: level, batchId })));
    setScholarshipApps(prev => prev.map(a => ids.includes(a.id) ? { ...a, status: "Recommended", recommendationLevel: level as any, batchId } : a));
    addNotification("Bulk Recommendation Successful", `${ids.length} applications have been recommended for ${level} scholarship.`);
    logAudit("BULK_SCHOLARSHIP_RECOMMENDED", `Count: ${ids.length} | Level: ${level} | Batch: ${batchId}`, "HIGH");
  };

  const addBatchConfig = async (name: string, startDate: string, endDate: string) => {
    const batch = await dbAddBatch({ name, startDate, endDate });
    setBatchConfigs([...batchConfigs, batch as any]);
    addNotification("New Batch Created", `${name} is now available for scheduling.`);
    await logAudit("BATCH_CONFIG_CREATED", `Name: ${name} | Period: ${startDate} to ${endDate}`, "MEDIUM");
  };

  const updateBatchConfig = async (id: number, updates: Partial<BatchConfig>) => {
    await dbUpdateBatch(id, updates);
    setBatchConfigs(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
    addNotification("Batch Updated", `Batch settings modified.`);
    await logAudit("BATCH_CONFIG_UPDATED", `BatchID: ${id} | Updates: ${JSON.stringify(updates)}`, "MEDIUM");
  };

  const deleteBatchConfig = async (id: number) => {
    await dbDelBatch(id);
    setBatchConfigs(prev => prev.filter(b => b.id !== id));
    addNotification("Batch Removed", `Batch deleted from system.`);
    await logAudit("BATCH_CONFIG_DELETED", `BatchID: ${id}`, "HIGH");
  };

  const approveBatch = async (batchId: number) => {
    const batchApps = scholarshipApps.filter(s => s.batchId === batchId);
    for (const app of batchApps) {
      await dbUpdateApp(app.id, { status: "Approved" });
    }
    setScholarshipApps(prev => prev.map(s => s.batchId === batchId ? { ...s, status: "Approved" } : s));
    addNotification("Batch Approved", `Scholarship Batch ${batchId} has been approved by Management.`);
    logAudit("BATCH_APPROVED", `BatchID: ${batchId} | Students: ${batchApps.length}`, "HIGH");
  };

  const bulkApproveScholarships = async (ids: string[]) => {
    await Promise.all(ids.map(id => dbUpdateApp(id, { status: "Approved" })));
    setScholarshipApps(prev => prev.map(a => ids.includes(a.id) ? { ...a, status: "Approved" } : a));
    addNotification("Bulk Approval Successful", `${ids.length} applications have been finalized and approved.`);
    logAudit("BULK_SCHOLARSHIP_APPROVED", `Count: ${ids.length} | Status: Approved`, "HIGH");
  };

  const addScholarshipProgram = async (name: string, provider: string, description: string, deadline: string) => {
    const prog = await dbAddProg({ name, provider, description, deadline });
    setScholarshipPrograms([{ ...prog, deadline: new Date(prog.deadline).toLocaleDateString() } as any, ...scholarshipPrograms]);
    addNotification("New Scholarship Open", `${name} is now accepting applicants.`);
    logAudit("SCHOLARSHIP_PROGRAM_CREATED", `Name: ${name} | Provider: ${provider}`, "LOW");
  };

  const updateScholarshipProgram = async (id: string, updates: Partial<ScholarshipProgram>) => {
    await dbUpdateProg(id, updates);
    setScholarshipPrograms(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addNotification("Program Updated", `Scholarship program details modified.`);
    await logAudit("SCHOLARSHIP_PROGRAM_UPDATED", `ProgID: ${id} | Changes: ${JSON.stringify(updates)}`, "MEDIUM");
  };

  const deleteScholarshipProgram = async (id: string) => {
    await dbDelProg(id);
    setScholarshipPrograms(prev => prev.filter(p => p.id !== id));
    addNotification("Program Removed", `Scholarship program deleted from system.`);
    await logAudit("SCHOLARSHIP_PROGRAM_DELETED", `ProgID: ${id}`, "HIGH");
  };

  const proposeActivity = async (orgId: string, details: { title: string, description: string, date: string, budget: string, venue: string, participants: string }) => {
    // 1. Update Database
    const newAct = await dbProposeAct(orgId, details);

    // 2. Update Local UI State
    setActivities([newAct as any, ...activities]);
    addNotification("New Activity Proposal", `${details.title} has been proposed for review.`);
  };

  const updateActivityStatus = async (id: string, updates: { status: OrgActivity["status"], comments?: string }) => {
    await dbUpdateActStatus(id, updates as any);
    setActivities(prev => prev.map(a => a.id === id ? { ...a, status: updates.status, osasComments: updates.comments } : a));
    
    const act = activities.find(a => a.id === id);
    if (act) {
      addNotification("Activity Status Updated", `Proposal '${act.title}' is now ${updates.status}.`);
    }
  };

  const renewOrganization = async (id: string) => {
    await dbUpdateOrg(id, { status: "Recognized" });
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, status: "Recognized" } : o));
  };

  const addOrganization = async (org: Omit<StudentOrg, "id">) => {
    // 1. Update Database
    const savedOrg = await dbAddOrg({ 
      name: org.name, 
      acronym: org.acronym, 
      category: org.category, 
      president: org.president,
      adviser: org.adviser,
      adviserId: org.adviserId || "",
      logo: org.logo
    });

    // 2. Update Local State
    setOrganizations([...organizations, savedOrg as any]);
    addNotification("New Organization Registered", `${org.name} is now part of the university RSOs.`);
  };

  const updateOrganization = async (id: string, updates: Partial<StudentOrg>) => {
    await dbUpdateOrg(id, updates);
    setOrganizations(prev => prev.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const deleteOrganization = async (id: string) => {
    await dbDeleteOrg(id);
    setOrganizations(prev => prev.filter(o => o.id !== id));
  };

  const bookAppointment = async (data: Omit<Appointment, "id" | "status">) => {
    const app = await dbBookApp({ ...data, studentName: currentUser?.name || data.studentName });
    setAppointments([...appointments, { ...app, studentName: currentUser?.name || data.studentName, date: new Date(app.date).toLocaleDateString() } as any]);
    addNotification("Appointment Booked", `New session for ${data.title} scheduled.`);
  };

  const updateApptStatus = async (id: string, status: Appointment["status"]) => {
    await dbUpdateAppStatus(id, status);
    setAppointments(prev => prev.map(a => id === a.id ? { ...a, status } : a));
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    
    let updatePayload = { ...data };
    
    // Only recalculate name if name fields are being updated
    if (data.firstName || data.lastName) {
      const first = data.firstName || currentUser.firstName || "";
      const middle = data.middleName || currentUser.middleName || "";
      const last = data.lastName || currentUser.lastName || "";
      updatePayload.name = `${first} ${middle ? middle + ' ' : ''}${last}`.trim();
    }
    
    const updatedUser = await dbUpdateProfile(currentUser.id, updatePayload);
    if (updatedUser) {
      setCurrentUser(updatedUser as any);
      setUsers(prev => prev.map(u => u.id === (updatedUser as any).id ? (updatedUser as any) : u));
    }
  };

  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <GlobalStateContext.Provider value={{
      requests,
      addRequest,
      updateRequestStatus,
      serviceTypes,
      addServiceType,
      updateServiceType,
      deleteServiceType,
      goodMoralConfig,
      updateGoodMoralConfig,
      issuedCertificates,
      issueCertificate,
      notifications,
      markNotificationsRead,
      stats,
      referrals,
      addReferral,
      endorseReferral,
      verdictReferral,
      scholarshipApps,
      submitScholarshipApp,
      recommendScholarship,
      bulkRecommendScholarships,
      approveBatch,
      bulkApproveScholarships,
      scholarshipPrograms,
      addScholarshipProgram,
      updateScholarshipProgram,
      deleteScholarshipProgram,
      batchConfigs,
      addBatchConfig,
      updateBatchConfig,
      deleteBatchConfig,
      currentUser,
      users,
      login,
      register,
      logout,
      uploadToVault,
      announcements,
      addAnnouncement,
      deleteAnnouncement,
      addNotification,
      organizations,
      activities,
      addOrganization,
      updateOrganization,
      deleteOrganization,
      proposeActivity,
      updateActivityStatus,
      renewOrganization,
      appointments,
      bookAppointment,
      updateApptStatus,
      verifyDocument,
      auditLogs,
      logAudit,
      theme,
      toggleTheme,
      isLoading,
      isSyncing,
      telemetryTier,
      updateProfile,
      isMobileSidebarOpen,
      toggleMobileSidebar
    }}>
      {children}
    </GlobalStateContext.Provider>
  );
}
