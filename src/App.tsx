// src/App.tsx
import { useEffect } from "react";
import { ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { useThemeSettings } from "./theme/Theme";
import { RouterProvider } from "react-router";
import router from "./router/Router";
import { useAppDispatch, useAppSelector } from "./store/Hooks.ts";
import { bootstrapAuth } from "./store/auth/AuthSlice";
import { loadPermissions } from "./store/permissions/PermissionSlice";
import Spinner from "./views/spinner/Spinner";

function App() {
    const theme = useThemeSettings();
    const dispatch = useAppDispatch();
    const authState = useAppSelector((state) => state.auth);
    const permissionState = useAppSelector((state) => state.permissions);

    // useEffect(() => {
    //     dispatch(bootstrapAuth()).then((result) => {
    //         if (result.meta.requestStatus === "fulfilled") {
    //             dispatch(loadPermissions());
    //         }
    //     });
    // }, [dispatch]);

    useEffect(() => {
        dispatch(bootstrapAuth()).then((result) => {
            if (
                bootstrapAuth.fulfilled.match(result) &&
                result.payload.isAuthenticated
            ) {
                dispatch(loadPermissions());
            }
        });
    }, [dispatch]);


    const isBooting = authState.loading || !authState.initialized || (authState.isAuthenticated && permissionState.loading);

    if (isBooting) {
        return <Spinner />;
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;