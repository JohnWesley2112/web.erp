// src/store/permissions/permissions.type.ts
import type { PermissionItem, RoleItem, UserProfileData } from "../../api/helpers/iam-api/iam-api.types";

export interface PermissionState {
    user: UserProfileData | null;
    rolesList: RoleItem[];
    permissionsList: PermissionItem[];
    loading: boolean;
    initialized: boolean; // Tracking if init has fired once
    error: string | null;
}
