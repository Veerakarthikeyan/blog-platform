import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
});

// Attach the JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the token has expired, clear the session and send the user to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem("token")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Turn an axios error into a readable message
export function errMsg(error) {
  const data = error.response?.data;
  if (data?.errors) return Object.values(data.errors).join(". ");
  return data?.message || "Something went wrong. Is the backend running?";
}

export default api;
