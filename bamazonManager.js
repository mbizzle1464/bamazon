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
//Connection to MySQL
connection.connect(function (err) {
    //console.log("Connected as id: " + connection.threadId);
    promptManager();    
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
var validateNewProduct = function (value) {
    var integer = Number.isInteger(parseFloat(Math.abs(value))),
        sign = Math.sign(value);
    if (integer && (sign === 1)) {
        return true
    } else if (value < 5) {
        console.log("\n============================")
        console.log("\nPlease enter a valid number.")
        console.log("\n============================\n")
        return
    } else {
        console.log("\n============================")
        console.log("\nPlease enter a valid number.")
        console.log("\n============================\n")
        return
    }
};
var validateNumeric = function (value){
    var number = (typeof parseFloat(value)) === 'number',
        positive = parseFloat(value) > 0;

    if (number && positive) {
        return true;
    } else {
        console.log("\n==================================================")
        console.log("\nPlease enter a positive number for the unit price.")
        console.log("\n==================================================\n")
        return 
    }
};

//function for prompting manager to make a selection
var promptManager = function () {
    inquirer.prompt([
        {
            name: 'option',
            type: 'list',
            message: 'Please select an option:',
            choices: ['VIEW PRODUCTS FOR SALE', 'VIEW LOW INVENTORY', 'ADD TO INVENTORY', 'ADD NEW PRODUCT', 'END'],            
        }
    ]).then(function (input) {
        //console.log(input); 
        switch (input.option) {
            case 'VIEW PRODUCTS FOR SALE':
                return viewProducts();
                break;
            case 'VIEW LOW INVENTORY':
                return viewLowInventory();
                break;
            case 'ADD TO INVENTORY':
                return addInventory();
                break;
            case 'ADD NEW PRODUCT':
                return addNewProduct();
                break;
            case 'END':
                return endManager();
                connection.end();   
                break;
            default:
                text = "ERROR: Unsupported operation!";
        }
    });
};
//function for viewing products
var viewProducts = function () {
    connection.query('SELECT * from Products', function (err, res) {
        if (err) throw err;
        console.log("\n===========================================");
        console.log("\nThese are the items currently in inventory.");
        console.log("\n===========================================\n");
        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
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
                endManager();
            } else if (input.end.toUpperCase() === 'NO') {
                promptManager();
            } else {
                endManager();
            }
        });
    });
};  
//function for viewing low inventory
var viewLowInventory = function () {
    connection.query('SELECT * from Products WHERE StockQuantity < 5', function (err, res) {
        if (err) throw err; 
        console.log("\n===============================================");
        console.log("\nThese are the items currently low in inventory.");
        console.log("\n===============================================\n");
        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
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
                endManager();
            } else if (input.end.toUpperCase() === 'NO') {
                promptManager();
            } else {
                endManager();
            }
        });
    });

};  
//function for adding inventory 
var addInventory = function () {
    connection.query('SELECT * from Products', function (err, res) {
        if (err) throw err;
        console.log("\n===========================================");
        console.log("\nThese are the items currently in inventory.");
        console.log("\n===========================================\n");
        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
            );
        }
        console.log(table.toString());
        inquirer.prompt([
            {
                name: 'ItemID',
                type: 'input', 
                message: 'Please enter the ItemID for the Stock update.',
                validate: validateInput,
                filter: Number
            },
            {
                name: 'quantity',
                type:'input',
                message: 'Please enter the amount you need to add.',
                validate: validateInput,
                filter: Number
            }
        ]).then(function (input) {
            //console.log(JSON.stringify(input, null, 2));    
            var item = input.ItemID,
                addQuantity = input.quantity,
                queryStr = 'SELECT * from Products WHERE ?';
            
            connection.query(queryStr, 
                {
                    ItemID: item
                },
            function(err, data) {
                if (err) throw err; 
                //console.log(JSON.stringify(data, null, 2)); 
                if (data.length === 0) {
                    console.log("\n============================");
                    console.log("\nPlease enter a valid Item ID.")
                    console.log("\n============================\n");
                    addInventory(); 
                } else {
                    var productData = data[0];  
                    console.log("\n=======================");
                    console.log("\nUpdating inventory now.")
                    console.log("\n=======================\n");
                    //console.log(JSON.stringify(productData, null, 2));
                    var updateQueryStr = 'UPDATE Products SET StockQuantity = ' + (productData.StockQuantity + addQuantity) + ' WHERE ItemID = ' + item;
                    //console.log("Updated Query String: " + updateQueryStr); 
                    connection.query(updateQueryStr, function (err, data) {
                        if (err) throw err;
                        console.log("\n===========================================================================================================");
                        console.log("\nStock Count for ItemID " + item + " has been updated to " + (productData.StockQuantity + addQuantity) + " .")
                        console.log("\n===========================================================================================================\n");
                        inquirer.prompt([
                            {
                                name: 'end',
                                type: 'list',
                                message: "Are you done?",
                                choices: ['YES', 'NO']
                            }
                        ]).then(function (input) {
                            if (input.end.toUpperCase() === 'YES') {
                                endManager();
                            } else if (input.end.toUpperCase() === 'NO') {
                                promptManager();
                            } else {
                                endManager();
                            }
                        });
                    });
                }
            });
        });
    });
};  
//function for adding new Products
var addNewProduct = function () {
    connection.query('SELECT * from Products', function (err, res) {
        if (err) throw err;
        console.log("\n===========================================");
        console.log("\nThese are the items currently in inventory.");
        console.log("\n===========================================\n");
        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Department Name', 'Price', 'Stock Quantity'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, res[i].Price, res[i].StockQuantity]
            );
        }
        console.log(table.toString());
        inquirer.prompt([
            {
                name: 'ItemID',
                type: 'input',
                message: 'Please enter a new or existing 5 digit ItemID',
                validate: validateNewProduct,
                filter: Number
            },
            {
                name: 'ProductName',
                type: 'input',
                message: 'Please enter the name of the product.',
            },
            {
                name: 'DepartmentName',
                type: 'list',
                message: 'Please enter the amount you need to add.',
                choices: ["Automotive", "Books", "Childrens Clothing", "Electronics", "Garden",
                    "Grocery", "Home", "Mens Clothing", "Pets", "Toys", "Womens Clothing"],
            },
            {
                name: 'Price',
                type: 'input',
                message: 'Please enter a price',
                validate: validateNumeric,
                filter: Number
            },
            {
                name: 'StockQuantity',
                type: 'input',
                message: 'Please enter an amount in stock',
                validate: validateInput,
                filter: Number
            },
        ]).then(function (input) {
            //console.log(JSON.stringify(input, null, 2)); 
            var queryStr = 'INSERT INTO Products SET ?';
            connection.query(queryStr, input, function (error, results, fields) {
                if (error) throw error;
                //console.log(results); 
                console.log("\n=====================");
                console.log("\Product has been added")
                console.log("\n=====================\n"); 
                inquirer.prompt([
                    {
                        name: 'end',
                        type: 'list',
                        message: "Are you done?",
                        choices: ['YES', 'NO']
                    }
                ]).then(function (input) {
                    if (input.end.toUpperCase() === 'YES') {
                        endManager();
                    } else if (input.end.toUpperCase() === 'NO') {
                        promptManager();
                    } else {
                        endManager();
                    }
                });
            });

        });
    });
}; 
//function for ending manager node app
var endManager = function () {
    connection.end();   
    console.log("\n=======================");
    console.log("\nThanks for stopping by!");
    console.log("\n=======================");
    process.exit();
};