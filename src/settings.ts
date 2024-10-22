
import { config } from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    PATH: {
        ROOT: '/',
        VIDEOS: '/videos',
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing',
    },
    ADMIN_AUTH: process.env.ADMIN_AUTH || 'admin:qwerty',
}
