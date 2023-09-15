const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");

const main = async () => {
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
      console.log("chunk: >> ", user);

      // callback method is required for stream to continue
      callback(null, chunk);
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
    .on("data", (data) => {
      console.log("data: ", data);
    })
    .on("end", () => {
      console.log("Stream ended");
    });
};

main();
