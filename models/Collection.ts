import mongoose from 'mongoose';

const CollectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a collection title'],
        trim: true,
    },
    description: {
        type: String,
    },
    image: {
        type: String, // Cover image for the collection
    },
    rule: {
        type: String, // The tag that defines this collection (simple version)
        required: [true, 'Please provide a tag rule'],
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

export default mongoose.models.Collection || mongoose.model('Collection', CollectionSchema);
