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

    async updateEmployee(fullName, position) {
        try {
            const connection = await this.db.getConnection();
            const arrayOfName = fullName.split(' ');
            const firstName = arrayOfName[0].trim();
            const lastName = arrayOfName[1].trim();
            const positionSql = `SELECT id FROM role WHERE title = '${position}'`
            const [result] = await this.db.query(positionSql);
            const sql = `UPDATE employee SET role_id = ${result[0].id} WHERE first_name = '${firstName}' AND last_name = '${lastName}';`;
            const [results] = await this.db.query(sql);
            connection.release();
            console.log('Updated the employee!');
        } catch (error) {
            console.log(error);
        } finally {
            await this.db.end();
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
            const departmentSql = `SELECT id FROM department WHERE name = '${department}';`;
            const [result] = await this.db.query(departmentSql);

            const sql = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, ${result[0].id});`
            const [results] = await this.db.query(sql);
            connection.release();
            console.log("Added the role!");
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
        const sql = `SELECT employee.id AS id, employee.first_name AS first_name, role.title AS title, department.name AS department, role.salary AS salary, manager.name AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id JOIN manager ON employee.manager_id = manager.id ORDER BY employee.id;`;
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
            const role_id = `SELECT id FROM role WHERE title = '${position}';`
            const [result] = await this.db.query(role_id);
            const id = result[0].id;
            const managerName = `SELECT id FROM manager WHERE name = '${manager}';`
            const [managerResult] = await this.db.query(managerName);
            const managerId = managerResult[0].id;
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${id}, ${managerId})`;
            const [results] = await this.db.query(sql);

            connection.release();
            console.log('Added the employee!');
        } catch (error) {
            console.log(error);
        } finally {
            await this.db.end();
        }
    ;}
    
    async viewByManager(manager) {
        try {
            const sql = `SELECT employee.first_name as first_name, employee.last_name as last_name, manager.name as Manager FROM employee JOIN manager on employee.manager_id = manager.id WHERE manager.name = '${manager}' ORDER BY manager.name;`
            const [results] = await this.db.query(sql);
            const formattedData = results.map(result => ({
                first_name: result.first_name,
                last_name: result.last_name,
                manager: result.Manager
            }));
            console.table(formattedData);
            return results;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    async quit() {
        console.log('Goodbye!');
    };

    async pullOptionsFromManager() {
        const sql = `SELECT name from manager`;
        try {
            const [results] = await this.db.query(sql);
            let options =[];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].name);
            }
            return options
        } catch (error) {
            console.log(error);
        }
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
    
    async pullOptionsFromPosition() {
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

    async pullOptionsFromDepartment() {
        const sql = `SELECT name FROM department;`;
        try {
            const [results] = await this.db.query(sql);
            let options = [];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].name);
            }
            return options
        } catch (error) {
            console.log(error);
        }
    };
    
    async pullOptionsFromEmployees() {
        const sql = 'Select first_name, last_name FROM employee;'
        try {
            const [results] = await this.db.query(sql);
            let options = [];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].first_name + ' ' + results[i].last_name);
            }
            return options
        } catch (error) {
            console.log(error);
        }
    }
    static async promptUser() {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: ['Add Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View All Employees', 'Update Employee Role', 'Update Employee Manager', 'View Employees By Manager', 'View Employees By Department', 'Delete Department, Roles, or Employee', 'View Budget of Department', 'Quit']
            }
        ])
    };

    static async promptRole(options) {
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
               choices: options
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

    static async promptEmployee(options, managerOptions) {
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
                    type: 'list',
                    name: 'manager',
                    message: "Who is the manager?",
                    choices: managerOptions
                }
            ])
        } catch (error) {
            console.log(error);
        }
    };

    static async promptUpdate(options, optionsPosition) {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: options
            },
            {
                type: 'list',
                name: 'newPosition',
                message: 'What is their role going to be?',
                choices: optionsPosition
            }
        ])
    };

    static async promptManagerView(options) {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager would you like to view?',
                choices: options
            }
        ])
    };

    static async promptUpdateManager(options, managerOptions) {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's manager would you like to update?",
                choices: options
            }, 
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the new manager?',
                choices: managerOptions
            }
        ])
    };
};


module.exports = {
    Question,
};