"use strict";
// import {VideoDBType} from './video-db-type'
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDB = exports.db = void 0;
exports.db = {
    videos: [],
    // some: []
};
// функция для быстрой очистки/заполнения базы данных для тестов
const setDB = (dataset) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        exports.db.videos = [];
        // db.some = []
        return;
    }
    // если что-то передано - то заменяем старые значения новыми
    exports.db.videos = dataset.videos || exports.db.videos;
    // db.some = dataset.some || db.some
};
exports.setDB = setDB;
