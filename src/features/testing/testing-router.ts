import { Router } from "express";
import { db } from "../../db/db";

export const testingRouter = Router({})

testingRouter.delete('/all-data', (req, res) => {
    db.videos = []
    db.blogs = []
    db.posts = []

    res.sendStatus(204)
})