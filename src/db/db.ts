// import {VideoDBType} from './video-db-type'

import { blogType } from "../blogs/models"
import { postType } from "../posts/models"
import { videoType } from "../videos/models"

export type DBType = { // типизация базы данных (что мы будем в ней хранить)
    videos: videoType[], // VideoDBType[]
    availableResolutions: string[],
    blogs: blogType[],
    posts: postType[],
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