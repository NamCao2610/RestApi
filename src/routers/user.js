const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const auth = require('../middleware/auth');

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
        res.send(req.user)

    } catch (e) {
        res.status(500).send(e.message);
    }
})

module.exports = router;