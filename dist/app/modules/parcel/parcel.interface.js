"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParcelType = exports.ParcelStatus = void 0;
var ParcelStatus;
(function (ParcelStatus) {
    ParcelStatus["REQUESTED"] = "REQUESTED";
    ParcelStatus["APPROVED"] = "APPROVED";
    ParcelStatus["DISPATCHED"] = "DISPATCHED";
    ParcelStatus["CANCELLED"] = "CANCELLED";
    ParcelStatus["CONFIRMED"] = "CONFIRMED";
})(ParcelStatus || (exports.ParcelStatus = ParcelStatus = {}));
var ParcelType;
(function (ParcelType) {
    ParcelType["DOCUMENT"] = "DOCUMENT";
    ParcelType["PACKAGE"] = "PACKAGE";
    ParcelType["FRAGILE"] = "FRAGILE";
    ParcelType["OVERSIZED"] = "OVERSIZED";
})(ParcelType || (exports.ParcelType = ParcelType = {}));
