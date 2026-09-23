// src/api/helpers/iam-api/iam-api.helper.ts

import axiosInstance from "../../axios-instance";
import type {
    PermissionItem,
    PermissionRolesResponse,
    RoleItem,
    UserPermissionMatrixItem,
} from "./iam-api.types";

export class IamApiHelper {

    async getAllRoles(): Promise<RoleItem[]> {
        const response = await axiosInstance("/iam/roles");
        return response.data.data;
    }

    async getAllPermissions(): Promise<{
        status: string;
        data: PermissionItem[];
    }> {
        const response = await axiosInstance("/iam/permissions");
        return response.data;
    }

    async getPermissionRoles(permissionId: number): Promise<{
        status: string;
        data: PermissionRolesResponse;
    }> {
        const response = await axiosInstance(`/iam/permissions/${permissionId}/roles`);
        return response.data;
    }

    async getAllUserPermissions(userId: number): Promise<{
        status: string;
        data: UserPermissionMatrixItem[];
    }> {
        const response = await axiosInstance(`/iam/user/${userId}/permissions`);
        return response.data;
    }

}

// Export a single instance for component initialization
export const iamApi = new IamApiHelper();
