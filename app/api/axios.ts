import axios from "axios";

// OMDb API base URL
const API_URL = "https://www.omdbapi.com/";
const API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || "ac8e2cf";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  params: {
    apikey: API_KEY,
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed for protected routes
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle errors globally
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default apiClient;
