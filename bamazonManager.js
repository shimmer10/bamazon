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
var cTable = require('console.table');

var password;
var connection;

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

function start() {
    inquirer.prompt([
        {
            name: "action",
            type: "rawlist",
            choices: ["View Products For Sale", "View Low Inventory Items", "Add to Inventory", "Add New Product"],
        },
    ])
        .then(function (action_response) {
            // get the information of the chosen item
            switch (action_response.action) {
                case "View Products For Sale":
                    viewProductsForSale();
                    break;
            }
        })
}

function viewProductsForSale() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // display products
        var products = [];
        for (var i = 0; i < results.length; i++) {
            products.push(
                {
                    ID: results[i].id,
                    Product_Name: results[i].product_name,
                    Department_Name: results[i].department_name,
                    Price: results[i].price.toFixed(2),
                    Quantity_In_Stock: results[i].stock_quantity
                })
        }
        console.table(products);
    })
    connection.end();
}