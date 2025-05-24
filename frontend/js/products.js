// Gestion des produits pour le site e-commerce

// Données de produits fictives pour la démonstration

// Fonction pour générer le HTML d'un produit
function generateProductHTML(product) {
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="placeholder-img">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <p class="product-category">${product.category}</p>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">${product.price.toFixed(2)} €</span>
                    ${product.oldPrice ? `<span class="old-price">${product.oldPrice.toFixed(2)} €</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="add-to-cart"><i class="fas fa-shopping-cart"></i> Ajouter</button>
                    <button class="wishlist-btn"><i class="far fa-heart"></i></button>
                </div>
            </div>
        </div>
    `;
}

// Fonction pour afficher les produits en vedette sur la page d'accueil
function displayFeaturedProducts() {
    const featuredProductsContainer = document.getElementById('featured-products');
    if (featuredProductsContainer) {
        // Sélectionner les 4 premiers produits pour la page d'accueil
        const featuredProducts = productsData.slice(0, 4);
        
        let productsHTML = '';
        featuredProducts.forEach(product => {
            productsHTML += generateProductHTML(product);
        });
        
        featuredProductsContainer.innerHTML = productsHTML;
    }
}

// Fonction pour afficher tous les produits sur la page de catégorie
function displayCategoryProducts(category) {
    const productsContainer = document.getElementById('category-products');
    if (productsContainer) {
        // Filtrer les produits par catégorie si spécifié
        const filteredProducts = category 
            ? productsData.filter(product => product.category.toLowerCase() === category.toLowerCase())
            : productsData;
        
        if (filteredProducts.length === 0) {
            productsContainer.innerHTML = '<p>Aucun produit trouvé dans cette catégorie.</p>';
            return;
        }
        
        let productsHTML = '';
        filteredProducts.forEach(product => {
            productsHTML += generateProductHTML(product);
        });
        
        productsContainer.innerHTML = productsHTML;
    }
}

// Fonction pour afficher les détails d'un produit sur la page produit
function displayProductDetails(productId) {
    const productContainer = document.querySelector('.product-details');
    if (productContainer) {
        // Trouver le produit par ID
        const product = productsData.find(p => p.id === parseInt(productId));
        
        if (!product) {
            productContainer.innerHTML = '<p>Produit non trouvé.</p>';
            return;
        }
        
        // Mettre à jour les informations du produit
        const productTitle = document.querySelector('.product-info-container h1');
        const productPrice = document.querySelector('.product-current-price');
        const productOldPrice = document.querySelector('.product-old-price');
        const productDescription = document.querySelector('.product-description');
        const mainImage = document.querySelector('.main-image');
        
        if (productTitle) productTitle.textContent = product.name;
        if (productPrice) productPrice.textContent = `${product.price.toFixed(2)} €`;
        
        if (productOldPrice) {
            if (product.oldPrice) {
                productOldPrice.textContent = `${product.oldPrice.toFixed(2)} €`;
                productOldPrice.style.display = 'inline';
            } else {
                productOldPrice.style.display = 'none';
            }
        }
        
        if (productDescription) productDescription.textContent = product.description;
        if (mainImage) mainImage.src = product.image;
    }
}

// Fonction pour rechercher des produits
function searchProducts(query) {
    if (!query) return productsData;
    
    query = query.toLowerCase();
    return productsData.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.category.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );
}

// Fonction pour trier les produits
function sortProducts(products, sortBy) {
    const sortedProducts = [...products];
    
    switch (sortBy) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        default:
            // Par défaut, ne rien faire
            break;
    }
    
    return sortedProducts;
}

// Initialiser l'affichage des produits lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', function() {
    // Afficher les produits en vedette sur la page d'accueil
    displayFeaturedProducts();
    
    // Vérifier si nous sommes sur une page de catégorie
    const categoryPage = document.querySelector('body').getAttribute('data-category');
    if (categoryPage) {
        displayCategoryProducts(categoryPage);
    }
    
    // Vérifier si nous sommes sur une page produit
    const productPage = document.querySelector('body').getAttribute('data-product-id');
    if (productPage) {
        displayProductDetails(productPage);
    }
    
    // Gestion du tri des produits
    const sortSelect = document.getElementById('sort-products');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const category = document.querySelector('body').getAttribute('data-category');
            let products = category 
                ? productsData.filter(product => product.category.toLowerCase() === category.toLowerCase())
                : productsData;
            
            products = sortProducts(products, this.value);
            
            const productsContainer = document.getElementById('category-products');
            if (productsContainer) {
                let productsHTML = '';
                products.forEach(product => {
                    productsHTML += generateProductHTML(product);
                });
                
                productsContainer.innerHTML = productsHTML;
            }
        });
    }
    
    // Gestion de la recherche de produits
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="search"]');
            if (searchInput) {
                const query = searchInput.value.trim();
                const searchResults = searchProducts(query);
                
                // Rediriger vers la page de résultats de recherche ou afficher les résultats
                // Pour cet exemple, nous allons simplement afficher les résultats dans la console
                console.log('Résultats de recherche:', searchResults);
                
                // Vous pourriez également mettre à jour une section de la page avec les résultats
                const resultsContainer = document.getElementById('search-results');
                if (resultsContainer) {
                    if (searchResults.length === 0) {
                        resultsContainer.innerHTML = '<p>Aucun résultat trouvé pour votre recherche.</p>';
                    } else {
                        let resultsHTML = '<h2>Résultats de recherche</h2>';
                        searchResults.forEach(product => {
                            resultsHTML += generateProductHTML(product);
                        });
                        
                        resultsContainer.innerHTML = resultsHTML;
                    }
                }
            }
        });
    }
});
let allProducts = [];

async function loadMenProducts() {
    try {
        const response = await fetch('http://localhost:5000/api/products?category=hommes');
        const data = await response.json();

        if (data.success) {
            allProducts = data.products;
            applySort(); // tri initial
        } else {
            document.getElementById('products-container').innerHTML = '<p>Aucun produit trouvé.</p>';
        }
    } catch (error) {
        console.error("Erreur chargement produits :", error);
    }
}

function applySort() {
    const sortValue = document.getElementById('sort').value;
    let sorted = [...allProducts];

    if (sortValue === 'price-asc') {
        sorted.sort((a, b) => a.price - b.price);
    } else if (sortValue === 'price-desc') {
        sorted.sort((a, b) => b.price - a.price);
    } else if (sortValue === 'newest') {
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    displayProducts(sorted);
}

function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image_url || '../images/product-placeholder.jpg'}" alt="${product.name}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.price.toFixed(2)} €</p>
                <button class="add-to-cart" data-id="${product.id}" data-stock="${product.stock}">
                    <i class="fas fa-shopping-cart"></i> Ajouter
                </button>
            </div>
        `;
        container.appendChild(card);
    });

    // Ajoute tes gestionnaires pour ajouter au panier ici si nécessaire
}
