// src/store/Store.ts
import { configureStore } from "@reduxjs/toolkit";
import CustomizerReducer from "./customizer/CustomizerSlice";
import PermissionReducer from "./permissions/PermissionSlice";
import AuthReducer from "./auth/AuthSlice";
import TenantReducer from "./tenant/TenantSlice";

export const store = configureStore({
    reducer: {
        customizer: CustomizerReducer,
        auth: AuthReducer,
        tenant: TenantReducer,
        permissions: PermissionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
