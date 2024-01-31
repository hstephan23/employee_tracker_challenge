INSERT INTO department (name) 
VALUES ('Engineering'),
    ('Web Development'),
    ('Administration');

INSERT INTO role (title, salary, department_id)
VALUES ('Engineer', 99999.00, 001),
    ('Administrator Assistant', 49999.00, 003),
    ('Junior Web Developer', 74999.00, 002),
    ('Senior Web Developer', 89999.00, 002),
    ('CEO', 149999.00, 003);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Harrison', 'Stephan', 003, 213),
    ('Isabelle', 'Nelson', 005, null),
    ('John', 'Doe', 001, 213),
    ('Steve', 'Nelson', 003, 213),
    ('Rick', 'Johnson', 002, 001),
    ('Steve', 'Jobs', 004, 001);
