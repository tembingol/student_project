// import {VideoDBType} from './video-db-type'

import { BlogViewModel } from "../input-output-types/blogs-models"
import { PostViewModel } from "../input-output-types/posts-models"
import { VideoViewModel } from "../input-output-types/videos-models"

export type DBType = { // типизация базы данных (что мы будем в ней хранить)
    videos: VideoViewModel[], // VideoDBType[]
    availableResolutions: string[],
    blogs: BlogViewModel[],
    posts: PostViewModel[],
}

export const db: DBType = { // создаём базу данных (пока это просто переменная)
    videos: [],
    availableResolutions: ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"],
    blogs: [],
    posts: [],
}

// функция для быстрой очистки/заполнения базы данных для тестов
export const setDB = (dataset?: Partial<DBType>) => {
    if (!dataset) { // если в функцию ничего не передано - то очищаем базу данных
        db.videos = []
        db.blogs = []
        db.posts = []
        return
    }

    // если что-то передано - то заменяем старые значения новыми
    db.videos = dataset.videos || db.videos
    db.blogs = dataset.blogs || db.blogs
    db.posts = dataset.posts || db.posts
    // db.some = dataset.some || db.some
}