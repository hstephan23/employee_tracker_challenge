const inquirer = require('inquirer');
class Question {
    constructor (option) {
        this.option = option;
    };

    updateEmplopyee () {
        console.log('update');
        
    };

    viewRoles () {
        console.log('View role');
    };

    addRole() {
        console.log('Add role');
    };

    viewDepartments() {
        console.log('View departments');
    };

    addDepartment() {
        console.log('Add department');
    };

    viewEmployees() {
        console.log('View employees');
    };

    quit() {
        console.log('Quit');
    };

    static promptUser() {
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