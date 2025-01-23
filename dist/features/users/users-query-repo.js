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
exports.usersQueryRepository = void 0;
const mongodb_1 = require("mongodb");
const db_js_1 = require("../../db/db.js");
exports.usersQueryRepository = {
    getUserCredentials: function (userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { userId: userId };
            const foundUser = yield db_js_1.db.getCollections().usersCredentialsCollection.findOne(filter);
            return foundUser;
        });
    },
    getUserByLogin: function (login) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { login: login };
            const foundUser = yield db_js_1.db.getCollections().usersCollection.findOne(filter);
            return foundUser;
        });
    },
    getUserByEmail: function (email) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { email: email };
            const foundUser = yield db_js_1.db.getCollections().usersCollection.findOne(filter);
            return foundUser;
        });
    },
    getUserById: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: new mongodb_1.ObjectId(id) };
            const foundUser = yield db_js_1.db.getCollections().usersCollection.findOne(filter);
            return foundUser;
        });
    },
    getUserByConfirmationCode: function (code) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { 'emailConfirmation.confirmationCode': code };
            const foundUser = yield db_js_1.db.getCollections().usersCollection.findOne(filter);
            return foundUser;
        });
    },
    getAllUsers: function (pageNumber, pageSize, sortBy, sortDirection, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const _pageNumber = +pageNumber;
            const _pageSize = +pageSize;
            const _sortDirection = sortDirection === 'asc' ? 1 : -1;
            const allUsers = yield db_js_1.db.getCollections().usersCollection.find(filter)
                .skip((_pageNumber - 1) * _pageSize)
                .limit(_pageSize)
                .sort({ [sortBy]: _sortDirection })
                .toArray();
            return allUsers;
        });
    },
    getDocumetnsCount: function (filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_js_1.db.getCollections().usersCollection.countDocuments(filter);
        });
    }
};
