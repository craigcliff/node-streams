const fs = require("fs");

const main = async () => {
  const readStream = fs.createReadStream("./data/import.csv", {
    // by default its 16kb, change it if you want chunk to be bigger or smaller
    highWaterMark: 100,
  });

  readStream.on("data", (buffer) => {
    console.log("data: ", buffer.toString());
  });

  readStream.on("end", () => {
    console.log("Stream ended");
  });
};

main();
