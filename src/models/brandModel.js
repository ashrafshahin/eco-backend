const mongoose = require('mongoose');
const { Schema } = mongoose;

const brandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        slug: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        description: {
            type: String,
        },

        logo: {
            type: String,
        },
    }, { timestamps: true });

module.exports = mongoose.model('Brand', brandSchema);