var mysql = require("mysql");

var inquirer = require("inquirer");

var connection = mysql.createConnection({

    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bmazon"
});


connection.connect(function (error) {
    if (error) {
        console.log(error);

    };

    console.log("sucessful connection");

    getProducts();

});



function getProducts() {
    connection.query("SELECT * FROM products;", function (error, response) {
        if (error) {
            console.log(error);

        };


        console.log(response);

        askUserForItem(response);

    });

};


function askUserForItem(products) {
    inquirer.prompt(
        [{
            type: "input",
            name: "choice",
            message: "enter product id"

        }]
    ).then(function (value) {

        var itemId = parseInt(value.choice);
        console.log(itemId);

        inquirer.prompt(
            [{
                type: "input",
                name: "quantity",
                message: "enter quantity id"

            }]
        ).then(function (value) {
            console.log(value.quantity);
            console.log(itemId);


            var quantity = parseInt(value.quantity);

            var product = findProduct(itemId, products);

            if (quantity > product.stock_quantity) {
                console.log("insufficient quantity");
            }
            else { 
                buyProduct(product, quantity);
            }

        });


    });

    function findProduct(itemId, products) {

        for (var i = 0; i < products.length; i++) {
            if (products[i].item_id === itemId) {
                return products[i];
            }
        }

        return null;
    }

    function buyProduct(product, quantity) {
        connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
            [quantity, product.item_id],
            function (error, response) {

                if (error) {
                    console.log(error);

                };

                console.log("successfully purchased");

                var price = parseFloat(product.price);
                var cost = quantity * price;
                console.log("total price ", cost);
            });
    }


};