INSERT INTO department (id, name) 
VALUES (001, 'Engineering'),
    (002, 'Web Development'),
    (003, 'Administration');

INSERT INTO role (id, title, salary, department_id)
VALUES (001, 'Engineer', 99999.00, 001),
    (002, 'Administrator Assistant', 49999.00, 003),
    (003, 'Junior Web Developer', 74999.00, 002),
    (004, 'Senior Web Developer', 89999.00, 002),
    (005, 'CEO', 149999.00, 003);

INSERT INTO employee (id, first_name, last_name, role_id, manager_id)
VALUES (001, 'Harrison', 'Stephan', 003, 213),
    (002, 'Isabelle', 'Nelson', 005, 001),
    (003, 'John', 'Doe', 001, 213),
    (004, 'Steve', 'Nelson', 003, 213),
    (005, 'Rick', 'Johnson', 002, 001),
    (006, 'Steve', 'Jobs', 004, 001);