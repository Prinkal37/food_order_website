<<<<<<< HEAD
# food_order_website
this is a simple food ordering website using html css and js in the frontend and in the backend i used express node and mysql
=======
# Food Ordering System
A simple food ordering system with menu, cart, and order history functionality.

## Installation

1. Clone the repository:

2. Navigate to the project folder:
how do you do that?
-> open terminal in vs code type cd backend 
and once you are in the backend directory
then

3. Install dependencies:
type "npm i" in your terminal and then press enter

4. Set up the environment variables by creating a `.env` file and adding your database configuration.
create a .env file in your root directory of the backend and then 

PORT=3000
HOST=localhost
USER=root
PASSWORD="your_db_password" <!-- enter your root password of mysql database -->
DATABASE=food_ordering_system

copy and paste these to your .env file 
(make sure your create a database in mysql first)

5. set up your my sql 
run these commands in your mysql:

CREATE DATABASE IF NOT EXISTS food_ordering_system;

USE food_ordering_system;

CREATE TABLE IF NOT EXISTS food_menu (
    id INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    food_price DECIMAL(10, 2) NOT NULL,
    food_image VARCHAR(255) NOT NULL
);

INSERT INTO food_menu (food_name, food_price, food_image) VALUES
('Pizza', 229.00, 'public/images/pizza.jpg'),
('Burger', 89.00, 'public/images/burger.jpg'),
('Fries', 59.00, 'public/images/fries.jpg'),
('Tandoori Chicken', 299.00, 'public/images/tandoori.jpg'),
('Chicken Wings', 249.00, 'public/images/wings.jpg'),
('Chicken Biryani', 300.00, 'public/images/biryani.jpg'),
('Veg Fried Rice', 129.00, 'public/images/vfr.jpg'),
('Tandoori Paneer', 239.00, 'public/images/tp.jpg'),
('Grilled Paneer', 199.00, 'public/images/gp.jpg'),
('Noodles', 99.00, 'public/images/noodles.jpg'),
('Momo', 69.00, 'public/images/momo.jpg'),
('Gulab Jamun', 40.00, 'public/images/gj.jpg');

CREATE TABLE IF NOT EXISTS food_orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    food_name VARCHAR(255) NOT NULL,
    food_price DECIMAL(10, 2) NOT NULL,
    order_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

run all these commands serially in you mysql

6. now start the backend server by running "npm start" to your vscode terminal in the backend directory 

7. now run the index.html file and you are good to go 


### how does the website work?
1. we made the frontend design using html css and js, we used js dom(document object model) to dynamically add html elements to the website. (used for creating the menu and the cart page)

2. firstly we used fetch method to retrieve the food menu from the backend and then dynamically added the data as the food menu in index.html.

3. in the food menu, if i click on add to cart button on any food item the specified item got added to the cart (use some backend logic to do it) 

4. then every time an item got added to the cart the cart.js also generates a bill.

5. after you click the order button the cart gets emptied and all the carts items got added to the order_history, we used post method in our backend to achieve that. 

6. then we have created another api which can get the data from the mysql database and send it to the frontend

7. next using fetch method we displayed the order history.

>>>>>>> 3cf299f (first commit)
