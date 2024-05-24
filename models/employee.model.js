const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  birthDate: String,
  salaryGross: Number,
  salaryNet: Number,
  vatValue: Number,
});


const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee