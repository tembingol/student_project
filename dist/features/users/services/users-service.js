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
exports.usersService = void 0;
const types_1 = require("../../../input-output-types/types");
const users_repository_1 = require("../users-repository");
const users_query_repo_1 = require("../users-query-repo");
const bcrypt_1 = __importDefault(require("bcrypt"));
const users_query_service_1 = require("./users-query-service");
exports.usersService = {
    createUser: function (user_1) {
        return __awaiter(this, arguments, void 0, function* (user, isConfirmed = false) {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.BadRequest,
                data: {},
                errors: { errorsMessages: [] }
            };
            if (!user.login) {
                response.errors.errorsMessages.push({ message: "login should be string", field: "login" });
            }
            else if (user.login.trim().length < 3 || user.login.trim().length > 10) {
                response.errors.errorsMessages.push({ message: "login should be more then 3 or 10", field: "login" });
            }
            else if (/^[a-zA-Z0-9_-]*$/.test(user.login.trim()) == false) {
                response.errors.errorsMessages.push({ message: "login is not valid", field: "login" });
            }
            if (!user.password) {
                response.errors.errorsMessages.push({ message: "password should be string", field: "password" });
            }
            else if (user.password.trim().length < 6 || user.password.trim().length > 20) {
                response.errors.errorsMessages.push({ message: "password should be more then 6 or 20", field: "password" });
            }
            if (!user.email) {
                response.errors.errorsMessages.push({ message: "email should be string", field: "email" });
            }
            else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email.trim()) == false) {
                response.errors.errorsMessages.push({ message: "not an email", field: "email" });
            }
            if (response.errors.errorsMessages.length > 0) {
                return response;
            }
            const isEmailAvalible = yield users_query_service_1.usersQueryService.getUserByEmail(user.email);
            if (isEmailAvalible !== null) {
                response.errors.errorsMessages.push({ message: "email should be unique", field: "email" });
                return response;
            }
            const isLoginAvalible = yield users_query_repo_1.usersQueryRepository.getUserByLogin(user.login);
            if (isLoginAvalible !== null) {
                response.errors.errorsMessages.push({ message: "login should be unique", field: "login" });
                return response;
            }
            if (response.errors.errorsMessages.length > 0) {
                return response;
            }
            const newUser = {
                login: user.login,
                createdAt: new Date(),
                email: user.email,
                emailConfirmation: {
                    confirmationCode: 'string',
                    expirationDate: new Date(),
                    isConfirmed: isConfirmed
                },
                phoneConfirmation: {
                    confirmationCode: 'string',
                    expirationDate: new Date(),
                    isConfirmed: false
                },
            };
            const salt = bcrypt_1.default.genSaltSync(10);
            const hash = bcrypt_1.default.hashSync(user.password, salt);
            const usersCredentials = {
                userId: "",
                salt: salt,
                hash: hash
            };
            const isCreated = yield users_repository_1.usersRepository.createUser(newUser, usersCredentials);
            const createdUser = yield users_query_repo_1.usersQueryRepository.getUserById(isCreated);
            if (createdUser !== null) {
                response.result = true;
                response.status = 201;
                response.data = (0, users_query_service_1.userEntityMapper)(createdUser);
            }
            return response;
        });
    },
    deleteUser: function (useriD) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.NotFound,
                data: {},
                errors: { errorsMessages: [] }
            };
            const isDeleted = yield users_repository_1.usersRepository.deleteUser(useriD);
            if (isDeleted) {
                response.result = true;
                response.status = types_1.HTTP_STATUS_CODE.NoContent;
            }
            return response;
        });
    },
    getUserByConfirmationCode: function (confirmCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.BadRequest,
                data: {},
                errors: { errorsMessages: [] }
            };
            const foundUser = yield users_query_repo_1.usersQueryRepository.getUserByConfirmationCode(confirmCode);
            if (foundUser === null) {
                response.errors.errorsMessages.push({ message: "confirmation code is wrong", field: "code" });
                return response;
            }
            if (foundUser.emailConfirmation.expirationDate < new Date()) {
                response.errors.errorsMessages.push({ message: "confirmation code is exparied", field: "code" });
                return response;
            }
            if (foundUser.emailConfirmation.isConfirmed) {
                response.errors.errorsMessages.push({ message: "user already is confirmed", field: "code" });
                return response;
            }
            response.result = true;
            response.status = types_1.HTTP_STATUS_CODE.NoContent;
            response.data = (0, users_query_service_1.userEntityMapper)(foundUser);
            return response;
        });
    }
};
