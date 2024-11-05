"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.videosRouter = void 0;
const express_1 = require("express");
const mongodb_1 = require("../../db/mongodb");
exports.videosRouter = (0, express_1.Router)({});
exports.videosRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allBlogs = yield mongodb_1.videoCollection.find().toArray();
    return allBlogs;
}));
// videosRouter.get('/:id', (req, res) => {
//     const myArray = db.videos.filter((e) => +e.id === +req.params.id)
//     if (myArray.length == 0) {
//         res.sendStatus(404)
//         return
//     }
//     res.status(200).json(myArray[0])
// })
// videosRouter.delete('/:id', (req, res) => {
//     const myArray = db.videos.filter((e) => +e.id === +req.params.id)
//     if (myArray.length == 0) {
//         res.sendStatus(404)
//         return
//     }
//     const objectIndex = db.videos.indexOf(myArray[0])
//     db.videos.splice(objectIndex, 1)
//     res.sendStatus(204)
// })
// videosRouter.post('/', (req, res) => {
//     let OutputErrors = inputVideoValidation(req.body)
//     if (OutputErrors.errorsMessages.length) {
//         res.status(400).json(OutputErrors)
//         return
//     }
//     let createdDate = new Date()
//     let publicationDate = new Date(createdDate.getTime() + 60 * 60 * 24 * 1000)
//     if (isValidDate(req.body.createdAt)) {
//         createdDate = req.body.createdAt
//     }
//     if (isValidDate(req.body.publicationDate)) {
//         publicationDate = req.body.publicationDate
//     }
//     let canBeDownloaded = false
//     if (typeof req.body.canBeDownloaded === "boolean") {
//         canBeDownloaded = req.body.canBeDownloaded
//     }
//     const newVideoObject: VideoViewModel = {
//         "author": req.body.author,
//         "availableResolutions": req.body.availableResolutions,
//         "canBeDownloaded": canBeDownloaded,
//         "createdAt": createdDate,
//         "id": db.videos.length + 1,
//         "minAgeRestriction": null,
//         "publicationDate": publicationDate,
//         "title": req.body.title,
//     }
//     db.videos.push(newVideoObject)
//     res.status(201).json(newVideoObject)
// })
// videosRouter.put('/:id', (req, res) => {
//     const myArray = db.videos.filter((e) => +e.id === +req.params.id)
//     if (myArray.length == 0) {
//         res.sendStatus(404)
//         return
//     }
//     let OutputErrors = inputVideoValidation(req.body)
//     let canBeDownloaded = false
//     if (typeof req.body.canBeDownloaded === "boolean") {
//         canBeDownloaded = req.body.canBeDownloaded
//     }
//     let minAgeRestriction = null
//     if ((typeof req.body.minAgeRestriction !== "undefined") && (!Number.isInteger(req.body.minAgeRestriction))) {
//         OutputErrors.errorsMessages.push({
//             "message": "incorrect values is not number",
//             "field": "minAgeRestriction"
//         })
//     } else if (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 0) {
//         OutputErrors.errorsMessages.push({
//             "message": "incorrect values",
//             "field": "minAgeRestriction"
//         })
//     } else {
//         minAgeRestriction = req.body.minAgeRestriction
//     }
//     if (!isValidDate(req.body.publicationDate)) {
//         OutputErrors.errorsMessages.push({
//             "message": "incorrect values",
//             "field": "publicationDate"
//         })
//     }
//     if (OutputErrors.errorsMessages.length) {
//         res.status(400).json(OutputErrors)
//         return
//     }
//     const index = db.videos.findIndex((e) => +e.id === +req.params.id);
//     if (index !== -1) {
//         db.videos[index].title = req.body.title;
//         db.videos[index].author = req.body.author;
//         db.videos[index].canBeDownloaded = canBeDownloaded;
//         db.videos[index].minAgeRestriction = minAgeRestriction;
//         db.videos[index].availableResolutions = req.body.availableResolutions;
//         db.videos[index].publicationDate = req.body.publicationDate;
//     }
//     //res.sendStatus(204)
//     res.status(204).json(db.videos[index])
// })
// function isValidDate(stringDate: string) {
//     //const regex = /^\d{4}-\d{2}-\d{2}$/
//     const regex = /\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)/
//     return regex.test(stringDate)
// }
// const inputVideoValidation = (videoObj: VideoInputModel) => {
//     let OutputErrors: OutputErrorsType = {
//         "errorsMessages": []
//     }
//     if (!videoObj.author || videoObj.author.length > 20) {
//         OutputErrors.errorsMessages.push({
//             "message": "incorrect values",
//             "field": "author"
//         })
//     }
//     if (!videoObj.title || videoObj.title.length > 40) {
//         OutputErrors.errorsMessages.push(
//             {
//                 "message": "incorrect values",
//                 "field": "title"
//             })
//     }
//     if (Array.isArray(videoObj.availableResolutions)) {
//         const resolutionsEerrorsArray = [];
//         const resolutions = videoObj.availableResolutions
//         for (let i = 0; i < resolutions.length; i++) {
//             console.log(resolutions[i])
//             console.log(db.availableResolutions.indexOf(resolutions[i]))
//             if (db.availableResolutions.indexOf(resolutions[i]) == -1) {
//                 resolutionsEerrorsArray.push(resolutions[i])
//             }
//         }
//         if (resolutionsEerrorsArray.length > 0) {
//             OutputErrors.errorsMessages.push({
//                 "message": "incorrect values",
//                 "field": "availableResolutions"
//             })
//         }
//     }
//     if ((typeof videoObj.canBeDownloaded !== "undefined") && (typeof videoObj.canBeDownloaded !== "boolean")) {
//         OutputErrors.errorsMessages.push({
//             "message": "incorrect values",
//             "field": "canBeDownloaded"
//         })
//     }
//     return OutputErrors
// }
