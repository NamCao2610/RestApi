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

//Get 1 user by id
router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    // User.findById(_id).then(user => {
    //     if (!user) {
    //         return res.status(404).send('Not found');
    //     }

    //     res.status(200).send(user);
    // }).catch(error => {
    //     res.status(500).send(error.message);
    // })
    try {

        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).send('Not found');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

//Update user
router.patch('/users/:id', async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdate = ['name', 'email', 'password', 'age'];

    const isValidUpdate = updates.every(update => allowedUpdate.includes(update));

    if (!isValidUpdate) {
        return res.status(404).send('Invalid Update!');
    }
    const _id = req.params.id;

    try {

        const user = await User.findById(_id);

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();

        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

        if (!user) {
            return res.status(404).send('Not found');
        }

        res.status(200).send(user);

    } catch (e) {
        res.status(400).send(e.message);
    }
})

//Delete User
router.delete('/users/:id', async (req, res) => {
    try {

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send('not found');
        }

        res.send(user);

    } catch (e) {
        res.status(500).send(e.message);
    }
})

module.exports = router;