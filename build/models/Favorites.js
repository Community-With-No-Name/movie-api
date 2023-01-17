"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const FavoritesSchema = new mongoose_1.default.Schema({
    backdrop_path: String,
    genre: [Number],
    homepage: String,
    id: Number,
    imdb_id: String,
    original_title: String,
    overview: String,
    popularity: Number,
    poster_path: String,
    release_date: String,
    status: String,
    tagline: String,
    title: String,
    vote_average: Number,
    vote_count: Number,
    modified: Date,
    created: Date,
});
const Favorites = mongoose_1.default.model('Favorites', FavoritesSchema);
exports.default = Favorites;
