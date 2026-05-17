import axios from "axios";

const baseURL = (import.meta as any).env?.VITE_API_URL ?? "/api";

export const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("bgmi_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic 401 handler
api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== "undefined") {
      window.localStorage.removeItem("bgmi_token");
      window.localStorage.removeItem("bgmi_user");
    }
    return Promise.reject(err);
  }
);
