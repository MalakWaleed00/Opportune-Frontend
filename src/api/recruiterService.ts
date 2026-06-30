import axios from "axios";

const API = "http://localhost:8080/api";

const authCfg = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token") ?? ""}` },
});

export interface JobPostRequest {
  title: string;
  companyName: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  salaryRange: string;
  description: string;
  skills: string[];
  deadline: string;
}

export interface JobPost extends JobPostRequest {
  id: number;
  status: "ACTIVE" | "CLOSED";
  applicationCount: number;
  postedAt: string;
}

function mapJob(raw: any): JobPost {
  return {
    id:               raw.id,
    title:            raw.title            ?? "",
    companyName:      raw.companyName      ?? raw.company           ?? "",
    location:         raw.location         ?? "",
    jobType:          raw.jobType          ?? raw.job_type          ?? "",
    experienceLevel:  raw.experienceLevel  ?? raw.experience_level  ?? "",
    salaryRange:      raw.salaryRange      ?? raw.salary            ?? "",
    description:      raw.description      ?? "",
    skills:           raw.skills           ?? [],
    deadline:         raw.deadline         ?? "",
    status:           raw.status === "CLOSED" ? "CLOSED" : "ACTIVE",
    applicationCount: raw.applicationCount ?? raw.application_count ?? 0,
    postedAt:         raw.postedAt         ?? raw.posted_at         ?? new Date().toISOString(),
  };
}

export const getMyJobs = async (): Promise<JobPost[]> => {
  const { data } = await axios.get(`${API}/recruiter/jobs`, authCfg());
  return Array.isArray(data) ? data.map(mapJob) : [];
};

export const createJob = async (req: JobPostRequest): Promise<JobPost> => {
  const { data } = await axios.post(`${API}/recruiter/jobs`, req, authCfg());
  return mapJob(data);
};

export const updateJob = async (id: number, req: Partial<JobPostRequest>): Promise<JobPost> => {
  const { data } = await axios.put(`${API}/recruiter/jobs/${id}`, req, authCfg());
  return mapJob(data);
};

export const deleteJob = async (id: number): Promise<void> => {
  await axios.delete(`${API}/recruiter/jobs/${id}`, authCfg());
};

export const toggleJobStatus = async (id: number): Promise<JobPost> => {
  const { data } = await axios.put(`${API}/recruiter/jobs/${id}/toggle-status`, {}, authCfg());
  return mapJob(data);
};
