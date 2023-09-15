const fs = require("fs");
const csv = require("csvtojson");
const { Transform } = require("stream");

const main = async () => {
  const readStream = fs.createReadStream("./data/import.csv");

  const writeStream = fs.createWriteStream("./data/exports.csv");

  const myTransform = new Transform({
    objectMode: true,
    transform(chunk, enc, callback) {
      console.log("chunk: >> ", chunk);

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
