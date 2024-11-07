document.querySelector("#menu-icon").addEventListener("click", function() {
    const navbar = document.querySelector("#navbar");
    navbar.classList.toggle("active");
    this.setAttribute("aria-expanded", navbar.classList.contains("active"));
});

window.onscroll = () => {
    document.querySelector("#navbar").classList.remove("active");
};

// Fetch menu items and display them
async function fetchMenu() {
    try {
        const response = await fetch('http://localhost:3000/api/menu'); 
        const data = await response.json();

        if (data.success) {
            displayMenu(data.menuData);
        } else {
            console.error('Failed to load menu:', data.message);
        }
    } catch (error) {
        console.error('Error fetching menu:', error);
    }
}

// Display menu items on the page
function displayMenu(menuItems) {
    const menuContainer = document.querySelector('.menu-container');

    menuItems.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('box');

        menuItemDiv.innerHTML = `
            <img src="http://localhost:3000/${item.food_img}" alt="${item.food_name}" class="box-img">
            <div class="food-name">${item.food_name}</div>
            <div class="food-price">₹${item.food_price}</div>
            <div class="cart" 
                 data-id="${item.food_id}" 
                 data-name="${item.food_name}" 
                 data-price="${item.food_price}" 
                 data-img="${item.food_img}">
                Add to cart <i class='bx bxs-cart'></i>
            </div>
        `;

        menuContainer.appendChild(menuItemDiv);
    });

    // Attach click event listeners to all "Add to Cart" buttons
    const cartButtons = document.querySelectorAll('.cart');
    cartButtons.forEach(button => {
        button.addEventListener('click', event => {
            const target = event.target.closest('.cart'); // Ensure the target is the correct element
            addToCart(target);
        });
    });
}

// Handle "Add to Cart" action
async function addToCart(target) {
    if (!target) return; // Safeguard if no target is found

    // Prepare cart item data
    const cartItem = {
        id: target.getAttribute('data-id'),
        name: target.getAttribute('data-name'),
        price: target.getAttribute('data-price'),
        img: target.getAttribute('data-img') // Include the food image
    };

    try {
        // Send the cart item to the backend
        const response = await fetch('http://localhost:3000/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cartItem)
        });

        const data = await response.json();

        if (response.ok) {
            alert(`Added to cart: ${cartItem.name} (₹${cartItem.price})`);
        } else {
            console.error('Failed to add to cart:', data.message);
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Something went wrong. Please try again.');
    }
}

// Call fetchMenu to load the menu when the page loads
document.addEventListener('DOMContentLoaded', fetchMenu);
