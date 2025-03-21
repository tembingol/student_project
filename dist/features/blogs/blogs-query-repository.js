"use strict";
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
const blogs_models_1 = require("../../input-output-types/blogs-models");
exports.blogsQueryRepository = {
    getAllBlogs: function (pageNumber, pageSize, sortBy, sortDirection, filter) {
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
    },
    getBlogByID: function (id) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundUser = yield blogs_models_1.BlogModel.findOne({ _id: id });
            return foundUser;
        });
    },
    getDocumetnsCount: function (filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const retult = yield blogs_models_1.BlogModel.countDocuments(filter);
            return retult;
        });
    },
};
