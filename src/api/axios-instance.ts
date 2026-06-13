import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

// Create an instance with default configurations
const axiosInstance = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 1. Request Interceptor: Attach the token to every outgoing request
axiosInstance.interceptors.request.use(
    (config) => {
        // Retrieve token from local storage, session storage, or a state management store
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axiosInstance;
