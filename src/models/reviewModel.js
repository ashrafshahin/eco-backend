const mongoose = require('mongoose')
const { Schema } = mongoose

const reviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },

        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            trim: true,
            default: '',
        },

    }, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);


// Review আলাদা collection হলে সাধারণত User এবং Product schema - তে কিছু লিখতেই হয় না। শুধু Review schema - তে reference রাখলেই কাজ হবে।