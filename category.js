// category.js - Handles category page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Handle authentication modal
    const userIcon = document.getElementById('user-icon');
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('close-auth');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (userIcon && authModal) {
        userIcon.addEventListener('click', function() {
            authModal.style.display = 'block';
        });
    }

    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        });

        registerTab.addEventListener('click', function() {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerForm.classList.add('active');
            loginForm.classList.remove('active');
        });
    }

    // Handle cart modal
    const cartIcon = document.getElementById('cart-icon');
    const cartModal = document.getElementById('cart-modal');
    const closeCartBtn = document.getElementById('close-cart');

    if (cartIcon && cartModal) {
        cartIcon.addEventListener('click', function() {
            cartModal.style.display = 'block';
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', function() {
            cartModal.style.display = 'none';
        });
    }

    // Close modals when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Handle subcategory filtering
    const subcategorySelect = document.getElementById('subcategory');
    if (subcategorySelect) {
        subcategorySelect.addEventListener('change', function() {
            filterProducts();
        });
    }

    // Handle sorting
    const sortBySelect = document.getElementById('sort-by');
    if (sortBySelect) {
        sortBySelect.addEventListener('change', function() {
            sortProducts();
        });
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    const product = e.target.closest('.product');
    const productName = product.querySelector('h3').textContent;
    const productPrice = product.querySelector('.price').textContent;
    const productImage = product.querySelector('img').src;
    
    addToCart(productName, productPrice, productImage);
    updateCartCount();
    
    // Show mini notification
    showNotification(`${productName} added to cart!`);
  });
});

// Cart functionality
function addToCart(name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  // Check if product already exists in cart
  const existingProduct = cart.find(item => item.name === name);
  
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      image: image,
      quantity: 1
    });
  }
  
  localStorage.setItem('cart', JSON.stringify(cart));
  displayCartItems();
}

function displayCartItems() {
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (!cartItems) return;
  
  cartItems.innerHTML = '';
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let total = 0;
  
  cart.forEach(item => {
    const priceValue = parseFloat(item.price.replace(/[^0-9.-]+/g, ''));
    total += priceValue * item.quantity;
    
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-details">
        <h4>${item.name}</h4>
        <p>${item.price} x ${item.quantity}</p>
      </div>
      <button class="remove-item" data-name="${item.name}">×</button>
    `;
    cartItems.appendChild(cartItem);
  });
  
  cartTotal.textContent = `$${total.toFixed(2)}`;
  
  // Add event listeners to remove buttons
  document.querySelectorAll('.remove-item').forEach(button => {
    button.addEventListener('click', function() {
      removeFromCart(this.getAttribute('data-name'));
    });
  });
}

function removeFromCart(name) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart = cart.filter(item => item.name !== name);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  displayCartItems();
  updateCartCount();
}

function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;
  
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  
  cartCount.textContent = count;
  if (count > 0) {
    cartCount.style.display = 'block';
  } else {
    cartCount.style.display = 'none';
  }
}

function showNotification(message) {
  const notification = document.getElementById('notification') || createNotificationElement();
  notification.textContent = message;
  notification.classList.add('show');
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 3000);
}

function createNotificationElement() {
  const notification = document.createElement('div');
  notification.id = 'notification';
  notification.className = 'notification';
  document.body.appendChild(notification);
  return notification;
}

// Filter products based on subcategory
function filterProducts() {
  const subcategory = document.getElementById('subcategory').value;
  const products = document.querySelectorAll('.product');
  
  products.forEach(product => {
    if (subcategory === 'all' || product.dataset.subcategory === subcategory) {
      product.style.display = 'block';
    } else {
      product.style.display = 'none';
    }
  });
}

// Sort products based on selection
function sortProducts() {
  const sortBy = document.getElementById('sort-by').value;
  const productsContainer = document.querySelector('.products-grid');
  const products = Array.from(document.querySelectorAll('.product'));
  
  products.sort((a, b) => {
    if (sortBy === 'price-low') {
      const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ''));
      const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ''));
      return priceA - priceB;
    } else if (sortBy === 'price-high') {
      const priceA = parseFloat(a.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ''));
      const priceB = parseFloat(b.querySelector('.price').textContent.replace(/[^0-9.-]+/g, ''));
      return priceB - priceA;
    } else if (sortBy === 'name') {
      const nameA = a.querySelector('h3').textContent;
      const nameB = b.querySelector('h3').textContent;
      return nameA.localeCompare(nameB);
    }
    return 0;
  });
  
  // Clear and re-append sorted products
  productsContainer.innerHTML = '';
  products.forEach(product => {
    productsContainer.appendChild(product);
  });
}

// Initialize on page load
displayCartItems();
updateCartCount();
});