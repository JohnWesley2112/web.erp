import { createElement } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../../store/Hooks";

interface ProtectedRouteProps {
    requiredPermissions?: string[];
}

const ProtectedRoute = ({ requiredPermissions = [] }: ProtectedRouteProps) => {
    const location = useLocation();

    const {
        token,
        initialized,
        loading: authLoading,
    } = useAppSelector((state) => state.auth);

    const permissions = useAppSelector(
        (state) => state.permissions.permissions,
    );

    // Wait until authentication bootstrap has completed.
    if (!initialized || authLoading) {
        return createElement("div", null, "Loading...");
    }

    // Authentication has been checked and there is no session.
    if (!token) {
        return createElement(Navigate, {
            to: "/login",
            replace: true,
            state: { from: location.pathname },
        });
    }

    console.log("🔐 PROTECTED ROUTE", {
        path: location.pathname,
        token: !!token,
        initialized,
        authLoading,
        permissions,
        requiredPermissions,
    });
    
    // Permission check.
    if (requiredPermissions.length > 0) {
        const hasAccess = requiredPermissions.every((permission) =>
            permissions.includes(permission),
        );

        if (!hasAccess) {
            return createElement(Navigate, {
                to: "/error/401",
                replace: true,
            });
        }
    }

    return createElement(Outlet);
};

export default ProtectedRoute;