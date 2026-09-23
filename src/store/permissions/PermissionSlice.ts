// src/store/permissions/PermissionSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios-instance";

interface PermissionState {
    permissions: string[];
    loading: boolean;
    initialized: boolean;
    error: string | null;
}

const initialState: PermissionState = {
    permissions: [],
    loading: false,
    initialized: false,
    error: null,
};

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = error.response as { data?: { message?: string } } | undefined;
        return response?.data?.message || "Failed to load permissions.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Failed to load permissions.";
};

export const loadPermissions = createAsyncThunk(
    "permissions/loadPermissions",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get("/iam/permissions");
            const payload = response.data?.data ?? response.data;
            const permissions = Array.isArray(payload) ? payload : [];
            return permissions;
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

const permissionSlice = createSlice({
    name: "permissions",
    initialState,
    reducers: {
        setPermissions: (state, action: { payload: string[] }) => {
            state.permissions = action.payload;
            state.initialized = true;
        },
        clearPermissions: (state) => {
            state.permissions = [];
            state.initialized = false;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadPermissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadPermissions.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.permissions = action.payload;
                state.error = null;
            })
            .addCase(loadPermissions.rejected, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.error = action.payload as string;
            });
    },
});

export const { setPermissions, clearPermissions } = permissionSlice.actions;
export default permissionSlice.reducer;

export const selectHasPermission = (state: { permissions?: { permissions?: string[] } }, permission: string) => {
    const permissions = state.permissions?.permissions ?? [];
    return permissions.includes(permission);
};
