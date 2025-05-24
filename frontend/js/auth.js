// Gestion de l'authentification et des comptes utilisateurs

document.addEventListener('DOMContentLoaded', function() {
    // Gestion des onglets d'authentification
    const loginTab = document.querySelector('.account-tab[data-tab="login"]');
    const registerTab = document.querySelector('.account-tab[data-tab="register"]');
    const loginContent = document.getElementById('login-content');
    const registerContent = document.getElementById('register-content');

    if (loginTab && registerTab) {
        loginTab.addEventListener('click', function() {
            loginTab.classList.add('active');
            registerTab.classList.remove('active');
            loginContent.classList.add('active');
            registerContent.classList.remove('active');
        });

        registerTab.addEventListener('click', function() {
            registerTab.classList.add('active');
            loginTab.classList.remove('active');
            registerContent.classList.add('active');
            loginContent.classList.remove('active');
        });
    }
    const user = JSON.parse(localStorage.getItem('currentUser'));
    updateAdminUI(user);
    // Gestion du formulaire de connexion
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Validation basique
            if (!email || !password) {
                showMessage('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            // Préparation des données pour l'API
            const loginData = {
                email: email,
                password: password,
                remember_me: rememberMe
            };
            
            // Appel à l'API de connexion (à implémenter avec le backend)
            loginUser(loginData);
        });
    }
    
    // Gestion du formulaire d'inscription
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const firstname = document.getElementById('register-firstname').value;
            const lastname = document.getElementById('register-lastname').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const termsAccepted = document.getElementById('terms').checked;
            
            // Validation basique
            if (!firstname || !lastname || !email || !password || !confirmPassword) {
                showMessage('Veuillez remplir tous les champs', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showMessage('Les mots de passe ne correspondent pas', 'error');
                return;
            }
            
            if (!termsAccepted) {
                showMessage('Vous devez accepter les conditions d\'utilisation', 'error');
                return;
            }
            
            // Préparation des données pour l'API
            const registerData = {
                firstname: firstname,
                lastname: lastname,
                email: email,
                password: password
            };
            
            // Appel à l'API d'inscription (à implémenter avec le backend)
            registerUser(registerData);
        });
    }
    
    // Fonction pour afficher les messages à l'utilisateur
    function showMessage(message, type = 'success') {
        // Vérifier si un message existe déjà et le supprimer
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Créer un nouvel élément de message
        const messageElement = document.createElement('div');
        messageElement.className = `auth-message ${type}`;
        messageElement.textContent = message;
        
        // Ajouter le message au formulaire actif
        const activeForm = document.querySelector('.account-content.active form');
        if (activeForm) {
            activeForm.prepend(messageElement);
            
            // Faire disparaître le message après 5 secondes
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
    
function registerUser(data) {
    fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify(data)
    })
    .then(async res => {
        const response = await res.json();
        if (!res.ok) {
            throw new Error(response.message || 'Erreur lors de l\'inscription');
        }
        showMessage('Inscription réussie! Vous pouvez maintenant vous connecter.');
        document.getElementById('register-form').reset();
        setTimeout(() => document.querySelector('.account-tab[data-tab="login"]').click(), 2000);
    })
    .catch(err => {
        console.error("Erreur:", err);
        showMessage(err.message || 'Erreur lors de l\'inscription', 'error');
    });
}


function loginUser(data) {
    fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            email: data.email,
            password: data.password
        })
    })
    .then(async res => {
        const response = await res.json();

        if (!res.ok) {
            showNotification(response.message || 'Échec de la connexion', 'error');
            return;
        }

        // Stocker les informations utilisateur dont is_admin
        localStorage.setItem('currentUser', JSON.stringify({
            ...response.user,
            isLoggedIn: true
        }));
        
        
        
        
        showNotification('Connexion réussie! Redirection...', 'success');
        setTimeout(() => window.location.href = 'profil.html', 1500);
        setTimeout(() => updateAdminUI(response.user), 2000);
        
    })
    .catch(() => showNotification('Erreur de connexion au serveur', 'error'));
}

