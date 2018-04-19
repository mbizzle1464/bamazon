// Require and Global Variables
var mysql = require("mysql"),
    inquirer = require("inquirer"),
    colors = require('colors/safe'),
    Table = require('cli-table');

// MySQL Connection 
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "P@ssw0rd",
    database: "bamazon_db"
});

connection.connect(function (err) {
    //console.log("Connected as id: " + connection.threadId);
    promptExecutive();  
});
//functions for validation
var validateInput = function (value) {
    var integer = Number.isInteger(parseFloat(Math.abs(value))),
        sign = Math.sign(value);

    if (integer && (sign === 1)) {
        return true
    } else {
        console.log("\n============================")
        console.log("\nPlease enter a valid number.")
        console.log("\n============================\n")
        return
    }
};
//functyion for prompting Executive to make a selection
var promptExecutive = function () {
    inquirer.prompt([
        {
            name: 'option',
            type: 'list',
            message: 'Please select an option:',
            choices: ['VIEW PRODUCTS SALES BY DEPT', 'CREATE NEW DEPT', 'END'],
        }
    ]).then(function (input) {
        //console.log(input); 
        switch (input.option) {
            case 'VIEW PRODUCTS SALES BY DEPT':
                return viewProductSales();
                break;
            case 'CREATE NEW DEPT':
                return createDepartment();
                break;            
            case 'END':
                return endExecutive();
                connection.end();
                break;
            default:
                text = "ERROR: Unsupported operation!";
        }
    });
};
//function for viewing Sales
var viewProductSales = function () {
    var table = new Table({
        head: ['Department ID', 'Department Name', 'Overhead Cost', 'Total Sales', 'Total Profit'],
        style: {
            head: ['blue'],
            compact: false,
            colAligns: ['center'],
        }
    });
    var queryStr = 'SELECT * from totalprofits';
    connection.query(queryStr, function(err, res){
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].DepartmentId, res[i].DepartmentName, res[i].OverHeadCosts, res[i].TotalSales, res[i].TotalProfit]
            );
        }
        console.log(table.toString());
        inquirer.prompt([
            {
                name: 'end',
                type: 'list',
                message: "Are you done?",
                choices: ['YES', 'NO']
            }
        ]).then(function (input) {
            if (input.end.toUpperCase() === 'YES') {
                endExecutive();
            } else if (input.end.toUpperCase() === 'NO') {
                promptExecutive();
            } else {
                endExecutive();
            }
        });
    });
}; 
//function for creating Department
var createDepartment = function () {
    var table = new Table({
        head: ['Department ID', 'Department Name'],
        style: {
            head: ['blue'],
            compact: false,
            colAligns: ['center'],
        }
    });
    var queryStr = 'SELECT * from totalprofits';
    connection.query(queryStr, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].DepartmentId, res[i].DepartmentName]
            );
        }
        console.log(table.toString());
        inquirer.prompt([
            {
                name: 'DepartmentName',
                type: 'input',
                message: 'Please enter the name of the Department.',
            },
            {
                name: 'OverHeadCosts',
                type: 'input',
                message: 'Please enter overhead costs for this Department.',
                validate: validateInput,
                filter: Number
            },
        ]).then(function (input) {
            //console.log(JSON.stringify(input, null, 2));
            var newDeptInfo = {
                DepartmentName: input.DepartmentName,
                OverHeadCosts: input.OverHeadCosts,
                TotalSales: 0,
            };
            var queryStr = 'INSERT INTO Departments SET ?';
            connection.query(queryStr, newDeptInfo, function (error, results, fields) {
                if (error) throw error;
                //console.log(results);  
                console.log("\n=========================");
                console.log("\nDepartment has been added")
                console.log("\n=========================\n");
                inquirer.prompt([
                    {
                        name: 'end',
                        type: 'list',
                        message: "Are you done?",
                        choices: ['YES', 'NO']
                    }
                ]).then(function (input) {
                    if (input.end.toUpperCase() === 'YES') {
                        endExecutive();
                    } else if (input.end.toUpperCase() === 'NO') {
                        promptExecutive();
                    } else {
                        endExecutive();
                    }
                });
            }); 
        });
    });
}; 
//function for ending manager node app
var endExecutive = function () {
    connection.end();
    console.log("\n=======================");
    console.log("\nThanks for stopping by!");
    console.log("\n=======================");
    process.exit();
}; 