import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5896/api",
  withCredentials: true, // allow backend cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ No token headers needed anymore (JWT handled via httpOnly cookie)
API.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ✅ Simplified error handler — just redirect on 401 if needed
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Session expired or not authorized");
      window.location.href = "/login"; // redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;
