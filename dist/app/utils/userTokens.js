"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createUserTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const createUserTokens = (payload) => {
    const accessToken = jsonwebtoken_1.default.sign(payload, env_1.envVars.JWT_ACCESS_SECRET, {
        expiresIn: env_1.envVars.JWT_ACCESS_EXPIRES,
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, env_1.envVars.JWT_REFRESH_SECRET, {
        expiresIn: env_1.envVars.JWT_REFRESH_EXPIRES,
    });
    return {
        accessToken,
        refreshToken,
    };
};
exports.createUserTokens = createUserTokens;
const verifyToken = (token, secret) => {
    const verifiedToken = jsonwebtoken_1.default.verify(token, secret);
    return verifiedToken;
};
exports.verifyToken = verifyToken;
