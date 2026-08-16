const jwt = require('jsonwebtoken')

let generateToken = (data,secret,expire)=>{
    let token = jwt.sign(data,secret,{
        expiresIn: expire
    })
    return token
}
module.exports = generateToken;