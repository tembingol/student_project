import {Request, Response} from 'express'
import {db} from '../db/db'
 
export const getVideosController = (req: Request, res: Response) => {
    const videos = db.videos // получаем видео из базы данных
 
    res
        .status(200)
        .json(videos) // отдаём видео в качестве ответа
}
 
// не забудьте добавить эндпоинт в апп