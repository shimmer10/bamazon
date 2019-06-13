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
                    displayProducts("all");
                    break;
                case "View Low Inventory Items":
                    displayProducts("low");
                    break;
            }
        })
}

function displayProducts(view) {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        var productsArray = [];

        // display products
        switch (view) {
            case "all":
                for (var i = 0; i < results.length; i++) {
                    pushProducts(productsArray, results[i]);
                }
                break;
            case "low":
                for (var i = 0; i < results.length; i++) {
                    if (results[i].stock_quantity <= 5) {
                        pushProducts(productsArray, results[i]);
                    }
                }
        }
        console.table(productsArray);
    })
    connection.end();
}

function pushProducts(productsArray, product) {
    productsArray.push(
        {
            ID: product.id,
            Product_Name: product.product_name,
            Department_Name: product.department_name,
            Price: product.price.toFixed(2),
            Quantity_In_Stock: product.stock_quantity
        })
}