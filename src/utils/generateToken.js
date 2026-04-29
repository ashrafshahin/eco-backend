const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const generateToken = (user) => {
    return jwt.sign(
        { id: User._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
};

module.exports = generateToken;