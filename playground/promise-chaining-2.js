require('../src/db/mongoose');

const Task = require('../src/models/task');

// Task.findByIdAndRemove('5f3c710836fc741d80ff9579').then(user => {
//     if (!user) {
//         throw new Error('Not found task');
//     }
//     console.log(user);
//     return Task.countDocuments({ completed: false });
// }).then(result => {
//     console.log(result);
// }).catch(error => {
//     console.log(error);
// })

removeTaskAndCount = async (id, completed) => {
    await Task.findByIdAndDelete(id);
    const count = await Task.countDocuments({ completed });

    return count;
}

removeTaskAndCount('5f3c8b8599832e02c8f4ff9c', false).then(count => {
    console.log(count);
}).catch(error => {
    console.log(error);
}) 
