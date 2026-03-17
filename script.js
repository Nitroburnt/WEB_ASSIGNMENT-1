const restaurants = [
    {
        id: 1,
        name: "Pizza Paradise",
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&q=80",
        menu: [
            { id: 101, name: "Margherita Pizza", price: 249, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&q=80" },
            { id: 102, name: "Pepperoni Pizza", price: 329, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&q=80" },
            { id: 103, name: "Garlic Bread", price: 149, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&q=80" }
        ]
    },
    {
        id: 2,
        name: "Burger Joint",
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&q=80",
        menu: [
            { id: 201, name: "Classic Cheeseburger", price: 219, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&q=80" },
            { id: 202, name: "Bacon Double Burger", price: 289, image: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500&q=80" },
            { id: 203, name: "Crispy Fries", price: 99, image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=500&q=80" }
        ]
    },
    {
        id: 3,
        name: "Healthy Greens",
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80",
        menu: [
            { id: 301, name: "Avocado Salad", price: 259, image: "https://images.unsplash.com/photo-1603046891726-36bfd957e0bf?w=500&q=80" },
            { id: 302, name: "Quinoa Bowl", price: 279, image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&q=80" },
            { id: 303, name: "Detox Smoothie", price: 169, image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&q=80" }
        ]
    }
];

// --- State Management ---
let cart = [];
let currentRestaurant = null;

// --- DOM Elements ---
const views = {
    restaurants: document.getElementById('restaurants-view'),
    menu: document.getElementById('menu-view'),
    cart: document.getElementById('cart-view')
};

const containers = {
    restaurants: document.getElementById('restaurants-container'),
    menu: document.getElementById('menu-container'),
    cartTbody: document.getElementById('cart-tbody')
};

const elements = {
    cartCount: document.getElementById('cart-count'),
    cartTotal: document.getElementById('cart-total'),
    restaurantTitle: document.getElementById('restaurant-name-title'),
    cartContent: document.getElementById('cart-content'),
    emptyCartMsg: document.getElementById('empty-cart-msg')
};

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    renderRestaurants();
    setupEventListeners();
});

// --- Event Listeners ---
function setupEventListeners() {
    document.getElementById('logo-link').addEventListener('click', () => switchView('restaurants'));
    document.getElementById('home-link').addEventListener('click', (e) => { e.preventDefault(); switchView('restaurants'); });
    document.getElementById('cart-btn').addEventListener('click', () => switchView('cart'));
    document.getElementById('back-btn').addEventListener('click', () => switchView('restaurants'));
    document.getElementById('start-shopping-btn').addEventListener('click', () => switchView('restaurants'));

    const contactInput = document.getElementById('customer-contact');
    contactInput.addEventListener('input', () => {
        contactInput.value = contactInput.value.replace(/\D/g, '').slice(0, 10);
    });
    
    document.getElementById('checkout-form').addEventListener('submit', (e) => {
        e.preventDefault();

        if (!/^\d{10}$/.test(contactInput.value)) {
            alert('Please enter a valid 10-digit contact number.');
            contactInput.focus();
            return;
        }

        alert('Success! Your order has been placed.');
        cart = [];
        updateCartBadge();
        switchView('restaurants');
        e.target.reset();
    });
}

// --- Navigation ---
function switchView(viewName) {
    Object.values(views).forEach(view => view.classList.remove('active'));
    views[viewName].classList.add('active');
    
    if (viewName === 'cart') {
        renderCart();
    }
}

// --- Rendering Functions ---

// 1. Render Restaurants
function renderRestaurants() {
    containers.restaurants.innerHTML = '';
    restaurants.forEach(restaurant => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img class="card-img" src="${restaurant.image}" alt="${restaurant.name}">
            <div class="card-body">
                <h3 class="card-title">${restaurant.name}</h3>
                <p class="card-info">⭐ ${restaurant.rating} / 5</p>
                <button class="btn-primary" style="margin-top:auto;" onclick="openMenu(${restaurant.id}, event)">View Menu</button>
            </div>
        `;
        // Allow clicking the whole card to open menu
        card.addEventListener('click', (e) => openMenu(restaurant.id, e));
        containers.restaurants.appendChild(card);
    });
}

// 2. Open & Render Menu
function openMenu(restaurantId, event) {
    if(event) event.stopPropagation();
    currentRestaurant = restaurants.find(r => r.id === restaurantId);
    elements.restaurantTitle.textContent = currentRestaurant.name + ' - Menu';
    
    containers.menu.innerHTML = '';
    currentRestaurant.menu.forEach(item => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <img class="card-img" src="${item.image}" alt="${item.name}">
            <div class="card-body">
                <h3 class="card-title">${item.name}</h3>
                <p class="card-price">₹${item.price.toFixed(2)}</p>
                <button class="btn-primary add-to-cart-btn">Add to Cart</button>
            </div>
        `;
        card.querySelector('.add-to-cart-btn').addEventListener('click', () => addToCart(item));
        containers.menu.appendChild(card);
    });
    
    switchView('menu');
}

// 3. Cart Logic & Rendering
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    updateCartBadge();
    alert(`Added ${item.name} to cart!`);
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartBadge();
    renderCart(); // Re-render the cart view
}

function updateQuantity(itemId, change) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(itemId);
        } else {
            updateCartBadge();
            renderCart();
        }
    }
}

function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
}

function renderCart() {
    containers.cartTbody.innerHTML = '';
    
    if (cart.length === 0) {
        elements.cartContent.style.display = 'none';
        elements.emptyCartMsg.style.display = 'block';
        return;
    }

    elements.cartContent.style.display = 'block';
    elements.emptyCartMsg.style.display = 'none';

    let totalCost = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.quantity;
        totalCost += subtotal;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.name}</td>
            <td>₹${item.price.toFixed(2)}</td>
            <td>
                <div class="qty-control">
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </td>
            <td>₹${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn-danger" onclick="removeFromCart(${item.id})">Remove</button>
            </td>
        `;
        containers.cartTbody.appendChild(tr);
    });

    elements.cartTotal.textContent = totalCost.toFixed(2);
}