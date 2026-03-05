import axios from "axios";

const API = "http://localhost:8080/api";


export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
  profilePicLink: string;
  cvLink: string;
  country: string;
  skills: string[];
  experienceLevel: string;
}

export const register = async (data: RegisterRequest) => {
  const response = await axios.post(
    `${API}/auth/register`,
    data,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
  return response.data;
};

export const login = async (data: any) => {
  const response = await axios.post(`${API}/auth/login`, data);
  return response.data;
};