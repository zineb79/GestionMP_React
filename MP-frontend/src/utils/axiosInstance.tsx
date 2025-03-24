import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:8443",
  withCredentials: true,
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  config.headers["Content-Type"] = "application/json";
  config.headers["Accept"] = "application/json";
  return config;
});

export default api;
