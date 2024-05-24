const express = require("express");
const bodyParser = require("body-parser");
const employeesRoutes = require("./routes/employees.routes")
const mongoose = require("mongoose");
const enableCors = require("./middlewares/cors")

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(enableCors)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

// routes
app.use("/", employeesRoutes)

app.use((error, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong!",
  });
});


const start = async () => {
  try {
    //connect to database
    const mongoDB = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
    await mongoose.connect(mongoDB);
    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error: "));

    //start server
    app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start()