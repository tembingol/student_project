import express from 'express'
import { SETTINGS } from './settings'
import { blogsRouter } from './features/blogs/blogs-router'
import { postRouter } from './features/posts/posts-router'
import { testingRouter } from './features/testing/testing-router'
import { commentsRouter } from './features/comments/comments-router'
import cookieParser from 'cookie-parser'
import { incomingRequestsMiddleware, sessionMetadataMiddleware } from './global-middlewares/sessions-middleware'
import { securityRouter } from './features/security/security-router'
import { authRouter } from './features/auth/authRouter'
import { usersRouter } from './features/users/usersRouter'


export const initApp = () => {
  const app = express() // создать приложение

  app.set('trust proxy', true)
  app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
  app.use(cookieParser())

  // session Metadata Middleware
  app.use((req, res, next) => {
    sessionMetadataMiddleware(req, res, next)
  });

  // session Counter Middleware
  app.use((req, res, next) => {
    incomingRequestsMiddleware(req, res, next)
  });

  // Middleware to log requests data
  app.use((req, res, next) => {
    console.log('endpoint', req.url)
    console.log({ method: req.method, body: req.body, query: req.query })
    next()
  });


  app.get(SETTINGS.PATH.ROOT, (req, res) => {
    // эндпоинт, который будет показывать на верселе какая версия бэкэнда сейчас залита
    res.status(200).json({ version: '1.1' })
  })

  app.use(SETTINGS.PATH.USERS, usersRouter)
  app.use(SETTINGS.PATH.AUTH, authRouter)
  app.use(SETTINGS.PATH.BLOGS, blogsRouter)
  app.use(SETTINGS.PATH.POSTS, postRouter)
  app.use(SETTINGS.PATH.COMMENTS, commentsRouter)
  app.use(SETTINGS.PATH.SECURITY, securityRouter)
  app.use(SETTINGS.PATH.TESTING, testingRouter)

  return app
}
