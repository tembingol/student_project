"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const settings_1 = require("./settings");
const blogs_router_1 = require("./features/blogs/blogs-router");
const posts_router_1 = require("./features/posts/posts-router");
const testing_router_1 = require("./features/testing/testing-router");
const users_router_1 = require("./features/users/users-router");
const auth_router_1 = require("./features/auth/auth-router");
const comments_router_1 = require("./features/comments/comments-router");
//import { getVideosController } from './videos/getVideosController'
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.get(settings_1.SETTINGS.PATH.ROOT, (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.1' });
});
exports.app.use(settings_1.SETTINGS.PATH.USERS, users_router_1.usersRouter);
exports.app.use(settings_1.SETTINGS.PATH.AUTH, auth_router_1.authRouter);
exports.app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_router_1.blogsRouter);
exports.app.use(settings_1.SETTINGS.PATH.POSTS, posts_router_1.postRouter);
exports.app.use(settings_1.SETTINGS.PATH.COMMENTS, comments_router_1.commentsRouter);
exports.app.use(settings_1.SETTINGS.PATH.TESTING, testing_router_1.testingRouter);
