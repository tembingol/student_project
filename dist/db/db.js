"use strict";
// import {VideoDBType} from './video-db-type'
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDB = exports.db = void 0;
exports.db = {
    videos: [],
    availableResolutions: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"],
    blogs: [],
    posts: [],
};
// функция для быстрой очистки/заполнения базы данных для тестов
const setDB = (dataset) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        exports.db.videos = [];
        exports.db.blogs = [];
        exports.db.posts = [];
        return;
    }
    // если что-то передано - то заменяем старые значения новыми
    exports.db.videos = dataset.videos || exports.db.videos;
    exports.db.blogs = dataset.blogs || exports.db.blogs;
    exports.db.posts = dataset.posts || exports.db.posts;
    // db.some = dataset.some || db.some
};
exports.setDB = setDB;
