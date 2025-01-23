"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initApp = void 0;
const express_1 = __importDefault(require("express"));
const settings_1 = require("./settings");
const blogs_router_1 = require("./features/blogs/blogs-router");
const posts_router_1 = require("./features/posts/posts-router");
const testing_router_1 = require("./features/testing/testing-router");
const users_router_1 = require("./features/users/users-router");
const auth_router_1 = require("./features/auth/auth-router");
const comments_router_1 = require("./features/comments/comments-router");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const sessions_middleware_1 = require("./global-middlewares/sessions-middleware");
const security_router_1 = require("./features/security/security-router");
const initApp = () => {
    const app = (0, express_1.default)(); // создать приложение
    app.set('trust proxy', true);
    app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
    app.use((0, cookie_parser_1.default)());
    // session Metadata Middleware
    app.use((req, res, next) => {
        (0, sessions_middleware_1.sessionMetadataMiddleware)(req, res, next);
    });
    // session Counter Middleware
    app.use((req, res, next) => {
        (0, sessions_middleware_1.incomingRequestsMiddleware)(req, res, next);
    });
    // Middleware to log requests data
    app.use((req, res, next) => {
        console.log('endpoint', req.url);
        console.log({ method: req.method, body: req.body, query: req.query });
        next();
    });
    // // Middleware to log session data
    // app.use((req, res, next) => {
    //   console.log('Context:', req.context);
    //   next();
    // });
    app.get(settings_1.SETTINGS.PATH.ROOT, (req, res) => {
        // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
        res.status(200).json({ version: '1.1' });
    });
    app.use(settings_1.SETTINGS.PATH.USERS, users_router_1.usersRouter);
    app.use(settings_1.SETTINGS.PATH.AUTH, auth_router_1.authRouter);
    app.use(settings_1.SETTINGS.PATH.BLOGS, blogs_router_1.blogsRouter);
    app.use(settings_1.SETTINGS.PATH.POSTS, posts_router_1.postRouter);
    app.use(settings_1.SETTINGS.PATH.COMMENTS, comments_router_1.commentsRouter);
    app.use(settings_1.SETTINGS.PATH.SECURITY, security_router_1.securityRouter);
    app.use(settings_1.SETTINGS.PATH.TESTING, testing_router_1.testingRouter);
    return app;
};
exports.initApp = initApp;
