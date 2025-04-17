// Main application script for index.html

// DOM Elements
const featuredProductsContainer = document.getElementById('featured-products');

// Display featured products on homepage
function displayFeaturedProducts() {
    if (!featuredProductsContainer) return;
    
    // Get featured products
    const featuredProducts = productsData.filter(product => product.featured);
    
    // Clear container
    featuredProductsContainer.innerHTML = '';
    
    // Display products
    featuredProducts.forEach(product => {
        const productElement = createProductElement(product);
        featuredProductsContainer.appendChild(productElement);
    });
}

// Create product element
function createProductElement(product) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product';
    
    productDiv.innerHTML = `
        <div class="product-img">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        </div>
    `;
    
    return productDiv;
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    displayFeaturedProducts();
    
    // Re-setup add to cart buttons
    setupAddToCartButtons();
});