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
exports.connectMongoDB = exports.expiredTokensCollection = exports.commentsCollection = exports.usersCredentialsCollection = exports.usersCollection = exports.videoCollection = exports.postCollection = exports.blogCollection = exports.db = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
// получение доступа к бд
const client = new mongodb_1.MongoClient(settings_1.SETTINGS.MONGO_URL);
exports.db = client.db(settings_1.SETTINGS.DB_NAME);
// получение доступа к коллекциям
exports.blogCollection = exports.db.collection(settings_1.SETTINGS.BLOG_COLLECTION_NAME);
exports.postCollection = exports.db.collection(settings_1.SETTINGS.POST_COLLECTION_NAME);
exports.videoCollection = exports.db.collection(settings_1.SETTINGS.VIDEO_COLLECTION_NAME);
exports.usersCollection = exports.db.collection(settings_1.SETTINGS.USERS_COLLECTION_NAME);
exports.usersCredentialsCollection = exports.db.collection(settings_1.SETTINGS.USERSCREDENTIALS_COLLECTION_NAME);
exports.commentsCollection = exports.db.collection(settings_1.SETTINGS.COMMENTS_COLLECTION_NAME);
exports.expiredTokensCollection = exports.db.collection(settings_1.SETTINGS.EXPIREDTOKENS_COLLECTION_NAME);
// проверка подключения к бд
const connectMongoDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield client.connect();
        yield client.db().command({ ping: 1 });
        console.log('connected to mongo');
        return true;
    }
    catch (e) {
        console.log('can not connected to mongo');
        console.log(e);
        yield client.close();
        return false;
    }
});
exports.connectMongoDB = connectMongoDB;
