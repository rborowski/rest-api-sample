const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//connect to database
const mongoDB = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

mongoose.connect(mongoDB);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error: "));

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: String,
  salaryGross: Number,
  salaryNet: Number,
  vatValue: Number,
});

const Employee = mongoose.model("Employee", employeeSchema);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))


const PORT = process.env.PORT || 3000;

const vatRate = 0.23;

function getSalaryNet(salaryGross, vatRate) {
  return +((salaryGross / (1 + vatRate) ).toFixed(2));
}

function getSalaryGross(salaryNet, vatRate) {
  return +((salaryNet * (1 + vatRate) ).toFixed(2));
}

function getVatValue(salaryGross, salaryNet) {
  return +((salaryGross - salaryNet).toFixed(2));
}

// routes

app.get("/", (req, res) => {
  const status = {
    message: "Hello " + process.env.APP_NAME,
  };

  res.json(status);
});

app.get("/employees", async (req, res) => {

  try {
    const employees = await Employee.find();
    res.status(201).json({ employees , message: "Success!" });
  } catch (error) {
    res.status(500).json({message: "Something went wrong, try again."});
  }

});

app.get("/employees/:id", async (req, res) => {

  try {
    const employee = await Employee.findById(req.params.id);
    res.status(201).json({ employee , message: "Success!" });
  } catch (error) {
    res.status(500).json({message: "Something went wrong, try again."});
  }

});

app.post("/employees", async (req, res) => {
  const { firstName, lastName, birthDate, salaryGross } = req.body;

  if (!firstName || !lastName || !birthDate || !salaryGross) {
    return res.status(400).json({message: 'Some fields left empty, try again' });
  }

  const salaryNet = getSalaryNet(salaryGross, vatRate);
  const vatValue = getVatValue(salaryGross, salaryNet);

  const employee = new Employee({
    firstName,
    lastName,
    birthDate,
    salaryGross,
    salaryNet,
    vatValue,
  });

  try {
    await employee.save();
    res.status(201).json({ employee: employee._doc , message: "Success! New employee saved" });
  } catch (error) {
    res.status(500).json("Something went wrong, try again.");
  }
});

app.patch("/employees/:id", async (req, res) => {
  let updatedData = req.body 

  if (req.body.salaryGross) {
    const salaryNet = getSalaryNet(req.body.salaryGross, vatRate);
    const vatValue = getVatValue(req.body.salaryGross, salaryNet);
    
    updatedData = {...req.body, salaryNet, vatValue}

  } else if (req.body.salaryNet) {
    const salaryGross = getSalaryGross(req.body.salaryNet, vatRate);
    const vatValue = getVatValue(salaryGross, req.body.salaryNet);

    updatedData = {...req.body, salaryGross, vatValue}
  }

  try {
    if(req.body.vatValue) {
      throw new Error("Modifying vatValue is prohibited. ")
    }

    await Employee.findByIdAndUpdate(req.params.id, updatedData);
    res.status(201).json({ message: "Success! Data updated" });
  } catch (error) {
    res.status(500).json({message: error + "Something went wrong, try again."});
  }

});

app.delete("/employees/:id", async (req, res) => {

  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(201).json({ message: "Success! Data deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again."});
  }

});

app.use((error, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong!",
  });
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
