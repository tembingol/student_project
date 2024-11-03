import { Router } from "express";
import { blogCollection, postCollection, videoCollection } from "../../db/mongodb";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req, res) => {
    await blogCollection.drop()
    await postCollection.drop()
    await videoCollection.drop()

    res.sendStatus(204)
})

// testingRouter.delete('/all-data', (req, res) => {
//     db.videos = []
//     db.blogs = []
//     db.posts = []

//     res.sendStatus(204)
// })