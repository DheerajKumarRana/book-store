import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
    },
    image: {
        type: String,
    },
    password: {
        type: String,
        // Not required if using OAuth providers
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    verificationToken: String,
    verificationTokenExpiry: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    address: {
        type: String,
        default: '',
    },
    phone: {
        type: String,
        default: '',
    },
    cart: [{
        bookId: {
            type: String,  // Storing as String ID for simplicity, or could be ObjectId
            required: true
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    }],
    purchasedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
