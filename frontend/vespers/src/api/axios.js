import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5896/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Attach token before every request
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ♻️ Handle 401 errors: attempt token refresh
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If unauthorized & no retry has been done yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        // Call backend to refresh the token
        const res = await axios.post("http://localhost:5896/api/user/refresh", {
          refreshToken,
        });

        const newAccessToken = res.data.accessToken;

        // Store new token
        localStorage.setItem("accessToken", newAccessToken);

        // Update default headers
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        // Retry the original request with new token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return API(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear localStorage and redirect to login
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default API;
