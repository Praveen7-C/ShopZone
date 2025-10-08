// scripts.js
// Product Data loaded from JSON file
        let productsData = null;

        // Load products data from JSON file
        async function loadProductsData() {
            try {
                const response = await fetch('productsData.json');
                if (!response.ok) {
                    throw new Error('Failed to load products data');
                }
                productsData = await response.json();
                filteredProducts = [...productsData.products];
        } catch (error) {
            console.error('Error loading products data:', error);
            // Fallback to empty data
            productsData = { products: [], categories: [] };
            filteredProducts = [];
        }
        }

        // Apply filters function
        function applyFilters() {
            let products = [...productsData.products];
            // Apply search
            if (searchTerm) {
                products = products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                );
            }
            // Apply category
            if (selectedCategory !== 'all') {
                products = products.filter(product => product.category === selectedCategory);
            }
            // Apply price
            products = products.filter(product => product.price <= maxPrice);
            // Apply sort
            switch(sortBy) {
                case 'price-low':
                    products.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    products.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    products.sort((a, b) => b.rating - a.rating);
                    break;
                case 'name':
                    products.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    // no sort
                    break;
            }
            filteredProducts = products;
            loadProducts();
        }

        // Application State
        let currentUser = null;
        let users = [];
        let cart = [];
        let wishlist = [];
        let filteredProducts = [];
        let searchTerm = '';
        let selectedCategory = 'all';
        let maxPrice = 50000;
        let sortBy = 'default';
        let currentPage = 'home';

        // Simple password hashing (for demo purposes - not secure for production)
        function hashPassword(password) {
            let hash = 0;
            for (let i = 0; i < password.length; i++) {
                const char = password.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash; // Convert to 32-bit integer
            }
            return hash.toString();
        }

        // Load users from localStorage
        function loadUsers() {
            const savedUsers = localStorage.getItem('users');
            if (savedUsers) {
                users = JSON.parse(savedUsers);
            }
        }

        // Save users to localStorage
        function saveUsers() {
            localStorage.setItem('users', JSON.stringify(users));
        }

        // Initialize the application
        (async () => {
            await loadProductsData();
            loadCategories();
            loadProducts();
            updateCartBadge();
            checkUserSession();
            loadWishlist();
            loadUsers();

            // Set current year in footer
            document.getElementById('currentYear').textContent = new Date().getFullYear();
        })();

        // User Authentication
        function checkUserSession() {
            const savedUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
            if (savedUser) {
                currentUser = savedUser;
                updateUserGreeting();
            }
        }

        function updateUserGreeting() {
            const greeting = document.getElementById('userGreeting');
            const signInLink = document.getElementById('signInLink');
            const signOutLink = document.getElementById('signOutLink');
            const userDropdown = document.getElementById('userDropdown');
            const navbarWelcome = document.getElementById('navbarWelcome');
            if (currentUser) {
                signInLink.classList.add('d-none');
                signOutLink.classList.remove('d-none');
                userDropdown.classList.remove('d-none');
                navbarWelcome.classList.remove('d-none');
                greeting.textContent = `Welcome, ${currentUser.name}!`;
                navbarWelcome.textContent = `Welcome, ${currentUser.name}!`;
                document.getElementById('userFullName').textContent = currentUser.name || '';
                document.getElementById('userEmail').textContent = currentUser.email || '';
                document.getElementById('userPhone').textContent = currentUser.phone || '';
                document.getElementById('userDeliveryAddress').textContent = currentUser.deliveryAddress || '';
            } else {
                signInLink.classList.remove('d-none');
                signOutLink.classList.add('d-none');
                userDropdown.classList.add('d-none');
                navbarWelcome.classList.add('d-none');
                greeting.textContent = 'Sign In';
                navbarWelcome.textContent = '';
                document.getElementById('userFullName').textContent = '';
                document.getElementById('userEmail').textContent = '';
                document.getElementById('userPhone').textContent = '';
                document.getElementById('userDeliveryAddress').textContent = '';
            }
        }

        // Navigation Functions
        function showHome() {
            hideAllPages();
            document.getElementById('homePage').style.display = 'block';
            currentPage = 'home';
        }

        function showCart() {
            hideAllPages();
            document.getElementById('cartPage').style.display = 'block';
            loadCartItems();
            currentPage = 'cart';
        }

        function showWishlist() {
            hideAllPages();
            document.getElementById('wishlistPage').style.display = 'block';
            loadWishlistItems();
            currentPage = 'wishlist';
        }

        function showProfile() {
            hideAllPages();
            document.getElementById('profilePage').style.display = 'block';
            loadProfile();
            currentPage = 'profile';
        }

        function showOrderHistory() {
            hideAllPages();
            document.getElementById('orderHistoryPage').style.display = 'block';
            loadOrderHistory();
            currentPage = 'orderHistory';
        }

        function showLogin() {
            const modal = new bootstrap.Modal(document.getElementById('loginModal'));
            modal.show();
        }

        function showLoginModal() {
            const modal = new bootstrap.Modal(document.getElementById('loginModal'));
            modal.show();
        }

        function showRegisterModal() {
            const modal = new bootstrap.Modal(document.getElementById('registerModal'));
            modal.show();
        }

        function logout() {
            const modal = new bootstrap.Modal(document.getElementById('logoutModal'));
            modal.show();
        }

        function confirmLogout() {
            currentUser = null;
            localStorage.removeItem('currentUser');
            updateUserGreeting();
            showToast('Logged out successfully!');
            showHome();
            const modal = bootstrap.Modal.getInstance(document.getElementById('logoutModal'));
            modal.hide();
        }

        function showRegister() {
            const modal = new bootstrap.Modal(document.getElementById('registerModal'));
            modal.show();
        }

        function showForgotPassword() {
            const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
            modal.show();
        }

        function hideAllPages() {
            document.getElementById('homePage').style.display = 'none';
            document.getElementById('cartPage').style.display = 'none';
            document.getElementById('wishlistPage').style.display = 'none';
            document.getElementById('profilePage').style.display = 'none';
            document.getElementById('orderHistoryPage').style.display = 'none';
        }

        // Load Categories
        function loadCategories() {
            const container = document.getElementById('categoriesContainer');
            container.innerHTML = '';
            
            productsData.categories.forEach(category => {
                const categoryCard = `
                    <div class="col-lg-2 col-md-4 col-sm-6 mb-4">
                        <div class="card category-card h-100" onclick="filterByCategory('${category.id}')">
                            <img src="${category.image}" class="card-img-top" alt="${category.name}" style="height: 150px; object-fit: cover;">
                            <div class="card-body text-center">
                                <h6 class="card-title">${category.name}</h6>
                    <small class="text-muted">${productsData.products.filter(p => p.category === category.id).length} items</small>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += categoryCard;
            });
        }

        // Load Products
        function loadProducts() {
            const container = document.getElementById('productsContainer');
            container.innerHTML = '';
            
            filteredProducts.forEach(product => {
                const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));
                
                const productCard = `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div class="card product-card">
                            <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                            <div class="card-body">
                                <h6 class="card-title">${product.name}</h6>
                                <p class="card-text text-muted small">${product.description}</p>
                                <div class="rating mb-2">
                                    <span class="text-warning">${stars}</span>
                                    <small class="text-muted">(${product.reviews})</small>
                                </div>
                                <div class="price-container mb-3">
                                    <span class="price">Rs. ${product.price}</span>
                                    ${product.originalPrice > product.price ?
                                        `<small class="text-muted text-decoration-line-through ms-2">Rs. ${product.originalPrice}</small>
                                         <span class="badge bg-danger ms-2">${discount}% off</span>` : ''
                                    }
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-cart flex-fill" onclick="addToCart(${product.id})">
                                        <i class="fas fa-cart-plus"></i> Add to Cart
                                    </button>
                                    <button class="btn btn-outline-danger" onclick="addToWishlist(${product.id})">
                                        <i class="fas fa-heart"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += productCard;
            });
            
            if (filteredProducts.length === 0) {
                container.innerHTML = `
                    <div class="col-12 text-center">
                        <div class="alert alert-info">
                            <h5>No products found</h5>
                            <p>Try adjusting your filters or search terms.</p>
                        </div>
                    </div>
                `;
            }
        }

        // Search Products
        function searchProducts(isMobile = false) {
            const searchInput = isMobile ? 
                document.getElementById('mobileSearchInput') : 
                document.getElementById('searchInput');
            const searchTerm = searchInput.value.toLowerCase().trim();
            
            if (searchTerm === '') {
                filteredProducts = [...productsData.products];
            } else {
                filteredProducts = productsData.products.filter(product =>
                    product.name.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                );
            }
            
            loadProducts();
            
            // Show home page if not already visible
            if (currentPage !== 'home') {
                showHome();
            }
            
            // Scroll to products section
            document.getElementById('productsSection').scrollIntoView();
        }

        // Filter by Category
        function filterByCategory(category) {
            const categoryFilter = document.getElementById('categoryFilter');
            if (categoryFilter) {
                categoryFilter.value = category || 'all';
            }

            const priceRange = document.getElementById('priceRange');
            const maxPrice = parseFloat(priceRange.value);

            let baseProducts;
            if (category === 'all' || !category) {
                baseProducts = productsData.products;
            } else {
                baseProducts = productsData.products.filter(product => product.category === category);
            }

            filteredProducts = baseProducts.filter(product => product.price <= maxPrice);

            loadProducts();

            // Show home page if not already visible
            if (currentPage !== 'home') {
                showHome();
            }

            // Scroll to products section
            document.getElementById('productsSection').scrollIntoView();
        }

        // Filter by Price
        function filterByPrice() {
            const priceRange = document.getElementById('priceRange');
            const priceValue = document.getElementById('priceValue');
            const maxPrice = parseFloat(priceRange.value);
            
            priceValue.textContent = maxPrice;
            
            const categoryFilter = document.getElementById('categoryFilter');
            const selectedCategory = categoryFilter.value;
            
            let baseProducts = selectedCategory === 'all' ? 
                productsData.products : 
                productsData.products.filter(product => product.category === selectedCategory);
            
            filteredProducts = baseProducts.filter(product => product.price <= maxPrice);
            loadProducts();
        }

        // Sort Products
        function sortProducts() {
            const sortSelect = document.getElementById('sortSelect');
            const sortBy = sortSelect.value;
            
            switch(sortBy) {
                case 'price-low':
                    filteredProducts.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filteredProducts.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filteredProducts.sort((a, b) => b.rating - a.rating);
                    break;
                case 'name':
                    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                default:
                    filteredProducts = [...productsData.products];
            }
            
            loadProducts();
        }

        // Cart Functions
        function addToCart(productId) {
            const product = productsData.products.find(p => p.id === productId);
            if (!product) return;
            
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }
            
            updateCartBadge();
            showToast(`${product.name} added to cart!`);
            saveCart();
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCartBadge();
            loadCartItems();
            showToast('Item removed from cart!');
            saveCart();
        }

        function updateQuantity(productId, newQuantity) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
                return;
            }
            
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
                updateCartBadge();
                loadCartItems();
                saveCart();
            }
        }

        function updateCartBadge() {
            const badge = document.getElementById('cartBadge');
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
        }

        function loadCartItems() {
            const container = document.getElementById('cartItems');
            const subtotalElement = document.getElementById('cartSubtotal');
            const taxElement = document.getElementById('cartTax');
            const totalElement = document.getElementById('cartTotal');
            
            if (cart.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                        <h4>Your cart is empty</h4>
                        <p class="text-muted">Add some products to get started!</p>
                        <button class="btn btn-cart" onclick="showHome()">Continue Shopping</button>
                    </div>
                `;
                subtotalElement.textContent = 'Rs.0.00';
                taxElement.textContent = 'Rs.0.00';
                totalElement.textContent = 'Rs.0.00';
                return;
            }
            
            container.innerHTML = '';
            let subtotal = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const cartItem = `
                    <div class="cart-item">
                        <div class="row align-items-center">
                            <div class="col-md-2">
                                <img src="${item.image}" class="img-fluid rounded" alt="${item.name}">
                            </div>
                            <div class="col-md-4">
                                <h6>${item.name}</h6>
                                <p class="text-muted small">${item.description}</p>
                                <span class="price">Rs. ${item.price}</span>
                            </div>
                            <div class="col-md-3">
                                <div class="input-group">
                                    <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                    <input type="number" class="form-control text-center" value="${item.quantity}" min="1" 
                                           onchange="updateQuantity(${item.id}, parseInt(this.value))">
                                    <button class="btn btn-outline-secondary" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <strong>Rs. ${itemTotal.toFixed(2)}</strong>
                            </div>
                            <div class="col-md-1">
                                <button class="btn btn-outline-danger btn-sm" onclick="removeFromCart(${item.id})">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += cartItem;
            });
            
            const shipping = subtotal > 500 ? 0 : 50;
            document.getElementById('cartShipping').textContent = shipping === 0 ? 'Free' : `Rs. ${shipping.toFixed(2)}`;
            const tax = subtotal * 0.08; // 8% tax
            const total = subtotal + shipping + tax;

                subtotalElement.textContent = `Rs. ${subtotal.toFixed(2)}`;
                taxElement.textContent = `Rs. ${tax.toFixed(2)}`;
                totalElement.textContent = `Rs. ${total.toFixed(2)}`;
        }

        function checkout() {
            if (cart.length === 0) {
                showToast('Your cart is empty!');
                return;
            }

            if (!currentUser) {
                showToast('Please sign in to checkout');
                showLogin();
                return;
            }

            // Simulate checkout process
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = total > 500 ? 0 : 50;
            const tax = total * 0.08;
            const finalTotal = total + shipping + tax;

            if (confirm(`Complete your order for Rs. ${finalTotal.toFixed(2)}?`)) {
                const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
                orderHistory.push({
                    id: Date.now(),
                    date: new Date().toISOString(),
                    items: [...cart],
                    total: finalTotal.toFixed(2)
                });
                localStorage.setItem('orderHistory', JSON.stringify(orderHistory));

                cart = [];
                updateCartBadge();
                saveCart();
                showToast('Order placed successfully! Thank you for shopping with us.');
                showHome();
            }
        }

        // Wishlist Functions
        function addToWishlist(productId) {
            const product = productsData.products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = wishlist.find(item => item.id === productId);

            if (!existingItem) {
                wishlist.push(product);
                updateWishlistBadge();
                showToast(`${product.name} added to wishlist!`);
                saveWishlist();
            } else {
                showToast(`${product.name} is already in your wishlist!`);
            }
        }

        function removeFromWishlist(productId) {
            if (confirm('Are you sure you want to remove this item from your wishlist?')) {
                wishlist = wishlist.filter(item => item.id !== productId);
                updateWishlistBadge();
                loadWishlistItems();
                showToast('Item removed from wishlist!');
                saveWishlist();
            }
        }

        function updateWishlistBadge() {
            const badge = document.getElementById('wishlistBadge');
            badge.textContent = wishlist.length;
        }

        function loadWishlistItems() {
            const container = document.getElementById('wishlistItems');

            if (wishlist.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-heart fa-3x text-muted mb-3"></i>
                        <h4>Your wishlist is empty</h4>
                        <p class="text-muted">Add some products to your wishlist!</p>
                        <button class="btn btn-cart" onclick="showHome()">Continue Shopping</button>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            wishlist.forEach(product => {
                const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
                const stars = '★'.repeat(Math.floor(product.rating)) + '☆'.repeat(5 - Math.floor(product.rating));

                const wishlistItem = `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div class="card product-card">
                            <img src="${product.image}" class="card-img-top product-image" alt="${product.name}">
                            <div class="card-body">
                                <h6 class="card-title">${product.name}</h6>
                                <p class="card-text text-muted small">${product.description}</p>
                                <div class="rating mb-2">
                                    <span class="text-warning">${stars}</span>
                                    <small class="text-muted">(${product.reviews})</small>
                                </div>
                                <div class="price-container mb-3">
                                    <span class="price">Rs. ${product.price}</span>
                                    ${product.originalPrice > product.price ?
                                        `<small class="text-muted text-decoration-line-through ms-2">Rs. ${product.originalPrice}</small>
                                         <span class="badge bg-danger ms-2">${discount}% off</span>` : ''
                                    }
                                </div>
                                <div class="d-flex gap-2">
                                    <button class="btn btn-cart flex-fill" onclick="addToCart(${product.id})">
                                        <i class="fas fa-cart-plus"></i> Add to Cart
                                    </button>
                                    <button class="btn btn-outline-danger" onclick="removeFromWishlist(${product.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += wishlistItem;
            });
        }

        function saveWishlist() {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }

        function loadWishlist() {
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                wishlist = JSON.parse(savedWishlist);
                updateWishlistBadge();
            }
        }

        function loadProfile() {
            if (!currentUser) return;

            document.getElementById('profileName').value = currentUser.name || '';
            document.getElementById('profileEmail').value = currentUser.email || '';
            document.getElementById('profilePhone').value = currentUser.phone || '';
            document.getElementById('profileDeliveryAddress').value = currentUser.deliveryAddress || '';
        }

        function loadOrderHistory() {
            const container = document.getElementById('orderHistoryItems');

            // Mock order history data (in a real app, this would come from server)
            const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');

            if (orderHistory.length === 0) {
                container.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-shopping-bag fa-3x text-muted mb-3"></i>
                        <h4>No orders yet</h4>
                        <p class="text-muted">Your order history will appear here once you make a purchase.</p>
                        <button class="btn btn-cart" onclick="showHome()">Start Shopping</button>
                    </div>
                `;
                return;
            }

            container.innerHTML = '';
            orderHistory.forEach(order => {
                const orderCard = `
                    <div class="card mb-3">
                        <div class="card-header">
                            <div class="row">
                                <div class="col-md-6">
                                    <strong>Order #${order.id}</strong>
                                </div>
                                <div class="col-md-6 text-end">
                                    <small class="text-muted">${new Date(order.date).toLocaleDateString()}</small>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-8">
                                    <h6>Items:</h6>
                                    <ul class="list-unstyled">
                                        ${order.items.map(item => `<li>${item.name} (x${item.quantity}) - Rs. ${item.price * item.quantity}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="col-md-4 text-end">
                                    <h5 class="text-success">Total: Rs. ${order.total}</h5>
                                    <span class="badge bg-success">Delivered</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += orderCard;
            });
        }

        // Authentication Forms
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            // Clear previous validation states
            clearValidationStates(emailInput, passwordInput);

            // Enhanced validation
            let isValid = true;

            // Email validation
            if (!email) {
                showValidationError(emailInput, 'Email address is required');
                isValid = false;
            } else if (!isValidEmail(email)) {
                showValidationError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }

            // Password validation
            if (!password) {
                showValidationError(passwordInput, 'Password is required');
                isValid = false;
            } else if (password.length < 6) {
                showValidationError(passwordInput, 'Password must be at least 6 characters long');
                isValid = false;
            }

            if (isValid) {
                // Find user by email
                const user = users.find(u => u.email === email);
                if (!user) {
                    showValidationError(emailInput, 'No account found with this email address');
                    return;
                }

                // Check password
                const hashedPassword = hashPassword(password);
                if (user.password !== hashedPassword) {
                    showValidationError(passwordInput, 'Incorrect password');
                    return;
                }

                // Login successful
                currentUser = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    deliveryAddress: user.deliveryAddress
                };

                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserGreeting();
                showToast(`Welcome back, ${currentUser.name}!`);
                showHome();

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
                modal.hide();
            }
        });

        // Real-time validation for login form
        document.getElementById('email').addEventListener('blur', function() {
            const email = this.value.trim();
            clearValidationStates(this);

            if (!email) {
                showValidationError(this, 'Email address is required');
            } else if (!isValidEmail(email)) {
                showValidationError(this, 'Please enter a valid email address');
            } else {
                showValidationSuccess(this);
            }
        });

        document.getElementById('password').addEventListener('blur', function() {
            const password = this.value;
            clearValidationStates(this);

            if (!password) {
                showValidationError(this, 'Password is required');
            } else if (password.length < 6) {
                showValidationError(this, 'Password must be at least 6 characters long');
            } else {
                showValidationSuccess(this);
            }
        });

        // Utility functions for validation
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }

        function showValidationError(input, message) {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');

            // Remove existing error message
            const existingError = input.parentNode.querySelector('.invalid-feedback');
            if (existingError) {
                existingError.remove();
            }

            // Add error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'invalid-feedback';
            errorDiv.textContent = message;
            input.parentNode.appendChild(errorDiv);
        }

        function showValidationSuccess(input) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');

            // Remove existing error message
            const existingError = input.parentNode.querySelector('.invalid-feedback');
            if (existingError) {
                existingError.remove();
            }
        }

        function clearValidationStates(...inputs) {
            inputs.forEach(input => {
                input.classList.remove('is-valid', 'is-invalid');
                const existingError = input.parentNode.querySelector('.invalid-feedback');
                if (existingError) {
                    existingError.remove();
                }
            });
        }

        document.getElementById('registerForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('regName').value;
            const email = document.getElementById('regEmail').value;
            const phone = document.getElementById('regPhone').value;
            const deliveryAddress = document.getElementById('regDeliveryAddress').value;
            const password = document.getElementById('regPassword').value;
            const confirmPassword = document.getElementById('regConfirmPassword').value;

            if (password !== confirmPassword) {
                showToast('Passwords do not match!');
                return;
            }

            // Check if user already exists
            const existingUser = users.find(user => user.email === email);
            if (existingUser) {
                showToast('An account with this email already exists!');
                return;
            }

            if (name && email && password) {
                const hashedPassword = hashPassword(password);
                const newUser = {
                    id: Date.now(),
                    name: name,
                    email: email,
                    phone: phone,
                    deliveryAddress: deliveryAddress,
                    password: hashedPassword
                };

                users.push(newUser);
                saveUsers();

                currentUser = {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    phone: newUser.phone,
                    deliveryAddress: newUser.deliveryAddress
                };

                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserGreeting();
                showToast(`Welcome to ShopZone, ${currentUser.name}!`);
                showHome();

                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
                modal.hide();
            }
        });

        document.getElementById('profileForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const name = document.getElementById('profileName').value;
            const email = document.getElementById('profileEmail').value;
            const phone = document.getElementById('profilePhone').value;
            const deliveryAddress = document.getElementById('profileDeliveryAddress').value;

            if (name && email) {
                // Track what changed for better feedback
                const changes = [];
                if (currentUser.name !== name) changes.push('name');
                if (currentUser.email !== email) changes.push('email');
                if (currentUser.phone !== phone) changes.push('phone');
                if (currentUser.deliveryAddress !== deliveryAddress) changes.push('delivery address');

                currentUser.name = name;
                currentUser.email = email;
                currentUser.phone = phone;
                currentUser.deliveryAddress = deliveryAddress;

                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateUserGreeting();

                // Enhanced success feedback
                let successMessage = 'Profile updated successfully!';
                if (changes.length > 0) {
                    successMessage += ` Updated: ${changes.join(', ')}.`;
                }

                showToast(successMessage);

                // Add visual feedback to the form
                const form = document.getElementById('profileForm');
                const submitBtn = form.querySelector('button[type="submit"]');

                // Temporarily change button text and style
                const originalText = submitBtn.textContent;
                submitBtn.innerHTML = '<i class="fas fa-check"></i> Updated!';
                submitBtn.classList.remove('btn-cart');
                submitBtn.classList.add('btn-success');

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.classList.remove('btn-success');
                    submitBtn.classList.add('btn-cart');
                }, 3000);

                // Add success border to form
                form.classList.add('border-success', 'border-2');
                setTimeout(() => {
                    form.classList.remove('border-success', 'border-2');
                }, 3000);
            }
        });

        document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('currentEmail').value.trim();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;

            // Validation
            if (!email || !isValidEmail(email)) {
                showToast('Please enter a valid email address.');
                return;
            }

            if (!newPassword || newPassword.length < 6) {
                showToast('Password must be at least 6 characters long.');
                return;
            }

            if (newPassword !== confirmPassword) {
                showToast('Passwords do not match.');
                return;
            }

            // Find user
            const userIndex = users.findIndex(u => u.email === email);
            if (userIndex === -1) {
                showToast('No account found with this email address.');
                return;
            }

            // Update password
            users[userIndex].password = hashPassword(newPassword);
            saveUsers();

            showToast('Password reset successfully!');

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
            modal.hide();

            // Clear form
            document.getElementById('currentEmail').value = '';
            document.getElementById('newPassword').value = '';
            document.getElementById('confirmNewPassword').value = '';
        });

        // Utility Functions
        function showToast(message) {
            const toastElement = document.getElementById('toast');
            const toastMessage = document.getElementById('toastMessage');
            
            toastMessage.textContent = message;
            
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
        }

        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        function loadCart() {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCartBadge();
            }
        }

        // Search on Enter key
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts(false);
            }
        });

        document.getElementById('mobileSearchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts(true);
            }
        });

        // Load cart on page load
        loadCart();