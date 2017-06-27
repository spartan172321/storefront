-- create the database
DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;


CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantitiy INT NOT NULL,
  PRIMARY KEY (item_id)
);

-- Insert "mock" data rows into this database and table
INSERT INTO products (product_name, department_name, price, stock_quantitiy)
VALUES ('jacket', 'clothings', 62.50, 50), ('gloves', 'clothings', 24.99, 10), ('headphones', 'electronics', 19.99, 100), ('ipad', 'electronics', 499.99, 5), ('microwave', 'appliances', 120.00, 25), ('oven', 'appliances', 350.41, 20), ('tools', 'hammer', 12.00, 62), ('tools', 'screwdriver', 10.00, 30), ('boxers', 'clothing', 4.50, 1000), ('zune', 'electronics', 120.00, 5000000);


SELECT * FROM products;