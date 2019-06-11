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

var password;
var connection;

fs.readFile('password.txt', function read(err, data) {
    if (err) {
        throw err;
    }
    password =  data.toString();
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
        connection.end();
    });
}

function start() {
    // query the database for all items being auctioned
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // list the information for the items they can purchase
        for (var i = 0; i < results.length; i++) {
            var product = results[i];
            var productInfo = product.id + ") " + product.product_name + ", $" + product.price + "/each";
            console.log(productInfo);
        }
        startPurchase();
    })
}

function startPurchase() {
    inquirer
    .prompt([
        {
            name: "choice",
            type: "input",
            message: "Please enter the id of the item you would like to purhcase: ",
            validate: function notBlankValidation(userInput) {
                var isValid = (userInput != "" && isNaN(userInput) === false);
                return isValid || "Please enter the id number of the item you would like to purchase";
            }
        }
    ])
    .then(function (answer) {
        // get the information of the chosen item

        
    })
}