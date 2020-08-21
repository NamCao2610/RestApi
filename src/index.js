const express = require('express');
require('./db/mongoose');

const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

const port = process.env.PORT || 3000;



app.use(express.json());

app.use(userRouter);
app.use(taskRouter);


app.listen(port, () => {
    console.log('Server dang chay' + port);
})

const Task = require('./models/task');
const User = require('./models/user');

// myFunction = async () => {
//     // const task = await Task.findById('5f3f6cf7966206166c2ce1ef');
//     // await task.populate('owner').execPopulate();
//     // console.log(task.owner);

//     const user = await User.findById('5f3f6bd9aafb262a90c79f47');
//     await user.populate('tasks').execPopulate();
//     console.log(user.tasks);
// }

// myFunction();

