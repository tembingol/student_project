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
exports.authRouter = void 0;
const express_1 = require("express");
const auth_validators_1 = require("./middlewares/auth-validators");
const users_query_repo_1 = require("../users/users-query-repo");
const bcrypt_1 = __importDefault(require("bcrypt"));
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
    // isEmail =  (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(req.body.loginOrEmail.trim())) 
    let foundUser = yield users_query_repo_1.usersQueryRepository.getUserByLogin(req.body.loginOrEmail.trim());
    if (foundUser == null) {
        foundUser = yield users_query_repo_1.usersQueryRepository.getUserByEmail(req.body.loginOrEmail.trim());
    }
    if (foundUser == null) {
        res.sendStatus(401);
        return;
    }
    const userCredentials = yield users_query_repo_1.usersQueryRepository.getUserCredentials(foundUser.id);
    const userHash = bcrypt_1.default.hashSync(req.body.password, userCredentials.salt);
    if (userHash !== userCredentials.hash) {
        res.sendStatus(401);
        return;
    }
    res.sendStatus(204);
}));
