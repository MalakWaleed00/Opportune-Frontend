import axios from "axios";

const API = "http://localhost:8080/api";

export interface ApplyOptionDTO {
  title: string;
  link: string;
}

export interface JobRequestDTO {
  skills: string[];
  experience: string;
  topK: number;
}

export interface JobResponseDTO {
  jobTitle: string;
  contributingSkills: string[];
  jobLinks: JobDetails[];
}

export interface JobDetails {
  id: number;
  title: string;
  companyName: string;
  location: string;
  via: string;
  shareLink: string;
  thumbnail: string | null;
  extensions: string[];
  description: string;
  link: string | null;
  applyOptions: ApplyOptionDTO[];
}

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const recommendJobs = async (request: JobRequestDTO): Promise<JobResponseDTO[]> => {
  const response = await axios.post(
    `${API}/jobs/recommend`,
    request,
    {
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders()
      }
    }
  );
  return response.data;
};

export const getAllJobs = async (title?: string, skills?: string[]): Promise<JobDetails[]> => {
  const params = new URLSearchParams();
  if (title) params.append("title", title);
  if (skills) skills.forEach(skill => params.append("skills", skill));

  const response = await axios.get(
    `${API}/jobs/all?${params.toString()}`,
    {
      headers: getAuthHeaders()
    }
  );
  return response.data;
};