// Authentication functionality for login and registration

// DOM Elements
const userIcon = document.getElementById('user-icon');
const authModal = document.getElementById('auth-modal');
const closeAuth = document.getElementById('close-auth');
const loginTab = document.getElementById('login-tab');
const registerTab = document.getElementById('register-tab');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// User states
let isLoggedIn = false;
let currentUser = null;

// Check if user is already logged in
function checkLoggedInStatus() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        isLoggedIn = true;
        updateUserInterface();
    }
}

// Update UI based on login status
function updateUserInterface() {
    const userIcon = document.getElementById('user-icon');
    
    if (isLoggedIn) {
        userIcon.innerHTML = `<i class="fas fa-user-check"></i>`;
        userIcon.title = `Logged in as ${currentUser.name}`;
    } else {
        userIcon.innerHTML = `<i class="fas fa-user"></i>`;
        userIcon.title = 'Login / Register';
    }
}

// Open auth modal
userIcon.addEventListener('click', function() {
    if (isLoggedIn) {
        // If user is logged in, show user menu or logout option
        if (confirm('Would you like to log out?')) {
            logout();
        }
    } else {
        // If user is not logged in, show auth modal
        authModal.style.display = 'block';
    }
});

// Close auth modal
closeAuth.addEventListener('click', function() {
    authModal.style.display = 'none';
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === authModal) {
        authModal.style.display = 'none';
    }
});

// Switch between login and register tabs
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

// Handle login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Get users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Successful login
        currentUser = user;
        isLoggedIn = true;
        
        // Save current user to local storage
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Update UI
        updateUserInterface();
        
        // Close modal
        authModal.style.display = 'none';
        
        // Show success message
        alert('Login successful!');
    } else {
        // Failed login
        alert('Invalid email or password. Please try again.');
    }
});

// Handle register form submission
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // Validate form
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    // Get existing users from local storage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        alert('Email already registered. Please use a different email.');
        return;
    }
    
    // Create new user
    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password
    };
    
    // Add new user to users array
    users.push(newUser);
    
    // Save users to local storage
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto login
    currentUser = newUser;
    isLoggedIn = true;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Update UI
    updateUserInterface();
    
    // Close modal
    authModal.style.display = 'none';
    
    // Show success message
    alert('Registration successful! You are now logged in.');
});

// Logout function
function logout() {
    localStorage.removeItem('currentUser');
    isLoggedIn = false;
    currentUser = null;
    updateUserInterface();
    alert('You have been logged out.');
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', function() {
    checkLoggedInStatus();
});