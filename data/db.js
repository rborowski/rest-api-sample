const mongoose = require("mongoose");
let mongoDB;

async function dbInit() {
  if (process.env.DB_ATLAS_URI) {
    mongoDB = `${process.env.DB_ATLAS_URI}`;
  } else {
    mongoDB = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
  }

  await mongoose.connect(mongoDB);

  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error: "));
}
//connect to database
module.exports = dbInit();
