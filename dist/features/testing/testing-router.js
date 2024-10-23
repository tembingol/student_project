"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testingRouter = void 0;
const express_1 = require("express");
const db_1 = require("../../db/db");
exports.testingRouter = (0, express_1.Router)({});
exports.testingRouter.delete('/all-data', (req, res) => {
    db_1.db.videos = [];
    db_1.db.blogs = [];
    db_1.db.posts = [];
    res.sendStatus(204);
});
