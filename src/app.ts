import express from 'express'
import { db } from './db/db'
import { videosRouter } from './videos/video-router'
import { SETTINGS } from './settings'

//import { getVideosController } from './videos/getVideosController'

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах

app.get(SETTINGS.PATH.ROOT, (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: '1.1' })
})

app.delete('/testing/all-data', (req, res) => {
  db.videos = []
  res.sendStatus(204)
})

app.use(SETTINGS.PATH.VIDEOS, videosRouter)
