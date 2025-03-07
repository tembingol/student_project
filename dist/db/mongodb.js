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
exports.db = exports.incomingRequestsCollection = exports.sessionssCollection = exports.expiredTokensCollection = exports.commentsCollection = exports.usersCredentialsCollection = exports.usersCollection = exports.videoCollection = exports.postCollection = exports.blogCollection = void 0;
const mongodb_1 = require("mongodb");
const settings_1 = require("../settings");
exports.db = {
    client: {},
    getDbName() {
        return this.client.db(settings_1.SETTINGS.DB_NAME);
    },
    run(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.client = new mongodb_1.MongoClient(url);
                yield this.client.connect();
                yield this.getDbName().command({ ping: 1 });
                console.log("Connected successfully to mongo server");
                return true;
            }
            catch (e) {
                console.error("Can't connect to mongo server", e);
                yield this.client.close();
                return false;
            }
        });
    },
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.close();
            console.log("Connection successful closed");
        });
    },
    drop() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //await this.getDbName().dropDatabase()
                const collections = yield this.getDbName().listCollections().toArray();
                for (const collection of collections) {
                    const collectionName = collection.name;
                    yield this.getDbName().collection(collectionName).deleteMany({});
                }
            }
            catch (e) {
                console.error('Error in drop db:', e);
                yield this.stop();
            }
        });
    },
    getCollections() {
        return {
            usersCollection: this.getDbName().collection("users"),
            blogCollection: this.getDbName().collection(settings_1.SETTINGS.BLOG_COLLECTION_NAME),
            postCollection: this.getDbName().collection(settings_1.SETTINGS.POST_COLLECTION_NAME),
            videoCollection: this.getDbName().collection(settings_1.SETTINGS.VIDEO_COLLECTION_NAME),
            usersCredentialsCollection: this.getDbName().collection(settings_1.SETTINGS.USERSCREDENTIALS_COLLECTION_NAME),
            commentsCollection: this.getDbName().collection(settings_1.SETTINGS.COMMENTS_COLLECTION_NAME),
            expiredTokensCollection: this.getDbName().collection(settings_1.SETTINGS.EXPIREDTOKENS_COLLECTION_NAME),
            sessionssCollection: this.getDbName().collection(settings_1.SETTINGS.SESSIONS_COLLECTION_NAME),
            incomingRequestsCollection: this.getDbName().collection(settings_1.SETTINGS.INCOMINGREQUESTS_COLLECTION_NAME),
            //blogsCollection:
        };
    }
};
