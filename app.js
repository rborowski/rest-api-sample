const express = require("express");
const bodyParser = require("body-parser");
const employeesRoutes = require("./routes/employees.routes")
const db = require("./data/db")
// const mongoose = require("mongoose");
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
    await db.dbInit

    //start server
    app.listen(PORT, () => console.log("Server Listening on PORT:", PORT));

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start()