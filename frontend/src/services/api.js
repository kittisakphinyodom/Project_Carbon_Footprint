
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
export const getActivityTypesByCategory = async (categoryId) => {
  const response = await api.get(
    `/activity-types/category/${categoryId}`
  );

  return response.data;
};
export const getScopes = async () => {
    const response = await api.get("/scopes");
    return response.data;
};



export default api;

