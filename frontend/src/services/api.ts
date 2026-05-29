import axios from "axios";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ── Request interceptor: attach JWT ──────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ms_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// ── Response interceptor: handle 401 globally ───────────────────────────
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status  = err.response?.status;
    const message = err.response?.data?.message || "Something went wrong.";

    if (status === 401) {
      localStorage.removeItem("ms_token");
      localStorage.removeItem("ms_user");
      // Redirect only if not already on auth pages
      if (!window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/register")) {
        window.location.href = "/login";
      }
    } else if (status === 429) {
      toast.error("Too many requests. Please slow down.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    }

    return Promise.reject({ message, status });
  }
);

// ── Auth ────────────────────────────────────────────────────────────────
export const authAPI = {
  register : (data)         => api.post("/auth/register", data),
  login    : (data)         => api.post("/auth/login",    data),
  logout   : ()             => api.post("/auth/logout"),
  getMe    : ()             => api.get("/auth/me"),
  updateProfile  : (data)   => api.patch("/auth/update-profile",  data),
  changePassword : (data)   => api.patch("/auth/change-password", data),
};

// ── Medicine ────────────────────────────────────────────────────────────
export const medicineAPI = {
  search  : (name, lang = "en") => api.get("/medicine/search",  { params: { name, lang } }),
  compare : (a, b, lang = "en") => api.get("/medicine/compare", { params: { a, b, lang } }),
  ocr     : (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return api.post("/ocr/extract", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // OCR can take longer
    });
  },
};

// ── History ──────────────────────────────────────────────────────────────
export const historyAPI = {
  getAll     : (params) => api.get("/history",       { params }),
  getStats   : ()       => api.get("/history/stats"),
  deleteItem : (id)     => api.delete(`/history/${id}`),
  clearAll   : ()       => api.delete("/history"),
};

export default api;
