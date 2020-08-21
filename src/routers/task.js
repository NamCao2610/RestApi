const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router()


//Create task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    try {

        await task.save();
        res.status(201).send(task);

    } catch (e) {
        res.send(400).send(e.message);
    }
})

//get task
router.get('/tasks', auth, async (req, res) => {

    try {

        // const task = await Task.find({ owner: req.user._id });
        await req.user.populate('tasks').execPopulate()

        res.status(200).send(req.user.tasks);

    } catch (e) {
        res.status(500).send(e.message);
    }
})

//Get task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;

    try {

        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send('Not found');
        }
        res.status(200).send(task);
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

        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send('Not found id');
        }


        updates.forEach(update => task[update] = req.body[update]);

        await task.save();

        // const task = await Task.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });


        res.send(task)

    } catch (e) {

        res.status(400).send(e.message);
    }


})

//Delete task

router.delete('/tasks/:id', auth, async (req, res) => {
    try {

        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

        if (!task) {
            return res.status(404).send('Not found');
        }

        res.send(task);


    } catch (e) {
        res.status(500).send(e.message);
    }
})

module.exports = router;