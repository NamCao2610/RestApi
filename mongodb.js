//CRUD create read update and delete
const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const ObjectID = mongodb.ObjectID;

const connectURL = 'mongodb://127.0.0.1:27017';

const databaseName = 'task-manager';

MongoClient.connect(connectURL, { useUnifiedTopology: true }, (error, client) => {
  if (error) {
    return console.log(error);
  }

  const db = client.db(databaseName);
  const users = db.collection('users');

  users.insertMany([
    { name: 'Nam', age: 20 },
    { name: 'Hai', age: 20 },
    { name: 'Ba', age: 21 }
  ], (error, user) => {
    if (error) {
      return console.log(error);
    }

    console.log(user.ops);
    users.deleteOne({
      name: 'Nam'
    }, (error, user) => {
      if (error) {
        return console.log(error);
      }

      console.log(user.deletedCount);

      users.updateOne({
        name: "Hai"
      }, {
        $set: { name: "Bon" }
      }, (error, result) => {
        if (error) {
          return console.log(error);
        }

        console.log(result.modifiedCount);

        users.find({ age: 20 }).toArray((error, result) => {
          if (error) {
            return console.log(error);
          }

          console.log(result);
        })
      })
    })
  })
})


