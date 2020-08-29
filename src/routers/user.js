const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');
const { sendWelcomeMail, sendCancelationMail } = require('../emails/account');

//Create user
router.post('/users', async (req, res) => {
    const user = new User(req.body);

    // user.save().then(user => {
    //     res.status(201).send(user);
    // }).catch(error => {
    //     res.status(400).send(error.message);
    // })
    try {

        await user.save();
        sendWelcomeMail(user.email, user.name);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e.message);
    }
})


//Sign in user
router.post('/users/login', async (req, res) => {

    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token });

    } catch (e) {
        res.status(400).send(e.message);
    }
})

//Log out
router.post('/users/logout', auth, async (req, res) => {
    try {

        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token
        })


        await req.user.save();

        res.send();

    } catch (e) {

        res.status(500).send(e);

    }
})

//Logout all
router.post('/users/logoutAll', auth, async (req, res) => {
    try {

        req.user.tokens = [];
        await req.user.save();
        res.send(req.user);

    } catch (e) {

        res.status(500).send();

    }
})
//GEt al user
router.get('/users', async (req, res) => {

    try {

        const users = await User.find({});
        res.status(200).send(users);

    } catch (e) {
        res.status(500).send(e.message);
    }

})


//Get all User
router.get('/users/me', auth, async (req, res) => {

    res.send(req.user);

})


//Update user
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdate = ['name', 'email', 'password', 'age'];

    const isValidUpdate = updates.every(update => allowedUpdate.includes(update));

    if (!isValidUpdate) {
        return res.status(404).send('Invalid Update!');
    }

    try {

        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();

        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

        res.status(200).send(req.user);

    } catch (e) {
        res.status(400).send(e.message);
    }
})

//Delete User
router.delete('/users/me', auth, async (req, res) => {
    try {

        await req.user.remove();
        sendCancelationMail(req.user.email, req.user.name);
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e.message);
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {

        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please must be a JEPG JPG PNG'));
        }

        cb(undefined, true);
    }
})
//upload avatar
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
})
//Delete avater
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send({ success: 'Xoa thanh cong' });
})

//Get avater form user
router.get('/users/:id/avatar', async (req, res) => {
    try {

        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error('User khong ton tai hoac khong co avatar')
        }

        res.set('Content-Type', 'image/jpg');
        res.send(user.avatar);

    } catch (e) {
        res.status(404).send(e.message);
    }
})

module.exports = router;