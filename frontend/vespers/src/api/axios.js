import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5896/api",
  withCredentials: true, // keep if backend uses cookies; safe to keep
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Attach token automatically before each request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// // 🚨 Optional: handle global 401 errors (e.g., expired token)
// API.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("Unauthorized! Redirecting to login...");
//       localStorage.removeItem("token");
//       window.location.href = "/login"; // auto redirect to login page
//     }
//     return Promise.reject(error);
//   }
// );

export default API;
