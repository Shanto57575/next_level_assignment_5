"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const auth_route_1 = require("../modules/auth/auth.route");
const parcel_route_1 = require("../modules/parcel/parcel.route");
exports.router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        element: user_route_1.userRoutes,
    },
    {
        path: "/auth",
        element: auth_route_1.authRoutes,
    },
    {
        path: "/parcel",
        element: parcel_route_1.parcelRoutes,
    },
];
moduleRoutes.forEach((route) => exports.router.use(route.path, route.element));
