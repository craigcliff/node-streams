const fs = require("fs");

const main = async () => {
  const readStream = fs.createReadStream("./data/import.csv");

  const writeStream = fs.createWriteStream("./data/exports.csv");

  readStream.pipe(writeStream);

  readStream.on("end", () => {
    console.log("Stream ended");
  });

  writeStream.on("finish", () => {
    console.log("Write finised");
  });
};

main();
