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
                const managerOptions = await employeeInstance.pullOptionsFromManager();
                const employeeInput = await Question.promptEmployee(options, managerOptions);
                await chosenOption.addEmployee(employeeInput.firstName, employeeInput.lastName, employeeInput.position, employeeInput.manager);
                break;
            case 'update employee role':
                const updateInstance = new Question();
                const updateOptions = await updateInstance.pullOptionsFromUpdate();
                const positionOptions = await updateInstance.pullOptionsFromPosition();
                const updateInput = await Question.promptUpdate(updateOptions, positionOptions);
                await chosenOption.updateEmployee(updateInput.employee, updateInput.newPosition);
                break;
            case 'view all roles':
                await chosenOption.viewRoles();
                break;
            case 'add role':
                const roleInstance = new Question();
                const roleOptions = await roleInstance.pullOptionsFromDepartment();
                const roleInput = await Question.promptRole(roleOptions);
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
            case 'update employee manager':
                const updateManagerInstance = new Question();
                const employeeOptions = await updateManagerInstance.pullOptionsFromEmployees();
                const updateManagerOptions = await updateManagerInstance.pullOptionsFromManager();
                const updateManagerInput = await Question.promptUpdateManager(employeeOptions, updateManagerOptions);
                await chosenOption.updateManager(updateManagerInput.manager, updateManagerInput.employee);
                break;
            case 'view employees by manager':
                const managerInstance = new Question();
                const viewManagerOptions = await managerInstance.pullOptionsFromManager();
                const viewManagerInput = await Question.promptManagerView(viewManagerOptions);
                await chosenOption.viewByManager(viewManagerInput.manager);
                break;
            case 'view employees by department':
                const departmentInstance = new Question();
                const viewDepartmentOptions = await departmentInstance.pullOptionsFromDepartment();
                const viewDepartmentInput = await Question.promptViewByDepartment(viewDepartmentOptions);
                await chosenOption.viewByDepartment(viewDepartmentInput.department);
                console.log('employes by department');
                break;
            case 'delete department, roles, or employee':
                console.log('delete');
                break;
            case 'view budget of department':
                console.log('budget');
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