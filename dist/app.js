"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
const video_router_1 = require("./videos/video-router");
const settings_1 = require("./settings");
//import { getVideosController } from './videos/getVideosController'
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.get(settings_1.SETTINGS.PATH.ROOT, (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.1' });
});
exports.app.delete('/testing/all-data', (req, res) => {
    db_1.db.videos = [];
    res.sendStatus(204);
});
exports.app.use(settings_1.SETTINGS.PATH.VIDEOS, video_router_1.videosRouter);
