const mongoose = require('mongoose');
const User = require('./userModel');
const { Schema } = mongoose

const orderSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    products: [{
        title: String,
        price: Number,
        sku: String,
        description: String,
        stock: Number,
        discountPrice: Number,
        images: [{
            url: String,
            isMain: Boolean,
        }],
        category: String,
        quantity: Number,
        totalPrice: Number,
        status: String,
    }],
    cartSubTotal: {
        type: Number,
        required: true,

    },
    tranId: {
        type: String,
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['pending', 'reject', 'approved'],
        default: 'pending',
    },

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);