import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogViewModel } from "../input-output-types/blogs-models";
import { PostViewModel } from "../input-output-types/posts-models";
import { VideoViewModel } from "../input-output-types/videos-models";
import { UserredentialsModel, UserViewModel } from "../input-output-types/users-moduls";

// получение доступа к бд
const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
export const db = client.db(SETTINGS.DB_NAME);

// получение доступа к коллекциям
export const blogCollection: Collection<BlogViewModel> = db.collection<BlogViewModel>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostViewModel> = db.collection<PostViewModel>(SETTINGS.POST_COLLECTION_NAME)
export const videoCollection: Collection<VideoViewModel> = db.collection<VideoViewModel>(SETTINGS.VIDEO_COLLECTION_NAME)
export const usersCollection: Collection<UserViewModel> = db.collection<UserViewModel>(SETTINGS.USERS_COLLECTION_NAME)
export const usersCredentialsCollection: Collection<UserredentialsModel> = db.collection<UserredentialsModel>(SETTINGS.USERSCREDENTIALS_COLLECTION_NAME)


// проверка подключения к бд
export const connectMongoDB = async () => {
    try {
        await client.connect()
        await client.db().command({ ping: 1 })
        console.log('connected to mongo')
        return true
    } catch (e) {
        console.log('can not connected to mongo')
        console.log(e)
        await client.close()
        return false
    }
}