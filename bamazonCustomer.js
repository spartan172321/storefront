var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon"
});

var numBuy;

var itemStock;

var newStock;

var totalPrice;

var itemName;

var itemId;


connection.connect(function(err) {
  if (err) throw err;
  cusView();
});

function cusView(){
	connection.query("Select * FROM products", function(err,res){
		if (err) throw err;
		// list the id, name, price, and units left of the product

		for(var i in res){
			console.log("ID: " + res[i].item_id + " | Product: " + res[i].product_name + " | Price: " + res[i].price + " | Current Stock: " + res[i].stock_quantitiy + '\n');
		};

		inquirer.prompt([
			{
				type: "input",
				message: "What is the ID of the item you wish to buy?\n",
				name: "id",
				validate: function(id) {
          if (isNaN(id) === false && parseInt(id) <= res.length && parseInt(id) > 0) {
            return true;
          }
          else{
          	return false;
          }
				}
			},
			{
				type: "input",
				message: "How many units would you like to buy?\n",
				name: "num"
			}
		]).then(function(answer){
				itemId = parseInt(answer.id);
				// var to hold the number to buy as an integer
				numBuy = parseInt(answer.num);
				// var to hold the amount in stock
				itemStock = res[parseInt(answer.id)-1].stock_quantitiy;
				// var to hold the product name
				itemName = res[parseInt(answer.id)-1].product_name;

				if(numBuy <= itemStock){
					// var hold the total cost if the stock is sufficient
					totalPrice = res[parseInt(answer.id)-1].price * numBuy;
					// ask to confirm order
					inquirer.prompt([
						{
							type: "confirm",
							message: "Order: " + numBuy + " of " + itemName + " for a total price of $" + totalPrice,
							name: "confirm"
						}
					]).then(function(ans){
						console.log(ans.confirm);
						if(ans.confirm === true){
							cusPurchase();
						}
						else{
							cusView();
						}
					});

				}
				else if(numBuy > itemStock){
					console.log('Insufficient quantity!');
					cusView();
				};
			});
	})
}
//item_id, product_name, department_name, price, stock_quantitiy

// function to update the stock if the order is submitted
function cusPurchase(){
	// var to hold the new stock after the purchase is made
	newStock = itemStock - numBuy;
	// var to hold the price total
	connection.query(
		"UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantitiy: newStock
      },
      {
        item_id: itemId
      }
    ],
    function(error) {
      if (error) throw error;
      console.log("Purchase was successful! Total cost of $" + totalPrice);
      connection.end();
    }
  );
}