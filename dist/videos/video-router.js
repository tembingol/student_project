"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const db_1 = require("../db/db");
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter.get('/', (req, res) => {
    const myArray = db_1.db.videos;
    res.status(200).json(myArray);
});
exports.videosRouter.get('/:id', (req, res) => {
    const myArray = db_1.db.videos.filter((e) => +e.id === +req.params.id);
    if (myArray.length == 0) {
        res.sendStatus(404);
        return;
    }
    res.status(200).json(myArray[0]);
});
exports.videosRouter.delete('/:id', (req, res) => {
    const myArray = db_1.db.videos.filter((e) => +e.id === +req.params.id);
    if (myArray.length == 0) {
        res.sendStatus(404);
        return;
    }
    const objectIndex = db_1.db.videos.indexOf(myArray[0]);
    db_1.db.videos.splice(objectIndex, 1);
    res.sendStatus(204);
});
exports.videosRouter.post('/', (req, res) => {
    let errorsArray = [];
    if (!req.body.author || req.body.author.length > 20) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "author"
        });
    }
    if (!req.body.title || req.body.title.length > 40) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "title"
        });
    }
    if (errorsArray.length) {
        res.status(400).json({
            "errorsMessages": errorsArray
        });
        return;
    }
    const createdDate = new Date();
    const newVideoObject = {
        "id": db_1.db.videos.length + 1,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": !req.body.canBeDownloaded ? req.body.canBeDownloaded : false,
        "minAgeRestriction": null,
        "createdAt": createdDate,
        "publicationDate": new Date(createdDate.getTime() + 60 * 60 * 24 * 1000),
        "availableResolutions": req.body.availableResolutions,
    };
    db_1.db.videos.push(newVideoObject);
    const myArray = db_1.db.videos;
    res.status(200).json(newVideoObject);
});
exports.videosRouter.put('/:id', (req, res) => {
    let errorsArray = [];
    const myArray = db_1.db.videos.filter((e) => +e.id === +req.params.id);
    if (myArray.length == 0) {
        res.sendStatus(404);
        return;
    }
    if (!req.body.author || req.body.author.length > 20) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "author"
        });
    }
    if (!req.body.title || req.body.title.length > 40) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "title"
        });
    }
    if (Array.isArray(req.body.availableResolutions)) {
        const resolutionsEerrorsArray = [];
        const resolutions = req.body.availableResolutions;
        for (let i = 0; i < resolutions.length; i++) {
            console.log(resolutions[i]);
            console.log(db_1.db.availableResolutions.indexOf(resolutions[i]));
            if (db_1.db.availableResolutions.indexOf(resolutions[i]) == -1) {
                resolutionsEerrorsArray.push(resolutions[i]);
            }
        }
        if (resolutionsEerrorsArray.length > 0) {
            errorsArray.push({
                "message": "incorrect values",
                "field": "availableResolutions"
            });
        }
    }
    let canBeDownloaded = false;
    if ((typeof req.body.canBeDownloaded !== "undefined") && (typeof req.body.canBeDownloaded !== "boolean")) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "canBeDownloaded"
        });
    }
    else if (typeof req.body.canBeDownloaded === "boolean") {
        canBeDownloaded = req.body.canBeDownloaded;
    }
    let minAgeRestriction = null;
    if ((typeof req.body.minAgeRestriction !== "undefined") && (!Number.isInteger(req.body.minAgeRestriction))) {
        errorsArray.push({
            "message": "incorrect values is not number",
            "field": "minAgeRestriction"
        });
    }
    else if (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 0) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "minAgeRestriction"
        });
    }
    else {
        minAgeRestriction = req.body.minAgeRestriction;
    }
    if (errorsArray.length) {
        res.status(400).json({
            "errorsMessages": errorsArray
        });
        return;
    }
    const index = db_1.db.videos.findIndex((e) => +e.id === +req.params.id);
    if (index !== -1) {
        db_1.db.videos[index].title = req.body.title;
        db_1.db.videos[index].author = req.body.author;
        db_1.db.videos[index].canBeDownloaded = canBeDownloaded;
        db_1.db.videos[index].minAgeRestriction = minAgeRestriction;
        db_1.db.videos[index].availableResolutions = req.body.availableResolutions;
        db_1.db.videos[index].publicationDate = req.body.publicationDate;
    }
    //res.sendStatus(204)
    res.status(204).json(db_1.db.videos[index]);
});
