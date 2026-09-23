// web.erp/src/api/helpers/users-api/users-api.helper.ts
import axiosInstance from "../../axios-instance";

// Export the input interface so the UI can share it
export interface CreateUserInput {
    firstname: string;
    lastname: string;
    userEmail: string;
    password: string;
    assignedRoles: number[];
}

export class UsersApiHelper {
    async getAllUsers() {
        const response = await axiosInstance.get("/users/users");
        return response.data;
    }

    // New method linking your Axios interceptor configuration to the backend API endpoint
    async createUser(data: CreateUserInput) {
        // Adjust "/users" to match your actual backend routing prefix if necessary
        const response = await axiosInstance.post("/users", data);
        return response.data;
    }
}

// Export a single instance to prevent recreating the helper class on every render
export const usersApi = new UsersApiHelper();
