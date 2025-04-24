import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:8443",
  withCredentials: true,
});

// ➤ Ajouter accessToken dans chaque requête
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  } else {
    config.headers = {
      ...config.headers,
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }
  return config;
});

// ➤ Intercepteur de réponse pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        console.warn("Aucun refreshToken trouvé");
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        interface RefreshResponse {
          accessToken: string;
        }

        const res = await api.post<RefreshResponse>("/auth/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Échec du rafraîchissement du token", refreshError);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
