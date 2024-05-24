const Employee = require("../models/employee.model")
const { getSalaryNet, getSalaryGross, getVatValue } = require("../utils/calculateSalary");

function hello (req, res) {
  const status = {
    message: "Hello " + process.env.APP_NAME,
  };

  res.json(status);
};

async function getAllEmployees (req, res) {

  try {
    const employees = await Employee.find();
    res.status(201).json( employees );
  } catch (error) {
    res.status(500).json({message: "An error occurred while fetching, try again."});
  }

};

async function getEmployee (req, res) {

  try {
    const employee = await Employee.findById(req.params.id);
    res.status(201).json( employee );
  } catch (error) {
    res.status(500).json({message: "An error occurred while fetching, try again."});
  }

};

async function addEmployee (req, res) {
  const { firstName, lastName, birthDate, salaryGross } = req.body;

  if (!firstName || !lastName || !birthDate || !salaryGross) {
    return res.status(400).json({message: 'Some fields left empty, try again' });
  }

  const employee = new Employee({
    firstName,
    lastName,
    birthDate,
    salaryGross,
    salaryNet: 0,
    vatValue: 0,
  });

  employee.updateSalaryNet();

  try {
    await employee.save();
    res.status(201).json( employee._doc );
  } catch (error) {
    res.status(500).json({message: "An error occurred while creating, try again."});
  }
};

async function updateEmployee (req, res) {
  let updatedData = req.body 

  if (updatedData.salaryGross) {
    const salaryNet = getSalaryNet(req.body.salaryGross);
    const vatValue = getVatValue(req.body.salaryGross, salaryNet);
    
    updatedData = {...req.body, salaryNet, vatValue}

  } else if (updatedData.salaryNet) {
    const salaryGross = getSalaryGross(req.body.salaryNet);
    const vatValue = getVatValue(salaryGross, req.body.salaryNet);

    updatedData = {...req.body, salaryGross, vatValue}
  }

  try {
    if(req.body.vatValue) {
      throw new Error("Modifying vatValue is prohibited.")
    }

    await Employee.findByIdAndUpdate(req.params.id, updatedData);
    const employee = await Employee.findById(req.params.id)
    res.status(201).json( employee );
  } catch (error) {
    res.status(500).json({message: error + ". An error occurred while updating, try again."});
  }

};

async function deleteEmployee (req, res) {

  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(201).json({ message: "Success! Data deleted" });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while deleting, try again."});
  }

};


module.exports = {
  hello,
  getAllEmployees,
  getEmployee,
  addEmployee,
  updateEmployee,
  deleteEmployee,
}