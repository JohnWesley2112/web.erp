// src/api/helpers/auth-api/auth-api.helper.ts
import axiosInstance from "../../axios-instance";

export interface userLoginPayload {
    email: string;
    password: string;
}

export class AuthApiHelper {
    async userLogin(data: userLoginPayload) {
        const response = await axiosInstance.post("/auth/login", data);
        return response.data;
    }
}

// Export a single instance for component initialization
export const iamApi = new AuthApiHelper();
