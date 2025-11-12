import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api", // adjust port if needed
  withCredentials: false, // set true only if using cookies/session
  headers: {
    "Content-Type": "application/json",
  },
});

// Optional: Interceptors (for auth tokens or errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;
