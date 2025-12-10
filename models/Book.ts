import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title'],
        maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    author: {
        type: String,
        required: [true, 'Please provide an author'],
    },
    genre: {
        type: String,
        default: 'Fiction',
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: 0,
    },
    coverImage: {
        type: String,
        required: [true, 'Please provide a cover image URL'],
    },
    fileUrl: {
        type: String,
        required: [true, 'Please provide a book file URL'],
    },
    s3Key: {
        type: String,
        // required: [true, 'S3 Key is required for secure access'], // Make optional for existing books
    },
    previewUrls: {
        type: [String], // Array of URLs for multiple preview pages
    },
    preview: {
        type: String, // Short preview text
    },
    tags: [String],
    rating: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0,
    },
    sold: {
        type: Number,
        default: 0,
    },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        rating: Number,
        createdAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model('Book', BookSchema);
