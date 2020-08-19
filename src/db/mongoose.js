const mongoose = require('mongoose');

connectURL = 'mongodb://127.0.0.1:27017/task-manager-api';

mongoose.connect(connectURL, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }, (error, client) => {
    if (error) {
        return console.log('Ket noi that bai');
    }

    console.log('Ket noi thanh cong')
});

