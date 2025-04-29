import { injectable } from "inversify"
import { CommentModel } from "../../../input-output-types/comments-models"

@injectable()
export class CommentsQueryRepository {

    async getCommentByID(id: string) {
        const retult = await CommentModel.findOne({ _id: id }).exec()
        return retult
    }

    async getCommentByFilter(filter: {}) {
        const retult = await CommentModel.findOne(filter).exec()
        return retult
    }

    async getCommentsOfPost(postId: string, pageNumber: Number, pageSize: Number, sortBy: string, sortDirection: string, searchNameTerm: string,) {
        const _pageNumber = +pageNumber
        const _pageSize = +pageSize
        const _sortDirection = sortDirection === 'asc' ? 1 : -1

        const allCommentsofPost = await CommentModel.find({ postId: postId })
            .skip((_pageNumber - 1) * _pageSize)
            .limit(_pageSize)
            .sort({ createdAt: _sortDirection, [sortBy]: _sortDirection })
            .exec()

        // const allCommentsofPostAggregate = await CommentModel.aggregate([
        //     { $match: { postId: postId } },
        //     { $lookup: { from: "likes", localField: "_id", foreignField: "objectId", as: "likesInfo" } },
        //     { $unionWith: { coll: "likes", pipeline: [] } },
        //     { $sort: { createdAt: _sortDirection, [sortBy]: _sortDirection } },
        //     { $skip: (_pageNumber - 1) * _pageSize },
        //     { $limit: _pageSize }
        // ]).exec()
        // console.log('allCommentsofPost2', allCommentsofPost2)

        return allCommentsofPost
    }

    async getDocumetnsCountOfPost(filter: {}) {
        const retult = await CommentModel.countDocuments(filter).exec()
        return retult
    }
}
