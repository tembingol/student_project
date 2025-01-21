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
exports.connectMongoDB = exports.incomingRequestsCollection = exports.sessionssCollection = exports.expiredTokensCollection = exports.commentsCollection = exports.usersCredentialsCollection = exports.usersCollection = exports.videoCollection = exports.postCollection = exports.blogCollection = exports.db = exports.client = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
// проверка подключения к бд
const connectMongoDB = (MONGO_URL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // получение доступа к бд
        exports.client = new mongodb_1.MongoClient(MONGO_URL);
        exports.db = yield exports.client.db(settings_1.SETTINGS.DB_NAME);
        yield exports.client.connect();
        yield exports.client.db().command({ ping: 1 });
        // получение доступа к коллекциям
        exports.blogCollection = exports.db.collection(settings_1.SETTINGS.BLOG_COLLECTION_NAME);
        exports.postCollection = exports.db.collection(settings_1.SETTINGS.POST_COLLECTION_NAME);
        exports.videoCollection = exports.db.collection(settings_1.SETTINGS.VIDEO_COLLECTION_NAME);
        exports.usersCollection = exports.db.collection(settings_1.SETTINGS.USERS_COLLECTION_NAME);
        exports.usersCredentialsCollection = exports.db.collection(settings_1.SETTINGS.USERSCREDENTIALS_COLLECTION_NAME);
        exports.commentsCollection = exports.db.collection(settings_1.SETTINGS.COMMENTS_COLLECTION_NAME);
        exports.expiredTokensCollection = exports.db.collection(settings_1.SETTINGS.EXPIREDTOKENS_COLLECTION_NAME);
        exports.sessionssCollection = exports.db.collection(settings_1.SETTINGS.SESSIONS_COLLECTION_NAME);
        exports.incomingRequestsCollection = exports.db.collection(settings_1.SETTINGS.INCOMINGREQUESTS_COLLECTION_NAME);
        // все ок
        console.log('connected to mongo');
        return true;
    }
    catch (e) {
        console.log('can not connected to mongo');
        console.log(e);
        yield exports.client.close();
        return false;
    }
});
exports.connectMongoDB = connectMongoDB;
