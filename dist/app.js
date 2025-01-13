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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.use((0, cookie_parser_1.default)());
exports.app.use((0, express_session_1.default)({
    secret: settings_1.SETTINGS.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 1000, // 1 day
    },
    name: 'sessionID',
    store: new connect_mongo_1.default({
        mongoUrl: settings_1.SETTINGS.MONGO_URL,
        dbName: settings_1.SETTINGS.DB_NAME,
        collectionName: 'sessions',
        ttl: 60 * 60 * 24 // 1 day
    })
}));
// Middleware to log requests data
exports.app.use((req, res, next) => {
    console.log('endpoint', req.url);
    console.log({ method: req.method, body: req.body, query: req.query });
    next();
});
// Middleware to log session data
exports.app.use((req, res, next) => {
    console.log('Session:', req.session);
    next();
});
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
