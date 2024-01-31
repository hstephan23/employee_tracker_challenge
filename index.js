// import the class Question
const { Question } = require('./public/questions');

// get the while loop variable defined
let check = true;

(async () => {
    // image to populate at the start
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
    // while loop so that the options will apppear at the end of the piece unless it is gone to quit (cancelling the program)
    while (check) {
        // call the class instance, and get user input from the beginnnig function
        const userInput = await Question.promptUser();
        const chosenOption = new Question(userInput.options);
        // get the option and get it to a more useable error (don't worry about capitalization or spaces)
        const optionValue = chosenOption.option.toLowerCase().trim();
        // switch statement instead of if statment for speed
        switch (optionValue) {
            // first case, where the option chosen is "Add Employee"
            case 'add employee':
                // define the instance of a question for use inside the switch statement
                const employeeInstance = new Question();
                // get the options from the database
                const options = await employeeInstance.pullOptionsFromDB();
                const managerOptions = await employeeInstance.pullOptionsFromManager();
                // let the user input the next choices
                const employeeInput = await Question.promptEmployee(options, managerOptions);
                // run the logic for the chosen input
                await chosenOption.addEmployee(employeeInput.firstName, employeeInput.lastName, employeeInput.position, employeeInput.manager);
                break;
            case 'update employee role':
                // define the instance of a question for use inside the switch statement
                const updateInstance = new Question();
                // get the options from the database
                const updateOptions = await updateInstance.pullOptionsFromUpdate();
                const positionOptions = await updateInstance.pullOptionsFromPosition();
                // let the user input the next choices
                const updateInput = await Question.promptUpdate(updateOptions, positionOptions);
                // run the logic for the chosen input
                await chosenOption.updateEmployee(updateInput.employee, updateInput.newPosition);
                break;
            case 'view all roles':
                await chosenOption.viewRoles();
                break;
            case 'add role':
                // define the instance of a question for use inside the switch statement
                const roleInstance = new Question();
                // get the options from the database
                const roleOptions = await roleInstance.pullOptionsFromDepartment();
                const roleInput = await Question.promptRole(roleOptions);
                // run the logic for the chosen input
                await chosenOption.addRole(roleInput.roleName, roleInput.salary, roleInput.roleDepartment);
                break;
            case 'view all departments':
                // run the logic for chosen input
                await chosenOption.viewDepartments();
                break;
            case 'add department':
                // get the options from the database
                const departmentInput = await Question.promptDepartment();
                // run the logic for the chosen input
                await chosenOption.addDepartment(departmentInput.departmentName);
                break;
            case 'view all employees':
                // run the logic for the chosen input
                await chosenOption.viewEmployees();
                break;
            case 'update employee manager':
                // define the instance of a question for use inside the switch statement
                const updateManagerInstance = new Question();
                // get the options from the database
                const employeeOptions = await updateManagerInstance.pullOptionsFromEmployees();
                const updateManagerOptions = await updateManagerInstance.pullOptionsFromManager();
                // let the user decide the next input
                const updateManagerInput = await Question.promptUpdateManager(employeeOptions, updateManagerOptions);
                // run the logic for the chosen input
                await chosenOption.updateManager(updateManagerInput.manager, updateManagerInput.employee);
                break;
            case 'view employees by manager':
                // define the instance of a question for use inside the switch statement
                const managerInstance = new Question();
                // get the options from the database
                const viewManagerOptions = await managerInstance.pullOptionsFromManager();
                // let the user decide the next input
                const viewManagerInput = await Question.promptManagerView(viewManagerOptions);
                // run the logic for the chosen input
                await chosenOption.viewByManager(viewManagerInput.manager);
                break;
            case 'view employees by department':
                // define the instance of a question for use inside the switch statement
                const departmentInstance = new Question();
                // get the options from the database
                const viewDepartmentOptions = await departmentInstance.pullOptionsFromDepartment();
                // let the user decide the next input
                const viewDepartmentInput = await Question.promptViewByDepartment(viewDepartmentOptions);
                // run the logic for the chosen input 
                await chosenOption.viewByDepartment(viewDepartmentInput.department);
                break;
            case 'delete department, role, or employee':
                // let the user decide the next input
                const firstChoice = await Question.promptDelete();
                // clean the data 
                const firstChoiceReady = firstChoice.delete.toLowerCase().trim();
                // definse the instance of a question for use insdie the switch statement
                const deleteInstance = new Question();
                // use an if statment with the cleaned data 
                if (firstChoiceReady === 'department') {
                    // get the options from the database
                    const deleteDepartmentOptions = await deleteInstance.pullOptionsFromDepartment();
                    // let the user decide the next input
                    const deleteDepartmentInput = await Question.promptDeleteDepartment(deleteDepartmentOptions);
                    // run the logic for the chosen input
                    await chosenOption.deleteDepartment(deleteDepartmentInput.department);
                } else if (firstChoiceReady === 'role') {
                    // get the options from the database
                    const deletePositionOptions = await deleteInstance.pullOptionsFromPosition();
                    // let the user decide the next input
                    const deletePositionInput = await Question.promptDeletePosition(deletePositionOptions);
                    // run the logic for the chosen input
                    await chosenOption.deletePosition(deletePositionInput.role);
                } else if (firstChoiceReady === 'employee') {
                    // get the options from the database
                    const deleteEmployeeOptions = await deleteInstance.pullOptionsFromEmployees();
                    // let the user decide the next input
                    const deleteEmployeeInput = await Question.promptDeleteEmployee(deleteEmployeeOptions);
                    // run the logic for the chosen input
                    await chosenOption.deleteEmployee(deleteEmployeeInput.employee);
                }
                // display a successful deletion
                console.log(`Successfully deleted that ${firstChoiceReady}!`);
                break;
            case 'view budget of department':
                // define the instance of a question for use inside the switch statement
                const budgetInstance = new Question();
                // get the options from the database
                const viewDepartments = await budgetInstance.pullOptionsFromDepartment();
                // let the user decide the next input
                const budgetInput = await Question.promptViewByBudget(viewDepartments);
                // get the logic for the chosen input
                await chosenOption.viewBudget(budgetInput.department);
                break;
            case 'quit':
                // quit when the option is chosen
                await chosenOption.quit();
                check = false;
                break;
            default:
                // default to catch any errors
                console.log('Invalid option');
                break;
        }
    };
})();