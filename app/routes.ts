import { type RouteConfig, index, layout, prefix, route } from "@react-router/dev/routes";

export default [
    layout("layouts/app-layout.tsx", [
        index("pages/landing.tsx"),
        route("report", "pages/report.tsx"),

        ...prefix("dashboard", [
            route("citizen", "pages/dashboard-citizen.tsx"),
            route("government", "pages/dashboard-government.tsx"),
        ]),
    ]),
] satisfies RouteConfig;
