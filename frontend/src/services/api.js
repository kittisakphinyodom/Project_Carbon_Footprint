
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCarbonSummary = async (startDate = "", endDate = "") => {
  const params = {};

  if (startDate) {
    params.start_date = startDate;
  }

  if (endDate) {
    params.end_date = endDate;
  }

  const response = await api.get("/carbon-calculations/summary", {
    params,
  });

  return response.data;
};

export const getMaterials = async () => {
  const response = await api.get("/materials");
  return response.data;
};

export const getActivities = async () => {
  const response = await api.get("/activities");
  return response.data;
};

export const createActivity = async (activityData) => {
  const response = await api.post("/activities", activityData);
  return response.data;
};

export const getActivityTypes = async () => {
  try {

    const response = await api.get(
      "/activity-types"
    );

    return response.data;

  } catch (error) {

    console.error(
      "Get activity types error:",
      error
    );

    throw error;

  }
};

export const getScopes = async () => {
    const response = await api.get("/scopes");
    return response.data;
};

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});
// Login
export const login = (data) => api.post("/auth/login", data);

export const register = (data) => api.post("/auth/register", data);

export const googleLogin = (credential) =>
    api.post("/auth/google", {
        credential
    });


export default api;

