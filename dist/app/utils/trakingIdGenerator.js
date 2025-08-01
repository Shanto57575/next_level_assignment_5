"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackingIdGenerator = void 0;
const trackingIdGenerator = () => {
    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
    const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRK-${datePart}-${randomPart}`;
};
exports.trackingIdGenerator = trackingIdGenerator;
