import { Collection, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { BlogDataBaseModel } from "../input-output-types/blogs-models";
import { PostDataBaseModel } from "../input-output-types/posts-models";
import { VideoViewModel } from "../input-output-types/videos-models";
import { UserCredentialsModel, UserDataBaseModel } from "../input-output-types/users-moduls";
import { CommentDataBaseModel } from "../input-output-types/comments-models";
import { ExpiredTokensModel } from "../input-output-types/expired-tokens-models";
import { IncomingRequestsModel, SessionDataBaseModel } from "../input-output-types/sessions-models";

// получение доступа к бд
// const client: MongoClient = new MongoClient(SETTINGS.MONGO_URL)
// export const db = client.db(SETTINGS.DB_NAME);
export let client: MongoClient
export let db: any

// получение доступа к коллекциям
export let blogCollection: Collection<BlogDataBaseModel>
export let postCollection: Collection<PostDataBaseModel>
export let videoCollection: Collection<VideoViewModel>
export let usersCollection: Collection<UserDataBaseModel>
export let usersCredentialsCollection: Collection<UserCredentialsModel>
export let commentsCollection: Collection<CommentDataBaseModel>
export let expiredTokensCollection: Collection<ExpiredTokensModel>
export let sessionssCollection: Collection<SessionDataBaseModel>
export let incomingRequestsCollection: Collection<IncomingRequestsModel>

// проверка подключения к бд
export const connectMongoDB = async (MONGO_URL: string) => {
    try {
        // получение доступа к бд
        client = new MongoClient(MONGO_URL)
        db = await client.db(SETTINGS.DB_NAME);
        await client.connect()
        await client.db().command({ ping: 1 })
        // получение доступа к коллекциям
        blogCollection = db.collection(SETTINGS.BLOG_COLLECTION_NAME)
        postCollection = db.collection(SETTINGS.POST_COLLECTION_NAME)
        videoCollection = db.collection(SETTINGS.VIDEO_COLLECTION_NAME)
        usersCollection = db.collection(SETTINGS.USERS_COLLECTION_NAME)
        usersCredentialsCollection = db.collection(SETTINGS.USERSCREDENTIALS_COLLECTION_NAME)
        commentsCollection = db.collection(SETTINGS.COMMENTS_COLLECTION_NAME)
        expiredTokensCollection = db.collection(SETTINGS.EXPIREDTOKENS_COLLECTION_NAME)
        sessionssCollection = db.collection(SETTINGS.SESSIONS_COLLECTION_NAME)
        incomingRequestsCollection = db.collection(SETTINGS.INCOMINGREQUESTS_COLLECTION_NAME)

        // все ок
        console.log('connected to mongo')
        return true
    } catch (e) {
        console.log('can not connected to mongo')
        console.log(e)
        await client.close()
        return false
    }
}