const mongoose = require('mongoose')
const { Schema } = mongoose

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    phone: {
        type: String,
    },
    
    // profile: {
    //     type: String,
    // },
    role: {
        type: String,
        enum: ['admin', 'user', 'editor', 'vendor'],
        default: 'user',

    },
    postalCode: {
        type: String,
    },

    address:{
        type: String,
    },
    city:{
         type: String,
    },

    // user varified check korar jonno...//
    isVerified: {
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
        fullName: {
            type: String,
        },
        
        email: {
            type: String,
        },
        
        
        zipCode: {
            type: String,
        },
        
        phoneNumber: {
            type: String,
        },

    },
    
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);


// confirm password schema theke pathanor kichu nai , tai schema te thakbe na only frontend e thakbe...
// full profile registration dekhe schema banate hobe, aksathe

// user role is an important part ...