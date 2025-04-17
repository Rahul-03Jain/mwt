// Shopping cart functionality

// DOM Elements
const cartIcon = document.getElementById('cart-icon');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItems = document.getElementById('cart-items');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');

// Cart state
let cart = [];

// Load cart from localStorage on page load
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add product to cart
function addToCart(productId, quantity = 1) {
    // Find the product in the products data
    const product = productsData.find(p => p.id === productId);
    
    if (!product) return;
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        // Update quantity if product exists
        existingItem.quantity += quantity;
    } else {
        // Add new item to cart
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity
        });
    }
    
    // Save cart to localStorage
    saveCart();
    
    // Update cart UI
    updateCartUI();
    
    // Show notification (optional)
    alert(`${product.name} added to cart!`);
}

// Remove item from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
}

// Update item quantity in cart
function updateCartItemQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        // Ensure quantity is at least 1
        item.quantity = Math.max(1, quantity);
        saveCart();
        updateCartUI();
    }
}

// Calculate cart total
function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart UI
function updateCartUI() {
    // Update cart item count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart items display
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-img">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            <span class="cart-item-remove" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItemElement);
            });
            
            // Add event listeners to quantity buttons and remove buttons
            addCartItemEventListeners();
        }
    }
    
    // Update subtotal
    if (cartSubtotal) {
        cartSubtotal.textContent = `$${calculateCartTotal().toFixed(2)}`;
    }
}

// Add event listeners to cart item controls
function addCartItemEventListeners() {
    // Decrease quantity buttons
    const decreaseButtons = document.querySelectorAll('.quantity-btn.decrease');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item && item.quantity > 1) {
                updateCartItemQuantity(productId, item.quantity - 1);
            }
        });
    });
    
    // Increase quantity buttons
    const increaseButtons = document.querySelectorAll('.quantity-btn.increase');
    increaseButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateCartItemQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    // Quantity input fields
    const quantityInputs = document.querySelectorAll('.quantity-input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.dataset.id);
            const quantity = parseInt(this.value);
            if (!isNaN(quantity) && quantity > 0) {
                updateCartItemQuantity(productId, quantity);
            }
        });
    });
    
    // Remove buttons
    const removeButtons = document.querySelectorAll('.cart-item-remove');
    removeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.id);
            removeFromCart(productId);
        });
    });
}

// Open cart modal
cartIcon.addEventListener('click', function(e) {
    e.preventDefault();
    cartModal.style.display = 'block';
});

// Close cart modal
closeCart.addEventListener('click', function() {
    cartModal.style.display = 'none';
});

// Close cart when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// Checkout button functionality
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty! Add items before checkout.');
            return;
        }
        
        // Check if user is logged in
        if (!isLoggedIn) {
            alert('Please login or register to proceed with checkout.');
            cartModal.style.display = 'none';
            authModal.style.display = 'block';
            return;
        }
        
        // Process checkout
        alert('Processing your order... Thank you for shopping with us!');
        
        // Clear cart after successful checkout
        cart = [];
        saveCart();
        updateCartUI();
        
        // Close cart modal
        cartModal.style.display = 'none';
    });
}

// Add to cart functionality
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = parseInt(this.dataset.id);
            addToCart(productId);
        });
    });
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    
    // Setup "Add to Cart" buttons if any exist on the page
    setupAddToCartButtons();
});