SELECT * 
FROM department;

SELECT * 
FROM role;

SELECT * 
FROM employee;

SELECT *
FROM manager;

-- viewEmployees
SELECT 
    employee.id AS id, 
    employee.first_name AS first_name,
    role.title AS title,
    department.name AS department,
    role.salary AS salary,
    manager.name AS manager
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id
JOIN manager ON employee.manager_id = manager.id
ORDER BY employee.id;

-- viewDepartments
SELECT 
    department.id AS id,
    department.name AS name
FROM department
ORDER BY department.id;

-- viewRoles
SELECT 
    role.id AS id, 
    role.title AS title,
    department.name AS department,
    role.salary AS salary
FROM role
JOIN department on role.department_id = department.id
ORDER BY role.id;

-- testing the basic 
SELECT id 
FROM role 
WHERE title = 'Junior Web Developer';

-- selecting employees by manager
SELECT 
    employee.first_name as 'First Name',
    employee.last_name as 'Last Name',
    manager.name as Manager
FROM employee
JOIN manager on employee.manager_id = manager.id
WHERE manager.name = 'Steve Jobs'
ORDER BY manager.name;

