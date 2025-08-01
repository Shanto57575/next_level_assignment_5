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
exports.ParcelController = void 0;
const catchAsync_1 = require("../../utils/catchAsync");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const parcel_service_1 = require("./parcel.service");
const createParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelInfo = yield parcel_service_1.ParcelService.createParcelService(req, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "parcel created Successfully",
        statusCode: http_status_codes_1.default.CREATED,
        data: parcelInfo,
    });
}));
const updateParcel = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const parcelInfo = yield parcel_service_1.ParcelService.updateParcelService(req, req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "parcel Status updated Successfully",
        statusCode: http_status_codes_1.default.OK,
        data: parcelInfo,
    });
}));
const getMyParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const myAllParcels = yield parcel_service_1.ParcelService.getMyParcelService(req.params.id, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "my parcels retrieved Successfully",
        statusCode: http_status_codes_1.default.OK,
        data: myAllParcels,
    });
}));
const getAllParcels = (0, catchAsync_1.catchAsync)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const AllParcels = yield parcel_service_1.ParcelService.getAllParcelService();
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        message: "All parcels retrieved Successfully",
        statusCode: http_status_codes_1.default.OK,
        data: AllParcels,
    });
}));
exports.ParcelController = {
    createParcel,
    updateParcel,
    getMyParcels,
    getAllParcels,
};
