SELECT * 
FROM department;

SELECT * 
FROM role;

SELECT * 
FROM employee;


SELECT department.id AS id, department.name AS name, role.title AS title
FROM department
JOIN role ON department.id = role.department_id;

