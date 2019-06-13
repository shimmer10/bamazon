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

var productsArray = [];

var all = "View Products For Sale";
var low =  "View Low Inventory Items";
var add = "Add to Inventory"

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
            choices: [all, low, add, "Add New Product"],
        },
    ])
        .then(function (action_response) {
            console.log(action_response.action);
            buildProductsArray(action_response.action);
        })
}

function buildProductsArray(view) {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        // display products
        switch (view) {
            case all:
            case add:
                for (var i = 0; i < results.length; i++) {
                    pushProducts(productsArray, results[i]);
                }
                if (view === all) {
                    console.table(productsArray)
                }
                else {
                    console.log("in here");
                }
                break;
            case low:
                for (var i = 0; i < results.length; i++) {
                    if (results[i].stock_quantity <= 5) {
                        pushProducts(productsArray, results[i]);
                    }
                }
                console.table(productsArray)
                break;
        }
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

function addProducts() {

    connection.end();
}