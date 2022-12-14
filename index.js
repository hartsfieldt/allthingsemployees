const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
let allDepartments;
let allRoles;
let allEmployees;

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
  await db
    .promise()
    .query("SELECT * FROM roles")
    .then(([res]) => {
      allRoles = res.map((role) => ({
        name: role.title,
        value: role.id,
      }));
      allRoles.push("Cancel");
    });
  await db
    .promise()
    .query("SELECT * FROM employees")
    .then(([res]) => {
      allEmployees = res.map((employee) => ({
        name: `${employee.first_name} ${employee.last_name}`,
        value: employee.id,
      }));
      allEmployees.push("Cancel");
    });
};

const mainMenu = () => {
  updateServer();
  console.clear();
  console.log(`${logo}`);
  inquirer
    .prompt([
      {
        type: "list",
        name: "options",
        message: "Please make a selections",
        choices: [
          "View all Departments",
          "Delete Department",
          "View all Roles",
          "Delete Role",
          "View All Employees",
          "Delete Employee",
          "Add an Employee",
          "Add a Role",
          "Add a Department",
          "Update an Employee Mgr.",
          "View Department Budget",
          "Exit Menu",
        ],
      },
    ])
    .then((choice) => choiceHandler(choice))
    .catch((error) => console.error(error));
};

const choiceHandler = async ({ options: choice }) => {
  switch (choice) {
    case "View all Departments":
      await getAllDepartments();
      break;
    case "Delete Department":
      await deleteDepartmentHandler();
      break;
    case "View all Roles":
      await getAllRoles();
      break;
    case "Delete Role":
      await deleteRoleHandler();
      break;
    case "View All Employees":
      await getAllEmployees();
      break;
    case "Delete Employee":
      await deleteEmployee();
      break;
    case "Add an Employee":
      await addEmployee();
      break;
    case "Add a Role":
      await addRole();
      break;
    case "Add a Department":
      await addDepartmentHandler();
      break;
    case "Update an Employee Mgr.":
      await updateMgr();
      break;
    case "View Department Budget":
      await viewDeptBudget();
      break;
  }
  // if (choice !== "Quit") {
  //   await againHandler();
  // }
};

const addDepartmentHandler = async () => {
  console.clear();
  await inquirer
    .prompt([
      {
        type: "input",
        name: "departmentName",
        message: "Enter a name for the Department",
      },
    ])
    .then((department) => addDepartment(department))
    .catch((err) => console.log(err));
};

const addDepartment = async ({ departmentName }) => {
  console.clear();
  await db
    .promise()
    .query(
      `
  INSERT INTO departments (departmentName)
  VALUES ("${departmentName}")
  `
    )
    .then(() => {
      console.log("The department was added.");
      setTimeout(() => {
        mainMenu();
      }, 3000);
    })
    .catch((err) => console.log(err));
};

const getAllDepartments = async () => {
  console.clear();
  await db
    .promise()
    .query(`SELECT id AS 'ID', departmentName AS 'Department' FROM departments`)
    .then(([rows]) => {
      console.log(cTable.getTable(rows));
      setTimeout(() => {
        againHandler();
      }, 3000);
    })
    .catch((error) => console.log(error));
};

const deleteDepartmentHandler = async () => {
  console.clear();
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
    .then((answer) => {
      if (answer.department === "Cancel") {
        mainMenu();
      } else {
        const sql = `DELETE FROM departments WHERE id = ?`;
        const params = answer.department;
        db.query(sql, params, (error, res) => {
          if (error) throw error;
        });
        console.clear();
        console.log("Department Deleted");
        setTimeout(() => {
          mainMenu();
        }, 3000);
      }
    })
    .catch((err) => console.log(err));
};

const getAllRoles = async () => {
  console.clear();
  await db
    .promise()
    .query(
      `
      SELECT title AS Roles, salary AS Salary, departmentName as Department
      FROM roles
      LEFT JOIN departments
      ON roles.department_id = departments.id
      `
    )
    .then(([rows]) => {
      console.log(cTable.getTable(rows));
      setTimeout(() => {
        againHandler();
      }, 3000);
    })
    .catch((err) => console.log(err));
};

