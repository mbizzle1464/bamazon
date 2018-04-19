// Require and Global Variables
var mysql = require("mysql"),
    inquirer = require("inquirer"),
    Table = require("cli-table"),
    colors = require('colors/safe');

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
   // console.log("Connected as id: " + connection.threadId);
    displayInventory();
});
// functions for validation
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
// function to display inventory at the start
var displayInventory = function () {
    console.log("\n==================================================");
    console.log("\nWelcome to Bamazon! Check out the inventory below!");
    console.log("\n==================================================\n");
    connection.query('SELECT ItemID, ProductName, Price FROM Products', function (err, result) {
        if (err) console.log(err);

        //creates a table for the information from the mysql database to be placed
        var table = new Table({
            head: ['Item Id#', 'Product Name', 'Price'],
            style: {
                head: ['blue'],
                compact: false,
                colAligns: ['center'],
            }
        });
        for (var i = 0; i < result.length; i++) {
            table.push(
                [result[i].ItemID, result[i].ProductName, "$" + result[i].Price]
            );
        }
        console.log(table.toString());
        setTimeout(promptUser, 2500);
    });
};
// function to prompt user for the item or quantity
var promptUser = function () {
    connection.query('SELECT ItemID, ProductName, Price FROM Products', function (err, res) {
        inquirer.prompt([
            {
                name: 'ItemID',
                type: 'input',
                message: 'What item would you like to purchase? ',
                validate: validateInput,
                filter: Number
            },
            {
                name: 'quantity',
                type: 'input',
                message: 'How many do you need?',
                validate: validateInput,
                filter: Number
            }
        ]).then(function (input) {

            var item = input.ItemID,
                quantity = input.quantity,
                queryStr = 'SELECT * FROM products WHERE ?';


            connection.query(queryStr,
                {
                    ItemID: item
                },                
                function (err, data) {
                    if (err) throw err;
                    console.log(JSON.stringify(data, null, 2));
                    
                    if (data.length === 0) {
                        console.log("\n============================");
                        console.log("\nPlease enter a valid Item ID.")
                        console.log("\n============================\n");
                        displayInventory();
                    } else {
                        var productData = data[0],
                            price = productData.Price,
                            total = price * quantity,
                            department = productData.DepartmentName;
                        //console.log(JSON.stringify(productData, null, 2));
                        //console.log(price, total, department);  
                        if (quantity <= productData.StockQuantity) {
                            console.log("\n==========================================================================");
                            console.log('\nCongratulations, the product you requested is in stock! Placing order now!');
                            console.log("\n==========================================================================\n");

                            var updateQueryStr = 'UPDATE Products SET StockQuantity = ' + (productData.StockQuantity - quantity) + ' WHERE ItemID = ' + (item);
                            connection.query(updateQueryStr, function (err, data) {
                                if (err) throw err;
                                console.log("\n========================================================");
                                console.log("\nYour order has been placed! Your total is $" + productData.Price * quantity)
                                console.log("\nThank you for shopping with Bamazon! See you again soon!");
                                console.log("\n========================================================\n");  
                            });                                                            
                            connection.query('UPDATE Departments SET ? WHERE ?', [{ TotalSales: total }, { DepartmentName: department }], function (err, res) {
                                if (err) throw err; 
                                connection.end(); 

                            });
                        } else {
                            console.log("\n===========================================================================");
                            console.log("\nSorry, there is not enough stock to place your order!")
                            console.log("\nPlease try another product or come back later when more stock is available.");
                            console.log("\n===========================================================================\n");
                            displayInventory();
                        }
                    }
                });
        });
    })
};    