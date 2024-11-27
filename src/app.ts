import express from 'express'
import { SETTINGS } from './settings'
import { videosRouter } from './features/videos/videos-router'
import { blogsRouter } from './features/blogs/blogs-router'
import { postRouter } from './features/posts/posts-router'
import { testingRouter } from './features/testing/testing-router'
import { usersRouter } from './features/users/users-router'
import { authRouter } from './features/auth/auth-router'
import { commentsRouter } from './features/comments/comments-router'

//import { getVideosController } from './videos/getVideosController'

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах

app.get(SETTINGS.PATH.ROOT, (req, res) => {
  // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
  res.status(200).json({ version: '1.1' })
})

app.use(SETTINGS.PATH.USERS, usersRouter)
app.use(SETTINGS.PATH.AUTH, authRouter)
app.use(SETTINGS.PATH.BLOGS, blogsRouter)
app.use(SETTINGS.PATH.POSTS, postRouter)
app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
app.use(SETTINGS.PATH.TESTING, testingRouter)