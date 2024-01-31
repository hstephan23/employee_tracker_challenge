const inquirer = require('inquirer');

function prompts () {
    inquirer
        .prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                options: ['Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View All employees', 'Quit']
            }
        ])
        .then(
            console.log(options)
        )
}

prompts();