"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.postRouter = (0, express_1.Router)({});
exports.postRouter.get('/', (req, res) => {
    const foudBlogs = db_1.db.posts;
    res.status(200).json(foudBlogs);
});
exports.postRouter.get('/:id', (req, res) => {
    const index = db_1.db.posts.findIndex((e) => +e.id === +req.params.id);
    if (index === -1) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(db_1.db.posts[index]);
});
exports.postRouter.post('/', (req, res) => {
    const OutputErrors = inputBlogValidation(req.body);
    if (OutputErrors.errorsMessages.length) {
        res.status(400).json(OutputErrors);
        return;
    }
    const newPost = {
        "id": (db_1.db.posts.length + 1).toString(),
        "title": req.body.title,
        "shortDescription": req.body.shortDescription,
        "content": req.body.content,
        "blogId": req.body.blogId,
        "blogName": req.body.blogName,
    };
    db_1.db.posts.push(newPost);
    res.status(201).json(newPost);
});
exports.postRouter.put('/:id', (req, res) => {
    const index = db_1.db.posts.findIndex((e) => +e.id === +req.params.id);
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
        db_1.db.posts[index].title = req.body.title;
        db_1.db.posts[index].shortDescription = req.body.shortDescription;
        db_1.db.posts[index].content = req.body.content;
        db_1.db.posts[index].blogId = req.body.blogId;
        db_1.db.posts[index].blogName = req.body.blogName;
    }
    res.status(204);
});
exports.postRouter.delete('/:id', (req, res) => {
    const index = db_1.db.posts.findIndex((e) => +e.id === +req.params.id);
    if (index === -1) {
        res.sendStatus(404);
        return;
    }
    db_1.db.blogs.splice(index, 1);
    res.sendStatus(204);
});
const inputBlogValidation = (postObject) => {
    let OutputErrors = {
        "errorsMessages": []
    };
    if (!postObject.title || postObject.title.length == 0 || postObject.title.length > 30) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "title"
        });
    }
    if (!postObject.shortDescription || postObject.shortDescription.length == 0 || postObject.shortDescription.length > 100) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "shortDescription"
        });
    }
    if (!postObject.content || postObject.content.length == 0 || postObject.content.length > 1000) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "content"
        });
    }
    if (!postObject.blogId || postObject.blogId.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "blogId"
        });
    }
    return OutputErrors;
};
