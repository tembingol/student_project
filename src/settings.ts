import { config } from 'dotenv'
config() // добавление переменных из файла .env в process.env


export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    ADMIN_AUTH: process.env.ADMIN_AUTH || 'admin:qwerty',
    MONGO_URL: process.env.MONGO_URL || 'mongodb://0.0.0.0:27017',
    DB_NAME: process.env.DB_NAME || 'test_project',

    EMAILMANAGERLOGIN: process.env.EMAILMANAGERLOGIN || 'login',
    EMAILMANAGERPASSWORD: process.env.EMAILMANAGERPASSWORD || 'password',

    BLOG_COLLECTION_NAME: 'blogs',
    POST_COLLECTION_NAME: 'posts',
    VIDEO_COLLECTION_NAME: 'videos',
    USERS_COLLECTION_NAME: 'users',
    LIKES_COLLECTION_NAME: 'likes',
    COMMENTS_COLLECTION_NAME: "comments",
    USERSCREDENTIALS_COLLECTION_NAME: 'usersCredentials',
    EXPIREDTOKENS_COLLECTION_NAME: 'expiredTokens',
    SESSIONS_COLLECTION_NAME: 'sessions',
    INCOMINGREQUESTS_COLLECTION_NAME: 'incomingRequests',

    JWT_SECRET: process.env.JWT_SECRET || 'testproject',
    SESSION_SECRET: process.env.SESSION_SECRET || 'testproject',
    ACCESSTOKEN_TTL: process.env.ACCESSTOKEN_TTL || '10m',
    REFRESHTOKEN_TTL: process.env.REFRESHTOKEN_TTL || '20m',

    PATH: {
        ROOT: '/',
        USERS: '/users',
        AUTH: '/auth',
        VIDEOS: '/videos',
        COMMENTS: '/comments',
        BLOGS: '/blogs',
        POSTS: '/posts',
        SECURITY: '/security',
        TESTING: '/testing',
    },
}
