import { WithId } from "mongodb"
import mongoose from 'mongoose'
import { SETTINGS } from "../settings"

export type BlogInputModel = {
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
}

export type BlogViewModel = {
    id: string
    name: string // max 15
    description: string // max 500
    websiteUrl: string // max 100 ^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$
    createdAt: string //($date-time))
    isMembership: boolean
}

const BlogSchema = new mongoose.Schema<WithId<BlogViewModel>>({
    id: { type: String, require: true },
    name: { type: String, require: true, max: 15 },
    description: { type: String, require: false, default: '', max: 500 },
    websiteUrl: { type: String, require: true, default: '', max: 100 },
    createdAt: { type: String, require: true, default: new Date().toISOString() },
    isMembership: { type: Boolean, require: false, default: false }
})

export const BlogModel = mongoose.model<WithId<BlogViewModel>>(SETTINGS.BLOG_COLLECTION_NAME, BlogSchema)
