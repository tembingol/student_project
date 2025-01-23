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
exports.postsRepository = void 0;
const mongodb_1 = require("mongodb");
const db_js_1 = require("../../db/db.js");
exports.postsRepository = {
    getAllVideos: function () {
        return __awaiter(this, void 0, void 0, function* () {
            const allVideos = yield db_js_1.db.getCollections().videoCollection.find();
            return allVideos.toArray();
        });
    },
    getVideoByID: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundVideo = yield db_js_1.db.getCollections().videoCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            if (!foundVideo) {
                return false;
            }
            return foundVideo;
        });
    },
    createVideo: function (reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const newVideo = {
                "author": reqBody.author,
                "availableResolutions": reqBody.availableResolutions,
                "canBeDownloaded": false,
                "createdAt": new Date(),
                "id": 1,
                "minAgeRestriction": null,
                "publicationDate": new Date(),
                "title": reqBody.title,
            };
            try {
                const result = yield db_js_1.db.getCollections().videoCollection.insertOne(newVideo);
                //if (!result.insertedId) {
                return result.insertedId.toString();
                //}
            }
            catch (err) {
                console.error(err);
            }
            return false;
        });
    },
    updateVideo: function (id, reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_js_1.db.getCollections().videoCollection.updateOne({ _id: new mongodb_1.ObjectId(id) }, {
                    $set: {
                        id: reqBody.id,
                        author: reqBody.author,
                        availableResolutions: reqBody.availableResolutions,
                        canBeDownloaded: reqBody.canBeDownloaded,
                        createdAt: reqBody.createdAt,
                        minAgeRestriction: null,
                        publicationDate: reqBody.publicationDate,
                        title: reqBody.title,
                    }
                });
                if (result.upsertedCount > 0) {
                    return true;
                }
            }
            catch (err) {
                console.error(err);
            }
            return false;
        });
    },
    deleteVideo: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield db_js_1.db.getCollections().videoCollection.deleteOne({ _id: new mongodb_1.ObjectId(id) });
                if (result.deletedCount > 0) {
                    return true;
                }
            }
            catch (err) {
                console.error(err);
            }
            return false;
        });
    }
};
