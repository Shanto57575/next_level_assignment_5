"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../errorHelper/AppError"));
const userTokens_1 = require("../utils/userTokens");
const env_1 = require("../config/env");
const user_model_1 = require("../modules/user/user.model");
const user_interface_1 = require("../modules/user/user.interface");
const checkAuth = (...authRoles) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let accessToken;
    if (req.headers.authorization) {
        accessToken = req.headers.authorization.replace("Bearer ", "");
    }
    else if (req.cookies) {
        const cookies = req.cookies;
        accessToken = cookies.accessToken;
    }
    if (!accessToken) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No Token Found!");
    }
    const verifiedToken = (0, userTokens_1.verifyToken)(accessToken, env_1.envVars.JWT_ACCESS_SECRET);
    const isUserExists = yield user_model_1.User.findById(verifiedToken._id);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found!");
    }
    if (isUserExists.isActive === user_interface_1.IsActive.BLOCKED) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User is ${isUserExists.isActive}`);
    }
    if (isUserExists.isDeleted) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, "USER IS DELETED!");
    }
    if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unauthorized Access!");
    }
    req.user = verifiedToken;
    next();
});
exports.checkAuth = checkAuth;
