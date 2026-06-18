const mongoose = require('mongoose');
const { Schema } = mongoose;

const Product = require('./productModel');
const User = require('../models/userModel');

const cartSchema = new Schema({

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
    quantity: {
        type: Number,
        min: 1,
        default: 1,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true
    },

}, {timestamps: true});

module.exports = mongoose.model('Cart', cartSchema);