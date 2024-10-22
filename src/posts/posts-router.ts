import { Router } from "express";
import { db } from "../db/db";
import { postType } from "./models";
import { OutputErrorsType } from "../models";

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

    const newPost: postType = {
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

    db.videos.splice(index, 1)
    res.sendStatus(204)
})

const inputBlogValidation = (blogObj: postType) => {
    let OutputErrors: OutputErrorsType = {
        "errorsMessages": []
    }

    if (!blogObj.title || blogObj.title.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "title"
        })
    }

    if (!blogObj.shortDescription || blogObj.shortDescription.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "shortDescription"
        })
    }

    if (!blogObj.content || blogObj.content.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "content"
        })
    }

    if (!blogObj.blogId || blogObj.blogId.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "blogId"
        })
    }

    if (!blogObj.blogName || blogObj.blogName.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "blogName"
        })
    }

    return OutputErrors
}