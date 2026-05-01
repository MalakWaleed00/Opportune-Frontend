import axios from "axios";

const API = "http://localhost:8080/api";


export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name: string;
  role: string;
  profilePicLink: string;
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

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const login = async (data: any) => {
  const response = await axios.post(`${API}/auth/login`, data);
  return response.data;
};

export interface UpdateProfileRequest {
  username?: string;
  name?: string;
  email?: string;
  location?: string;
  cvLink?: string;
  profilePicLink?: string;
  skills?: string[];
}

export const getCurrentProfile = async () => {
  const response = await axios.get(`${API}/users/me/profile`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateCurrentProfile = async (data: UpdateProfileRequest) => {
  const response = await axios.put(`${API}/users/me/profile`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export const changePassword = async (data: ChangePasswordRequest) => {
  const response = await axios.put(`${API}/users/me/change-password`, data, {
    headers: getAuthHeaders()
  });
  return response.data;
};

