const mysql = require("mysql2");
const mysql = require("mysql2");
const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "", // change password
    database: "employeetracker",
  },
  console.log("Connected to the employee tracker database.")
);
module.exports = db;
