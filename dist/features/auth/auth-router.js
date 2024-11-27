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
exports.authRouter = (0, express_1.Router)({});
// // simple logger for this router's requests
// // all requests to this router will first hit this middleware
// authRouter.use(function (req, res, next) {
//     console.log('authRouter Logger \n{--')
//     console.log('%s ,%s ,%s', req.method, req.body, req.baseUrl + req.url)
//     console.log('--}')
//     next()
// })
exports.authRouter.post('/login', ...auth_validators_1.authValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authService.checkUserCredintails(req.body);
    if (result === null) {
        res.sendStatus(401);
        return;
    }
    const userToken = yield JWT_service_1.jwtService.createJWT(result);
    res.status(200).send(userToken);
}));
exports.authRouter.get('/login/me', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authorization = req.headers['Authorization'.toLowerCase()];
    if (typeof authorization == "undefined") {
        res.sendStatus(401);
        return;
    }
    const token = authorization.slice(7);
    const foundUser = yield auth_service_1.authService.getUserByToken(token.toString());
    if (foundUser === null) {
        res.sendStatus(401);
        return;
    }
    res.status(201).send(foundUser);
    return;
}));
