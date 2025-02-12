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
exports.usersRouter = void 0;
const express_1 = require("express");
const users_validators_1 = require("./middlewares/users-validators");
const users_service_1 = require("./services/users-service");
const base_auth_middleware_1 = require("../../global-middlewares/base-auth-middleware");
const users_query_service_1 = require("./services/users-query-service");
exports.usersRouter = (0, express_1.Router)({});
exports.usersRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield users_query_service_1.usersQueryService.findUsers(req.query);
    res.status(serviceRes.status).json(serviceRes.data);
}));
exports.usersRouter.post('/', base_auth_middleware_1.baseAuthMiddleware, ...users_validators_1.userRegistrationValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield users_service_1.usersService.createUser(req.body, true);
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.status(serviceRes.status).json(serviceRes.errors);
}));
exports.usersRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const serviceRes = yield users_service_1.usersService.deleteUser(req.params.id);
    if (serviceRes.result) {
        res.status(serviceRes.status).json(serviceRes.data);
        return;
    }
    res.sendStatus(serviceRes.status);
}));
