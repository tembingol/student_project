import { Router } from "express";
import { db } from "../../db/db";
import { PostInputModel, PostViewModel } from "../../input-output-types/posts-models";
import { OutputErrorsType } from "../../input-output-types/otput-errors-model";
import { baseAuthMiddleware } from "../../global-middlewares/base-auth-middleware";

export const postRouter = Router({})

postRouter.get('/', (req, res) => {
    const foudPosts = db.posts
    res.status(200).json(foudPosts)
})

postRouter.get('/:id', (req, res) => {
    const index = db.posts.findIndex((e) => +e.id === +req.params.id);
    if (index === -1) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(db.posts[index])
})

postRouter.post('/', baseAuthMiddleware, (req, res) => {
    const OutputErrors = inputPostValidation(req.body)

    if (OutputErrors.errorsMessages.length) {
        res.status(400).json(OutputErrors)
        return
    }

    const newPost: PostViewModel = {
        "id": (db.posts.length + 1).toString(),
        "title": req.body.title,
        "shortDescription": req.body.shortDescription,
        "content": req.body.content,
        "blogId": req.body.blogId,
        "blogName": req.body.blogName,
    }

    db.posts.push(newPost)
    res.status(201).json(newPost)
})

postRouter.put('/:id', baseAuthMiddleware, (req, res) => {
    const index = db.posts.findIndex((e) => +e.id === +req.params.id);

    if (index === -1) {
        res.sendStatus(404)
        return
    }

    const OutputErrors = inputPostValidation(req.body)

    if (OutputErrors.errorsMessages.length) {
        res.status(400).json(OutputErrors)
        return
    }

    if (index !== -1) {
        db.posts[index].title = req.body.title;
        db.posts[index].shortDescription = req.body.shortDescription;
        db.posts[index].content = req.body.content;
        db.posts[index].blogId = req.body.blogId;
        db.posts[index].blogName = req.body.blogName;
    }

    res.sendStatus(204)
})

postRouter.delete('/:id', baseAuthMiddleware, (req, res) => {
    const index = db.posts.findIndex((e) => +e.id === +req.params.id);

    if (index === -1) {
        res.sendStatus(404)
        return
    }

    db.posts.splice(index, 1)
    res.sendStatus(204)
})

const inputPostValidation = (postObject: PostInputModel) => {
    let OutputErrors: OutputErrorsType = {
        "errorsMessages": []
    }

    if (!postObject.title || postObject.title.length == 0 || postObject.title.length > 30) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "title"
        })
    }

    if (!postObject.shortDescription || postObject.shortDescription.length == 0 || postObject.shortDescription.length > 100) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "shortDescription"
        })
    }

    if (!postObject.content || postObject.content.length == 0 || postObject.content.length > 1000) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "content"
        })
    }

    if (!postObject.blogId || postObject.blogId.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "blogId"
        })
    }

    return OutputErrors
}