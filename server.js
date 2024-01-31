const { Question } = require('./public/questions');

(async () => {
    let check = true;
    while (check) {
        const userInput = await Question.promptUser();

        const chosenOption = new Question (
            userInput.option
        );
        if (chosenOption === 'Update Employee Role') {
            Question.updateEmployee();
        } else if (chosenOption === 'View All Roles') {
            Question.viewRoles();
        } else if (chosenOption === 'Add Role') {
            Question.addRole();
        } else if (chosenOption === 'View All Departments') {
            Question.viewDepartments();
        } else if (chosenOption === 'Add Department') {
            Question.addDepartment();
        } else if (chosenOption === 'View All Employees') {
            Question.ViewEmployees();
        } else if (chosenOption === 'Quit') {
            Question.quit();
            check = false;
        } else {
            check = false;
        }
    }
})();