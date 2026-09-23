// web.erp/src/api/axios-instance.ts
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error?.response?.status;

        // if (status === 401) {
        //     localStorage.removeItem("accessToken");
        //     localStorage.removeItem("selectedTenantId");
        //     localStorage.removeItem("tenantId");
        //     window.location.assign("/erp/login");
        // }

        if (status === 401) {
            const token = localStorage.getItem("accessToken");

            if (token) {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("selectedTenantId");
                localStorage.removeItem("tenantId");

                window.location.assign("/erp/login");
            }
        }

        if (status === 403) {
            window.location.assign("/erp/error/401");
        }

        if (status === 404) {
            window.location.assign("/erp/error/404");
        }

        if (status === 500) {
            window.location.assign("/erp/error/404");
        }

        return Promise.reject(error);
    },
);

export default axiosInstance;
