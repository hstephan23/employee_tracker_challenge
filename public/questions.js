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
        const sql = `SELECT employee.id AS id, employee.first_name AS first_name, role.title AS title, department.name AS department, role.salary AS salary, employee.manager_id AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id;`;
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
    
    async addRole() {
        console.log('Add role');
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
        console.log('Add department');
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
};


module.exports = {
    Question,
};