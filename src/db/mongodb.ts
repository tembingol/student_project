import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogViewModel } from "../input-output-types/blogs-models";
import { PostViewModel } from "../input-output-types/posts-models";
import { VideoViewModel } from "../input-output-types/videos-models";

// получение доступа к бд
const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
export const db = client.db(SETTINGS.DB_NAME);

// получение доступа к коллекциям
export const blogCollection: Collection<BlogViewModel> = db.collection<BlogViewModel>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostViewModel> = db.collection<PostViewModel>(SETTINGS.POST_COLLECTION_NAME)
export const videoCollection: Collection<VideoViewModel> = db.collection<VideoViewModel>(SETTINGS.VIDEO_COLLECTION_NAME)

// проверка подключения к бд
export const connectMongoDB = async () => {
    try {
        await client.connect()
        console.log('connected to db')
        return true
    } catch (e) {
        console.log(e)
        await client.close()
        return false
    }
}