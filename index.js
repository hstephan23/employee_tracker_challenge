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
            case 'update employee role':
                await Question.updateEmployee();
                break;
            case 'view all roles':
                await Question.viewRoles();
                break;
            case 'add role':
                await Question.addRole();
                break;
            case 'view all departments':
                await Question.viewDepartments();
                break;
            case 'add department':
                await Question.addDepartment();
                break;
            case 'view all employees':
                await Question.viewEmployees();
                break;
            case 'quit':
                await Question.quit();
                check = false;
                break;
            default:
                console.log('Invalid option', chosenOption.option);
                break;
        }
    };
})();