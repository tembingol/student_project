import express from 'express'
import {db} from './db/db'
//import { getVideosController } from './videos/getVideosController'

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
 
app.get('/', (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({version: '1.1'})
})

app.get('/videos', (req, res) => {
    const myArray = db.videos
    res.status(200).json(myArray)
})

app.get('/videos/:id', (req, res) => {
    const myArray = db.videos.filter( (e) => +e.id === +req.params.id )
    if (myArray.length==0){
        res.send(404)
        return
    }
    res.status(200).json(myArray[0])
})

app.post('/videos', (req, res) => {
 
 
    if(!req.body.title || req.body.title.length>40){
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

    if(!req.body.author || req.body.author.length>20){
        const error ={
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

    const newVideoObject = {
        "id": db.videos.length + 1,
        "title": req.body.title,
        "author": req.body.author,
        "canBeDownloaded": true,
        "minAgeRestriction": null,
        "createdAt": new Date(),
        "publicationDate": new Date(),
        "availableResolutions": req.body.availableResolutions,
      }
      db.videos.push(newVideoObject)

    const myArray = db.videos
    res.status(200).json(newVideoObject)
})

//app.get(SETTINGS.PATH.VIDEOS, getVideosController)
// app.use(SETTINGS.PATH.VIDEOS, videosRouter)