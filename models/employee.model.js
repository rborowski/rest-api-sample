const mongoose = require("mongoose");
const { getSalaryNet, getVatValue } = require("../utils/calculateSalary");

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  birthDate: {
    type: String,
    required: true,
  },
  salaryGross: {
    type: Number,
    required: true,
  },
  salaryNet: {
    type: Number,
    required: true,
  },
  vatValue: {
    type: Number,
    required: true,
  },
});

employeeSchema.methods.updateSalaryNet = function updateSalaryNet () {
  this.salaryNet = getSalaryNet(this.salaryGross);
  this.vatValue = getVatValue( this.salaryGross, this.salaryNet ); 
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee