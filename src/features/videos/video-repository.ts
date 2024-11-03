import { ObjectId } from "mongodb"
import { videoCollection } from "../../db/mongodb"
import { VideoInputModel, VideoViewModel } from "../../input-output-types/videos-models"

export const postsRepository = {
    getAllVideos: async function () {
        const allVideos = await videoCollection.find()
        return allVideos.toArray()
    },
    getVideoByID: async function (id: string) {
        const foundVideo = await videoCollection.findOne({ _id: new ObjectId(id) })
        if (!foundVideo) {
            return false
        }
        return foundVideo
    },
    createVideo: async function (reqBody: VideoInputModel) {
        const newVideo: VideoViewModel = {
            "author": reqBody.author,
            "availableResolutions": reqBody.availableResolutions,
            "canBeDownloaded": false,
            "createdAt": new Date(),
            "id": 1,
            "minAgeRestriction": null,
            "publicationDate": new Date(),
            "title": reqBody.title,
        }
        try {
            const result = await videoCollection.insertOne(newVideo)
            //if (!result.insertedId) {
            return result.insertedId.toString()
            //}
        } catch (err) {
            console.error(err)
        }
        return false
    },
    updateVideo: async function (id: string, reqBody: VideoViewModel) {
        try {
            const result = await videoCollection.updateOne({ _id: new ObjectId(id) }, {
                $set: {
                    id: reqBody.id,
                    author: reqBody.author,
                    availableResolutions: reqBody.availableResolutions,
                    canBeDownloaded: reqBody.canBeDownloaded,
                    createdAt: reqBody.createdAt,
                    minAgeRestriction: null,
                    publicationDate: reqBody.publicationDate,
                    title: reqBody.title,

                }
            })

            if (result.upsertedCount > 0) {
                return true
            }

        } catch (err) {
            console.error(err)
        }
        return false
    },
    deleteVideo: async function (id: string) {
        try {
            const result = await videoCollection.deleteOne({ _id: new ObjectId(id) })

            if (result.deletedCount > 0) {
                return true
            }
        } catch (err) {
            console.error(err)
        }
        return false
    }
}