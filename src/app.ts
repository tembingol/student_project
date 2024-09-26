import express from 'express'
import { db } from './db/db'
//import { getVideosController } from './videos/getVideosController'

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах

app.get('/', (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: '1.1' })
})

app.get('/videos', (req, res) => {
  const myArray = db.videos
  res.status(200).json(myArray)
})

app.get('/videos/:id', (req, res) => {
  const myArray = db.videos.filter((e) => +e.id === +req.params.id)
  if (myArray.length == 0) {
    res.sendStatus(404)
    return
  }
  res.status(200).json(myArray[0])
})

app.delete('/videos/:id', (req, res) => {
  const myArray = db.videos.filter((e) => +e.id === +req.params.id)
  if (myArray.length == 0) {
    res.sendStatus(404)
    return
  }
  const objectIndex = db.videos.indexOf(myArray[0])

  db.videos.splice(objectIndex, 1)
  res.sendStatus(204)
})

app.post('/videos', (req, res) => {
  if (!req.body.title || req.body.title.length > 40) {
    const error =
    {
      "errorsMessages": [
        {
          "message": "incorrect values",
          "field": "title"
        }
      ]
    }
    res.status(400).json(error)
    return
  }

  if (!req.body.author || req.body.author.length > 20) {
    const error = {
      "errorsMessages": [
        {
          "message": "incorrect values",
          "field": "author"
        }
      ]
    }
    res.status(400).json(error)
    return
  }
  const createdDate = new Date()
  const newVideoObject = {
    "id": db.videos.length + 1,
    "title": req.body.title,
    "author": req.body.author,
    "canBeDownloaded": null,
    "minAgeRestriction": null,
    "createdAt": createdDate,
    "publicationDate": new Date(createdDate.getTime() + 60 * 60 * 24 * 1000),
    "availableResolutions": req.body.availableResolutions,
  }

  db.videos.push(newVideoObject)

  const myArray = db.videos
  res.status(200).json(newVideoObject)
})

app.put('/videos/:id', (req, res) => {

  const myArray = db.videos.filter((e) => +e.id === +req.params.id)
  if (myArray.length == 0) {
    res.sendStatus(404)
    return
  }

  if (!req.body.title || req.body.title.length > 40) {
    const error =
    {
      "errorsMessages": [
        {
          "message": "incorrect values",
          "field": "title"
        }
      ]
    }
    res.status(400).json(error)
    return
  }

  if (!req.body.author || req.body.author.length > 20) {
    const error = {
      "errorsMessages": [
        {
          "message": "incorrect values",
          "field": "author"
        }
      ]
    }
    res.status(400).json(error)
    return
  }

  if (!req.body.availableResolutions) {
    const errorsArray = [];
    const resolutions = req.body.availableResolutions
    for (let i = 0; i < resolutions.length; i++) {
      if (availableResolutions.indexOf(resolutions[i]) == -1) {
        errorsArray.push(resolutions[i])
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
      }
      res.status(400).json(error)
      return
    }
  }

  let canBeDownloaded = false
  if ((typeof req.body.canBeDownloaded !== "undefined") && (typeof req.body.canBeDownloaded !== "boolean")) {
    const error = {
      "errorsMessages": [
        {
          "message": "incorrect values",
          "field": "canBeDownloaded"
        }
      ]
    }
    res.status(400).json(error)
    return
  } else if (typeof req.body.canBeDownloaded === "boolean") {
    canBeDownloaded = req.body.canBeDownloaded
  }

  let minAgeRestriction = null
  if ((typeof req.body.minAgeRestriction !== "undefined") && (!Number.isInteger(req.body.minAgeRestriction))) {
    const error = {
      "errorsMessages": [
        {
          "message": "incorrect values is not number",
          "field": "minAgeRestriction"
        }
      ]
    }
    res.status(400).json(error)
    return
  } else if (req.body.minAgeRestriction > 18 || req.body.minAgeRestriction < 0) {
    const error = {
      "errorsMessages": [
        {
          "message": "incorrect values",
          "field": "minAgeRestriction"
        }
      ]
    }
    res.status(400).json(error)
    return
  } else {
    minAgeRestriction = req.body.minAgeRestriction
  }

  const index = db.videos.findIndex((e) => +e.id === +req.params.id);
  if (index !== -1) {
    db.videos[index].name = 'Alison'; // Alice становится Alison
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

const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"]
//app.get(SETTINGS.PATH.VIDEOS, getVideosController)
// app.use(SETTINGS.PATH.VIDEOS, videosRouter)