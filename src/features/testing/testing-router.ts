import { Router } from "express";
import { blogCollection, postCollection, videoCollection, usersCollection, usersCredentialsCollection, commentsCollection, sessionssCollection, incomingRequestsCollection } from "../../db/mongodb";

export const testingRouter = Router({})

testingRouter.delete('/all-data', async (req, res) => {
    await blogCollection.drop()
    await postCollection.drop()
    await videoCollection.drop()
    await usersCollection.drop()
    await usersCredentialsCollection.drop()
    await commentsCollection.drop()
    await sessionssCollection.drop()
    await incomingRequestsCollection.drop()

    res.sendStatus(204)
})
