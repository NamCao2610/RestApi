const express = require('express');
const Task = require('../models/task');
const router = new express.Router()


//Create task
router.post('/tasks', async (req, res) => {
    const task = new Task(req.body);

    // task.save().then(task => {
    //     res.status(201).send(task);
    // }).catch(error => {
    //     res.status(400).send(error.message);
    // })
    try {

        await task.save();
        res.status(201).send(task);

    } catch (e) {
        res.send(400).send(e.message);
    }
})

//get task
router.get('/tasks', async (req, res) => {
    // Task.find({}).then(tasks => {
    //     res.status(200).send(tasks);
    // }).catch(e => {
    //     res.status(500).send(e.message);
    // })
    try {

        const task = await Task.find({});
        res.status(200).send(task);

    } catch (e) {
        res.status(500).send(e.message);
    }
})

//Get task by id
router.get('/tasks/:id', async (req, res) => {
    const _id = req.params.id;
    // Task.findById({ _id }).then(task => {
    //     if (!task) {
    //         return res.status(404).send('Not found');
    //     }

    //     res.status(200).send(task);
    // }).catch(e => {
    //     res.status(500).send(e.message);
    // })
    try {

        const user = await Task.findById(_id);
        if (!user) {
            return res.status(404).send('Not found');
        }
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

//Update task
router.patch('/tasks/:id', async (req, res) => {
    const _id = req.params.id
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isAllowUpdate = updates.every(update => allowedUpdates.includes(update));

    if (!isAllowUpdate) {
        return res.status(400).send('Not found key');
    }

    try {


        const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });

        if (!task) {
            return res.status(404).send('Not found id');
        }

        res.send(task)

    } catch (e) {

        res.status(400).send(e.message);
    }


})

//Delete task

router.delete('/tasks/:id', async (req, res) => {
    try {

        const user = await Task.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send('Not found');
        }

        res.send(user);


    } catch (e) {
        res.status(500).send(e.message);
    }
})

module.exports = router;