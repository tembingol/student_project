import { Router } from "express";
import { db } from "../db/db";
import { OutputErrorsType } from "../input-output-types/otput-errors-model";
import { PostInputModel, PostViewModel } from "../input-output-types/posts-models";

export const postRouter = Router({})

postRouter.get('/', (req, res) => {
    const foudBlogs = db.posts
    res.status(200).json(foudBlogs)
})

postRouter.get('/:id', (req, res) => {
    const index = db.posts.findIndex((e) => +e.id === +req.params.id);
    if (index === -1) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(db.posts[index])
})

postRouter.post('/', (req, res) => {
    const OutputErrors = inputBlogValidation(req.body)

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

postRouter.put('/:id', (req, res) => {
    const index = db.posts.findIndex((e) => +e.id === +req.params.id);

    if (index === -1) {
        res.sendStatus(404)
        return
    }

    const OutputErrors = inputBlogValidation(req.body)

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

    res.status(204)
})

postRouter.delete('/:id', (req, res) => {
    const index = db.posts.findIndex((e) => +e.id === +req.params.id);

    if (index === -1) {
        res.sendStatus(404)
        return
    }

    db.blogs.splice(index, 1)
    res.sendStatus(204)
})

const inputBlogValidation = (postObject: PostInputModel) => {
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