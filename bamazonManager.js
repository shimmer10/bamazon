/***********************
 * UNH Bootcamp
 * 
 * @author Jennifer Grace
 * 
 * Bamazon Inventory MySQL
 ***********************/

// adding node elements
var mysql = require('mysql');
var inquirer = require('inquirer');
var fs = require('fs');
require('console.table');

// needed variables
var password;
var connection;
var productsArray;

// menu options
var all = "View Products For Sale";
var low = "View Low Inventory Items";
var add = "Add to Inventory";
var newProduct = "Add New Product";
var exit = "Exit";

// read the file for the password
fs.readFile('password.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    password = data.toString();
    createInfoToConnect(password)
});

// create the connection information for the sql database
function createInfoToConnect(password) {
    connection = mysql.createConnection({
        host: "localhost",

        port: 3306,

        user: "root",

        password: password,
        database: "bamazon"
    });
    connect(connection);
}


// connect to the mysql server and sql database
function connect(connection) {
    connection.connect(function (err) {
        if (err) throw err;
        start();
    });
}

// start bamazonManager
function start() {
    productsArray = [];
    inquirer.prompt([
        {
            name: "action",
            type: "rawlist",
            choices: [all, low, add, newProduct, exit],
        },
    ])
        .then(function (action_response) {
            processUserChoice(action_response.action);
        })
}

// take next action based on user input
function processUserChoice(view) {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        switch (view) {
            case all:
                clearConsole();
                for (var i = 0; i < results.length; i++) {
                    buildProductsArray(productsArray, results[i])
                }
                console.table(productsArray);
                start();
                break;
            case low:
                clearConsole();
                for (var i = 0; i < results.length; i++) {
                    if (results[i].stock_quantity <= 5) {
                        buildProductsArray(productsArray, results[i]);
                    }
                }
                console.table(productsArray);
                start();
                break;
            case add:
                addInventory(results);
                break;
            case newProduct:
                console.log("new product");
                connection.end()
                break;
            case exit:
                console.log("Thank you for using Bamazon Manager");
                connection.end();
        }
    })
}

function buildProductsArray(productsArray, product) {
    productsArray.push(
        {
            ID: product.id,
            Product_Name: product.product_name,
            Department_Name: product.department_name,
            Price: product.price.toFixed(2),
            Quantity_In_Stock: product.stock_quantity
        })
}

function addInventory(results) {
    inquirer
        .prompt([
            {
                name: "item",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < results.length; i++) {
                        choiceArray.push(results[i].product_name);
                    }
                    return choiceArray;
                },
                message: "What item would you like to add stock to?"
            },
            {
                name: "count",
                type: "input",
                message: "How many should be added to stock?"
            }
        ])
        .then(function (answer) {
            updateTable(results, answer.item, answer.count);
        });
}

function updateTable(results, item, count) {
    var chosenItem;
    for (var i = 0; i < results.length; i++) {
        if (results[i].product_name === item) {
            chosenItem = results[i];
        }
    }
    var newCount = parseInt(count) + parseInt(chosenItem.stock_quantity);
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: newCount
            },
            {
                id: chosenItem.id
            }
        ],
        function (error) {
            if (error) throw error;
            console.log("Item number " + chosenItem.id + " updated from quantity " + chosenItem.stock_quantity + " to " + newCount);
            start();
        }
    );
}

function clearConsole() {
    process.stdout.write('\x1B[2J\x1B[0f');
}