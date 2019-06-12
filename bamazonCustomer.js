/************************************
 * UNH Bootcamp
 * 
 * @author Jennifer Grace
 * 
 * Bamazon Customer Purchasing MySQL
 ************************************/

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
    inquirer.prompt([
        {
            name: "item_id",
            type: "input",
            message: "Please enter the id of the item you would like to purhcase: ",
            validate: function notBlankValidation(userInput) {
                var isValid = (userInput != "" && isNaN(userInput) === false);
                return isValid || "Please enter the id number of the item you would like to purchase";
            }
        },
        {
            name: "item_count",
            type: "input",
            message: "Please enter the quantity you would like to purchase: ",
            validate: function notBlankValidation(userInput) {
                var isValid = (userInput != "" && isNaN(userInput) === false);
                return isValid || "Please enter how many (numerical) you would like to purchase";
            }
        }
    ])
        .then(function (answer) {
            // get the information of the chosen item
            connection.query("SELECT * FROM products WHERE id=?", [answer.item_id], function (err, results) {
                if (err) throw err;
                // check if there is enough stock
                checkQuantity(results[0].stock_quantity, answer.item_count, results[0].price, answer.item_id);
            })
        })
}
function checkQuantity(stock, requestedQuantity, itemPrice, itemId) {
    if (stock >= parseInt(requestedQuantity)) {
        var cost = parseFloat(itemPrice) * parseInt(requestedQuantity)
        console.log("Your order has been processed.");
        var remainingInventory = parseInt(stock) - parseInt(requestedQuantity);
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
                {
                    stock_quantity: remainingInventory
                },
                {
                    id: itemId
                }
            ],
            function (err, res) {
                if (err) throw err;
                console.log("Your purchase total is $" + cost)
            }
        )
    }
    else {
        console.log("Sorry, we cannot process your order as there is an insufficient quantity.")
    }
    connection.end();
}