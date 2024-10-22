import express from 'express'
import { db } from './db/db'
import { SETTINGS } from './settings'
import { videosRouter } from './routers/video-router'
import { blogsRouter } from './routers/blogs-router'
import { postRouter } from './routers/posts-router'
import { testingRouter } from './routers/testing-router'

//import { getVideosController } from './videos/getVideosController'

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах

app.get(SETTINGS.PATH.ROOT, (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: '1.1' })
})

app.use(SETTINGS.PATH.VIDEOS, videosRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)
