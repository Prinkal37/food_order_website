const express = require('express')
const mysql = require('mysql2')
const dotenv = require('dotenv')
const cors = require('cors')
const mySqlPool = require('./db')
const cart = []; // In-memory cart array

//configure dotenv
dotenv.config()

const app = express()
const PORT = process.env.PORT

//MIDDLEWARES
app.use(express.json())
app.use(cors())
app.use('/public', express.static('public'));

//ROUTES

// get food items
app.get('/api/menu',async (req,res)=>{
    try {
        // getting the items for the menu
        const menuData = await mySqlPool.query("SELECT * FROM food_menu")
        if(!menuData){
            return res.status(404).send({
                success:false,
                message:"No data found in the given sql table"
            })
        }
        res.status(200).send({
            success:true,
            message:"Menu items",
            totalFoodItems: menuData[0].length,
            menuData: menuData[0]
        })
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in fetching the items of the menu',
            error
        })
    }
})


// Add cart item
app.post('/api/cart', (req, res) => {
    try {
        const { id, name, price, img} = req.body;

        // Validate input
        if (!id || !name || !price || !img) {
            return res.status(400).send({
                success: false,
                message: 'Missing required fields (id, name, price)',
            });
        }

        cart.push({ id, name, price, img });
        res.status(201).send({
            success: true,
            message: 'Item added to cart successfully',
            cart,
        });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).send({
            success: false,
            message: 'Internal server error while adding item to cart',
            error: error.message,
        });
    }
});

// Get all cart items
app.get('/api/cart', (req, res) => {
    try {
        if (cart.length === 0) {
            return res.status(404).send({
                success: false,
                message: 'No items in the cart',
            });
        }

        res.status(200).send({
            success: true,
            cart,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error while fetching cart items',
            error: error.message,
        });
    }
});

// clearing the cart items by id
app.delete('/api/cart/:id', (req, res) => {
    try {
        const { id } = req.params;

        const index = cart.findIndex(item => item.id === id);

        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Cart item not found',
            });
        }

        cart.splice(index, 1);

        res.status(200).json({
            success: true,
            message: 'Cart item removed successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal server error while deleting cart item',
            error: error.message,
        });
    }
});

// Clear the cart
app.delete('/api/cart', (req, res) => {
    try {
        cart.length = 0; 
        res.status(200).send({
            success: true,
            message: 'Cart emptied successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error while clearing the cart',
            error: error.message,
        });
    }
});

// get the order history
app.get('/api/orders',async (req,res)=>{
    try {
        // getting the items for the menu
        const orderData = await mySqlPool.query("SELECT * FROM food_orders")
        if(!orderData){
            return res.status(404).send({
                success:false,
                message:"No data found in the given sql table"
            })
        }
        res.status(200).send({
            success: true,
            message: "Order history",
            totalFoodItems: orderData[0].length,
            orderData: orderData[0]
        });
        
        
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error in fetching the items of the order history',
            error
        })
    }
})

// Save cart data to order history
app.post('/api/orders', async (req, res) => {
    try {
        const { cart } = req.body;

        if (!cart || cart.length === 0) {
            return res.status(400).send({
                success: false,
                message: 'Cart is empty or missing',
            });
        }

        // Insert each cart item into the order history table
        const insertPromises = cart.map(item =>
            mySqlPool.query(
                'INSERT INTO food_orders (food_name, food_price) VALUES (?, ?)',
                [item.name, item.price]
            )
        );

        await Promise.all(insertPromises);

        res.status(201).send({
            success: true,
            message: 'Order history updated successfully',
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Internal server error while saving order history',
            error: error.message,
        });
    }
});


//conditional listing(only if the mysql db is connected the backend will listen to the defined port)
mySqlPool.query('SELECT 1').then(()=>{
    // my sql 
    console.log('Mysql is connected.')
    //PORT
    app.listen(PORT,()=>{
        console.log(`server is running at port ${PORT}`)
    })
}).catch((error)=>{
    console.log(error)
})
