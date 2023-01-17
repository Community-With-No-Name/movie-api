import mongoose from 'mongoose';

const FavoritesSchema = new mongoose.Schema({
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
    created:Date,
})
const Favorites = mongoose.model('Favorites', FavoritesSchema);
export default Favorites;
