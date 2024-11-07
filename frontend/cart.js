//handling the navigation links (href)
document.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        console.log(`Clicked link: ${href}`);
        if (href.startsWith('#')) {
            event.preventDefault();
            console.log(`Redirecting to: index.html${href}`);
            window.location.href = `index.html${href}`;
        }
    });
});

// Fetch cart items from the backend
async function fetchCartItems() {
    try {
        const response = await fetch('http://localhost:3000/api/cart');
        const data = await response.json();

        if (data.success) {
            displayCartItems(data.cart);
            generateBill(data.cart); // Generate the bill after fetching cart items
        } else {
            console.error('Failed to load cart items:', data.message);
        }
    } catch (error) {
        console.error('Error fetching cart items:', error);
    }
}

// Display cart items dynamically
function displayCartItems(cartItems) {
    const cartItemsContainer = document.querySelector('.cartItems');
    cartItemsContainer.innerHTML = ''; // Clear existing items

    cartItems.forEach(item => {
        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('box');
        cartItemDiv.setAttribute('data-id', item.id);

        cartItemDiv.innerHTML = `
            <div class="food_details">
                <img src="http://localhost:3000/${item.img}" alt="${item.name}" class="box-img">
                <div>
                    <div class="food-name">${item.name}</div>
                    <div class="food-price">₹${item.price}</div>
                </div>
            </div>
            <i class='bx bxs-trash'></i>
        `;

        // Append the item to the cart container
        cartItemsContainer.appendChild(cartItemDiv);

        // Add event listener for delete
        const trashIcon = cartItemDiv.querySelector('.bxs-trash');
        trashIcon.addEventListener('click', () => deleteCartItem(item.id, cartItemDiv));
    });
}

// Generate Bill dynamically based on the cart items
function generateBill(cartItems) {
    const billItemsContainer = document.querySelector('.bill-content');
    const totalAmountElement = document.querySelector('.totalAmount');
    let total = 0;

    billItemsContainer.innerHTML = ''; 
    cartItems.forEach(item => {
        const billItemDiv = document.createElement('div');
        billItemDiv.classList.add('bill-items');
        
        const itemTotal = parseInt(item.price);  
        total += itemTotal;
        console.log(total)

        billItemDiv.innerHTML = `
            <div class="foodName">${item.name}</div>
            <div class="price">₹${item.price}</div>
        `;

        // Append the bill item to the container
        billItemsContainer.appendChild(billItemDiv);
    });

    // Set the total price in the final bill section
    totalAmountElement.textContent = `₹${total.toFixed(2)}`;

    // Attach functionality to the "Order" button
    const orderButton = document.querySelector('.order');
    orderButton.addEventListener('click', () => placeOrder());
}
// Place Order and Clear Cart
async function placeOrder() {
    try {
        // Fetch current cart data
        const response = await fetch('http://localhost:3000/api/cart');
        const cartData = await response.json();

        if (!cartData.success || cartData.cart.length === 0) {
            alert('Cart is empty! Cannot place order.');
            return;
        }

        // Save cart data to order history
        const saveOrderResponse = await fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cart: cartData.cart }),
        });

        const saveOrderData = await saveOrderResponse.json();

        if (!saveOrderData.success) {
            alert('Failed to save order history.');
            return;
        }

        // Clear cart on the backend
        const clearCartResponse = await fetch('http://localhost:3000/api/cart', {
            method: 'DELETE', // This will empty the entire cart
        });

        const clearCartData = await clearCartResponse.json();

        if (clearCartData.success) {
            alert('Order placed successfully');
            // Clear the UI
            document.querySelector('.cartItems').innerHTML = ''; // Empty the cart display
            document.querySelector('.bill').innerHTML = ''; // Empty the bill

            // Fetch and display updated order history
            await fetchOrderHistory();
        } else {
            alert('Failed to clear cart');
        }
        location.reload()
    } catch (error) {
        console.error('Error placing order:', error);
        alert('Something went wrong. Please try again.');
    }
}


// Fetch Order History and Display
async function fetchOrderHistory() {
    try {
        const response = await fetch('http://localhost:3000/api/orders');
        const data = await response.json();

        if (data.success) {
            displayOrderHistory(data.orderData);
        } else {
            console.error('Failed to load order history:', data.message);
        }
    } catch (error) {
        console.error('Error fetching order history:', error);
    }
}

// Dynamically Display Order History
function displayOrderHistory(orderItems) {
    const historyContainer = document.querySelector('.history');
    historyContainer.innerHTML = ''; // Clear previous history

    orderItems.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.classList.add('H-orders');
        orderDiv.innerHTML = `
            <div>${order.food_name}</div>
            <div>₹${order.food_price}</div>
            <div>${new Date(order.order_date).toLocaleString()}</div>
        `;
        console.log('Order data:', orderItems);

        historyContainer.appendChild(orderDiv);
    });
}
// Call fetchOrderHistory when the page loads or when manually triggered
document.addEventListener('DOMContentLoaded', fetchOrderHistory);

// Clear cart items from the UI
function clearCart() {
    const cartItemsContainer = document.querySelector('.cartItems');
    cartItemsContainer.innerHTML = ''; 
}

// Delete a cart item
async function deleteCartItem(itemId, cartItemDiv) {
    try {
        const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
            method: 'DELETE',
        });

        const data = await response.json();

        if (response.ok) {
            cartItemDiv.remove();
            // After deleting an item, regenerate the bill and update the cart
            fetchCartItems(); // Reload cart and update bill
        } else {
            alert('Failed to remove item');
        }
    } catch (error) {
        console.error('Error deleting cart item:', error);
        alert('Something went wrong. Please try again.');
    }
}

// Call fetchCartItems when the page loads
document.addEventListener('DOMContentLoaded', fetchCartItems);
