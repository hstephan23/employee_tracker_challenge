const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

class Question {
    constructor (option) {
        this.option = option;
        this.db = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: '',
                database: 'employee_db'
        });
    };

    async updateEmployee() {
        console.log('Updated the employee!');
    };

    async pullOptionsFromUpdate() {
        const sql = `SELECT first_name, last_name FROM employee`;
        try {
            const [results] = await this.db.query(sql);
            let options = [];
            for (let i = 0; i < results.length; i++) {
                const name = results[i].first_name + ' ' + results[i].last_name;
                options.push(name);
            }
            return options;
        } catch (error) {
            console.log(error);
        }
    };

    async viewRoles () {
        const sql = `SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department on role.department_id = department.id ORDER BY role.id;`;
        try {
            const [results] = await this.db.query(sql);
            const formattedData = results.map(result => ({
                id: result.id,
                title: result.title,
                department: result.department,
                salary: result.salary,
            }));
            console.table(formattedData);
            return results;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
    
    async addRole(title, salary, department) {
        try {
            const connection = await this.db.getConnection();
            let department_id;

            if (department === 'Engineering') {
                department_id = 1;
            } else if (department === 'Web Development') {
                department_id = 2;
            } else if (department === 'Administration') {
                department_id = 3;
            } else{
                department_id = 0;
            }

            const sql = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, ${department_id});`
            const [results] = await this.db.query(sql);
            connection.release();
            console.log("Added the role!", results);
        } catch (error) {
            console.log(error);
        } finally {
            await this.db.end();
        }
        
    };

    async viewDepartments() {
        const sql = `SELECT department.id AS id, department.name AS name FROM department ORDER BY department.id;`;
        try {
            const [results] = await this.db.query(sql);
            const formattedData = results.map(result => ({
                id: result.id,
                name: result.name
            }));
            console.table(formattedData);
            return results;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async addDepartment(name) {
        try {
            const connection = await this.db.getConnection();
            const sql = `INSERT INTO department (name) VALUES ('${name}');`
            const [result] = await this.db.query(sql);

            connection.release();
            console.log('Added the department!');
        } catch (error) {
            console.log(error);
        } finally {
            await this.db.end();
        }
    };

    async viewEmployees() {
        const sql = `SELECT employee.id AS id, employee.first_name AS first_name, role.title AS title, department.name AS department, role.salary AS salary, employee.manager_id AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;`;
        try {
            const [results] = await this.db.query(sql);
            const formattedData = results.map(result => ({
                id: result.id,
                first_name: result.first_name,
                title: result.title,
                department: result.department,
                salary: result.salary,
                manager: result.manager
            }));
            console.table(formattedData);
            return results;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async addEmployee(firstName, lastName, position, manager) {
        try {
            const connection = await this.db.getConnection();
            const role_id = `SELECT id FROM role WHERE title = '${position}'`
            const [result] = await this.db.query(role_id);
            console.log(result);
            const id = result[0].id;
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${id}, ${manager})`;
            const [results] = await this.db.query(sql);

            connection.release();
            console.log('Added the employee!');
        } catch (error) {
            console.log(error);
        } finally {
            await this.db.end();
        }
    ;}

    async quit() {
        console.log('Goodbye!');
    };

    async pullOptionsFromDB() {
        const sql = `SELECT title FROM role`;
        try {
            const [results] = await this.db.query(sql);
            let options = [];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].title);
            }
            return options;
        } catch (error) {
            console.log(error);
        }
    };

    static async promptUser() {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: ['Add Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View All Employees', 'Update Employee Role', 'Quit']
            }
        ])
    };

    static async promptRole() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'roleName',
                message: 'What is the name of the role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
               type: 'list',
               name: 'roleDepartment',
               message: 'Which department does the role belong to?',
               choices: ['Engineering', 'Web Development', 'Administration']
            }
        ])
    };

    static async promptDepartment() {
        return inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the department?'
            }
        ])
    };

    static async promptEmployee(options) {
        try {
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'firstName',
                    message: "What is the employee's first name?"
                },
                {
                    type: 'input',
                    name: 'lastName',
                    message: "What is the employee's last name?"
                },
                {
                    type: 'list',
                    name: 'position',
                    message: "What is the employee's role?",
                    choices: options
                },
                {
                    type: 'input',
                    name: 'manager',
                    message: "What is the employee's manager id?"
                }
            ])
        } catch (error) {
            console.log(error);
        }
    };

    static async promptUpdate(options) {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: options
            }
        ])
    };
};


module.exports = {
    Question,
};