const Employee = require("../models/employee.model")

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



function hello (req, res) {
  const status = {
    message: "Hello " + process.env.APP_NAME,
  };

  res.json(status);
};

async function getAllEmployees (req, res) {

  try {
    const employees = await Employee.find();
    res.status(201).json({ employees , message: "Success!" });
  } catch (error) {
    res.status(500).json({message: "Something went wrong, try again."});
  }

};

async function getEmployee (req, res) {

  try {
    const employee = await Employee.findById(req.params.id);
    res.status(201).json({ employee , message: "Success!" });
  } catch (error) {
    res.status(500).json({message: "Something went wrong, try again."});
  }

};

async function addEmployee (req, res) {
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
};


async function updateEmployee (req, res) {
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

};

async function deleteEmployee (req, res) {

  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.status(201).json({ message: "Success! Data deleted" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, try again."});
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