var mysql = require("mysql");
var inquirer =require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "Am450478",
    database: "bamazon"
});

connection.connect(function (err) {
    console.log("connected as id " + connection.threadId);
    if (err) throw err;
    
    loadProducts();

});

function loadProducts() {
    
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
            console.table(res);

        promptCustomerForItem(res);
    });
}

function promptCustomerForItem(inventory){
    inquirer
       .prompt([
           {
               name: "choice",
               type: "input",
               message: "please enter the item_id for product you would like to purchase.",
               
               validate: function(val){
                   return !isNaN(val);
               }

           }
       ]) 
       
    .then(function(val) {
        var choiceId = parseInt(val.choice);
        var product = checkInventory(choiceId, inventory);

        if (product) {
            promptCustomerForQuantity(product);
        }
        else {
            console.log("\nThat item is not in the inventory.");
            loadProducts();
        }

    });

}

function promptCustomerForQuantity(products){
    inquirer
       .prompt([
           {
               name:"quantity",
               type:"input",
               message:"How many would like to purchase?",
               validate: function(val){
               return val > 0;
               }
           }
       ])
    .then(function(val) {
        var quantity = parseInt(val.quantity);

        if(quantity > products.stock_quantity){
            console.log("quantity exceeds available inventory");
            loadProducts();
         } else {
            checkInventory(products);
        }


function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
         if (inventory[i].item_id === choiceId) {
            return inventory[i];
        }
    }
            return null;
        }
    });

            makePurchase(products , quantity)
    };
    



function makePurchase(products,quantity){
    connection.query(
       "UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?",
        [quantity, products.item_id],
    function (err, res) {
        console.log("\nSuccessfully purchased " + quantity + " " + products.product_name + "'s!");
            loadProducts();
        }
    );
    

}







