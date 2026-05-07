const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    terms: {
        type: Boolean,
    },
    profile: {
        type: String,
    },
    role: {
        type: String,
        enum: ['admin', 'user', 'editor', 'vendor'],
        default: 'user',

    },
    // user varified check korar jonno...//
    isVarified: {
        type: Boolean,
        default: false,
    },
    // user Active / Hold check korar jonno...//
    isHold: {
        type: Boolean,
        default: false,
    },

    // alada paramitre...
    billingAddress: {
        firstname: {
            type: String,
        },
        lastname: {
            type: String,
        },
        email: {
            type: String,
        },
        companyName: {
            type: String,
        },
        state: {
            type: String,
        },
        zipCode: {
            type: String,
        },
        country: {
            type: String,
        },
        phoneNumber: {
            type: String,
        },

    },

});

module.exports = mongoose.model('User', userSchema);


// confirm password schema theke pathanor kichu nai , tai schema te thakbe na only frontend e thakbe...
// full profile registration dekhe schema banate hobe, aksathe

// user role is an important part ...