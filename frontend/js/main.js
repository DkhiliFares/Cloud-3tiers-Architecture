// Fichier principal JavaScript pour le site e-commerce

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Gestion du menu mobile
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Gestion du formulaire de newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                // Simuler l'envoi du formulaire
                alert('Merci de vous être inscrit à notre newsletter !');
                emailInput.value = '';
            }
        });
    }
    
    // Gestion des onglets dans les pages de compte et produit
    function setupTabs(tabBtnsSelector, tabContentsSelector) {
        const tabBtns = document.querySelectorAll(tabBtnsSelector);
        const tabContents = document.querySelectorAll(tabContentsSelector);
        
        if (tabBtns.length && tabContents.length) {
            tabBtns.forEach((btn, index) => {
                btn.addEventListener('click', function() {
                    // Retirer la classe active de tous les boutons et contenus
                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));
                    
                    // Ajouter la classe active au bouton cliqué et au contenu correspondant
                    btn.classList.add('active');
                    if (tabContents[index]) {
                        tabContents[index].classList.add('active');
                    }
                });
            });
        }
    }
    
    // Configurer les onglets pour la page de compte
    setupTabs('.account-tab', '.account-content');
    
    // Configurer les onglets pour la page de produit
    setupTabs('.tab-btn', '.tab-content');
    
    // Gestion des options de couleur et de taille sur la page produit
    function setupProductOptions(optionsSelector, activeClass) {
        const options = document.querySelectorAll(optionsSelector);
        
        if (options.length) {
            options.forEach(option => {
                option.addEventListener('click', function() {
                    options.forEach(o => o.classList.remove(activeClass));
                    option.classList.add(activeClass);
                });
            });
        }
    }
    
    // Configurer les options de couleur
    setupProductOptions('.color-option', 'active');
    
    // Configurer les options de taille
    setupProductOptions('.size-option', 'active');
    
    // Gestion des miniatures sur la page produit
    const thumbnails = document.querySelectorAll('.thumbnail');
    const mainImage = document.querySelector('.main-image');
    
    if (thumbnails.length && mainImage) {
        thumbnails.forEach(thumbnail => {
            thumbnail.addEventListener('click', function() {
                const newSrc = this.getAttribute('src');
                mainImage.setAttribute('src', newSrc);
                
                thumbnails.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
    
    // Gestion de la quantité sur la page produit et panier
    function setupQuantityButtons() {
        const decrementBtns = document.querySelectorAll('.quantity-btn[data-action="decrement"]');
        const incrementBtns = document.querySelectorAll('.quantity-btn[data-action="increment"]');
        
        if (decrementBtns.length && incrementBtns.length) {
            decrementBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = this.parentNode.querySelector('.quantity-input');
                    let value = parseInt(input.value);
                    if (value > 1) {
                        input.value = value - 1;
                        // Déclencher un événement de changement pour mettre à jour les totaux si nécessaire
                        input.dispatchEvent(new Event('change'));
                    }
                });
            });
            
            incrementBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const input = this.parentNode.querySelector('.quantity-input');
                    let value = parseInt(input.value);
                    input.value = value + 1;
                    // Déclencher un événement de changement pour mettre à jour les totaux si nécessaire
                    input.dispatchEvent(new Event('change'));
                });
            });
        }
    }
    
    setupQuantityButtons();
    
    // Gestion du panier
    function setupCartFunctionality() {
        const addToCartBtns = document.querySelectorAll('.add-to-cart, .add-to-cart-btn');
        const cartCount = document.getElementById('cart-count');
        
        // Initialiser le panier depuis le localStorage ou créer un nouveau
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Mettre à jour le compteur du panier
        function updateCartCount() {
            if (cartCount) {
                cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
            }
        }
        
        // Mettre à jour le panier dans le localStorage
        function updateCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
        }
        
        // Initialiser le compteur
        updateCartCount();
        
        // Ajouter des écouteurs d'événements aux boutons d'ajout au panier
        if (addToCartBtns.length) {
            addToCartBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Récupérer les informations du produit
                    const productCard = this.closest('.product-card') || this.closest('.product-container');
                    if (!productCard) return;
                    
                    const productId = productCard.getAttribute('data-product-id') || '1';
                    const productName = productCard.querySelector('.product-title')?.textContent || 
                                       productCard.querySelector('h1')?.textContent || 'Produit';
                    const productPrice = parseFloat(productCard.querySelector('.current-price')?.textContent.replace('€', '') || 
                                                  productCard.querySelector('.product-current-price')?.textContent.replace('€', '') || 
                                                  '0');
                    const productImage = productCard.querySelector('img')?.getAttribute('src') || '';
                    
                    // Récupérer la quantité si disponible
                    const quantityInput = productCard.querySelector('.quantity-input');
                    const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
                    
                    // Récupérer les options sélectionnées si disponibles
                    const selectedColor = productCard.querySelector('.color-option.active')?.getAttribute('data-color') || '';
                    const selectedSize = productCard.querySelector('.size-option.active')?.textContent || '';
                    
                    // Vérifier si le produit est déjà dans le panier
                    const existingItemIndex = cart.findIndex(item => 
                        item.id === productId && 
                        item.color === selectedColor && 
                        item.size === selectedSize
                    );
                    
                    if (existingItemIndex !== -1) {
                        // Mettre à jour la quantité si le produit existe déjà
                        cart[existingItemIndex].quantity += quantity;
                    } else {
                        // Ajouter un nouveau produit au panier
                        cart.push({
                            id: productId,
                            name: productName,
                            price: productPrice,
                            image: productImage,
                            quantity: quantity,
                            color: selectedColor,
                            size: selectedSize
                        });
                    }
                    
                    // Mettre à jour le panier
                    updateCart();
                    
                    // Afficher un message de confirmation
                    alert('Produit ajouté au panier !');
                });
            });
        }
        
        // Gestion de la page panier
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        if (cartItemsContainer && cartSummary) {
            // Fonction pour rendre les éléments du panier
            function renderCartItems() {
                cartItemsContainer.innerHTML = '';
                
                if (cart.length === 0) {
                    cartItemsContainer.innerHTML = '<p>Votre panier est vide.</p>';
                    return;
                }
                
                let subtotal = 0;
                
                cart.forEach((item, index) => {
                    const itemTotal = item.price * item.quantity;
                    subtotal += itemTotal;
                    
                    const cartItemHTML = `
                        <div class="cart-item" data-index="${index}">
                            <div class="cart-item-image">
                                <img src="${item.image}" alt="${item.name}">
                            </div>
                            <div class="cart-item-details">
                                <h3 class="cart-item-title">${item.name}</h3>
                                <p class="cart-item-variant">
                                    ${item.color ? `Couleur: ${item.color}` : ''}
                                    ${item.color && item.size ? ' | ' : ''}
                                    ${item.size ? `Taille: ${item.size}` : ''}
                                </p>
                                <p class="cart-item-price">${item.price.toFixed(2)} €</p>
                            </div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn" data-action="decrement">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-index="${index}">
                                <button class="quantity-btn" data-action="increment">+</button>
                            </div>
                            <p class="cart-item-price">${itemTotal.toFixed(2)} €</p>
                            <button class="cart-item-remove" data-index="${index}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    `;
                    
                    cartItemsContainer.innerHTML += cartItemHTML;
                });
                
                // Mettre à jour le résumé du panier
                const shipping = subtotal > 50 ? 0 : 5.99;
                const total = subtotal + shipping;
                
                const summaryHTML = `
                    <div class="summary-row">
                        <span>Sous-total</span>
                        <span>${subtotal.toFixed(2)} €</span>
                    </div>
                    <div class="summary-row">
                        <span>Livraison</span>
                        <span>${shipping.toFixed(2)} €</span>
                    </div>
                    <div class="summary-row total">
                        <span>Total</span>
                        <span>${total.toFixed(2)} €</span>
                    </div>
                    <button class="checkout-btn">Procéder au paiement</button>
                `;
                
                cartSummary.innerHTML = summaryHTML;
                
                // Ajouter des écouteurs d'événements après avoir rendu les éléments
                setupQuantityButtons();
                setupRemoveButtons();
                setupQuantityInputs();
                setupCheckoutButton();
            }
            
            // Configurer les boutons de suppression
            function setupRemoveButtons() {
                const removeButtons = document.querySelectorAll('.cart-item-remove');
                
                removeButtons.forEach(button => {
                    button.addEventListener('click', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        cart.splice(index, 1);
                        updateCart();
                        renderCartItems();
                    });
                });
            }
            
            // Configurer les inputs de quantité
            function setupQuantityInputs() {
                const quantityInputs = document.querySelectorAll('.cart-item-quantity .quantity-input');
                
                quantityInputs.forEach(input => {
                    input.addEventListener('change', function() {
                        const index = parseInt(this.getAttribute('data-index'));
                        const newQuantity = parseInt(this.value);
                        
                        if (newQuantity > 0) {
                            cart[index].quantity = newQuantity;
                        } else {
                            this.value = 1;
                            cart[index].quantity = 1;
                        }
                        
                        updateCart();
                        renderCartItems();
                    });
                });
            }
            
            // Configurer le bouton de paiement
            function setupCheckoutButton() {
                const checkoutBtn = document.querySelector('.checkout-btn');
                
                if (checkoutBtn) {
                    checkoutBtn.addEventListener('click', function() {
                        // Rediriger vers la page de paiement ou afficher un message
                        alert('Redirection vers la page de paiement...');
                        // window.location.href = 'checkout.html';
                    });
                }
            }
            
            // Rendre les éléments du panier au chargement de la page
            renderCartItems();
        }
    }
    
    setupCartFunctionality();
    
    // Fonctionnalités du tableau de bord administrateur
    function setupAdminDashboard() {
        const adminMenuItems = document.querySelectorAll('.admin-menu-item');
        
        if (adminMenuItems.length) {
            adminMenuItems.forEach(item => {
                item.addEventListener('click', function() {
                    adminMenuItems.forEach(i => i.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Ici, vous pourriez charger le contenu correspondant
                    // ou rediriger vers la page appropriée
                });
            });
        }
    }
    
    setupAdminDashboard();
});





