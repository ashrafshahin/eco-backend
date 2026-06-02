const mongoose = require('mongoose')
const { Schema } = mongoose

const productSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    description: {
        type: String,
    },
    shortDescription: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    discountPrice: {
        type: Number,
        min: 0,
        default: 0,
    },
    sku: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    stock: {
        type: Number,
        min: 0,
        default: 0,
    },
    brand: {
        type: Schema.Types.ObjectId,
        ref: 'Brand',
        required: true,
    },

    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    subCategory: {
        type: Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true,
    },

    tags: [{
        type: String,
        trim: true,
    }],

    additionalInformation: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending',
    },
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },

    numReviews: {
        type: Number,
        default: 0,
        min: 0,
    },


}, { timestamps: true });


module.exports = mongoose.model('Product', productSchema)