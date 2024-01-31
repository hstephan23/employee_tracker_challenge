const { Question } = require('./public/questions');

let check = true;

(async () => {
    console.log(`._________________________________________________.
|                                                 |
|  _____                 _                        |
| | ____|_ __ __   _ __ | | ___  _   _  ___  ___  |
| |  _| | '_ ' _ \\| '  \\| |/   \\| | | |/ _ \\/ _ \\ |
| | |___| | | | | | |_) | | (_) | |_| |  __/  __/ |
| |_____|_| |_| |_| .__/|_|\\___/\\___, |\\___|\\___| |
|                 |_|            |___/            |
|                                                 |
|  __  __                                         |
| |  \\/  | __ _ _ ___  __ _  __ _  ___ _ __       |
| | |\\/| |/ _' | '_  \\/ _' |/ _' |/ _ \\ '__|      |
| | |  | | ( | | | | | ( | | ( | |  __/ |         |
| |_|  |_|\\__,_|_| |_|\\__,_|\\__, |\\___|_|         |
|                           |___/                 |
'-------------------------------------------------'`)
    while (check) {
        const userInput = await Question.promptUser();
        const chosenOption = new Question(userInput.options);
        const optionValue = chosenOption.option.toLowerCase().trim();
        switch (optionValue) {
            case 'add employee':
                const employeeInstance = new Question();
                const options = await employeeInstance.pullOptionsFromDB();
                const employeeInput = await Question.promptEmployee(options);
                await chosenOption.addEmployee(employeeInput.firstName, employeeInput.lastName, employeeInput.position, employeeInput.manager);
                break;
            case 'update employee role':
                await chosenOption.updateEmployee();
                break;
            case 'view all roles':
                await chosenOption.viewRoles();
                break;
            case 'add role':
                const roleInput = await Question.promptRole();
                await chosenOption.addRole(roleInput.roleName, roleInput.salary, roleInput.roleDepartment);
                break;
            case 'view all departments':
                await chosenOption.viewDepartments();
                break;
            case 'add department':
                const departmentInput = await Question.promptDepartment();
                await chosenOption.addDepartment(departmentInput.departmentName);
                break;
            case 'view all employees':
                await chosenOption.viewEmployees();
                break;
            case 'quit':
                await chosenOption.quit();
                check = false;
                break;
            default:
                console.log('Invalid option', chosenOption.option);
                break;
        }
    };
})();