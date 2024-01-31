SELECT * 
FROM department;

SELECT * 
FROM role;

SELECT * 
FROM employee;

-- viewEmployees
SELECT 
    employee.id AS id, 
    employee.first_name AS first_name,
    role.title AS title,
    department.name AS department,
    role.salary AS salary,
    employee.manager_id AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
ORDER BY employee.id;

-- viewDepartments
SELECT 
    department.id AS id,
    department.name AS name
FROM department;
ORDER BY department.id

-- viewRoles
SELECT 
    role.id AS id, 
    role.title AS title,
    department.name AS department,
    role.salary AS salary
FROM role
JOIN department on role.department_id = department.id
ORDER BY role.id;

