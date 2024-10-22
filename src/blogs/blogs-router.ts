import { Router } from "express";
import { db } from "../db/db";
import { blogType } from "./models";
import { OutputErrorsType } from "../models";

export const blogsRouter = Router({})

blogsRouter.get('/', (req, res) => {
    const foudBlogs = db.blogs
    res.status(200).json(foudBlogs)
})

blogsRouter.get('/:id', (req, res) => {
    const index = db.blogs.findIndex((e) => +e.id === +req.params.id);
    if (index === -1) {
        res.sendStatus(404)
        return
    }
    res.status(200).json(db.blogs[index])
})

blogsRouter.post('/', (req, res) => {
    const OutputErrors = inputBlogValidation(req.body)

    if (OutputErrors.errorsMessages.length) {
        res.status(400).json(OutputErrors)
        return
    }

    const newBlog: blogType = {
        "id": (db.blogs.length + 1).toString(),
        "name": req.body.name,
        "description": req.body.description,
        "websiteUrl": req.body.websiteUrl,
    }

    db.blogs.push(newBlog)
    res.status(201).json(newBlog)
})

blogsRouter.put('/:id', (req, res) => {
    const index = db.blogs.findIndex((e) => +e.id === +req.params.id);

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
        db.blogs[index].name = req.body.name;
        db.blogs[index].description = req.body.description;
        db.blogs[index].websiteUrl = req.body.websiteUrl;
    }

    res.status(204)
})

blogsRouter.delete('/:id', (req, res) => {
    const index = db.blogs.findIndex((e) => +e.id === +req.params.id);

    if (index === -1) {
        res.sendStatus(404)
        return
    }

    db.videos.splice(index, 1)
    res.sendStatus(204)
})

const inputBlogValidation = (blogObj: blogType) => {
    let OutputErrors: OutputErrorsType = {
        "errorsMessages": []
    }

    if (!blogObj.name || blogObj.name.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "name"
        })
    }

    if (!blogObj.description || blogObj.description.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "description"
        })
    }
    if (!blogObj.websiteUrl || blogObj.websiteUrl.length == 0) {
        OutputErrors.errorsMessages.push({
            "message": "incorrect values",
            "field": "websiteUrl"
        })
    }
    return OutputErrors
}