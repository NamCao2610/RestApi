const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (req, res, next) => {
    try {

        const token = req.header('Authorization').replace('Bearer ', '')
        const decode = jwt.verify(token, 'namdepzai');

        const user = await User.findOne({ _id: decode._id, "tokens.token": token });

        if (!user) {
            throw new Error('Khong dung voi token')
        }

        req.token = token
        req.user = user
        next();

    } catch (e) {
        res.status(401).send('Please authenticate');
    }
}

module.exports = auth;