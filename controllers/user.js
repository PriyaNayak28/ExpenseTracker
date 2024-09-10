const User = require('../models/user');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');


function isstringinvalid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

const signup = async (req, res) => {
    try {
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;

        if (isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ err: "Bad parameters . Something is missing" });
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            await User.create({ name: name, email: email, password: hash }).then(() => {
                res.status(201).json({ message: 'Successfully create new user' })
            })
        })
    } catch (err) {
        res.status(403).json({ error: err });
    }
}

const generateAccessToken = (id, name, ispremiumuser) => {
    return jwt.sign({ userId: id, name: name, ispremiumuser }, '#@focus28ABCDabcd');
}

const login = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        if (isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ message: 'E-mail id or Password is missing', success: false })
        }

        await User.findAll({ where: { email } }).then((user) => {
            if (user.length > 0) {
                bcrypt.compare(password, user[0].password, (err, result) => {
                    if (err) {
                        throw new Error('Something went wrong')
                    }
                    if (result === true) {
                        res.status(200).json({ success: true, message: 'User Logged in successfully', token: generateAccessToken(user[0].id, user[0].name, user[0].ispremiumuser) })
                    } else {
                        return res.status(400).json({ success: false, message: 'Password is Incorrect' })
                    }
                })
            } else {
                return res.status(404).json({ success: false, message: 'User Doesnot exist' })
            }
        })
    } catch (err) {
        res.status(500).json({ message: err, success: false });
    }
}

module.exports = {
    signup,
    login,
    generateAccessToken
};