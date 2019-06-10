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
        // once you have the items, prompt the user for which they'd like to bid on
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            var product = results[i];
                            choiceArray.push(product.product_name);
                        }
                        return choiceArray;
                    },
                    message: "What product would you like to buy?"
                }
            ])
            .then(function (answer) {
                // get the information of the chosen item
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].item_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
            })
    })
}