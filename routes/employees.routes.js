const express = require("express")

const employeesController = require("../controllers/employees.controller")

const router = express.Router()


router.get("/", employeesController.hello);

router.get("/employees", employeesController.getAllEmployees);

router.get("/employees/:id", employeesController.getEmployee);

router.post("/employees", employeesController.addEmployee);

router.patch("/employees/:id", employeesController.updateEmployee);

router.delete("/employees/:id", employeesController.deleteEmployee);

module.exports = router