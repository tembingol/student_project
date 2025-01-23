import { Db, MongoClient } from "mongodb";
import { SETTINGS } from "../settings";
import { UserCredentialsModel, UserDataBaseModel } from "../input-output-types/users-moduls";
import { BlogDataBaseModel } from "../input-output-types/blogs-models";
import { PostDataBaseModel } from "../input-output-types/posts-models";
import { VideoViewModel } from "../input-output-types/videos-models";
import { CommentDataBaseModel } from "../input-output-types/comments-models";
import { ExpiredTokensModel } from "../input-output-types/expired-tokens-models";
import { IncomingRequestsModel, SessionDataBaseModel } from "../input-output-types/sessions-models";

export const db = {
    client: {} as MongoClient,

    getDbName(): Db {
        return this.client.db(SETTINGS.DB_NAME);
    },

    async run(url: string) {
        try {
            this.client = new MongoClient(url)
            await this.client.connect();
            await this.getDbName().command({ ping: 1 });
            console.log("Connected successfully to mongo server");
            return true;
        } catch (e: unknown) {
            console.error("Can't connect to mongo server", e);
            await this.client.close();
            return false;
        }
    },

    async stop() {
        await this.client.close();
        console.log("Connection successful closed");
    },

    async drop() {
        try {
            //await this.getDbName().dropDatabase()
            const collections = await this.getDbName().listCollections().toArray();

            for (const collection of collections) {
                const collectionName = collection.name;
                await this.getDbName().collection(collectionName).deleteMany({});
            }
        } catch (e: unknown) {
            console.error('Error in drop db:', e);
            await this.stop();
        }
    },

    getCollections() {
        return {
            usersCollection: this.getDbName().collection<UserDataBaseModel>("users"),
            blogCollection: this.getDbName().collection<BlogDataBaseModel>(SETTINGS.BLOG_COLLECTION_NAME),
            postCollection: this.getDbName().collection<PostDataBaseModel>(SETTINGS.POST_COLLECTION_NAME),
            videoCollection: this.getDbName().collection<VideoViewModel>(SETTINGS.VIDEO_COLLECTION_NAME),
            usersCredentialsCollection: this.getDbName().collection<UserCredentialsModel>(SETTINGS.USERSCREDENTIALS_COLLECTION_NAME),
            commentsCollection: this.getDbName().collection<CommentDataBaseModel>(SETTINGS.COMMENTS_COLLECTION_NAME),
            expiredTokensCollection: this.getDbName().collection<ExpiredTokensModel>(SETTINGS.EXPIREDTOKENS_COLLECTION_NAME),
            sessionssCollection: this.getDbName().collection<SessionDataBaseModel>(SETTINGS.SESSIONS_COLLECTION_NAME),
            incomingRequestsCollection: this.getDbName().collection<IncomingRequestsModel>(SETTINGS.INCOMINGREQUESTS_COLLECTION_NAME),
            //nexCollection: this.getDbName().collection<NextCollectionModel>(SETTINGS.NEXT_COLLECTION_NAME),
        }
    }

}