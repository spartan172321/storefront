var mysql = require("mysql");
var inquirer = require("inquirer");

// List a set of menu options:
// View Products for Sale
// View Low Inventory
// Add to Inventory
// Add New Product
var itemStock;

var itemId;


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  user: "root",

  password: "",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;

  inquirer.prompt([
		{
			type: "list",
			message: "What would you like to do?\n",
			name: "action",
			choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
		}
	]).then(function(choice){
		switch (choice.action) {
      case "View Products for Sale":
        viewProd();
        break;

      case "View Low Inventory":
        lowStock();
        break;

      case "Add to Inventory":
        addStock();
        break;

      case "Add New Product":
        addNewprod();
        break;
     }
	});
});

// If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.

function viewProd(){
	connection.query("Select * FROM products", function(err,res){
		if (err) throw err;

		for(var i in res){
			console.log("ID: " + res[i].item_id + " | Product: " + res[i].product_name + " | Price: " + res[i].price + " | Current Stock: " + res[i].stock_quantitiy + '\n');
		};
		connection.end();
	});
}

// If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function lowStock(){
	connection.query("SELECT * FROM products WHERE stock_quantitiy < 5", function(err,res){
		if (err) throw err;

		for(var i in res){
			console.log("ID: " + res[i].item_id + " | Product: " + res[i].product_name + " | Price: " + res[i].price + " | Current Stock: " + res[i].stock_quantitiy + '\n');
		};
		connection.end();
	});
}

// If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.

function addStock(){
	connection.query("Select * FROM products", function(err,res){
		if (err) throw err;

		inquirer.prompt([
			{
				type: "input",
				message: "What is the id of the product you would like to add to?\n",
				name: "item",
				validate: function(item) {
	        if (isNaN(item) === false && parseInt(item) <= res.length && parseInt(item) > 0) {
	          return true;
	        }
	        else{
	        	return false;
	        }
				}
			},
			{
				type: "input",
				message: "How many units would you like to add?",
				name: "units",
				validate: function(units) {
	        if (isNaN(units) === false) {
	          return true;
	        }
	        else{
	        	return false;
	        }
				}
			}
		]).then(function(ans){
			var addNum = parseInt(ans.units);
			itemStock = res[parseInt(ans.item)-1].stock_quantitiy;
			itemStock += addNum;
			itemId = res[parseInt(ans.item)-1].item_id;

			connection.query(
				"UPDATE products SET ? WHERE ?",
		    [
		      {
		        stock_quantitiy: itemStock
		      },
		      {
		        item_id: itemId
		      }
		    ],
		    function(error) {
		      if (error) throw error;
		      console.log("Item Id: " + itemId + " is now stocked at " + itemStock + " units.\n");
		      connection.end();
		    }
		  );
		});
	});
}

// If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addNewprod(){

	inquirer.prompt([
		{
			type: "input",
			message: "What is the new product you would like to add?\n",
			name: "name",
		},
		{
			type: "input",
			message: "What department does this item belong to?\n",
			name: "dep",
		},
		{
			type: "input",
			message: "How many units of the product will be available?\n",
			name: "num",
			validate: function(num) {
	      if (isNaN(num) === false && parseInt(num) > 0) {
	        return true;
	      }
	      else{
	      	return false;
	      }
			}
		},
		{
			type: "input",
			message: "What should the price be set at?\n",
			name: "price",
			validate: function(price) {
	      if (isNaN(price) === false && parseFloat(price) > 0) {
	        return true;
	      }
	      else{
	      	return false;
	      }
			}
		}
	]).then(function(ans){
		connection.query(
		 	"INSERT INTO products SET ?",
		  {
		    product_name: ans.name,
		    department_name: ans.dep,
		    price: parseInt(ans.price),
		    stock_quantitiy: parseInt(ans.num)
		  },
		  function(err, res) {
		    console.log(res.affectedRows + " product inserted!\n");
	      connection.end();
	    }
	  );
	});
}