function updateAdminUI(user) {
    const adminElements = document.querySelectorAll('.admin-only');
    console.log(user);
    if (user && user.is_admin) {
        adminElements.forEach(el => el.style.display = 'block');
    } else {
        adminElements.forEach(el => el.style.display = 'none');
    }
}


    
    async function checkAuthStatus() {
    // 1. Vérifier d'abord le localStorage pour une réponse rapide
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // 2. Vérifier auprès du serveur pour confirmer
    try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
            credentials: 'include' // Important pour les cookies de session
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // Si l'utilisateur est connecté côté serveur
            if (data.success && data.user) {
                // Mettre à jour le localStorage
                localStorage.setItem('currentUser', JSON.stringify({
                    ...data.user,
                    isLoggedIn: true
                }));
                
                // Rediriger si on est sur la page de connexion
                if (window.location.pathname.includes('compte.html')) {
                    window.location.href = 'profil.html';
                }
                return true;
            }
        }
        
        // Si non authentifié, nettoyer le localStorage
        localStorage.removeItem('currentUser');
        
        // Rediriger vers login si on est sur une page protégée
        if (window.location.pathname.includes('profil.html')) {
            window.location.href = 'compte.html';
        }
        return false;
        
    } catch (error) {
        console.error("Erreur de vérification d'authentification:", error);
        return false;
    }
}
    
    // Vérifier le statut d'authentification au chargement de la page
    checkAuthStatus();
    
    // Gestion du lien "Mot de passe oublié"
    const forgotPasswordLink = document.querySelector('.forgot-password');
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Afficher un formulaire de récupération de mot de passe
            const loginContent = document.getElementById('login-content');
            const currentForm = loginContent.innerHTML;
            
            loginContent.innerHTML = `
                <form id="forgot-password-form" class="auth-form">
                    <div class="form-group">
                        <label for="forgot-email">Email</label>
                        <input type="email" id="forgot-email" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-block">Réinitialiser le mot de passe</button>
                    </div>
                    <div class="form-footer">
                        <a href="#" id="back-to-login">Retour à la connexion</a>
                    </div>
                </form>
            `;
            
            // Gestion du formulaire de récupération de mot de passe
            const forgotForm = document.getElementById('forgot-password-form');
            forgotForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('forgot-email').value;
                
                if (!email) {
                    showMessage('Veuillez entrer votre email', 'error');
                    return;
                }
                
                // Simulation d'un appel API pour la récupération de mot de passe
                console.log('Demande de réinitialisation pour:', email);
                
                showMessage('Si votre email existe dans notre base de données, vous recevrez un lien de réinitialisation.');
                
                // Réinitialiser le formulaire
                forgotForm.reset();
            });
            
            // Gestion du lien de retour à la connexion
            const backToLoginLink = document.getElementById('back-to-login');
            backToLoginLink.addEventListener('click', function(e) {
                e.preventDefault();
                loginContent.innerHTML = currentForm;
                
                // Réinitialiser les écouteurs d'événements
                const newLoginForm = document.getElementById('login-form');
                if (newLoginForm) {
                    newLoginForm.addEventListener('submit', function(e) {
                        e.preventDefault();
                        
                        const email = document.getElementById('login-email').value;
                        const password = document.getElementById('login-password').value;
                        const rememberMe = document.getElementById('remember-me').checked;
                        
                        // Validation basique
                        if (!email || !password) {
                            showMessage('Veuillez remplir tous les champs', 'error');
                            return;
                        }
                        
                        // Préparation des données pour l'API
                        const loginData = {
                            email: email,
                            password: password,
                            remember_me: rememberMe
                        };
                        
                        // Appel à l'API de connexion
                        loginUser(loginData);
                    });
                }
                
                // Réinitialiser le lien "Mot de passe oublié"
                const newForgotPasswordLink = document.querySelector('.forgot-password');
                if (newForgotPasswordLink) {
                    newForgotPasswordLink.addEventListener('click', forgotPasswordLink.onclick);
                }
            });
        });
    }
});
 // Fonction pour afficher les messages à l'utilisateur
    function showNotification(message, type = 'success') {
        // Vérifier si un message existe déjà et le supprimer
        const existingMessage = document.querySelector('.auth-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Créer un nouvel élément de message
        const messageElement = document.createElement('div');
        messageElement.className = `auth-message ${type}`;
        messageElement.textContent = message;
        
        // Ajouter le message au formulaire actif
        const activeForm = document.querySelector('.account-content.active form');
        if (activeForm) {
            activeForm.prepend(messageElement);
            
            // Faire disparaître le message après 5 secondes
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