const addRole = async () => {
  console.clear();
  await inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Enter a Role name",
      },
      {
        type: "number",
        name: "salary",
        message: "What is the salary for this role?",
      },
      {
        type: "list",
        name: "department",
        message: "What department would you like to add this role to?",
        choices: allDepartments,
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO roles (title, salary, department_id) VALUES ("${answer.roleName}", "${answer.salary}", "${answer.department}");`;
      db.query(sql, (err, res) => {
        if (err) throw err;
        console.log("Role was added");
        setTimeout(() => {
          mainMenu();
        }, 3000);
      });
    })
    .catch((err) => console.log(err));
};

const deleteRoleHandler = async () => {
  console.clear();
  await inquirer
    .prompt({
      type: "list",
      name: "roleList",
      message: "Choose a role to remove or choose CANCEL to cancel",
      choices: allRoles,
    })
    .then((answer) => {
      if (answer.roleList === "Cancel") {
        mainMenu();
      } else {
        const sql = `DELETE FROM roles WHERE id = ?`;
        const params = answer.roleList;
        db.query(sql, params, (err, res) => {
          if (err) throw err;
        });
        console.clear();
        console.log("Role Deleted");
        setTimeout(() => {
          mainMenu();
        }, 3000);
      }
    });
};

const getAllEmployees = async () => {
  console.clear();
  await db
    .promise()
    .query(
      `
      SELECT
      CONCAT(e.first_name,' ',e.last_name) AS Employee,
      roles.title AS Title,
      roles.salary as Salary,
      CONCAT(m.first_name,' ',m.last_name) AS Manager,
      departments.departmentName AS Department
      FROM employees e
      LEFT JOIN roles
      ON roles.id = e.role_id
      LEFT JOIN departments
      ON roles.department_id = departments.id
      LEFT JOIN employees m ON e.manager_id = m.id;
    `
    )
    .then(([rows]) => {
      console.log(cTable.getTable(rows));
      setTimeout(() => {
        againHandler();
      }, 3000);
    })
    .catch((err) => console.log(err));
};

const addEmployee = async () => {
  console.clear();
  await inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Enter the employees First Name",
      },
      {
        type: "input",
        name: "last_name",
        message: "Enter the employees Last Name",
      },
      {
        type: "list",
        name: "employee_role",
        message: "Enter the employees role",
        choices: allRoles,
      },
    ])
    .then((answer) => {
      const sql = `INSERT INTO employees SET ?`;
      const params = {
        first_name: answer.first_name,
        last_name: answer.last_name,
        role_id: answer.employee_role,
      };
      db.query(sql, params, (err, res) => {
        if (err) throw err;
        console.log("Employee was added");
        setTimeout(() => {
          mainMenu();
        }, 3000);
      });
    });
};

const updateMgr = async () => {
  console.clear();
  await inquirer
    .prompt([
      {
        type: "list",
        name: "employeeList",
        message: "Choose the employee whose manager you would like to change",
        choices: allEmployees,
      },
      {
        type: "list",
        name: "managerList",
        message: "Choose a manager for the employee",
        choices: allEmployees,
      },
    ])
    .then((answer) => {
      const sql = `UPDATE employees SET manager_id = ? WHERE id = ?`;
      const params = [answer.managerList, answer.employeeList];
      db.query(sql, params, (err, res) => {
        if (err) throw err;
        console.log("The employees manager was changed successfully");
        setTimeout(() => {
          mainMenu();
        }, 3000);
      });
    });
};

const deleteEmployee = async () => {
  console.clear();
  await updateServer();
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        message: "Choose employee to delete",
        choices: allEmployees,
      },
    ])
    .then((answer) => {
      if (answer.employee === "Cancel") {
        mainMenu();
      } else {
        const sql = `DELETE FROM employees WHERE id = ?`;
        const params = answer.employee;
        db.query(sql, params, (error, res) => {
          if (error) throw error;
          console.log("Employee was deleted");
          setTimeout(() => {
            mainMenu();
          }, 3000);
        });
      }
    })
    .catch((error) => console.log(error));
};

const viewDeptBudget = async () => {
  console.clear();
  await inquirer
    .prompt([
      {
        type: "list",
        name: "department",
        message: "Choose a department",
        choices: allDepartments,
      },
    ])
    .then((answer) => {
      const sql = `
        SELECT SUM (salary)
        AS "Total Salary"
        FROM departments
        LEFT JOIN roles
        ON roles.department_id = departments.id
        WHERE departments.id = ?
        `;
      const params = answer.department;
      db.query(sql, params, (err, res) => {
        if (err) throw err;
        console.table(res);
        setTimeout(() => {
          againHandler();
        }, 3000);
      });
    });
};

function againHandler() {
  setTimeout(() => {
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
  }, 3000);
}

const exitApp = () => {
  console.log("Thank you for visiting our Employee Tracker!");
  process.exit(1);
};

mainMenu();
