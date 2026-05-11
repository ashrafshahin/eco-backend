const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )
};

module.exports = generateToken;