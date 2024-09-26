"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db/db");
//import { getVideosController } from './videos/getVideosController'
exports.app = (0, express_1.default)(); // создать приложение
exports.app.use(express_1.default.json()); // создание свойств-объектов body и query во всех реквестах
exports.app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.1' });
});
exports.app.get('/videos', (req, res) => {
    const myArray = db_1.db.videos;
    res.status(200).json(myArray);
});
exports.app.get('/videos/:id', (req, res) => {
    const myArray = db_1.db.videos.filter((e) => +e.id === +req.params.id);
    if (myArray.length == 0) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(myArray[0]);
});
exports.app.delete('/videos/:id', (req, res) => {
    const myArray = db_1.db.videos.filter((e) => +e.id === +req.params.id);
    if (myArray.length == 0) {
        res.sendStatus(404);
        return;
    }
    const objectIndex = db_1.db.videos.indexOf(myArray[0]);
    db_1.db.videos.splice(objectIndex, 1);
    res.sendStatus(204);
});
exports.app.post('/videos', (req, res) => {
    if (!req.body.title || req.body.title.length > 40) {
        const error = {
            "errorsMessages": [
                {
                    "message": "incorrect values",
                    "field": "title"
                }
            ]
        };
        res.status(400).json(error);
        return;
    }
    if (!req.body.author || req.body.author.length > 20) {
        const error = {
            "errorsMessages": [
                {
                    "message": "incorrect values",
                    "field": "author"
                }
            ]
        };
        res.status(400).json(error);
        return;
    }
    const newVideoObject = {
        "id": db_1.db.videos.length + 1,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": new Date(),
        "publicationDate": new Date(),
        "availableResolutions": req.body.availableResolutions,
    };
    db_1.db.videos.push(newVideoObject);
    const myArray = db_1.db.videos;
    res.status(200).json(newVideoObject);
});
exports.app.put('/videos/:id', (req, res) => {
    const myArray = db_1.db.videos.filter((e) => +e.id === +req.params.id);
    if (myArray.length == 0) {
        res.sendStatus(404);
        return;
    }
    if (!req.body.title || req.body.title.length > 40) {
        const error = {
            "errorsMessages": [
                {
                    "message": "incorrect values",
                    "field": "title"
                }
            ]
        };
        res.status(400).json(error);
        return;
    }
    if (!req.body.author || req.body.author.length > 20) {
        const error = {
            "errorsMessages": [
                {
                    "message": "incorrect values",
                    "field": "author"
                }
            ]
        };
        res.status(400).json(error);
        return;
    }
    if (!req.body.availableResolutions) {
        const errorsArray = [];
        const resolutions = req.body.availableResolutions;
        for (let i = 0; i < resolutions.length; i++) {
            if (availableResolutions.indexOf(resolutions[i]) == -1) {
                errorsArray.push(resolutions[i]);
            }
        }
        if (errorsArray.length) {
            const error = {
                "errorsMessages": [
                    {
                        "message": "incorrect values",
                        "field": "availableResolutions"
                    }
                ]
            };
            res.status(400).json(error);
            return;
        }
    }
    if (!req.body.canBeDownloaded) {
    }
    if (!req.body.minAgeRestriction || req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 0) {
        const error = {
            "errorsMessages": [
                {
                    "message": "incorrect values",
                    "field": "minAgeRestriction"
                }
            ]
        };
        res.status(400).json(error);
        return;
    }
    const index = db_1.db.videos.findIndex((e) => +e.id === +req.params.id);
    if (index !== -1) {
        db_1.db.videos[index].name = 'Alison'; // Alice становится Alison
        db_1.db.videos[index].title = req.body.title;
        db_1.db.videos[index].author = req.body.author;
        db_1.db.videos[index].minAgeRestriction = req.body.minAgeRestriction;
        db_1.db.videos[index].availableResolutions = req.body.availableResolutions;
        db_1.db.videos[index].publicationDate = req.body.publicationDate;
    }
    res.sendStatus(204);
});
const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];
//app.get(SETTINGS.PATH.VIDEOS, getVideosController)
// app.use(SETTINGS.PATH.VIDEOS, videosRouter)
