import axios from "axios";

const API = "http://localhost:8080/api";

const authCfg = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
});

export type AppStatus =
  | "Applied"
  | "Interview Scheduled"
  | "Interview Done"
  | "Offer Received"
  | "Offer Accepted"
  | "Rejected"
  | "Withdrawn";

export interface Application {
  id: string;
  jobTitle: string;
  company: string;
  logo: string;
  location: string;
  salary: string;
  appliedDate: string;
  status: AppStatus;
  notes: string;
}

export const TO_BACKEND: Record<AppStatus, string> = {
  Applied:               "APPLIED",
  "Interview Scheduled": "INTERVIEW_SCHEDULED",
  "Interview Done":      "INTERVIEW_DONE",
  "Offer Received":      "OFFER_RECEIVED",
  "Offer Accepted":      "OFFER_ACCEPTED",
  Rejected:              "REJECTED",
  Withdrawn:             "WITHDRAWN",
};

export const FROM_BACKEND: Record<string, AppStatus> = {
  APPLIED:              "Applied",
  INTERVIEW_SCHEDULED:  "Interview Scheduled",
  INTERVIEW_DONE:       "Interview Done",
  OFFER_RECEIVED:       "Offer Received",
  OFFER_ACCEPTED:       "Offer Accepted",
  REJECTED:             "Rejected",
  WITHDRAWN:            "Withdrawn",
};

function fmtDate(raw?: string): string {
  if (!raw) return new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  try {
    return new Date(raw).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return raw;
  }
}

function mapApp(raw: any): Application {
  return {
    id:          String(raw.id),
    jobTitle:    raw.jobTitle   ?? raw.job_title   ?? "",
    company:     raw.company    ?? "",
    logo:        raw.logo       ?? "💼",
    location:    raw.location   ?? "",
    salary:      raw.salary     ?? raw.salaryRange  ?? "",
    appliedDate: fmtDate(raw.appliedDate ?? raw.applied_date),
    status:      FROM_BACKEND[raw.status] ?? "Applied",
    notes:       raw.notes ?? "",
  };
}

export const getMyApplications = async (): Promise<Application[]> => {
  const { data } = await axios.get(`${API}/applications/my`, authCfg());
  return Array.isArray(data) ? data.map(mapApp) : [];
};

export const createApplication = async (
  app: Pick<Application, "jobTitle" | "company" | "location" | "salary" | "status" | "notes">
): Promise<Application> => {
  const { data } = await axios.post(
    `${API}/applications`,
    { ...app, status: TO_BACKEND[app.status] },
    authCfg()
  );
  return mapApp(data);
};

export const updateApplicationStatus = async (id: string, status: AppStatus): Promise<void> => {
  await axios.put(`${API}/applications/${id}`, { status: TO_BACKEND[status] }, authCfg());
};

export const deleteApplication = async (id: string): Promise<void> => {
  await axios.delete(`${API}/applications/${id}`, authCfg());
};

export interface AnalyticsResponse {
  total:            number;
  interviews:       number;
  offers:           number;
  accepted:         number;
  rejected:         number;
  interviewRate:    number;
  offerRate:        number;
  successRate:      number;
  statusBreakdown:  Record<string, number>;
  recentApplications: Array<{
    id:          number;
    jobTitle:    string;
    company:     string;
    status:      string;
    appliedDate: string;
  }>;
}

export const getMyAnalytics = async (): Promise<AnalyticsResponse> => {
  const { data } = await axios.get(`${API}/applications/my/analytics`, authCfg());
  return data;
};
