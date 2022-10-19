const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");
const db = require("./db/connection");
let allDepartments;

const logo = `\x1b[95m

    ███████╗███╗░░░███╗██████╗░██╗░░░░░░█████╗░██╗░░░██╗███████╗███████╗
    ██╔════╝████╗░████║██╔══██╗██║░░░░░██╔══██╗╚██╗░██╔╝██╔════╝██╔════╝
    █████╗░░██╔████╔██║██████╔╝██║░░░░░██║░░██║░╚████╔╝░█████╗░░█████╗░░
    ██╔══╝░░██║╚██╔╝██║██╔═══╝░██║░░░░░██║░░██║░░╚██╔╝░░██╔══╝░░██╔══╝░░
    ███████╗██║░╚═╝░██║██║░░░░░███████╗╚█████╔╝░░░██║░░░███████╗███████╗
    ╚══════╝╚═╝░░░░░╚═╝╚═╝░░░░░╚══════╝░╚════╝░░░░╚═╝░░░╚══════╝╚══════╝

    ████████╗██████╗░░█████╗░░█████╗░██╗░░██╗███████╗██████╗░
    ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░██╔╝██╔════╝██╔══██╗
    ░░░██║░░░██████╔╝███████║██║░░╚═╝█████═╝░█████╗░░██████╔╝
    ░░░██║░░░██╔══██╗██╔══██║██║░░██╗██╔═██╗░██╔══╝░░██╔══██╗
    ░░░██║░░░██║░░██║██║░░██║╚█████╔╝██║░╚██╗███████╗██║░░██║
    ░░░╚═╝░░░╚═╝░░╚═╝╚═╝░░╚═╝░╚════╝░╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝

                    ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
                    ▒▒▄▄▄▒▒▒█▒▒▒▒▄▒▒▒▒▒▒▒▒
                    ▒█▀█▀█▒█▀█▒▒█▀█▒▄███▄▒
                    ░█▀█▀█░█▀██░█▀█░█▄█▄█░
                    ░█▀█▀█░█▀████▀█░█▄█▄█░
                    ████████▀█████████████

\x1b[0m`;

const updateServer = async () => {
  console.clear();
  await db
    .promise()
    .query("SELECT * FROM departments")
    .then(([res]) => {
      allDepartments = res.map((department) => ({
        name: department.departmentName,
        value: department.id,
      }));
      allDepartments.push("Cancel");
    });
};

const mainMenu = () => {
  console.clear();
  console.log(`${logo}`);
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Please make a selections",
        choices: [
          "View all departments",
          "Delete Department",
          "View all Roles",
          "Delete Role",
        ],
      },
    ])
    .then((choice) => choiceHandler(choice))
    .catch((error) => console.error(error));
};

const choiceHandler = async ({ options: choice }) => {
  switch (choice) {
    case "View all departments":
      await getAllDepartments();
      break;
    case "Delete Department":
      await deleteDepartmentHandler();
      break;
    case "Delete Role":
      await deleteRoleHandler();
      break;
    case "View all Roles":
      await getAllRoles();
      break;
  }
  if (choice !== "Quit") {
    await againHandler();
  }
};

const getAllDepartments = async () => {
  await db
    .promise()
    .query(`SELECT id AS 'ID', departmentName AS 'Department' FROM departments`)
    .then(([rows]) => console.log(cTable.getTable(rows)))
    .catch((error) => console.log(error));
};
const createDepartmentsList = () => {
  let departments;
  db.promise()
    .query(`SELECT departments.departmentName FROM departments`)
    .then(([rows]) => (departments = rows.map((row) => row.name)))
    .catch((error) => console.log(error));
  return departments;
};

const deleteDepartmentHandler = async () => {
  await updateServer();
  inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose department to delete",
        choices: allDepartments,
      },
    ])
    .then(function (answer) {
      if (answer.department === "Cancel") {
        againHandler();
      } else {
        const sql = `DELETE FROM departments WHERE id = ?`;
        const params = answer.department;
        db.query(sql, params, (error, res) => {
          if (error) throw error;
        });
        console.clear();
        updateServer();
        againHandler();
      }
    })
    .catch((error) => console.log(error));
};

const againHandler = () => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "again",
        message: "Would you like to do anything else?",
      },
    ])
    .then(({ again }) => {
      if (again) {
        mainMenu();
      } else {
        exitApp();
      }
    });
};

const exitApp = () => {
  console.log("Thank you for visiting our Employee Tracker!");
  process.exit(1);
};

updateServer();
mainMenu();
