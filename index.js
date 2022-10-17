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
        choices: ["View all departments"],
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
