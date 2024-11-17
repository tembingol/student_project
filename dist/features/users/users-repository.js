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
exports.usersRepository = void 0;
const mongodb_1 = require("mongodb");
const mongodb_2 = require("../../db/mongodb");
exports.usersRepository = {
    createUser: function (user, usersCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const newBObjectId = new mongodb_1.ObjectId();
            user._id = newBObjectId;
            user.id = newBObjectId.toString();
            //toDo transaction
            const insetrCred = mongodb_2.usersCredentialsCollection.insertOne(usersCredentials);
            const insertResult = yield mongodb_2.usersCollection.insertOne(user);
            return insertResult.insertedId.toString();
        });
    },
    deleteUser: function (useriD) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield mongodb_2.usersCollection.deleteOne({ id: useriD });
            return result.deletedCount === 1;
        });
    },
};
