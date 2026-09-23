import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios-instance";
import { iamApi } from "../../api/helpers/auth-api/auth-api.helper";

export interface AuthUser {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
}

interface AuthState {
    user: AuthUser | null;
    token: string | null;
    tenantName: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    initialized: boolean;
    error: string | null;
}

const getStoredToken = () => localStorage.getItem("accessToken");
const getStoredTenantName = () => localStorage.getItem("activeTenantName");

const initialState: AuthState = {
    user: null,
    token: getStoredToken(),
    tenantName: getStoredTenantName(),
    isAuthenticated: Boolean(getStoredToken()),
    loading: false,
    initialized: false,
    error: null,
};

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = error.response as { data?: { message?: string } } | undefined;
        return response?.data?.message || "Request failed.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Request failed.";
};

export const bootstrapAuth = createAsyncThunk(
    "auth/bootstrapAuth",
    async (_, { rejectWithValue }) => {
        const token = getStoredToken();

        if (!token) {
            return { user: null, token: null, isAuthenticated: false };
        }

        try {
            const response = await axiosInstance.get("/auth/me");
            const payload = response.data?.data ?? response.data;
            const user = payload?.user ?? payload ?? null;
            const tenantName = localStorage.getItem("activeTenantName");

            return {
                user,
                token,
                tenantName,
                isAuthenticated: true,
            };
        } catch (error: unknown) {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("selectedTenantId");
            localStorage.removeItem("tenantId");
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

export const login = createAsyncThunk(
    "auth/login",
    async (
        payload: { email: string; password: string },
        { rejectWithValue },
    ) => {
        try {
            const response = await iamApi.userLogin({
                email: payload.email,
                password: payload.password,
            });
            const session = response?.data ?? response;
            const token = session?.accessToken ?? session?.token ?? null;
            const user = session?.user ?? null;
            const tenantId = session?.tenantId ?? null;
            const tenantName = session?.tenants?.find((tenant: { id?: string }) => tenant.id === tenantId)?.name
                ?? session?.tenant?.name
                ?? session?.tenants?.[0]?.name
                ?? null;

            if (token) {
                localStorage.setItem("accessToken", token);
            }

            if (tenantId) {
                localStorage.setItem("selectedTenantId", tenantId);
            } else {
                localStorage.removeItem("selectedTenantId");
            }

            if (tenantName) {
                localStorage.setItem("activeTenantName", tenantName);
            } else {
                localStorage.removeItem("activeTenantName");
            }

            return {
                user,
                token,
                tenantId,
                tenantName,
                isAuthenticated: Boolean(token),
            };
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setSession: (state, action) => {
            const { user, token, tenantId, tenantName, isAuthenticated } = action.payload;
            state.user = user;
            state.token = token;
            state.tenantName = tenantName ?? state.tenantName ?? localStorage.getItem("activeTenantName");
            state.isAuthenticated = Boolean(isAuthenticated || token);
            state.error = null;
            if (tenantId) {
                localStorage.setItem("selectedTenantId", tenantId);
            }
            if (state.tenantName) {
                localStorage.setItem("activeTenantName", state.tenantName);
            }
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.tenantName = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem("accessToken");
            localStorage.removeItem("selectedTenantId");
            localStorage.removeItem("tenantId");
            localStorage.removeItem("activeTenantName");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(bootstrapAuth.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bootstrapAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.tenantName = action.payload.tenantName ?? localStorage.getItem("activeTenantName") ?? state.tenantName;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.error = null;
            })
            .addCase(bootstrapAuth.rejected, (state, action) => {
                state.loading = false;
                state.initialized = true;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = action.payload as string;
            })
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.tenantName = action.payload.tenantName ?? state.tenantName;
                state.isAuthenticated = action.payload.isAuthenticated;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;
