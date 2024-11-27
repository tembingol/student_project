import { commentsCollection } from "../../db/mongodb"

export const commentsQueryRepository = {
    getCommentByID: async function (filter: {}) {
        const retult = await commentsCollection.findOne(filter)
        return retult
    },
}