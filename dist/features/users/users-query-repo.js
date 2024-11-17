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
const mongodb_1 = require("../../db/mongodb");
exports.usersQueryRepository = {
    getUserByLogin: function (login) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { login: login };
            const foundUser = yield mongodb_1.usersCollection.findOne(filter);
            if (foundUser) {
                return userEntityMapper(foundUser);
            }
            return foundUser;
        });
    },
    getUserById: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { id: id };
            const foundUser = yield mongodb_1.usersCollection.findOne(filter);
            if (foundUser) {
                return userEntityMapper(foundUser);
            }
            return foundUser;
        });
    },
    getUserByEmail: function (email) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { email: email };
            const foundUser = yield mongodb_1.usersCollection.findOne(filter);
            if (foundUser) {
                return userEntityMapper(foundUser);
            }
            return foundUser;
        });
    },
    getAllUsers: function (pageNumber, pageSize, sortBy, sortDirection, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const _pageNumber = +pageNumber;
            const _pageSize = +pageSize;
            const _sortDirection = sortDirection === 'asc' ? 1 : -1;
            console.log("getAllUsers_sortDirection  %s", _sortDirection);
            console.log("getAllUsers_filter  %s", filter);
            console.log(filter);
            console.log("getAllUsers_sortBy  %s", sortBy);
            const allUsers = yield mongodb_1.usersCollection.find(filter)
                .skip((_pageNumber - 1) * _pageSize)
                .limit(_pageSize)
                .sort({ [sortBy]: _sortDirection })
                .toArray();
            return allUsers.map((el) => userEntityMapper(el));
        });
    },
    getDocumetnsCount: function (filter) {
        return __awaiter(this, void 0, void 0, function* () {
            // console.log('getDocumetnsCount Logger \n{--')
            // console.log('filter %s', filter)
            // console.log(filter)
            // console.log('--}')
            return yield mongodb_1.usersCollection.countDocuments(filter);
        });
    }
};
function userEntityMapper(user) {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
    };
    // const mappedArr = arrToMAp.map((el) => {
    //     let { ["_id"]: _, ...mapped } = el
    //     return mapped
    // })
    // return mappedArr
}
