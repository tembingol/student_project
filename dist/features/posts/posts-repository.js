"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postsRepository = void 0;
const db_1 = require("../../db/db");
exports.postsRepository = {
    getAllPosts: function () {
        const allBlogs = db_1.db.posts;
        return allBlogs;
    },
    getPostByID: function (id) {
        const index = db_1.db.posts.findIndex((e) => e.id === id);
        if (index === -1) {
            return false;
        }
        return db_1.db.posts[index];
    },
    createPost: function (reqBody) {
        const newPost = {
            "id": (db_1.db.posts.length + 1).toString(),
            "title": reqBody.title,
            "shortDescription": reqBody.shortDescription,
            "content": reqBody.content,
            "blogId": reqBody.blogId,
            "blogName": ""
        };
        try {
            db_1.db.posts.push(newPost);
            return newPost.id;
        }
        catch (err) {
            return false;
        }
    },
    updatePost: function (id, reqBody) {
        const index = db_1.db.posts.findIndex((e) => e.id === id);
        if (index === -1) {
            return false;
        }
        db_1.db.posts[index].title = reqBody.title;
        db_1.db.posts[index].shortDescription = reqBody.shortDescription;
        db_1.db.posts[index].content = reqBody.content;
        db_1.db.posts[index].blogId = reqBody.blogId;
        db_1.db.posts[index].blogName = reqBody.blogName;
        return true;
    },
    deletePost: function (id) {
        const index = db_1.db.posts.findIndex((e) => e.id === id);
        if (index === -1) {
            return false;
        }
        db_1.db.posts.splice(index, 1);
        return true;
    }
};
