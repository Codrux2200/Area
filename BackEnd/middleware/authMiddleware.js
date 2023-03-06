const jwt = require('jsonwebtoken');
const Users = require('../model/Users');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async (req, res, next) => {
    let token

    //if request contain authorization + at least a token bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            next()
        } catch (err) {
            console.log(err)
            res.status(401)
            throw new Error('authorization fail')
        }
    }
    if (!token) {
        console.log("err2")
        res.status(401)
        throw new Error('token identification fail')
    }
})

const admin = asyncHandler(async (req, res, next) => {
    let token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            const user = await Users.findById(decode.id)
            if (user.role == 'admin') {
                next()
            } else {
                res.status(401)
                throw new Error('admin authorization fail')
            }
        } catch (err) {
            console.log(err)
            res.status(401)
            throw new Error('admin authorization fail')
        }
    }
    if (!token) {
        console.log("err2")
        res.status(401)
        throw new Error('token identification fail')
    }
})

module.exports = { protect, admin }