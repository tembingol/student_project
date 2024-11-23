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
exports.usersQueryService = void 0;
exports.userEntityMapper = userEntityMapper;
exports.userCredentialsMapper = userCredentialsMapper;
const users_query_repo_1 = require("../users-query-repo");
exports.usersQueryService = {
    findUsers: function (queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageNumber = queryParams.pageNumber ? +queryParams.pageNumber : 1;
            const pageSize = queryParams.pageSize ? +queryParams.pageSize : 10;
            const sortBy = queryParams.sortBy ? queryParams.sortBy : "createdAt";
            const sortDirection = queryParams.sortDirection ? queryParams.sortDirection : 'desc';
            const searchLoginTerm = queryParams.searchLoginTerm ? queryParams.searchLoginTerm : "";
            const searchEmailTerm = queryParams.searchEmailTerm ? queryParams.searchEmailTerm : "";
            const filter = {
                $or: [
                    { login: { $regex: searchLoginTerm, $options: 'i' } },
                    { email: { $regex: searchEmailTerm, $options: 'i' } }
                ]
            };
            const allUsers = yield users_query_repo_1.usersQueryRepository.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, filter);
            const mappedAllUsers = allUsers.map((el) => userEntityMapper(el));
            const totalCount = yield users_query_repo_1.usersQueryRepository.getDocumetnsCount(filter);
            const result = {
                result: true,
                status: 200,
                data: {
                    pagesCount: Math.ceil(totalCount / pageSize),
                    page: pageNumber,
                    pageSize: pageSize,
                    totalCount: totalCount,
                    items: mappedAllUsers,
                },
                errors: { errorsMessages: [] }
            };
            return result;
        });
    },
    getUserByEmail: function (email) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield users_query_repo_1.usersQueryRepository.getUserByEmail(email);
            if (foundUser) {
                return userEntityMapper(foundUser);
            }
            return foundUser;
        });
    },
    getUserByLogin: function (login) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield users_query_repo_1.usersQueryRepository.getUserByLogin(login);
            if (foundUser) {
                return userEntityMapper(foundUser);
            }
            return foundUser;
        });
    },
    getUserById: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield users_query_repo_1.usersQueryRepository.getUserById(id);
            if (foundUser) {
                return userEntityMapper(foundUser);
            }
            return foundUser;
        });
    },
    getUserCredentials: function (userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { userId: userId };
            const foundUser = yield users_query_repo_1.usersQueryRepository.getUserCredentials(userId);
            if (foundUser) {
                return userCredentialsMapper(foundUser);
            }
            return foundUser;
        });
    },
};
function userEntityMapper(user) {
    return {
        id: user._id.toString(),
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    };
}
function userCredentialsMapper(userCredential) {
    return {
        userId: userCredential.userId,
        salt: userCredential.salt,
        hash: userCredential.hash,
    };
}
