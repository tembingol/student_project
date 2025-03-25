"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.blogsQueryRepository = void 0;
const inversify_1 = require("inversify");
const blogs_models_1 = require("../../input-output-types/blogs-models");
let blogsQueryRepository = class blogsQueryRepository {
    getAllBlogs(pageNumber, pageSize, sortBy, sortDirection, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const _pageNumber = +pageNumber;
            const _pageSize = +pageSize;
            const _sortDirection = sortDirection === 'asc' ? 1 : -1;
            const allBlogs = yield blogs_models_1.BlogModel.find(filter)
                .skip((_pageNumber - 1) * _pageSize)
                .limit(_pageSize)
                .sort({ [sortBy]: _sortDirection })
                .lean();
            return allBlogs;
        });
    }
    getBlogByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield blogs_models_1.BlogModel.findOne({ _id: id });
            return foundUser;
        });
    }
    getDocumetnsCount(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const retult = yield blogs_models_1.BlogModel.countDocuments(filter);
            return retult;
        });
    }
};
exports.blogsQueryRepository = blogsQueryRepository;
exports.blogsQueryRepository = blogsQueryRepository = __decorate([
    (0, inversify_1.injectable)()
], blogsQueryRepository);
