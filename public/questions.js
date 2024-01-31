const inquirer = require('inquirer');
const mysql = require('mysql2');

class Question {
    constructor (option) {
        this.option = option;
    };

    static async updateEmployee () {
        console.log('update');
    };

    static async viewRoles () {
        console.log('View role');
    };
    
    static async addRole() {
        console.log('Add role');
    };

    static async viewDepartments() {
        console.log('View departments');
    };

    static async addDepartment() {
        console.log('Add department');
    };

    static async viewEmployees() {
        console.log('View employees');
    };

    static async quit() {
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