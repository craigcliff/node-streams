const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");
const user = require("./user");

const main = async (cb) => {
  const readStream = fs.createReadStream("./data/import.csv");

  const writeStream = fs.createWriteStream("./data/exports.csv");

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
      callback(null, user);
    },
  });

  const myFilter = new Transform({
    objectMode: true,
    transform(user, enc, callback) {
      const lowSalary = user.salary < 1000;
      if (!user.isActive || lowSalary) {
        this.push(user);
      }

      // Continue processing
      callback();
    },
  });

  readStream
    .pipe(
      csv(
        {
          delimiter: ";",
        },
        // built in node function that trasforms streams into objects
        {
          objectMode: true,
        }
      )
    )
    .pipe(myTransform)
    .pipe(myFilter)
    .on("error", (error) => {
      console.log("stream error: ", error);
      cb(error);
    })
    .on("data", (data) => {
      console.log("data: >>>>> ", data);
    })
    .on("error", (error) => {
      console.log("stream error: ", error);
      cb(error);
    })
    .on("end", () => {
      console.log("Stream ended");
      cb(null);
    });
};

main();
