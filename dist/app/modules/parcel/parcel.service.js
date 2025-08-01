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
exports.ParcelService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const AppError_1 = __importDefault(require("../../errorHelper/AppError"));
const user_model_1 = require("../user/user.model");
const parcel_interface_1 = require("./parcel.interface");
const trakingIdGenerator_1 = require("../../utils/trakingIdGenerator");
const parcel_model_1 = require("./parcel.model");
const user_interface_1 = require("../user/user.interface");
const createParcelService = (req, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { sender, receiver } = payload, rest = __rest(payload, ["sender", "receiver"]);
    if (sender === receiver) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "Sender & Receiver must be different");
    }
    const isSenderExists = yield user_model_1.User.findById(sender);
    const isReceiverExists = yield user_model_1.User.findById(receiver);
    if (!isSenderExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Sender doesn't Exists");
    }
    if (!isReceiverExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "Receiver doesn't Exists");
    }
    if (isSenderExists.role !== user_interface_1.Role.SENDER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User role is ${isSenderExists.role}, but you assigned him as ${user_interface_1.Role.SENDER}`);
    }
    if (isReceiverExists.role !== user_interface_1.Role.RECEIVER) {
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, `User role is ${isReceiverExists.role}, but you assigned him as ${user_interface_1.Role.RECEIVER}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    let trackingId = "";
    let isUnique = false;
    while (!isUnique) {
        trackingId = (0, trakingIdGenerator_1.trackingIdGenerator)();
        const existing = yield parcel_model_1.Parcel.findOne({ trackingId });
        if (!existing) {
            isUnique = true;
        }
    }
    const parcelPayload = Object.assign(Object.assign({}, rest), { sender,
        receiver,
        trackingId, statusLogs: [
            {
                status: parcel_interface_1.ParcelStatus.REQUESTED,
            },
        ] });
    const newParcel = yield parcel_model_1.Parcel.create(parcelPayload);
    yield Promise.all([
        user_model_1.User.findByIdAndUpdate(sender, {
            $push: { sentParcels: newParcel._id },
        }),
        user_model_1.User.findByIdAndUpdate(receiver, {
            $push: { receivedParcels: newParcel._id },
        }),
    ]);
    return newParcel;
});
const updateParcelService = (req, parcelId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { statusLog } = payload, restPayload = __rest(payload, ["statusLog"]);
    // is parcel exists?
    const isParcelExists = yield parcel_model_1.Parcel.findById(parcelId);
    if (!isParcelExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "parcel doesn't exists");
    }
    // checking if ever it was dispatched
    const isDispatched = isParcelExists.statusLogs.some((log) => log.status === parcel_interface_1.ParcelStatus.DISPATCHED);
    // checking one who is trying to cancel is actually the sender
    if ((statusLog === null || statusLog === void 0 ? void 0 : statusLog.status) === parcel_interface_1.ParcelStatus.CANCELLED &&
        req.user.role !== user_interface_1.Role.SENDER) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Your Are not Authorized to cancel this parcel");
    }
    if (isDispatched && (statusLog === null || statusLog === void 0 ? void 0 : statusLog.status) === parcel_interface_1.ParcelStatus.CANCELLED) {
        // if dispatched cant cancel
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "parcel already dispatched you cant cancel it now");
    }
    if ((statusLog === null || statusLog === void 0 ? void 0 : statusLog.status) === parcel_interface_1.ParcelStatus.CONFIRMED &&
        isParcelExists.receiver.toString() != req.user._id.toString()) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Unauthorized Access");
    }
    const updatedParcel = yield parcel_model_1.Parcel.findByIdAndUpdate(parcelId, restPayload, {
        new: true,
        runValidators: true,
    });
    if (statusLog) {
        updatedParcel === null || updatedParcel === void 0 ? void 0 : updatedParcel.statusLogs.push({
            status: statusLog.status,
            updatedBy: req.user._id,
            updatedAt: new Date(),
            note: statusLog.note,
        });
        yield (updatedParcel === null || updatedParcel === void 0 ? void 0 : updatedParcel.save());
    }
    return updatedParcel;
});
const getMyParcelService = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "User Not Found!");
    }
    const allParcels = yield parcel_model_1.Parcel.find({
        $or: [{ sender: userId }, { receiver: userId }],
    })
        .populate("sender", "name email")
        .populate("receiver", "name email");
    let filteredParcels = allParcels;
    if (query.status) {
        filteredParcels = allParcels.filter((parcel) => {
            var _a;
            const logs = parcel.statusLogs;
            const latestStatus = (_a = logs === null || logs === void 0 ? void 0 : logs[logs.length - 1]) === null || _a === void 0 ? void 0 : _a.status;
            return latestStatus === query.status;
        });
    }
    if (!filteredParcels) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "No parcel Found");
    }
    return filteredParcels;
});
const getAllParcelService = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield parcel_model_1.Parcel.find();
});
exports.ParcelService = {
    createParcelService,
    updateParcelService,
    getMyParcelService,
    getAllParcelService,
};
