const jwt = require('jsonwebtoken');

const secureMiddleware = (req, res, next) => {
    const token = req.headers.authorization
    
    const data = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            res.send({ message: 'Unauthorised..' })
        } else {
            next()
        }
    })

};