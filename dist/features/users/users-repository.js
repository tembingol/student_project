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
const mongodb_1 = require("mongodb");
const db_1 = require("../../db/db");
const usersRepository = {
    createUser: function (user, usersCredentials) {
        return __awaiter(this, void 0, void 0, function* () {
            const newObjectId = new mongodb_1.ObjectId();
            const newUser = Object.assign(Object.assign({}, user), { _id: newObjectId });
            //toDo transaction {
            const insetrCredentials = db_1.db.getCollections().usersCredentialsCollection.insertOne(Object.assign(Object.assign({}, usersCredentials), { userId: newObjectId.toString() }));
            const insertResult = yield db_1.db.getCollections().usersCollection.insertOne(newUser);
            //toDo transaction }
            return insertResult.insertedId.toString();
        });
    },
    deleteUser: function (useriD) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield db_1.db.getCollections().usersCollection.deleteOne({ _id: new mongodb_1.ObjectId(useriD) });
            return result.deletedCount === 1;
        });
    },
    updateConfirmation: function (useriD) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: new mongodb_1.ObjectId(useriD) };
            const result = yield db_1.db.getCollections().usersCollection.updateOne(filter, { $set: { 'emailConfirmation.isConfirmed': true } });
            return result.modifiedCount === 1;
        });
    },
    updateConfirmationCode: function (useriD, confirmationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = { _id: new mongodb_1.ObjectId(useriD) };
            const result = yield db_1.db.getCollections().usersCollection.updateOne(filter, { $set: { 'emailConfirmation.confirmationCode': confirmationCode } });
            return result.modifiedCount === 1;
        });
    },
};
