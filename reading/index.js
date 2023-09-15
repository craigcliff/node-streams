const fs = require("fs");
const csv = require("csvtojson");

const main = async () => {
  const readStream = fs.createReadStream("./data/import.csv");

  const writeStream = fs.createWriteStream("./data/exports.csv");

  //  We can use pipe to prevent backpressure
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
    .on("data", (data) => {
      console.log("data: ", data);
    });
};

main();
