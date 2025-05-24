# ModaStyle - Site E-commerce de Vêtements

Ce projet est un site e-commerce complet pour la vente de vêtements en ligne, avec gestion des comptes utilisateurs, panier d'achat, et tableau de bord administrateur.

## Structure du Projet

```
e-commerce-vetements/
├── backend/               # Backend Flask avec API REST
│   ├── venv/              # Environnement virtuel Python
│   ├── src/               # Code source du backend
│   │   ├── models/        # Modèles de données
│   │   ├── routes/        # Routes API
│   │   ├── static/        # Fichiers statiques
│   │   └── main.py        # Point d'entrée principal
│   └── requirements.txt   # Dépendances Python
├── frontend/              # Frontend HTML/CSS/JS
│   ├── css/               # Styles CSS
│   ├── js/                # Scripts JavaScript
│   ├── images/            # Images et assets
│   ├── pages/             # Pages HTML secondaires
│   └── index.html         # Page d'accueil
└── database.sql           # Script SQL pour la base de données
```

## Fonctionnalités

- **Catalogue de produits** : Affichage des produits par catégories avec filtres et recherche
- **Panier d'achat** : Ajout/suppression de produits, calcul du total, processus de paiement
- **Comptes utilisateurs** : Inscription, connexion, gestion de profil, historique des commandes
- **Tableau de bord administrateur** : Gestion des produits, utilisateurs et commandes
- **Stockage d'images** : Intégration avec AWS S3 pour le stockage des images produits
- **Base de données** : Structure complète avec relations, contraintes et données de démonstration

## Prérequis

- Python 3.8+
- MySQL 5.7+ ou MariaDB 10.3+
- Navigateur web moderne (Chrome, Firefox, Safari, Edge)
- Compte AWS avec bucket S3 (pour le stockage des images en production)

## Installation et Configuration

### 1. Base de données

Créez une base de données MySQL et importez le script SQL :

```bash
mysql -u root -p < database.sql
```

### 2. Backend

Configurez l'environnement virtuel et installez les dépendances :

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Sur Windows : venv\Scripts\activate
pip install -r requirements.txt
```

Configurez les variables d'environnement (créez un fichier `.env` dans le dossier backend) :

```
DB_USERNAME=root
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=3306
DB_NAME=mydb
AWS_ACCESS_KEY=your_access_key
AWS_SECRET_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
```

Lancez le serveur Flask :

```bash
cd src
python main.py
```

Le serveur sera accessible à l'adresse http://localhost:5000

### 3. Frontend

Pour tester le frontend localement, vous pouvez utiliser n'importe quel serveur web statique. Par exemple, avec Python :

```bash
cd frontend
python -m http.server 8000
```

Le site sera accessible à l'adresse http://localhost:8000

## Utilisation

### Interface Utilisateur

- Accédez à http://localhost:8000 pour voir la page d'accueil
- Parcourez les produits par catégories
- Créez un compte utilisateur pour passer des commandes
- Ajoutez des produits au panier et procédez au paiement

### Interface Administrateur

- Accédez à http://localhost:8000/pages/admin.html
- Connectez-vous avec les identifiants administrateur :
  - Email : admin@modastyle.com
  - Mot de passe : password
- Gérez les produits, utilisateurs et commandes depuis le tableau de bord

## Déploiement en Production

Pour déployer l'application en production :

1. **Base de données** : Configurez une base de données MySQL/MariaDB sur votre serveur
2. **Backend** : Déployez l'application Flask avec Gunicorn/uWSGI derrière un serveur web comme Nginx
3. **Frontend** : Déployez les fichiers statiques sur un serveur web ou un CDN
4. **AWS S3** : Configurez un bucket S3 pour le stockage des images
5. **Variables d'environnement** : Configurez les variables d'environnement sur votre serveur

## Sécurité

- Les mots de passe sont hachés avec bcrypt
- Les sessions utilisateur sont sécurisées
- L'accès au tableau de bord administrateur est protégé
- Les uploads d'images sont validés et sécurisés

## Personnalisation

- Modifiez les styles CSS dans `frontend/css/styles.css`
- Ajoutez de nouvelles catégories et produits via l'interface administrateur
- Personnalisez les textes et images dans les fichiers HTML

## Licence

Ce projet est fourni à titre d'exemple et peut être utilisé comme base pour votre propre site e-commerce.

## Support

Pour toute question ou assistance, veuillez contacter l'équipe de développement.
