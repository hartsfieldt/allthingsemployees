INSERT INTO departments (departmentName)
VALUES ("Management"),
    ("Administration"),
    ("Web Development"),
    ("Sales and Marketing"),
    ("Human Resources"),
    ("Accounting");
INSERT INTO roles (title, salary, department_id)
VALUES ("CEO", "225000.00", 1),
    ("COO", "200000.00", 1),
    (
        "Head of Sales and Marketing",
        "125000.00",
        1
    ),
    ("HR Manager", "75000.00", 1),
    ("Accounting Manager", "75000.00", 1),
    ("Executive Assistant", "65000.00", 2),
    ("Support Staff", "50000.00", 2),
    ("Project Coordinator", "70000.00", 2),
    ("Full Stack Developer", "89000.00", 3),
    ("Sales Consultant", "55000.00", 4),
    ("HR Representitive", "60000.00", 5),
    ("Accounting Representitive", "60000.00", 6);
INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ("Scott", "Hartsfield", 1, 1),
    ("Teresa", "Hartsfield", 2, 1),
    ("Craig", "Sobel", 3, 1),
    ("Danielle", "Payen", 2, 1),
    ("Sarah", "Lane", 5, 2),
    ("Allie", "Harts", 6, 2),
    ("Jordan", "Sidhu", 12, 5),
    ("Kristin", "Thomas", 11, 4),
    ("Kevin", "Nguyen", 12, 5),
    ("Anna", "Tran", 10, 3),
    ("Jimmy", "Nguyen", 5, 2),
    ("Chloe", "Chau", 3, 2),
    ("Saundra", "Lathan", 10, 3),
    ("Robert", "McKenleigh", 8, 2),
    ("Grace", "Sloop", 7, 2),
    ("Dennis", "Horn", 4, 2),
    ("Patrick", "MacDonald", 9, 2);