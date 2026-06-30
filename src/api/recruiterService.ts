const STORAGE_KEY = "opportune_recruiter_jobs";

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

function loadJobs(): JobPost[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveJobs(jobs: JobPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
}

function nextId(jobs: JobPost[]): number {
  return jobs.length > 0 ? Math.max(...jobs.map(j => j.id)) + 1 : 1;
}

export const createJob = async (data: JobPostRequest): Promise<JobPost> => {
  const jobs = loadJobs();
  const newJob: JobPost = {
    ...data,
    id: nextId(jobs),
    status: "ACTIVE",
    applicationCount: 0,
    postedAt: new Date().toISOString(),
  };
  saveJobs([newJob, ...jobs]);
  return newJob;
};

export const getMyJobs = async (): Promise<JobPost[]> => {
  return loadJobs();
};

export const updateJob = async (id: number, data: Partial<JobPostRequest>): Promise<JobPost> => {
  const jobs = loadJobs();
  const updated = jobs.map(j => j.id === id ? { ...j, ...data } : j);
  saveJobs(updated);
  return updated.find(j => j.id === id)!;
};

export const deleteJob = async (id: number): Promise<void> => {
  saveJobs(loadJobs().filter(j => j.id !== id));
};

export const toggleJobStatus = async (id: number): Promise<JobPost> => {
  const jobs = loadJobs();
  const updated = jobs.map(j =>
    j.id === id ? { ...j, status: j.status === "ACTIVE" ? "CLOSED" as const : "ACTIVE" as const } : j
  );
  saveJobs(updated);
  return updated.find(j => j.id === id)!;
};
