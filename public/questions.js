// import necessary pieces to the document
const inquirer = require('inquirer');
const mysql = require('mysql2/promise');
require('dotenv').config();

// initialize the question class
class Question {
    // create a constructor for the variables that will be reused
    constructor (option) {
        // the option variable is input
        this.option = option;
        // the this.db is the creating a connection to the database, will be reused frequently
        this.db = mysql.createPool({
            // used dotenv to protect data
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });
    };

    // method to update informationn of an employee, requires 2 parameters
    async updateEmployee(fullName, position) {
        try {
            // establish a new connection with the db
            const connection = await this.db.getConnection();
            // take the parameter and split the full name back into the first and last name pieces
            const arrayOfName = fullName.split(' ');
            // the first piece should be the first name and will be trimmed
            const firstName = arrayOfName[0].trim();
            // the second piece should be the second name and will be trimmed
            const lastName = arrayOfName[1].trim();
            // we need to gain their current role's id from the parameter passed in
            const positionSql = `SELECT id FROM role WHERE title = '${position}'`
            const [result] = await this.db.query(positionSql);
            // we create a query based on the informatin we found previously 
            const sql = `UPDATE employee SET role_id = ${result[0].id} WHERE first_name = '${firstName}' AND last_name = '${lastName}';`;
            // we set the results to a variable to get the data 
            const [results] = await this.db.query(sql);
            // we end the connection
            connection.release();
            // and display the message
            console.log('Updated the employee!');
        } catch (error) {
            console.log(error);
        } finally {
            // actually end the terminal
            await this.db.end();
        }
    };

