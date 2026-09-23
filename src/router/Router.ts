// src/router/Router.ts
import { lazy, createElement } from "react";
import type { RouteObject } from "react-router-dom";
import Loadable from "../layout/loadable/Loadable";
import { createBrowserRouter, Navigate } from "react-router-dom";
import ProtectedRoute from "../components/gaurd/ProtectedRoute";

const BlankLayout = Loadable(lazy(() => import("../layout/blank/BlankLayout")));
const FullLayout = Loadable(lazy(() => import("../layout/full/FullLayout")));
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Signup = Loadable(lazy(() => import("../pages/auth/Signup")));
const Home = Loadable(lazy(() => import("../views/home/Home")));
const Error = Loadable(lazy(() => import("../views/error/Error")));
const UnAuthorized = Loadable(
    lazy(() => import("../views/error/UnAuthorized")),
);
const FeatureComingSoon = Loadable(
    lazy(() => import("../pages/systra/FeatureComingSoon")),
);
const InstitutionPage = Loadable(lazy(() => import("../pages/institution/InstitutionPage")));
const CampusesPage = Loadable(lazy(() => import("../pages/campuses/CampusesPage")));
const AcademicYearsPage = Loadable(lazy(() => import("../pages/academic/AcademicYearsPage")));
const ClassesPage = Loadable(lazy(() => import("../pages/academic/ClassesPage")));
const SectionsPage = Loadable(lazy(() => import("../pages/academic/SectionsPage")));
const SubjectsPage = Loadable(lazy(() => import("../pages/academic/SubjectsPage")));
const TeachersPage = Loadable(lazy(() => import("../pages/teachers/TeachersPage")));
const StudentsPage = Loadable(lazy(() => import("../pages/students/StudentsPage")));
const AttendancePage = Loadable(lazy(() => import("../pages/attendance/AttendancePage")));
const AuditLogsPage = Loadable(lazy(() => import("../pages/audit/AuditLogsPage")));

const Router: RouteObject[] = [
    {
        element: createElement(ProtectedRoute),
        children: [
            {
                path: "/",
                element: createElement(FullLayout),
                children: [
                    { path: "/", element: createElement(Navigate, { to: "/home" }) },
                    { path: "home", element: createElement(Home) },
                    {
                        path: "institution",
                        element: createElement(ProtectedRoute, { requiredPermissions: ["institution.read"] }),
                        children: [{ index: true, element: createElement(InstitutionPage) }],
                    },
                    {
                        path: "campuses",
                        element: createElement(ProtectedRoute, { requiredPermissions: ["campus.read"] }),
                        children: [{ index: true, element: createElement(CampusesPage) }],
                    },
                    {
                        path: "academic",
                        element: createElement(ProtectedRoute, { requiredPermissions: ["academic.read"] }),
                        children: [
                            { path: "years", element: createElement(AcademicYearsPage) },
                            { path: "classes", element: createElement(ClassesPage) },
                            { path: "sections", element: createElement(SectionsPage) },
                            { path: "subjects", element: createElement(SubjectsPage) },
                        ],
                    },
                    { path: "users", element: createElement(ProtectedRoute, { requiredPermissions: ["user.manage"] }), children: [{ index: true, element: createElement(FeatureComingSoon, { title: "Users" }) }] },
                    { path: "teachers", element: createElement(ProtectedRoute, { requiredPermissions: ["teacher.read"] }), children: [{ index: true, element: createElement(TeachersPage) }] },
                    { path: "students", element: createElement(ProtectedRoute, { requiredPermissions: ["student.read"] }), children: [{ index: true, element: createElement(StudentsPage) }] },
                    { path: "attendance", element: createElement(ProtectedRoute, { requiredPermissions: ["attendance.read"] }), children: [{ index: true, element: createElement(AttendancePage) }] },
                    { path: "audit-logs", element: createElement(ProtectedRoute, { requiredPermissions: ["audit.read"] }), children: [{ index: true, element: createElement(AuditLogsPage) }] },
                    { path: "permissions", element: createElement(ProtectedRoute, { requiredPermissions: ["user.manage"] }), children: [{ index: true, element: createElement(FeatureComingSoon, { title: "Permissions" }) }] },
                    { path: "*", element: createElement(Navigate, { to: "/error/401" }) },
                ],
            },
        ],
    },
    {
        path: "/",
        element: createElement(BlankLayout),
        children: [
            { path: "error/404", element: createElement(Error) },
            { path: "error/401", element: createElement(UnAuthorized) },
            { path: "login", element: createElement(Login) },
            { path: "signup", element: createElement(Signup) },
        ],
    },
];

const router = createBrowserRouter(Router, {
    basename: "/erp",
});

export default router;
