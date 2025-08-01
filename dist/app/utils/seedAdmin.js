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
exports.SeedAdmin = void 0;
const env_1 = require("../config/env");
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_interface_1 = require("../modules/user/user.interface");
const user_model_1 = require("../modules/user/user.model");
const SeedAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = env_1.envVars.ADMIN_EMAIL;
        const password = env_1.envVars.ADMIN_PASSWORD;
        const isAdminExists = yield user_model_1.User.findOne({ email });
        if (isAdminExists) {
            console.log("Admin Already exists");
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUNDS));
        const auths = {
            provider: "credentials",
            providerId: email,
        };
        const adminPayload = {
            name: "Admin",
            email,
            password: hashedPassword,
            role: user_interface_1.Role.ADMIN,
            auths,
            isVerified: true,
        };
        const adminInfo = yield user_model_1.User.create(adminPayload);
        if (adminInfo) {
            console.log("Admin Created successfully!");
        }
    }
    catch (error) {
        console.log(error);
    }
});
exports.SeedAdmin = SeedAdmin;
