"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogModel = exports.BlogSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
exports.BlogSchema = new mongoose_1.default.Schema({
    id: { type: String, require: true },
    name: { type: String, require: true, max: 15 },
    description: { type: String, require: false, default: '', max: 500 },
    websiteUrl: { type: String, require: true, default: '', max: 100 },
    createdAt: { type: String, require: true, default: new Date().toISOString() },
    isMembership: { type: Boolean, require: false, default: false }
});
exports.BlogModel = mongoose_1.default.model('blogs', exports.BlogSchema);