    // method to view the roles at the current company
    async viewRoles () {
        // the query that will be used, tested in the query.sql file
        const sql = `SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary FROM role JOIN department on role.department_id = department.id ORDER BY role.id;`;
        // a try statement in case there is an error 
        try {
            // the results from the query
            const [results] = await this.db.query(sql);
            // formatting the data to be displayed in a table
            const formattedData = results.map(result => ({
                id: result.id,
                title: result.title,
                department: result.department,
                salary: result.salary,
            }));
            // using console.table to display the data
            console.table(formattedData);
            return results;
        // a catch statement to push the error if it occurs
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
    
    // method to add an additional role, requires 3 parameters
    async addRole(title, salary, department) {
        // a try statement for errors
        try {
            // establish a connection to the database
            const connection = await this.db.getConnection();
            // the query that will be used, tested in the query.sql file
            const departmentSql = `SELECT id FROM department WHERE name = '${department}';`;
            const [result] = await this.db.query(departmentSql);
            // the query that will be used, tested in the query.sql file
            const sql = `INSERT INTO role (title, salary, department_id) VALUES ('${title}', ${salary}, ${result[0].id});`
            const [results] = await this.db.query(sql);
            // release the connection
            connection.release();
            console.log("Added the role!");
        // a catch in case there is an error 
        } catch (error) {
            console.log(error);
        } finally {
            // end the database connection
            await this.db.end();
        }
        
    };

    // method to view the departments at the current company
    async viewDepartments() {
        // the query that will be used, tested in the query.sql file
        const sql = `SELECT department.id AS id, department.name AS name FROM department ORDER BY department.id;`;
        // the try statement to help catch errors
        try {
            // the results that pull from the db
            const [results] = await this.db.query(sql);
            // the results formmatted for display
            const formattedData = results.map(result => ({
                id: result.id,
                name: result.name
            }));
            // using console.table to display as a table instead of an object
            console.table(formattedData);
            return results;
        // the catch statement for errors
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // method to add an additional role, requires 1 parameter
    async addDepartment(name) {
        // a try statement to help catch errors
        try {
            // get a connection established
            const connection = await this.db.getConnection();
            // the query that will be used, tested in the query.sql file
            const sql = `INSERT INTO department (name) VALUES ('${name}');`;
            const [result] = await this.db.query(sql);
            // release the connection
            connection.release();
            // show message that it was successfully completed
            console.log('Added the department!');
        // a catch statement for the errors
        } catch (error) {
            console.log(error);
        } finally {
            await this.db.end();
        }
    };

    // method to view the employees
    async viewEmployees() {
        // the query that will be used, tested in the query.sql file
        const sql = `SELECT employee.id AS id, employee.first_name AS first_name, role.title AS title, department.name AS department, role.salary AS salary, IFNULL(manager.name, 'Self') AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id LEFT JOIN manager ON employee.manager_id = manager.id ORDER BY employee.id;`;
        // a try for errors
        try {
            // the results of the query
            const [results] = await this.db.query(sql);
            // formatting the data to be displayed
            const formattedData = results.map(result => ({
                id: result.id,
                first_name: result.first_name,
                title: result.title,
                department: result.department,
                salary: result.salary,
                manager: result.manager
            }));
            // console.table to display the formatted data
            console.table(formattedData);
            return results;
        // a catch for errors
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // method to add an employee, requires 4 parameters
    async addEmployee(firstName, lastName, position, manager) {
        // the try for errors
        try {
            // connecting to the database
            const connection = await this.db.getConnection();
            // preparing the data from the queries
            // the query that will be used, tested in the query.sql file
            const role_id = `SELECT id FROM role WHERE title = '${position}';`
            const [result] = await this.db.query(role_id);
            const id = result[0].id;
            // the query that will be used, tested in the query.sql file
            const managerName = `SELECT id FROM manager WHERE name = '${manager}';`
            const [managerResult] = await this.db.query(managerName);
            const managerId = managerResult[0].id;
            // the data here is pulled through the various prepared queries
            // the query that will be used, tested in the query.sql file
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${firstName}', '${lastName}', ${id}, ${managerId})`;
            const [results] = await this.db.query(sql);
            // release the connection
            connection.release();
            console.log('Added the employee!');
        } catch (error) {
            console.log(error);
        } finally {
            // end the connection
            await this.db.end();
        }
    ;}
    
    // method to view the managers
    async viewByManager(manager) {
        // try to help with errors
        try {
            // the query that will be used, tested in the query.sql file
            const sql = `SELECT employee.first_name as first_name, employee.last_name as last_name, manager.name as Manager FROM employee JOIN manager ON employee.manager_id = manager.id WHERE manager.name = '${manager}' ORDER BY manager.name;`;
            const [results] = await this.db.query(sql);
            // the data that needs to be formatted
            const formattedData = results.map(result => ({
                first_name: result.first_name,
                last_name: result.last_name,
                manager: result.Manager
            }));
            // formatted data is displayed in a table
            console.table(formattedData);
            return results;
        // catch to help with errors
        } catch (error) {
            console.log(error);
            throw error;
        }
    };
   
    // method to view the budget
    async viewBudget(department) {
        // try statement to reduce errors
        try {
            // the query that will be used, tested in the query.sql file
            const idSql = `SELECT role.id, department.name FROM role JOIN department ON role.department_id = department.id WHERE department.name = '${department}';`
            const [idResults] = await this.db.query(idSql);
            // need to create an array of all the data that is needed
            const idArray = [];
            for (let i = 0; i < idResults.length; i++) {
                idArray.push(`employee.role_id = ${idResults[i].id}`);
            }
            // joining the idString  to create a complete string for the query using the join statment
            const idString = idArray.join(' OR ');
            // the query that will be used, tested in the query.sql file
            const sql = `SELECT SUM(role.salary) AS total_sum, department.name AS department FROM role JOIN department ON role.department_id = department.id JOIN employee ON employee.role_id = role.id WHERE department.name = '${department}' AND (${idString}) GROUP BY department.name;`;
            const [results] = await this.db.query(sql);
            // format the data for display
            const formattedData = results.map(result => ({
                department: result.department,
                total_cost: result.total_sum
            }));
            // using console.table to display the items
            console.table(formattedData);
            return results;
            // catch for the purpose of errors
        } catch (error) {
            console.log('error');
            throw error;
        }
    }

    // method to view the employees by their department
    async viewByDepartment(department) {
        // try to prevent errors
        try {
            // the query that will be used, tested in the query.sql file
            const sql = `SELECT employee.first_name as first_name, employee.last_name as last_name, department.name AS department FROM employee JOIN role on employee.role_id = role.id JOIN department on role.department_id = department.id WHERE department.name = '${department}' ORDER BY employee.first_name`
            const [results] = await this.db.query(sql);
            // formatting the data for use
            const formattedData = results.map(result => ({
                first_name: result.first_name,
                last_name: result.last_name,
                department: result.department
            }));  
            // usingn console.table to display the data 
            console.table(formattedData);
            return results;  
        // catch for errors   
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // method to update the manager of an employee
    async updateManager(manager, employee) {
        // try to prevent errors
        try {
            // checking the connection
            const connection = await this.db.getConnection();
            // splitting the name into the first and last name pieces, trimming to clean the data
            const arrayOfName = employee.split(' ');
            const firstName = arrayOfName[0].trim();
            const lastName = arrayOfName[1].trim();
            // the query that will be used, tested in the query.sql file
            const managerSql = `SELECT id FROM manager WHERE name = '${manager}';`;
            const [result] = await this.db.query(managerSql);
            // the query that will be used, tested in the query.sql file
            const sql = `UPDATE employee SET manager_id = ${result[0].id} WHERE first_name = '${firstName}' AND last_name = '${lastName}';`
            const [results] = await this.db.query(sql);
            // releasing the connection
            connection.release();
            console.log('Updated the manager!');
        // catch for errors
        } catch (error) {
            console.log(error);
            // ending the connection
        } finally {
            await this.db.end();
        }
    };

    // method to delete the department
    async deleteDepartment(option) {
        // try to prevent errors
        try {
            // the query that will be used, tested in the query.sql file
            const sql = `DELETE FROM department WHERE name = '${option}';`;
            const [results] = await this.db.query(sql);
        // the catch for errors
        } catch (error) {
            console.log(error);
        }
    };

    // method to delete the position
    async deletePosition(option) {
        // the try statement to help prevent errors
        try {
            // the query that will be used, tested in the query.sql file
            const sql = `DELETE FROM role WHERE title = '${option}';`;
            const [result] = await this.db.query(sql);
        // the catch statement for the errors
        } catch (error) {
            console.log(error);
        } 
    };

    // method to delete the employee
    async deleteEmployee(option) {
        // try to help with errors
        try {
            // splitting the name into first and last, and trimming to clean the data
            const splitName = option.split(' ');
            const firstName = splitName[0].trim();
            const lastName = splitName[1].trim();
            // the query that will be used, tested in the query.sql file
            const sql = `DELETE FROM employee WHERE first_name = '${firstName}' AND last_name = '${lastName}';`;
            const [results] = await this.db.query(sql);
        // catch for errors
        } catch (error) {
            console.log(error);
        }
    };

    // method for quitting the loop
    async quit() {
        // display goodbye
        console.log('Goodbye!');
    };

    // method for displaying the options of managers
    async pullOptionsFromManager() {
        // the query that will be used, tested in the query.sql file
        const sql = `SELECT name from manager`;
        // the try to help with errors
        try {
            // the query results
            const [results] = await this.db.query(sql);
            // creating an array of options that can be used in inquirer
            let options =[];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].name);
            }
            // returning the options for use
            return options
        // the catch for the errors
        } catch (error) {
            console.log(error);
        }
    };

    // method for displaying the options of position titles
    async pullOptionsFromDB() {
        // the query that will be used, tested in the query.sql file
        const sql = `SELECT title FROM role`;
        // the try to help with errors
        try {
            // the results of the query
            const [results] = await this.db.query(sql);
            // the options as an array for use in inquirer
            let options = [];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].title);
            }
            // returning the options for use
            return options;
        // the catch for errors
        } catch (error) {
            console.log(error);
        }
    };

    // method for displaying the options of the employees 
    async pullOptionsFromUpdate() {
        // the query that will be used, tested in the query.sql file
        const sql = `SELECT first_name, last_name FROM employee`;
        // try for error protection
        try {
            // the results from the inquiry
            const [results] = await this.db.query(sql);
            // making an array for use in inquirer
            let options = [];
            for (let i = 0; i < results.length; i++) {
                // combining the first and last name
                const name = results[i].first_name + ' ' + results[i].last_name;
                options.push(name);
            }
            // returning the options for use
            return options;
        // catch for the errors
        } catch (error) {
            console.log(error);
        }
    };
    
    // method for displaying the options of the postion/role
    async pullOptionsFromPosition() {
        // the query that will be used, tested in the query.sql file
        const sql = `SELECT title FROM role`;
        // try to help prevent errors
        try {
            // the result of the query
            const [results] = await this.db.query(sql);
            // creating an array that can be returned and used by inquirer
            let options = [];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].title);
            } 
            // returning options for use 
            return options;
        // catch for errors
        } catch (error) {
            console.log(error);
        }
    };

    // method for displaying the options of the department
    async pullOptionsFromDepartment() {
        // the query that will be used, tested in the query.sql file
        const sql = `SELECT name FROM department;`;
        // try to help with errors
        try {
            // the results of the query
            const [results] = await this.db.query(sql);
            // creating an array that is used by inquirer
            let options = [];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].name);
            }
            // returning options for use
            return options;
        // catch the errors
        } catch (error) {
            console.log(error);
        }
    };
    
    // method for displaying the options of the employees
    async pullOptionsFromEmployees() {
        // the query that will be used, tested in the query.sql file
        const sql = 'SELECT first_name, last_name FROM employee;'
        // testing with try 
        try {
            // results of the query
            const [results] = await this.db.query(sql);
            // the array of options that will be used by inquirer, combining first and last name for readability
            let options = [];
            for (let i = 0; i < results.length; i++) {
                options.push(results[i].first_name + ' ' + results[i].last_name);
            };
            // return the options for use
            return options;
        // catching the error
        } catch (error) {
            console.log(error);
        }
    };

    // static method so that it works of inquirer, the main piece
    static async promptUser() {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'options',
                message: 'What would you like to do?',
                choices: ['Add Employee', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'View All Employees', 'Update Employee Role', 'Update Employee Manager', 'View Employees By Manager', 'View Employees By Department', 'Delete Department, Role, or Employee', 'View Budget of Department', 'Quit']
            }
        ])
    };

    // static method with the options parameter so that the inquirer works
    static async promptRole(options) {
        // returns the answer from inquirer
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
               choices: options
            }
        ])
    };

    // static method so that the inquirer works
    static async promptDepartment() {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'input',
                name: 'departmentName',
                message: 'What is the name of the department?'
            }
        ])
    };

    // static method so 2 option parameters so that the inquirer works
    static async promptEmployee(options, managerOptions) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?"
            },
            {
                type: 'list',
                name: 'position',
                message: "What is the employee's role?",
                choices: options
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the manager?",
                choices: managerOptions
            }
        ])
    };

    // static method so 2 option parameters are passed thorugh the inquirer
    static async promptUpdate(options, optionsPosition) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee would you like to update?',
                choices: options
            },
            {
                type: 'list',
                name: 'newPosition',
                message: 'What is their role going to be?',
                choices: optionsPosition
            }
        ])
    };

    // static method so that the 1 parameter works with inquirer
    static async promptManagerView(options) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager would you like to view?',
                choices: options
            }
        ])
    };

    // static method so that the 2 parameters work with inquirer
    static async promptUpdateManager(options, managerOptions) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "Which employee's manager would you like to update?",
                choices: options
            }, 
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the new manager?',
                choices: managerOptions
            }
        ])
    };
    
    // static method so that the 1 parameter works with inquirer
    static async promptViewByDepartment(options) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department do you want to view?',
                choices: options
            }
        ])
    }

    // static method so that the 1 parameter works with inquirer
    static async promptViewByBudget(options) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department budget do you want to view?',
                choices: options
            }
        ])
    }
    
    // static method so that the prompt works with the inquirer
    static async promptDelete() {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'delete',
                message: 'Which do you want to delete?',
                choices: ['Department', 'Role', 'Employee']
            }
        ])
    }

    // static method so that 1 parameter works with the inquirer
    static async promptDeleteDepartment(options) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department do you want to delete?',
                choices: options
            }
        ])
    }; 

    // static method so that 1 parameter works with the inquirer
    static async promptDeletePosition(options) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role do you want to delete?',
                choices: options
            }
        ])
    };

    // static method that takes in 1 parameter and works with the inquirer
    static async promptDeleteEmployee(options) {
        // returns the answer from inquirer
        return inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee do you want to delete?',
                choices: options
            }
        ])
    };

};

// exporting the data that needs to be used in the other file
module.exports = {
    Question,
};