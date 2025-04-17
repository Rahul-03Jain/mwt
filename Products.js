// Products page script

// DOM Elements
const allProductsContainer = document.getElementById('all-products');
const paginationContainer = document.getElementById('pagination');
const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');
const searchInput = document.getElementById('search-products');
const searchBtn = document.querySelector('.search-btn');

// Pagination settings
const productsPerPage = 8;
let currentPage = 1;
let filteredProducts = [];

// Initialize products page
function initProductsPage() {
    // Start with all products
    filteredProducts = [...productsData];
    
    // Setup event listeners
    setupFilters();
    
    // Display products
    displayProducts();
}

// Setup filter event listeners
function setupFilters() {
    // Category filter
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            currentPage = 1;
            filterProducts();
        });
    }
    
    // Sort filter
    if (sortFilter) {
        sortFilter.addEventListener('change', function() {
            filterProducts();
        });
    }
    
    // Search
    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            currentPage = 1;
            filterProducts();
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                currentPage = 1;
                filterProducts();
            }
        });
    }
}

// Filter products based on criteria
function filterProducts() {
    // Start with all products
    let filtered = [...productsData];
    
    // Filter by category
    if (categoryFilter && categoryFilter.value !== 'all') {
        filtered = filtered.filter(product => product.category === categoryFilter.value);
    }
    
    // Filter by search term
    if (searchInput && searchInput.value.trim() !== '') {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Sort products
    if (sortFilter) {
        switch (sortFilter.value) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filtered.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                // Default sort (by id)
                filtered.sort((a, b) => a.id - b.id);
        }
    }
    
    // Update filtered products
    filteredProducts = filtered;
    
    // Display products
    displayProducts();
}

// Display products with pagination
function displayProducts() {
    if (!allProductsContainer) return;
    
    // Clear container
    allProductsContainer.innerHTML = '';
    
    // Calculate pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Display products for current page
    if (productsToShow.length === 0) {
        allProductsContainer.innerHTML = '<p class="no-products">No products found matching your criteria.</p>';
    } else {
        productsToShow.forEach(product => {
            const productElement = createProductElement(product);
            allProductsContainer.appendChild(productElement);
        });
    }
    
    // Setup pagination
    displayPagination(totalPages);
    
    // Re-setup add to cart buttons
    setupAddToCartButtons();
}

// Display pagination controls
function displayPagination(totalPages) {
    if (!paginationContainer) return;
    
    // Clear pagination container
    paginationContainer.innerHTML = '';
    
    // Don't show pagination if only one page
    if (totalPages <= 1) return;
    
    // Previous button
    const prevBtn = document.createElement('span');
    prevBtn.className = 'pagination-btn prev';
    prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevBtn.addEventListener('click', function() {
        if (currentPage > 1) {
            currentPage--;
            displayProducts();
        }
    });
    paginationContainer.appendChild(prevBtn);
    
    // Page buttons
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if end page is at the limit
    if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('span');
        pageBtn.className = `pagination-btn ${i === currentPage ? 'active' : ''}`;
        pageBtn.textContent = i;
        pageBtn.addEventListener('click', function() {
            currentPage = i;
            displayProducts();
        });
        paginationContainer.appendChild(pageBtn);
    }
    
    // Next button
    const nextBtn = document.createElement('span');
    nextBtn.className = 'pagination-btn next';
    nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextBtn.addEventListener('click', function() {
        if (currentPage < totalPages) {
            currentPage++;
            displayProducts();
        }
    });
    paginationContainer.appendChild(nextBtn);
}

// Create product element (same as in app.js)
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

// Initialize products page on DOM content loaded
document.addEventListener('DOMContentLoaded', function() {
    initProductsPage();
});