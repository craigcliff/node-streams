const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");
const { pipeline } = require("stream/promises");
const user = require("./user");
const { createGzip } = require("zlib");

const main = async () => {
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

  const convertToNdJson = new Transform({
    objectMode: true,
    transform(user, enc, callback) {
      const ndjson = JSON.stringify(user) + "\n";
      this.push(ndjson);
      callback();
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
      myFilter,
      convertToNdJson,
      createGzip(),
      fs.createWriteStream("./data/export.ndjson")
    );
    console.log("Stream successful");
  } catch (error) {
    console.log("An error has occurred: ", error);
  }
};

main();
