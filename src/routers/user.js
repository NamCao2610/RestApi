const express = require('express');
const User = require('../models/user');
const router = new express.Router();

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
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e.message);
    }
})

//Get all User
router.get('/users', async (req, res) => {
    // User.find({}).then(users => {
    //     res.status(201).send(users)
    // }).catch(error => {
    //     res.status(500).send(error.message)
    // })
    try {

        const users = await User.find({});
        res.status(200).send(users);

    } catch (e) {
        res.status(500).send(e.message);
    }
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

        const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })

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