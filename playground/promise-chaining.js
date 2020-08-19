require('../src/db/mongoose');

const User = require('../src/models/user');

//5f3c4ed0bc9bb3228cdae305

// User.findByIdAndUpdate('5f3c56709dc5bd18e049f5a2', { age: 1 }).then(user => {
//     console.log(user);
//     return User.countDocuments({ age: 1 })
// }).then(result => {
//     console.log(result);
// }).catch(error => {
//     console.log(error);
// })

const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age });

    const count = await User.countDocuments({ age })

    return count;
}

updateAgeAndCount('5f3c56709dc5bd18e049f5a2', 2).then(count => {
    console.log(count)
}).catch(error => {
    console.log(error);
})