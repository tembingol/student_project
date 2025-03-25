"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsService = void 0;
const inversify_1 = require("inversify");
const types_1 = require("../../../input-output-types/types");
const posts_service_1 = require("../../posts/services/posts-service");
const blogs_repository_1 = require("../repo/blogs-repository");
const blogs_query_service_1 = require("./blogs-query-service");
let BlogsService = class BlogsService {
    constructor(blogsRepository, postsService) {
        this.blogsRepository = blogsRepository;
        this.postsService = postsService;
    }
    createBlog(blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.BadRequest,
                data: {},
                errors: { errorsMessages: [] }
            };
            const newBblogId = yield this.blogsRepository.createBlog(blogBody);
            if (!newBblogId) {
                return response;
            }
            // const foundCreatedBlog = await blogsQueryRepository.getBlogByID(newBblogId.id);
            // if (!foundCreatedBlog) {
            //     return response
            // }
            if (newBblogId) {
                response.result = true;
                response.status = types_1.HTTP_STATUS_CODE.Created;
                response.data = (0, blogs_query_service_1.blogEntityMapper)(newBblogId);
            }
            return response;
        });
    }
    createBlogPost(id, postBody) {
        return __awaiter(this, void 0, void 0, function* () {
            postBody.blogId = id;
            const newPost = yield this.postsService.createPost(postBody);
            return newPost;
        });
    }
    updateBlog(id, blogBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.NotFound,
                data: {},
                errors: { errorsMessages: [] }
            };
            const isBlogUpdated = yield this.blogsRepository.updateBlog(id, blogBody);
            if (isBlogUpdated) {
                response.result = true;
                response.status = types_1.HTTP_STATUS_CODE.NoContent;
            }
            return response;
        });
    }
    deleteBlog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = {
                result: false,
                status: types_1.HTTP_STATUS_CODE.NotFound,
                data: {},
                errors: { errorsMessages: [] }
            };
            const isBlogDeleted = yield this.blogsRepository.deleteBlog(id);
            if (isBlogDeleted) {
                response.result = true;
                response.status = types_1.HTTP_STATUS_CODE.NoContent;
            }
            return response;
        });
    }
};
exports.BlogsService = BlogsService;
exports.BlogsService = BlogsService = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository,
        posts_service_1.PostsService])
], BlogsService);
