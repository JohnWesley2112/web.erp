import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../api/axios-instance";

export interface TenantSummary {
    id: string;
    name: string;
    code?: string;
    status?: string;
}

interface TenantState {
    tenants: TenantSummary[];
    selectedTenantId: string | null;
    loading: boolean;
    error: string | null;
}

const storedTenantId = () => localStorage.getItem("selectedTenantId") || localStorage.getItem("tenantId");

const initialState: TenantState = {
    tenants: [],
    selectedTenantId: storedTenantId(),
    loading: false,
    error: null,
};

const getErrorMessage = (error: unknown): string => {
    if (typeof error === "object" && error !== null && "response" in error) {
        const response = error.response as { data?: { message?: string } } | undefined;
        return response?.data?.message || "Unable to switch tenant.";
    }

    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to switch tenant.";
};

export const selectTenant = createAsyncThunk(
    "tenant/selectTenant",
    async (tenantId: string, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post("/auth/select-tenant", { tenantId });
            const payload = response.data?.data ?? response.data;
            const selected = payload?.tenant ?? null;
            const nextToken = payload?.accessToken ?? null;

            if (nextToken) {
                localStorage.setItem("accessToken", nextToken);
            }

            const resolvedTenantId = selected?.id ?? tenantId;
            localStorage.setItem("selectedTenantId", resolvedTenantId);

            return {
                selectedTenantId: resolvedTenantId,
                tenant: selected,
            };
        } catch (error: unknown) {
            return rejectWithValue(getErrorMessage(error));
        }
    },
);

const tenantSlice = createSlice({
    name: "tenant",
    initialState,
    reducers: {
        hydrateTenants: (state, action: { payload: TenantSummary[] }) => {
            state.tenants = action.payload;
            const selected = state.selectedTenantId ?? localStorage.getItem("selectedTenantId");
            if (selected) {
                state.selectedTenantId = selected;
            }
        },
        clearTenantSelection: (state) => {
            state.selectedTenantId = null;
            state.tenants = [];
            localStorage.removeItem("selectedTenantId");
            localStorage.removeItem("tenantId");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(selectTenant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(selectTenant.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTenantId = action.payload.selectedTenantId;
                state.error = null;
                localStorage.setItem("selectedTenantId", action.payload.selectedTenantId);
            })
            .addCase(selectTenant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { hydrateTenants, clearTenantSelection } = tenantSlice.actions;
export default tenantSlice.reducer;
