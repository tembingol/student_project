"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
const base_auth_middleware_1 = require("../global-middlewares/base-auth-middleware");
exports.blogsRouter = (0, express_1.Router)({});
exports.blogsRouter.get('/', (req, res) => {
    const allBlogs = db_1.db.blogs;
    res.status(200).json(allBlogs);
});
exports.blogsRouter.get('/:id', (req, res) => {
    const index = db_1.db.blogs.findIndex((e) => +e.id === +req.params.id);
    if (index === -1) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(db_1.db.blogs[index]);
});
exports.blogsRouter.post('/', base_auth_middleware_1.baseAuthMiddleware, (req, res) => {
    const OutputErrors = inputBlogValidation(req.body);
    if (OutputErrors.errorsMessages.length) {
        res.status(400).json(OutputErrors);
        return;
    }
    const newBlog = {
        "id": (db_1.db.blogs.length + 1).toString(),
        "name": req.body.name,
        "description": req.body.description,
        "websiteUrl": req.body.websiteUrl,
    };
    db_1.db.blogs.push(newBlog);
    res.status(201).json(newBlog);
});
exports.blogsRouter.put('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => {
    const index = db_1.db.blogs.findIndex((e) => +e.id === +req.params.id);
    if (index === -1) {
        res.sendStatus(404);
        return;
    }
    const OutputErrors = inputBlogValidation(req.body);
    if (OutputErrors.errorsMessages.length) {
        res.status(400).json(OutputErrors);
        return;
    }
    if (index !== -1) {
        db_1.db.blogs[index].name = req.body.name;
        db_1.db.blogs[index].description = req.body.description;
        db_1.db.blogs[index].websiteUrl = req.body.websiteUrl;
    }
    res.sendStatus(204);
});
exports.blogsRouter.delete('/:id', base_auth_middleware_1.baseAuthMiddleware, (req, res) => {
    const index = db_1.db.blogs.findIndex((e) => e.id === req.params.id);
    if (index === -1) {
        res.sendStatus(404);
        return;
    }
    db_1.db.blogs.splice(index, 1);
    res.sendStatus(204);
});
const inputBlogValidation = (blogObj) => {
    let OutputErrors = {
        "errorsMessages": []
    };
    if (!blogObj.name || blogObj.name.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "name"
        });
    }
    if (!blogObj.description || blogObj.description.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "description"
        });
    }
    if (!blogObj.websiteUrl || blogObj.websiteUrl.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "websiteUrl"
        });
    }
    return OutputErrors;
};
