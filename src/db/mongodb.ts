import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogDataBaseModel } from "../input-output-types/blogs-models";
import { PostDataBaseModel } from "../input-output-types/posts-models";
import { VideoViewModel } from "../input-output-types/videos-models";
import { UserCredentialsModel, UserDataBaseModel } from "../input-output-types/users-moduls";
import { CommentDataBaseModel } from "../input-output-types/comments-models";
import { ExpiredTokensModel } from "../input-output-types/expired-tokens-models";

// получение доступа к бд
const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
export const db = client.db(SETTINGS.DB_NAME);

// получение доступа к коллекциям
export const blogCollection: Collection<BlogDataBaseModel> = db.collection<BlogDataBaseModel>(SETTINGS.BLOG_COLLECTION_NAME)
export const postCollection: Collection<PostDataBaseModel> = db.collection<PostDataBaseModel>(SETTINGS.POST_COLLECTION_NAME)
export const videoCollection: Collection<VideoViewModel> = db.collection<VideoViewModel>(SETTINGS.VIDEO_COLLECTION_NAME)
export const usersCollection: Collection<UserDataBaseModel> = db.collection<UserDataBaseModel>(SETTINGS.USERS_COLLECTION_NAME)
export const usersCredentialsCollection: Collection<UserCredentialsModel> = db.collection<UserCredentialsModel>(SETTINGS.USERSCREDENTIALS_COLLECTION_NAME)
export const commentsCollection: Collection<CommentDataBaseModel> = db.collection<CommentDataBaseModel>(SETTINGS.COMMENTS_COLLECTION_NAME)
export const expiredTokensCollection: Collection<ExpiredTokensModel> = db.collection<ExpiredTokensModel>(SETTINGS.EXPIREDTOKENS_COLLECTION_NAME)

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