"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetAuthCookie = void 0;
const SetAuthCookie = (res, tokenInfo) => {
    if (tokenInfo.accessToken) {
        res.cookie("accessToken", tokenInfo.accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
    }
    if (tokenInfo.refreshToken) {
        res.cookie("refreshToken", tokenInfo.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
    }
};
exports.SetAuthCookie = SetAuthCookie;
