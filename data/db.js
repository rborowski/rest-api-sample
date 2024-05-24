const mongoose = require("mongoose");
let credentials = ""

async function dbInit() {
  if (process.env.DB_PASSWORD) {
    credentials = `${process.env.DB_USER}:${process.env.DB_PASSWORD}@`;
  }

  const mongoDB = `mongodb://${credentials}${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

  await mongoose.connect(mongoDB);
  
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "MongoDB connection error: "));

}
//connect to database
module.exports = dbInit()