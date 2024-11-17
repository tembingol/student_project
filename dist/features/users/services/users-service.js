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
exports.usersService = void 0;
const mongodb_1 = require("mongodb");
const users_repository_1 = require("../users-repository");
const users_query_repo_1 = require("../users-query-repo");
exports.usersService = {
    findUsers: function (queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1;
            const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10;
            const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt";
            const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc';
            const searchLoginTerm = queryParams.searchLoginTerm ? queryParams.searchLoginTerm : "";
            const searchEmailTerm = queryParams.searchEmailTerm ? queryParams.searchEmailTerm : "";
            const filter = {};
            // if (searchLoginTerm && searchEmailTerm) {
            //     filter.login = { $regex: searchLoginTerm, $options: 'i' }
            // }
            if (searchLoginTerm) {
                filter.login = { $regex: searchLoginTerm, $options: 'i' };
            }
            if (searchEmailTerm) {
                filter.email = { $regex: searchEmailTerm, $options: 'i' };
            }
            const allUsers = yield users_query_repo_1.usersQueryRepository.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, filter);
            const totalCount = yield users_query_repo_1.usersQueryRepository.getDocumetnsCount(filter);
            const response = {
                result: true,
                status: 200,
                data: {
                    pagesCount: Math.ceil(totalCount / pageSize),
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: allUsers,
                },
                errors: []
            };
            return response;
        });
    },
    createUser: function (user) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: 400,
                data: {},
                errors: []
            };
            if (!user.login) {
                response.errors = [...response.errors, { errorsMessages: { message: "login should be string", field: "login" } }];
            }
            else if (user.login.trim().length < 3 || user.login.trim().length > 10) {
                response.errors = [...response.errors, { errorsMessages: { message: "login should be more then 3 or 10", field: "login" } }];
            }
            else if (/^[a-zA-Z0-9_-]*$/.test(user.login.trim()) == false) {
                response.errors = [...response.errors, { errorsMessages: { message: "login should true", field: "login" } }];
            }
            if (!user.password) {
                response.errors = [...response.errors, { errorsMessages: { message: "password should be string", field: "login" } }];
            }
            else if (user.password.trim().length < 6 || user.password.trim().length > 20) {
                response.errors = [...response.errors, { errorsMessages: { message: "password should be more then 6 or 20", field: "login" } }];
            }
            if (!user.email) {
                response.errors = [...response.errors, { errorsMessages: { message: "email should be string", field: "login" } }];
            }
            else if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(user.email.trim()) == false) {
                response.errors = [...response.errors, { errorsMessages: { message: "email should true", field: "email" } }];
            }
            if (response.errors.length > 0) {
                return response;
            }
            const isEmailAvalible = yield users_query_repo_1.usersQueryRepository.getUserByEmail(user.email);
            if (isEmailAvalible !== null) {
                response.result = false;
                response.status = 400;
                response.data = {};
                response.errors = [...response.errors, { errorsMessages: { message: "email should be unique", field: "email" } }];
                return response;
            }
            const isLoginAvalible = yield users_query_repo_1.usersQueryRepository.getUserByLogin(user.login);
            if (isLoginAvalible !== null) {
                response.result = false;
                response.status = 400;
                response.data = {};
                response.errors = [...response.errors, { errorsMessages: { message: "login should be unique", field: "login" } }];
                return response;
            }
            if (response.errors.length > 0) {
                return response;
            }
            const userId = new mongodb_1.ObjectId();
            const newUser = {
                _id: userId,
                id: userId.toString(),
                login: user.login,
                createdAt: new Date(),
                email: user.email,
            };
            const isCreated = yield users_repository_1.usersRepository.createUser(newUser);
            if (isCreated !== "") {
                const createdUser = yield users_query_repo_1.usersQueryRepository.getUserById(isCreated);
                response.result = true;
                response.status = 201;
                response.data = createdUser == null ? {} : createdUser;
            }
            return response;
        });
    },
    deleteUser: function (useriD) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = {
                result: false,
                status: 404,
                data: {},
                errors: "User not found"
            };
            const isDeleted = yield users_repository_1.usersRepository.deleteUser(useriD);
            if (isDeleted) {
                response.result = true;
                response.status = 204;
                response.errors = "";
            }
            return response;
        });
    },
};
