"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsRepository = void 0;
const db_1 = require("../../db/db");
exports.blogsRepository = {
    getAllBlogs: function () {
        const allBlogs = db_1.db.blogs;
        return allBlogs;
    },
    getBlogByID: function (id) {
        const index = db_1.db.blogs.findIndex((e) => e.id === id);
        if (index === -1) {
            return false;
        }
        return db_1.db.blogs[index];
    },
    createBlog: function (reqBody) {
        const newBlog = {
            "id": (db_1.db.blogs.length + 1).toString(),
            "name": reqBody.name,
            "description": reqBody.description,
            "websiteUrl": reqBody.websiteUrl,
        };
        try {
            db_1.db.blogs.push(newBlog);
            return newBlog.id;
        }
        catch (err) {
            return false;
        }
    },
    updateBlog: function (id, reqBody) {
        const index = db_1.db.blogs.findIndex((e) => e.id === id);
        if (index === -1) {
            return false;
        }
        db_1.db.blogs[index].name = reqBody.name;
        db_1.db.blogs[index].description = reqBody.description;
        db_1.db.blogs[index].websiteUrl = reqBody.websiteUrl;
        return true;
    },
    deleteBlog: function (id) {
        const index = db_1.db.blogs.findIndex((e) => e.id === id);
        if (index === -1) {
            return false;
        }
        db_1.db.blogs.splice(index, 1);
        return true;
    }
};
