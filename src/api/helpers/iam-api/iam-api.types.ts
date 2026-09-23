// src/api/helpers/iam-api/iam-api.types.ts

export interface RoleItem {
    id: number;
    roleName: string;
}

export interface RoleMatrixItem {
    roleId: number;
    permissionId: number;
    canRead: boolean | null;
    canAdd: boolean | null;
    canEdit: boolean | null;
    canDelete: boolean | null;
    isRestricted: boolean | null;
    isExceptional: boolean | null;
}

export interface UserPermissionMatrixItem {
    id: number;
    permissionName: string;
    canRead: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    isRestricted: boolean;
    isExceptional: boolean;
}

export interface PermissionItem {
    id: number;
    permissionName: string;
    roles: RoleMatrixItem[];
}

export interface PermissionRoleAssignment {
    canRead: boolean;
    canAdd: boolean;
    canEdit: boolean;
    canDelete: boolean;
    isRestricted: boolean;
    isExceptional: boolean;
    role: RoleItem;
}

export interface PermissionRolesResponse {
    id: number;
    permissionName: string;
    roles: PermissionRoleAssignment[];
}

// 👇 Added these interfaces to handle your authenticated user profile state
export interface UserProfileRole {
    id: number;
    roleName: string;
}

export interface UserProfileData {
    id: number;
    firstname: string;
    lastname: string;
    userEmail: string;
    assignedRoles: UserProfileRole[];
}
