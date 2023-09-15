const mongoose = require("mongoose");

const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const user = require("./user");
const UserModel = require("./user");
const bufferingObjectStream = require("buffering-object-stream");

const main = async () => {
  await mongoose.connect("mongodb://localhost:27017/myapp");
  const readStream = fs.createReadStream("./data/import.csv");

  const myTransform = new Transform({
    objectMode: true,
    transform(chunk, enc, callback) {
      const user = {
        name: chunk.name,
        email: chunk.email.toLowerCase(),
        age: +chunk.age,
        salary: +chunk.salary,
        isActive: chunk.isActive === "true",
      };

      // callback method is required for stream to continue
      this.push(user);
      callback();
    },
  });

  const myFilter = new Transform({
    objectMode: true,
    transform(user, enc, callback) {
      if (!user.isActive) {
        callback(null);
        return;
      }

      console.log("User: ", user);

      //  Need to send data to next transformer - only last transformer does not need to push data.
      this.push(user);
      callback(null);
    },
  });

  const saveUser = new Transform({
    objectMode: true,
    async transform(user, enc, callback) {
      await UserModel.create(user);
      callback(null);
    },
  });

  const saveUsers = new Transform({
    objectMode: true,
    async transform(users, enc, callback) {
      //   const promises = users.map((user) => UserModel.create(user));
      //   await Promise.all(promises);
      await UserModel.bulkWrite(
        users.map((user) => ({
          insertOne: {
            document: user,
          },
        }))
      );

      callback(null);
    },
  });

  try {
    await pipeline(
      readStream,
      csv(
        {
          delimiter: ";",
        },
        // built in node function that trasforms streams into objects
        {
          objectMode: true,
        }
      ),
      myTransform,
      //myFilter,his allows us to load a certain amount of objects in memory at any given time
      //  T
      bufferingObjectStream(400),
      saveUsers
    );
    console.log("Stream successful");
    process.exit(0);
  } catch (error) {
    console.log("An error has occurred: ", error);
  }
};

main();
