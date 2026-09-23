export type PermissionType = "add" | "edit" | "delete" | "view";

export interface Role {
    id: number;
    name: string;
}

export const ALL_ROLES: Role[] = [
    { id: 1, name: "Admin" },
    { id: 2, name: "Manager" },
    { id: 3, name: "Editor" },
    { id: 4, name: "Viewer" },
    { id: 5, name: "Guest" },
];

// Track which Role IDs are assigned to which action
export interface PermissionsState {
    add: number[];
    edit: number[];
    delete: number[];
    view: number[];
}