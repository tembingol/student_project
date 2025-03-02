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
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter_old = void 0;
const express_1 = require("express");
const auth_validators_1 = require("./middlewares/auth-validators");
const auth_service_1 = require("./services/auth-service");
const types_1 = require("../../input-output-types/types");
const refreshToken_validator_1 = require("./middlewares/refreshToken-validator");
const sessions_middleware_1 = require("../../global-middlewares/sessions-middleware");
const accessToken_validator_1 = require("./middlewares/accessToken-validator");
const users_query_service_1 = require("../users/services/users-query-service");
exports.authRouter_old = (0, express_1.Router)({});
exports.authRouter_old.post('/registration', sessions_middleware_1.incomingRequestsCheckMiddleware, ...auth_validators_1.authRegistrationValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield auth_service_1.authService.registerNewUser(req.body);
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.errors);
}));
exports.authRouter_old.post('/registration-confirmation', sessions_middleware_1.incomingRequestsCheckMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield auth_service_1.authService.confirmEmail(req.body);
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.errors);
}));
exports.authRouter_old.post('/registration-email-resending', sessions_middleware_1.incomingRequestsCheckMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield auth_service_1.authService.resendRegistrationEmail(req.body);
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.errors);
}));
exports.authRouter_old.post('/login', sessions_middleware_1.incomingRequestsCheckMiddleware, ...auth_validators_1.authLoginValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield auth_service_1.authService.checkUserCredintails(req.body);
    if (foundUser === null) {
        res.sendStatus(401);
        return;
    }
    if (!req.context) {
        res.sendStatus(502);
        return;
    }
    const serviceRes = yield auth_service_1.authService.loginUser(foundUser, req.context.userDeviceInfo);
    if (!serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.errors);
        return;
    }
    const accessToken = serviceRes.data.accessToken;
    const refreshToken = serviceRes.data.refreshToken;
    const ssid = serviceRes.data.deviceId;
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, });
    res.cookie('ssid', ssid, { httpOnly: true, secure: true, });
    res.status(200).send({ accessToken: accessToken });
}));
exports.authRouter_old.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken === undefined) {
        res.sendStatus(types_1.HTTP_STATUS_CODE.Unauthorized);
        return;
    }
    const serviceRes = yield auth_service_1.authService.logoutUser(refreshToken);
    if (!serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.clearCookie('refreshToken', { httpOnly: true, secure: true, });
    res.clearCookie('ssid', { httpOnly: true, secure: true, });
    res.sendStatus(types_1.HTTP_STATUS_CODE.NoContent);
}));
exports.authRouter_old.post('/refresh-token', refreshToken_validator_1.refteshTokenValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!req.context) {
        res.sendStatus(502);
        return;
    }
    const serviceRes = yield auth_service_1.authService.refreshTokens(refreshToken, req.context.currentUser.userId);
    if (!serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.errors);
        return;
    }
    const ssid = serviceRes.data.deviceId;
    const newAccessToken = serviceRes.data.accessToken;
    const newRefreshToken = serviceRes.data.refreshToken;
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, });
    res.cookie('ssid', ssid, { httpOnly: true, secure: true, });
    res.status(types_1.HTTP_STATUS_CODE.OK).send({ accessToken: newAccessToken });
}));
exports.authRouter_old.get('/login/me', accessToken_validator_1.accessTokenValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.context) {
        res.sendStatus(502);
        return;
    }
    const currentUser = req.context.currentUser;
    const foundUser = yield users_query_service_1.usersQueryService.getUserById(currentUser.userId);
    if (!foundUser) {
        res.sendStatus(types_1.HTTP_STATUS_CODE.Unauthorized);
        return;
    }
    res.status(types_1.HTTP_STATUS_CODE.OK).send(foundUser);
}));
exports.authRouter_old.get('/me', accessToken_validator_1.accessTokenValidator, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.context) {
        res.sendStatus(502);
        return;
    }
    const currentUser = req.context.currentUser;
    const foundUser = yield users_query_service_1.usersQueryService.getUserById(currentUser.userId);
    if (!foundUser) {
        res.sendStatus(types_1.HTTP_STATUS_CODE.Unauthorized);
        return;
    }
    res.status(types_1.HTTP_STATUS_CODE.OK).send(foundUser);
}));
