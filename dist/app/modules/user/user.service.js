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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = require("./user.model");
const env_1 = require("../../config/env");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const user_interface_1 = require("./user.interface");
const createUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, role } = payload, rest = __rest(payload, ["email", "password", "role"]);
    if (role === user_interface_1.Role.ADMIN) {
        throw new AppError_1.default(http_status_codes_1.default.FORBIDDEN, `You cannot assign yourself to be ${role}`);
    }
    const isUserExists = yield user_model_1.User.findOne({ email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "User already exists!");
    }
    // password hashing
    const hashedPassword = yield bcrypt_1.default.hash(password, Number(env_1.envVars.BCRYPT_SALT_ROUNDS));
    // auth type
    const authProvider = {
        provider: "credentials",
        providerId: email,
    };
    const userInfo = Object.assign(Object.assign({}, rest), { email,
        role, password: hashedPassword, auths: authProvider });
    const userData = yield user_model_1.User.create(userInfo);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = userData.toObject(), { password: pass } = _a, restData = __rest(_a, ["password"]);
    return restData;
});
const getAllUserService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, searchTerm = "" } = query;
    const totalUser = yield user_model_1.User.countDocuments();
    const result = yield user_model_1.User.find({
        $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { email: { $regex: searchTerm, $options: "i" } },
        ],
    })
        .select("-password")
        .sort("-createdAt")
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));
    return { result, totalUser };
    // * 5 4
});
const getAllReceiverService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield user_model_1.User.find({ role: "RECEIVER" })
        .select("-password")
        .sort("-createdAt");
});
const updateUserService = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = yield user_model_1.User.findByIdAndUpdate(userId, payload, {
        new: true,
        runValidators: true,
    });
    if (!updatedData) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User not Found");
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _a = updatedData.toObject(), { password } = _a, restData = __rest(_a, ["password"]);
    return restData;
});
const getProfileService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield user_model_1.User.findById(userId).select("-password");
    return data;
});
exports.userService = {
    createUserService,
    getAllUserService,
    getAllReceiverService,
    updateUserService,
    getProfileService,
};
