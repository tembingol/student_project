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
exports.authRouter = void 0;
const express_1 = require("express");
const auth_validators_1 = require("./middlewares/auth-validators");
const JWT_service_1 = require("../../application-services/JWT-service");
const auth_service_1 = require("./services/auth-service");
const types_1 = require("../../input-output-types/types");
exports.authRouter = (0, express_1.Router)({});
// // simple logger for this router's requests
// // all requests to this router will first hit this middleware
// authRouter.use(function (req, res, next) {
//     console.log('authRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })
exports.authRouter.post('/registration', ...auth_validators_1.authRegistrationValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield auth_service_1.authService.registerNewUser(req.body);
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.errors);
}));
exports.authRouter.post('/registration-confirmation', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield auth_service_1.authService.confirmEmail(req.body);
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.errors);
}));
exports.authRouter.post('/registration-email-resending', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield auth_service_1.authService.resendRegistrationEmail(req.body);
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.errors);
}));
exports.authRouter.post('/login', ...auth_validators_1.authLoginValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const foundUser = yield auth_service_1.authService.checkUserCredintails(req.body);
    if (foundUser === null) {
        res.sendStatus(401);
        return;
    }
    const accessToken = yield JWT_service_1.jwtService.createAccsessJWT(foundUser);
    const refreshToken = yield JWT_service_1.jwtService.createRefreshJWT(foundUser);
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, });
    res.status(200).send({ accessToken: accessToken });
}));
exports.authRouter.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    res.sendStatus(types_1.HTTP_STATUS_CODE.NoContent);
}));
exports.authRouter.post('/refresh-token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken === undefined) {
        res.sendStatus(types_1.HTTP_STATUS_CODE.Unauthorized);
        return;
    }
    const serviceRes = yield auth_service_1.authService.refreshToken(refreshToken);
    if (!serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    const foundUser = serviceRes.data;
    const accessToken = yield JWT_service_1.jwtService.createAccsessJWT(foundUser);
    const newRefreshToken = yield JWT_service_1.jwtService.createRefreshJWT(foundUser);
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, });
    res.status(types_1.HTTP_STATUS_CODE.OK).send({ accessToken: accessToken });
}));
exports.authRouter.get('/login/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers['Authorization'.toLowerCase()];
    if (authorization == undefined) {
        res.sendStatus(types_1.HTTP_STATUS_CODE.Unauthorized);
        return;
    }
    const accessToken = authorization.slice(7);
    const foundUser = yield auth_service_1.authService.getUserByToken(accessToken.toString());
    if (foundUser === null) {
        res.sendStatus(types_1.HTTP_STATUS_CODE.Unauthorized);
        return;
    }
    console.log(foundUser);
    res.status(types_1.HTTP_STATUS_CODE.OK).send(foundUser);
}));
exports.authRouter.get('/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers['Authorization'.toLowerCase()];
    if (authorization == undefined) {
        res.sendStatus(types_1.HTTP_STATUS_CODE.Unauthorized);
        return;
    }
    const accessToken = authorization.slice(7);
    const foundUser = yield auth_service_1.authService.getUserByToken(accessToken.toString());
    if (foundUser === null) {
        res.sendStatus(types_1.HTTP_STATUS_CODE.Unauthorized);
        return;
    }
    res.status(types_1.HTTP_STATUS_CODE.OK).send(foundUser);
}));
