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
    // is parcel exists
    const isParcelExists = yield parcel_model_1.Parcel.findById(parcelId);
    if (!isParcelExists) {
        throw new AppError_1.default(http_status_codes_1.default.NOT_FOUND, "parcel doesn't exists");
    }
    // checking if ever it was dispatched
    const isDispatched = isParcelExists.statusLogs.some((log) => log.status === parcel_interface_1.ParcelStatus.DISPATCHED);
    if (isDispatched && (statusLog === null || statusLog === void 0 ? void 0 : statusLog.status) !== parcel_interface_1.ParcelStatus.CONFIRMED) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "parcel already dispatched");
    }
    // checking one who is trying to cancel is actually the sender or not
    if ((statusLog === null || statusLog === void 0 ? void 0 : statusLog.status) === parcel_interface_1.ParcelStatus.CANCELLED &&
        req.user.role !== user_interface_1.Role.SENDER) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Only Sender can cancel parcel");
    }
    if (isDispatched && (statusLog === null || statusLog === void 0 ? void 0 : statusLog.status) === parcel_interface_1.ParcelStatus.CANCELLED) {
        // if dispatched cant cancel
        throw new AppError_1.default(http_status_codes_1.default.BAD_REQUEST, "parcel already dispatched you cant cancel it now");
    }
    if ((statusLog === null || statusLog === void 0 ? void 0 : statusLog.status) === parcel_interface_1.ParcelStatus.CONFIRMED &&
        isParcelExists.receiver.toString() != req.user._id.toString()) {
        throw new AppError_1.default(http_status_codes_1.default.UNAUTHORIZED, "Only Receiver can Confirm status");
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
    const filters = {
        $and: [
            {
                $or: [{ sender: userId }, { receiver: userId }],
            },
            { trackingId: { $regex: query.searchTerm || "", $options: "i" } },
        ],
    };
    const total = yield parcel_model_1.Parcel.countDocuments(filters);
    const allParcels = yield parcel_model_1.Parcel.find(filters)
        .populate("sender", "name email")
        .populate("receiver", "name email")
        .populate("statusLogs.updatedBy", "name email role")
        .sort(query.sort === "OLDEST" ? "createdAt" : "-createdAt")
        .skip((parseInt(query.page) - 1) * parseInt(query.limit))
        .limit(parseInt(query.limit));
    return { data: allParcels, total };
});
const getAllParcelService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, searchTerm = "" } = query;
    const totalParcel = yield parcel_model_1.Parcel.countDocuments();
    const result = yield parcel_model_1.Parcel.find({
        trackingId: { $regex: searchTerm, $options: "i" },
    })
        .populate("receiver", "name email")
        .populate("sender", "name email")
        .populate("statusLogs.updatedBy", "name email role")
        .sort(query.sort === "OLDEST" ? "createdAt" : "-createdAt")
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit));
    return { result, totalParcel };
});
const trackParcelService = (query) => __awaiter(void 0, void 0, void 0, function* () {
    return yield parcel_model_1.Parcel.find({
        trackingId: { $regex: query.trackingId, $options: "i" },
    })
        .populate("receiver", "name email")
        .populate("sender", "name email")
        .populate("statusLogs.updatedBy", "name email role");
});
const getParcelAnalyticsService = () => __awaiter(void 0, void 0, void 0, function* () {
    // 1️⃣ Total parcels by status
    const statusAggregation = yield parcel_model_1.Parcel.aggregate([
        { $unwind: "$statusLogs" },
        { $sort: { "statusLogs.updatedAt": 1 } },
        {
            $group: {
                _id: "$statusLogs.status",
                count: { $sum: 1 },
            },
        },
    ]);
    // 2️⃣ Parcels per type
    const typeAggregation = yield parcel_model_1.Parcel.aggregate([
        {
            $group: {
                _id: "$parcelType",
                count: { $sum: 1 },
            },
        },
    ]);
    // 3️⃣ Parcels created per day
    const dailyAggregation = yield parcel_model_1.Parcel.aggregate([
        {
            $group: {
                _id: {
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
                },
                count: { $sum: 1 },
                totalFee: { $sum: "$fee" },
            },
        },
        { $sort: { _id: 1 } },
    ]);
    // 4️⃣ Total parcels sent vs received per user (optional)
    const userAggregation = yield parcel_model_1.Parcel.aggregate([
        {
            $facet: {
                sent: [
                    { $group: { _id: "$sender", count: { $sum: 1 } } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                    {
                        $project: {
                            _id: 0,
                            name: "$user.name",
                            email: "$user.email",
                            count: 1,
                        },
                    },
                ],
                received: [
                    { $group: { _id: "$receiver", count: { $sum: 1 } } },
                    {
                        $lookup: {
                            from: "users",
                            localField: "_id",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                    {
                        $project: {
                            _id: 0,
                            name: "$user.name",
                            email: "$user.email",
                            count: 1,
                        },
                    },
                ],
            },
        },
    ]);
    return {
        status: statusAggregation,
        types: typeAggregation,
        daily: dailyAggregation,
        users: userAggregation[0],
    };
});
exports.ParcelService = {
    createParcelService,
    updateParcelService,
    getMyParcelService,
    getAllParcelService,
    trackParcelService,
    getParcelAnalyticsService,
};
