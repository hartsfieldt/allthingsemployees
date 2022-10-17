const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql2");
const db = require("./db/connection");

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

const mainMenu = async () => {
  console.clear();
  console.log(`${logo}`);
  await inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Please make a selections",
        choices: ["View all departments", "Delete Department"],
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
  }
  if (choice !== "Quit") {
    await againHandler();
  }
};

const getAllDepartments = async () => {
  await db
    .promise()
    .query(`SELECT * FROM departments`)
    .then(([rows]) => console.log(cTable.getTable(rows)))
    .catch((error) => console.log(error));
};
const createDepartmentsList = async () => {
  let departments;
  await db
    .promise()
    .query(`SELECT departments.departmentName FROM departments`)
    .then(([rows]) => (departments = rows.map((row) => row.name)))
    .catch((error) => console.log(error));
  return departments;
};

const deleteDepartmentHandler = async () => {
  let departments = await createDepartmentsList();
  await inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose department to delete",
        choices: departments,
      },
    ])
    .then((choice) => deleteDepartment(choice))
    .catch((error) => console.log(error));
};

const deleteDepartment = async ({ department }) => {
  let departmentsArray;
  await db
    .promise()
    .query(`SELECT * FROM departments WHERE name = '${department}'`)
    .then(([rows]) => (departmentsArray = rows))
    .catch((error) => console.log(error));
  if (departmentsArray.length > 1) {
    console.log(cTable.getTable(departmentsArray));
  }
};

const againHandler = async () => {
  await inquirer
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
  db.end();
};

mainMenu();
