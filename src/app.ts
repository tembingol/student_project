import express from 'express'
import { SETTINGS } from './settings'
import { blogsRouter } from './features/blogs/blogs-router'
import { postRouter } from './features/posts/posts-router'
import { testingRouter } from './features/testing/testing-router'
import { usersRouter } from './features/users/users-router'
import { authRouter } from './features/auth/auth-router'
import { commentsRouter } from './features/comments/comments-router'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'

export const app = express() // создать приложение
app.use(express.json()) // создание свойств-объектов body и query во всех реквестах
app.use(cookieParser())
app.use(session({
  secret: SETTINGS.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 1000, // 1 day
  },
  name: 'sessionID',
  store: new MongoStore(
    {
      mongoUrl: SETTINGS.MONGO_URL,
      dbName: SETTINGS.DB_NAME,
      collectionName: 'sessions',
      ttl: 60 * 60 * 24 // 1 day
    }
  )
}))

// Middleware to log requests data
app.use((req, res, next) => {
  console.log('endpoint', req.url)
  console.log({ method: req.method, body: req.body, query: req.query })
  next()
});

// Middleware to log session data
app.use((req, res, next) => {
  console.log('Session:', req.session);
  next();
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
app.use(SETTINGS.PATH.TESTING, testingRouter)