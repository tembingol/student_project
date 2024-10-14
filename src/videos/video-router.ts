import { Router } from "express";
import { db } from "../db/db";

export const videosRouter = Router({})

videosRouter.get('/', (req, res) => {
    const myArray = db.videos
    res.status(200).json(myArray)
})

videosRouter.get('/:id', (req, res) => {
    const myArray = db.videos.filter((e) => +e.id === +req.params.id)
    if (myArray.length == 0) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(myArray[0])
})

videosRouter.delete('/:id', (req, res) => {
    const myArray = db.videos.filter((e) => +e.id === +req.params.id)
    if (myArray.length == 0) {
        res.sendStatus(404)
        return
    }
    const objectIndex = db.videos.indexOf(myArray[0])

    db.videos.splice(objectIndex, 1)
    res.sendStatus(204)
})

videosRouter.post('/', (req, res) => {
    let errorsArray = []
    if (!req.body.author || req.body.author.length > 20) {
        errorsArray.push(
            {
                "message": "incorrect values",
                "field": "author"
            })
    }

    if (!req.body.title || req.body.title.length > 40) {
        errorsArray.push(
            {
                "message": "incorrect values",
                "field": "title"
            }
        )
    }

    if (errorsArray.length) {
        res.status(400).json({
            "errorsMessages": errorsArray
        })
        return
    }

    const createdDate = new Date()
    const newVideoObject = {
        "id": db.videos.length + 1,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": !req.body.canBeDownloaded ? req.body.canBeDownloaded : false,
        "minAgeRestriction": null,
        "createdAt": createdDate,
        "publicationDate": new Date(createdDate.getTime() + 60 * 60 * 24 * 1000),
        "availableResolutions": req.body.availableResolutions,
    }

    db.videos.push(newVideoObject)

    const myArray = db.videos
    res.status(200).json(newVideoObject)
})

videosRouter.put('/:id', (req, res) => {
    let errorsArray = []
    const myArray = db.videos.filter((e) => +e.id === +req.params.id)
    if (myArray.length == 0) {
        res.sendStatus(404)
        return
    }

    if (!req.body.author || req.body.author.length > 20) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "author"
        })
    }

    if (!req.body.title || req.body.title.length > 40) {
        errorsArray.push(
            {
                "message": "incorrect values",
                "field": "title"
            })
    }

    if (Array.isArray(req.body.availableResolutions)) {
        const resolutionsEerrorsArray = [];
        const resolutions = req.body.availableResolutions
        for (let i = 0; i < resolutions.length; i++) {
            console.log(resolutions[i])
            console.log(db.availableResolutions.indexOf(resolutions[i]))
            if (db.availableResolutions.indexOf(resolutions[i]) == -1) {
                resolutionsEerrorsArray.push(resolutions[i])
            }
        }
        if (resolutionsEerrorsArray.length > 0) {
            errorsArray.push({
                "message": "incorrect values",
                "field": "availableResolutions"
            })
        }
    }

    let canBeDownloaded = false
    if ((typeof req.body.canBeDownloaded !== "undefined") && (typeof req.body.canBeDownloaded !== "boolean")) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "canBeDownloaded"
        })
    } else if (typeof req.body.canBeDownloaded === "boolean") {
        canBeDownloaded = req.body.canBeDownloaded
    }

    let minAgeRestriction = null
    if ((typeof req.body.minAgeRestriction !== "undefined") && (!Number.isInteger(req.body.minAgeRestriction))) {
        errorsArray.push({
            "message": "incorrect values is not number",
            "field": "minAgeRestriction"
        })
    } else if (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 0) {
        errorsArray.push({
            "message": "incorrect values",
            "field": "minAgeRestriction"
        })
    } else {
        minAgeRestriction = req.body.minAgeRestriction
    }

    if (errorsArray.length) {
        res.status(400).json({
            "errorsMessages": errorsArray
        })
        return
    }

    const index = db.videos.findIndex((e) => +e.id === +req.params.id);
    if (index !== -1) {
        db.videos[index].title = req.body.title;
        db.videos[index].author = req.body.author;
        db.videos[index].canBeDownloaded = canBeDownloaded;
        db.videos[index].minAgeRestriction = minAgeRestriction;
        db.videos[index].availableResolutions = req.body.availableResolutions;
        db.videos[index].publicationDate = req.body.publicationDate;
    }

    //res.sendStatus(204)
    res.status(204).json(db.videos[index])
})
