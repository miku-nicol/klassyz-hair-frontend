import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🟢 REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (or sessionStorage)
    const token = localStorage.getItem("authToken");

    if (token) {
      // Attach token to every request
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return Promise.reject(error);
  }
);

// 🔵 RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[API Response]`, response);
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      // Handle specific status codes globally
      if (status === 401) {
        console.warn("Unauthorized — Redirecting to login...");
        // Optionally redirect to login
        // window.location.href = "/login";
      } else if (status === 403) {
        console.warn("Access denied — insufficient permissions.");
      } else if (status === 500) {
        console.error("Server error — please try again later.");
      }

      console.error("[API Error Response]", data);
    } else {
      console.error("[Network Error]", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
