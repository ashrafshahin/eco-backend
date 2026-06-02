const mongoose = require('mongoose')
const { Schema } = mongoose

const categorySchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim:true,
    },
    status: {
        type: String,
        enum: ['pending', 'active', 'inactive'],
        default: 'pending',
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },

    description: {
        type: String,
        default: '',
    },

    image: {
        type: String,
        default: '',
    },

}, { timestamps: true });


module.exports = mongoose.model('Category', categorySchema)