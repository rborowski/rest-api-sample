const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const employees = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    birthDate: "1926-02-10",
    salaryGross: 5432,
    salryNet: 4416.26,
    vatValue: 1015.74,
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Doe",
    birthDate: "1939-10-06",
    salaryGross: 6545,
    salryNet: 5321.14,
    vatValue: 1233.86,
  },
  {
    id: 3,
    firstName: "Frank",
    lastName: "Doe",
    birthDate: "1981-12-13",
    salaryGross: 7345,
    salryNet: 5971.54,
    vatValue: 1373.46,
  },
];

app.get("/", (req, res) => {
  const status = {
    message: "Hello " + process.env.APP_NAME,
  };

  res.json(status);
});

app.get("/employee/:id", (req, res) => {
  const response = employees[parseInt(req.params.id) - 1];

  res.json(response);
});

app.post("/employee", (req, res) => {
  console.log(req.body);

  const response = {
    message: "Employee added.",
    employee_id: 1,
  };

  res.json(response);
});

app.patch("/employee/:id", (req, res) => {
  console.log(req.params.id);
  console.log(req.body);

  const response = {
    message: `updated employee: ${req.body.id}`,
  };

  res.json(response);
});

app.delete("/employee/:id", (req, res) => {
  console.log(req.params.id);
  console.log(req.body);

  const response = {
    message: `deleted employee: ${req.body.id}`,
  };

  res.json(response);
});

app.use((error, req, res, next) => {
  res.status(500).json({
    message: "Something went wrong!",
  });
});

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});
