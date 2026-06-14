import { lazy, createElement } from "react";
import Loadable from "../layout/loadable/Loadable";
import { createBrowserRouter, Navigate } from "react-router";

/* ----------- Pages ----------- */

// Layouts
const BlankLayout = Loadable(lazy(() => import("../layout/blank/BlankLayout")));
const FullLayout = Loadable(lazy(() => import("../layout/full/FullLayout")));

// Auth
const Login = Loadable(lazy(() => import("../pages/auth/Login")));
const Signup = Loadable(lazy(() => import("../pages/auth/Signup")));

// Pages
const Home = Loadable(lazy(() => import("../views/home/Home")));
const Error = Loadable(lazy(() => import("../views/error/Error")));

const Router: any = [
    {
        path: "/",
        element: createElement(FullLayout),
        children: [
            { path: "/", element: createElement(Navigate, { to: "/home" }) },
            {
                path: "home",
                element: createElement(Home),
            },

            {
                path: "*",
                element: createElement(Navigate, { to: "/error/404" }),
            },
        ],
    },
    {
        path: "/",
        element: createElement(BlankLayout),
        children: [
            {
                path: "error/404",
                element: createElement(Error),
            },
            {
                path: "login",
                element: createElement(Login),
            },
            {
                path: "signup",
                element: createElement(Signup),
            },
        ],
    },
];

const router = createBrowserRouter(Router, {
    basename: "/erp",
});

export default router;
