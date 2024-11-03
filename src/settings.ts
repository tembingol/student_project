
import { config } from 'dotenv'
config() // добавление переменных из файла .env в process.env

export const SETTINGS = {
    // все хардкодные значения должны быть здесь, для удобства их изменения
    PORT: process.env.PORT || 3003,
    ADMIN_AUTH: process.env.ADMIN_AUTH || 'admin:qwerty',
    MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://mongoadmin:lsebKIJ2lUSECKpX@cluster0.xl5of.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
    DB_NAME: process.env.DB_NAME || 'student_project',
    BLOG_COLLECTION_NAME: 'blogs',
    POST_COLLECTION_NAME: 'posts',
    VIDEO_COLLECTION_NAME: 'videos',
    PATH: {
        ROOT: '/',
        VIDEOS: '/videos',
        BLOGS: '/blogs',
        POSTS: '/posts',
        TESTING: '/testing',
    },
}
