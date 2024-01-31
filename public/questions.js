const inquirer = require('inquirer');
const mysql = require('mysql2/promise');

class Question {
    constructor (option) {
        this.option = option;
        this.db = mysql.createPool({
                host: 'localhost',
                user: 'root',
                password: 'kajTun-wykse4-myrmiv',
                database: 'employee_db'
        });
    };

    async updateEmployee() {
        console.log('Updated the employee!');
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

            const sql = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', '${salary}', ${department_id});`
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

    async addDepartment() {
        console.log('Added the department!');
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

    async quit() {
        console.log('Quit');
    };

    static async promptUser() {
        return inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: ['Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View All Employees', 'Quit']
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
    }
};


module.exports = {
    Question,
};