// JavaScript pour le tableau de bord administrateur

document.addEventListener('DOMContentLoaded', function() {
    // Gestion de la navigation entre les pages du tableau de bord
    const menuItems = document.querySelectorAll('.admin-menu-item');
    const adminPages = document.querySelectorAll('.admin-page');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const pageName = this.getAttribute('data-page');
            
            if (pageName) {
                // Désactiver tous les éléments du menu et masquer toutes les pages
                menuItems.forEach(i => i.classList.remove('active'));
                adminPages.forEach(p => p.classList.remove('active'));
                
                // Activer l'élément du menu cliqué
                this.classList.add('active');
                
                // Afficher la page correspondante
                const targetPage = document.getElementById(`${pageName}-page`);
                if (targetPage) {
                    targetPage.classList.add('active');
                }
            }
        });
    });
    
    // Gestion du bouton de déconnexion
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            // Simuler une déconnexion
            localStorage.removeItem('currentUser');
            
            // Rediriger vers la page de connexion
            window.location.href = 'compte.html';
        });
    }
    
    // Gestion des cases à cocher dans les tableaux
    const selectAllCheckboxes = document.querySelectorAll('.select-all-checkbox');
    
    selectAllCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const table = this.closest('table');
            const rowCheckboxes = table.querySelectorAll('.row-checkbox');
            
            rowCheckboxes.forEach(rowCheckbox => {
                rowCheckbox.checked = this.checked;
            });
        });
    });
    
    // Gestion des liens d'action dans les tableaux
    const viewButtons = document.querySelectorAll('.admin-table-action.view');
    const editButtons = document.querySelectorAll('.admin-table-action.edit');
    const deleteButtons = document.querySelectorAll('.admin-table-action.delete');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Récupérer les informations de la ligne
            const row = this.closest('tr');
            const id = row.querySelector('td:nth-child(2)').textContent;
            
            // Afficher un message pour simuler l'affichage des détails
            alert(`Affichage des détails pour ${id}`);
        });
    });
    
    editButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Récupérer les informations de la ligne
            const row = this.closest('tr');
            const id = row.querySelector('td:nth-child(2)').textContent;
            
            // Afficher un formulaire d'édition (simulation)
            showEditModal(id);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Récupérer les informations de la ligne
            const row = this.closest('tr');
            const id = row.querySelector('td:nth-child(2)').textContent;
            
            // Demander confirmation avant suppression
            if (confirm(`Êtes-vous sûr de vouloir supprimer ${id} ?`)) {
                // Simuler la suppression
                row.remove();
                alert(`${id} a été supprimé avec succès.`);
            }
        });
    });
    
    // Fonction pour afficher un modal d'édition (simulation)
    function showEditModal(id) {
        // Créer un modal d'édition
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        
        // Déterminer le type d'élément à éditer
        let title, fields;
        
        if (id.startsWith('#ORD')) {
            title = 'Modifier la commande';
            fields = `
                <div class="form-group">
                    <label>ID de commande</label>
                    <input type="text" class="form-control" value="${id}" disabled>
                </div>
                <div class="form-group">
                    <label>Statut</label>
                    <select class="form-control">
                        <option>En attente</option>
                        <option>En traitement</option>
                        <option selected>Complétée</option>
                        <option>Annulée</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Date de livraison estimée</label>
                    <input type="date" class="form-control">
                </div>
                <div class="form-group">
                    <label>Notes</label>
                    <textarea class="form-control"></textarea>
                </div>
            `;
        } else if (id.startsWith('#PRD')) {
            title = 'Modifier le produit';
            fields = `
                <div class="form-group">
                    <label>ID du produit</label>
                    <input type="text" class="form-control" value="${id}" disabled>
                </div>
                <div class="form-group">
                    <label>Nom du produit</label>
                    <input type="text" class="form-control" value="T-shirt Premium Coton">
                </div>
                <div class="form-group">
                    <label>Prix</label>
                    <input type="number" class="form-control" value="29.99">
                </div>
                <div class="form-group">
                    <label>Catégorie</label>
                    <select class="form-control">
                        <option selected>Hommes</option>
                        <option>Femmes</option>
                        <option>Enfants</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Stock</label>
                    <input type="number" class="form-control" value="45">
                </div>
                <div class="form-group">
                    <label>Description</label>
                    <textarea class="form-control">T-shirt en coton premium, coupe régulière et confortable.</textarea>
                </div>
                <div class="form-group">
                    <label>Image</label>
                    <input type="file" class="form-control">
                </div>
            `;
        } else {
            title = 'Modifier le client';
            fields = `
                <div class="form-row">
                    <div class="form-group">
                        <label>Prénom</label>
                        <input type="text" class="form-control" value="Marie">
                    </div>
                    <div class="form-group">
                        <label>Nom</label>
                        <input type="text" class="form-control" value="Dupont">
                    </div>
                </div>
                <div class="form-group">
                    <label>Email</label>
                    <input type="email" class="form-control" value="marie.dupont@example.com">
                </div>
                <div class="form-group">
                    <label>Téléphone</label>
                    <input type="tel" class="form-control" value="+33 6 12 34 56 78">
                </div>
                <div class="form-group">
                    <label>Adresse</label>
                    <textarea class="form-control">123 Rue de Paris, 75001 Paris, France</textarea>
                </div>
            `;
        }
        
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>${title}</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="edit-form">
                        ${fields}
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline modal-cancel">Annuler</button>
                            <button type="submit" class="btn">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ajouter les écouteurs d'événements pour le modal
        const closeBtn = modal.querySelector('.admin-modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#edit-form');
        
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simuler l'enregistrement des modifications
            alert(`Modifications enregistrées pour ${id}`);
            modal.remove();
        });
        
        // Fermer le modal si on clique en dehors
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Gestion des boutons d'ajout
    const addButtons = document.querySelectorAll('.admin-toolbar-left .btn');
    
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Déterminer le type d'élément à ajouter en fonction de la page active
            const activePage = document.querySelector('.admin-page.active');
            
            if (activePage) {
                const pageId = activePage.id;
                
                if (pageId === 'products-page') {
                    showAddProductModal();
                } else if (pageId === 'customers-page') {
                    showAddCustomerModal();
                } else if (pageId === 'orders-page') {
                    showAddOrderModal();
                }
            }
        });
    });
    
    // Fonction pour afficher un modal d'ajout de produit
    function showAddProductModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>Ajouter un nouveau produit</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="add-product-form">
                        <div class="form-group">
                            <label>Nom du produit</label>
                            <input type="text" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Prix</label>
                            <input type="number" class="form-control" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Prix ancien (optionnel)</label>
                            <input type="number" class="form-control" step="0.01">
                        </div>
                        <div class="form-group">
                            <label>Catégorie</label>
                            <select class="form-control" required>
                                <option value="">Sélectionner une catégorie</option>
                                <option value="hommes">Hommes</option>
                                <option value="femmes">Femmes</option>
                                <option value="enfants">Enfants</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Stock</label>
                            <input type="number" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Badge (optionnel)</label>
                            <input type="text" class="form-control" placeholder="Ex: Nouveau, -20%, etc.">
                        </div>
                        <div class="form-group">
                            <label>Description</label>
                            <textarea class="form-control" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Image</label>
                            <input type="file" class="form-control" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline modal-cancel">Annuler</button>
                            <button type="submit" class="btn">Ajouter</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ajouter les écouteurs d'événements pour le modal
        const closeBtn = modal.querySelector('.admin-modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#add-product-form');
        
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simuler l'ajout d'un produit
            alert('Produit ajouté avec succès!');
            modal.remove();
            
            // Recharger la page pour afficher le nouveau produit (simulation)
            // Dans une implémentation réelle, on ajouterait dynamiquement le produit au tableau
        });
        
        // Fermer le modal si on clique en dehors
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Fonction pour afficher un modal d'ajout de client
    function showAddCustomerModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>Ajouter un nouveau client</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="add-customer-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label>Prénom</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Nom</label>
                                <input type="text" class="form-control" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Mot de passe</label>
                            <input type="password" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Téléphone</label>
                            <input type="tel" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Adresse</label>
                            <textarea class="form-control"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline modal-cancel">Annuler</button>
                            <button type="submit" class="btn">Ajouter</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ajouter les écouteurs d'événements pour le modal
        const closeBtn = modal.querySelector('.admin-modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#add-customer-form');
        
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simuler l'ajout d'un client
            alert('Client ajouté avec succès!');
            modal.remove();
            
            // Recharger la page pour afficher le nouveau client (simulation)
            // Dans une implémentation réelle, on ajouterait dynamiquement le client au tableau
        });
        
        // Fermer le modal si on clique en dehors
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Fonction pour afficher un modal d'ajout de commande
    function showAddOrderModal() {
        const modal = document.createElement('div');
        modal.className = 'admin-modal';
        
        modal.innerHTML = `
            <div class="admin-modal-content">
                <div class="admin-modal-header">
                    <h3>Ajouter une nouvelle commande</h3>
                    <button class="admin-modal-close">&times;</button>
                </div>
                <div class="admin-modal-body">
                    <form id="add-order-form">
                        <div class="form-group">
                            <label>Client</label>
                            <select class="form-control" required>
                                <option value="">Sélectionner un client</option>
                                <option value="1">Marie Dupont</option>
                                <option value="2">Jean Martin</option>
                                <option value="3">Sophie Petit</option>
                                <option value="4">Pierre Durand</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Produits</label>
                            <div class="order-products">
                                <div class="order-product">
                                    <select class="form-control" required>
                                        <option value="">Sélectionner un produit</option>
                                        <option value="1">T-shirt Premium Coton</option>
                                        <option value="2">Robe d'Été Fleurie</option>
                                        <option value="3">Jean Slim Stretch</option>
                                        <option value="4">Veste Légère Imperméable</option>
                                    </select>
                                    <input type="number" class="form-control" placeholder="Quantité" min="1" value="1" required>
                                    <button type="button" class="btn btn-small btn-outline remove-product">Supprimer</button>
                                </div>
                            </div>
                            <button type="button" class="btn btn-small add-product">Ajouter un produit</button>
                        </div>
                        <div class="form-group">
                            <label>Adresse de livraison</label>
                            <textarea class="form-control" required></textarea>
                        </div>
                        <div class="form-group">
                            <label>Statut</label>
                            <select class="form-control" required>
                                <option value="pending">En attente</option>
                                <option value="processing">En traitement</option>
                                <option value="completed">Complétée</option>
                                <option value="cancelled">Annulée</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Notes</label>
                            <textarea class="form-control"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline modal-cancel">Annuler</button>
                            <button type="submit" class="btn">Ajouter</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Ajouter les écouteurs d'événements pour le modal
        const closeBtn = modal.querySelector('.admin-modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#add-order-form');
        const addProductBtn = modal.querySelector('.add-product');
        
        closeBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        cancelBtn.addEventListener('click', function() {
            modal.remove();
        });
        
        // Ajouter un produit à la commande
        addProductBtn.addEventListener('click', function() {
            const orderProducts = modal.querySelector('.order-products');
            const newProduct = document.createElement('div');
            newProduct.className = 'order-product';
            newProduct.innerHTML = `
                <select class="form-control" required>
                    <option value="">Sélectionner un produit</option>
                    <option value="1">T-shirt Premium Coton</option>
                    <option value="2">Robe d'Été Fleurie</option>
                    <option value="3">Jean Slim Stretch</option>
                    <option value="4">Veste Légère Imperméable</option>
                </select>
                <input type="number" class="form-control" placeholder="Quantité" min="1" value="1" required>
                <button type="button" class="btn btn-small btn-outline remove-product">Supprimer</button>
            `;
            orderProducts.appendChild(newProduct);
            
            // Ajouter l'écouteur d'événement pour le bouton de suppression
            const removeBtn = newProduct.querySelector('.remove-product');
            removeBtn.addEventListener('click', function() {
                newProduct.remove();
            });
        });
        
        // Ajouter l'écouteur d'événement pour le bouton de suppression initial
        const removeBtn = modal.querySelector('.remove-product');
        if (removeBtn) {
            removeBtn.addEventListener('click', function() {
                const product = this.closest('.order-product');
                product.remove();
            });
        }
        
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simuler l'ajout d'une commande
            alert('Commande ajoutée avec succès!');
            modal.remove();
            
            // Recharger la page pour afficher la nouvelle commande (simulation)
            // Dans une implémentation réelle, on ajouterait dynamiquement la commande au tableau
        });
        
        // Fermer le modal si on clique en dehors
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    // Gestion des liens dans les cartes du tableau de bord
    const cardActions = document.querySelectorAll('.admin-card-action');
    
    cardActions.forEach(action => {
        action.addEventListener('click', function(e) {
            e.preventDefault();
            
            const pageName = this.getAttribute('data-page');
            
            if (pageName) {
                // Trouver l'élément de menu correspondant et simuler un clic
                const menuItem = document.querySelector(`.admin-menu-item[data-page="${pageName}"]`);
                if (menuItem) {
                    menuItem.click();
                }
            }
        });
    });
    
    // Gestion de la pagination
    const paginationBtns = document.querySelectorAll('.admin-pagination-btn');
    
    paginationBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!this.disabled) {
                // Désactiver tous les boutons de pagination
                paginationBtns.forEach(b => b.classList.remove('active'));
                
                // Activer le bouton cliqué
                this.classList.add('active');
                
                // Simuler le chargement d'une nouvelle page
                // Dans une implémentation réelle, on chargerait les données correspondantes
            }
        });
    });
    
    // Vérifier si l'utilisateur est administrateur
    function checkAdminStatus() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!currentUser || !currentUser.isLoggedIn || !currentUser.isAdmin) {
            // Rediriger vers la page de connexion si l'utilisateur n'est pas administrateur
            window.location.href = 'compte.html';
        }
    }
    
    // Vérifier le statut d'administrateur au chargement de la page
    // Commenté pour la démonstration
    // checkAdminStatus();
});
