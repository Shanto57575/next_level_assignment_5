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
exports.userController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const user_service_1 = require("./user.service");
const createUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userInfo = yield user_service_1.userService.createUserService(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User created Successfully",
        statusCode: http_status_codes_1.default.CREATED,
        data: userInfo,
    });
}));
const getAllUsers = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allUserInfo = yield user_service_1.userService.getAllUserService();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "all user retrieved Successfully",
        statusCode: http_status_codes_1.default.OK,
        data: allUserInfo,
    });
}));
const updateUser = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedData = yield user_service_1.userService.updateUserService(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "User Updated Successfully",
        statusCode: http_status_codes_1.default.OK,
        data: updatedData,
    });
}));
exports.userController = {
    createUser,
    getAllUsers,
    updateUser,
};
