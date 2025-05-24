from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import os
import sys
import json
from datetime import datetime
from dotenv import load_dotenv  # Ajout de cette ligne
from flask_cors import CORS


# Chargement des variables d'environnement depuis le fichier .env
load_dotenv()  # Ajout de cette ligne

# Configuration de l'application Flask
app = Flask(__name__)

app.config['SECRET_KEY'] = os.urandom(24)
app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+pymysql://{os.getenv('DB_USERNAME', 'root')}:{os.getenv('DB_PASSWORD', 'password')}@{os.getenv('DB_HOST', 'localhost')}:{os.getenv('DB_PORT', '3306')}/{os.getenv('DB_NAME', 'mydb')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:8000", "http://127.0.0.1:8000"],
        "supports_credentials": True,  # ← important !
        "allow_headers": ["Content-Type"],
        "methods": ["GET", "POST", "PUT", "DELETE" ,"PATCH"]
    }
})
# Initialisation de la base de données
db = SQLAlchemy(app)

# Modèles de données
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(50), nullable=False)
    lastname = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'firstname': self.firstname,
            'lastname': self.lastname,
            'email': self.email,
            'is_admin': self.is_admin,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    price = db.Column(db.Float, nullable=False)
    old_price = db.Column(db.Float, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    image_url = db.Column(db.String(255), nullable=True)
    badge = db.Column(db.String(20), nullable=True)
    stock = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'old_price': self.old_price,
            'category': self.category,
            'image_url': self.image_url,
            'badge': self.badge,
            'stock': self.stock,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

class Order(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(20), default='pending')
    shipping_address = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref=db.backref('orders', lazy=True))
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'total_amount': self.total_amount,
            'status': self.status,
            'shipping_address': self.shipping_address,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'items': [item.to_dict() for item in self.items]
        }

class OrderItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    
    order = db.relationship('Order', backref=db.backref('items', lazy=True))
    product = db.relationship('Product')
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_id': self.order_id,
            'product_id': self.product_id,
            'product_name': self.product.name,
            'quantity': self.quantity,
            'price': self.price,
            'total': self.quantity * self.price
        }
# Ajoutez ce modèle pour les messages de contact
class ContactMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(20), default='pending')  # 'pending' ou 'completed'
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'subject': self.subject,
            'message': self.message,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }

# Routes API pour l'authentification
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    print("📥 Données reçues par Flask :", data)
    # Validation des champs requis
    required_fields = ['firstname', 'lastname', 'email', 'password']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'success': False, 'message': f'Le champ {field} est requis'}), 400

    # Validation de l'email
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'success': False, 'message': 'Cet email est déjà utilisé'}), 400

    # Validation du mot de passe
    if len(data['password']) < 8:
        return jsonify({'success': False, 'message': 'Le mot de passe doit contenir au moins 8 caractères'}), 400

    try:
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

        new_user = User(
            firstname=data['firstname'],
            lastname=data['lastname'],
            email=data['email'],
            password=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            'success': True, 
            'message': 'Inscription réussie',
            'user': new_user.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        print("❌ Erreur lors de l'inscription :", str(e))
        return jsonify({
            'success': False,
            'message': 'Erreur serveur lors de l\'inscription',
            'error': str(e)
        }), 500
        
        
        
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json

    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'success': False, 'message': 'Champs requis manquants'}), 400

    user = User.query.filter_by(email=email).first()

    if not user or not check_password_hash(user.password, password):
        return jsonify({'success': False, 'message': 'Email ou mot de passe incorrect'}), 401

    session['user_id'] = user.id

    return jsonify({
        'success': True,
        'message': 'Connexion réussie',
        'user': {
            'id': user.id,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email,
            'is_admin': user.is_admin,  # Assurez-vous que ce champ est inclus
            'created_at': user.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
    }), 200

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({'success': True, 'message': 'Déconnexion réussie'}), 200
# Route pour obtenir les infos utilisateur
@app.route('/api/auth/user', methods=['GET'])
def get_current_user():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        session.pop('user_id', None)
        return jsonify({'success': False, 'message': 'Utilisateur non trouvé'}), 404
    
    return jsonify({
        'success': True,
        'user': user.to_dict()
    }), 200

# Route pour mettre à jour le profil
@app.route('/api/auth/user', methods=['PUT'])
def update_user():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    if not user:
        return jsonify({'success': False, 'message': 'Utilisateur non trouvé'}), 404
    
    data = request.json
    
    # Validation des mots de passe
    if data.get('new_password'):
        if not data.get('current_password'):
            return jsonify({'success': False, 'message': 'Mot de passe actuel requis'}), 400
        
        if not check_password_hash(user.password, data['current_password']):
            return jsonify({'success': False, 'message': 'Mot de passe actuel incorrect'}), 400
        
        if data['new_password'] != data.get('confirm_password', ''):
            return jsonify({'success': False, 'message': 'Les nouveaux mots de passe ne correspondent pas'}), 400
        
        user.password = generate_password_hash(data['new_password'], method='sha256')
    
    # Mise à jour des autres champs
    user.firstname = data.get('firstname', user.firstname)
    user.lastname = data.get('lastname', user.lastname)
    user.email = data.get('email', user.email)
    
    try:
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Profil mis à jour avec succès',
            'user': user.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Erreur lors de la mise à jour',
            'error': str(e)
        }), 500
# Routes API pour les produits
@app.route('/api/products', methods=['GET'])
def get_products():
    category = request.args.get('category')
    
    if category:
        products = Product.query.filter_by(category=category).all()
    else:
        products = Product.query.all()
    
    return jsonify({
        'success': True,
        'products': [product.to_dict() for product in products]
    }), 200

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'success': False, 'message': 'Produit non trouvé'}), 404
    
    return jsonify({
        'success': True,
        'product': product.to_dict()
    }), 200

# Routes API pour les commandes
@app.route('/api/orders', methods=['POST'])
def create_order():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    data = request.json
    
    # Créer une nouvelle commande
    new_order = Order(
        user_id=session['user_id'],
        total_amount=data['total_amount'],
        shipping_address=data['shipping_address']
    )
    
    db.session.add(new_order)
    db.session.commit()
    
    # Ajouter les articles de la commande
    for item in data['items']:
        order_item = OrderItem(
            order_id=new_order.id,
            product_id=item['product_id'],
            quantity=item['quantity'],
            price=item['price']
        )
        db.session.add(order_item)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Commande créée avec succès',
        'order': new_order.to_dict()
    }), 201

@app.route('/api/orders', methods=['GET'])
def get_user_orders():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    orders = Order.query.filter_by(user_id=session['user_id']).all()
    
    return jsonify({
        'success': True,
        'orders': [order.to_dict() for order in orders]
    }), 200

# Routes API pour l'administration
@app.route('/api/admin/users', methods=['GET'])
def admin_get_users():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    
    if not user or not user.is_admin:
        return jsonify({'success': False, 'message': 'Accès non autorisé'}), 403
    
    users = User.query.all()
    
    return jsonify({
        'success': True,
        'users': [user.to_dict() for user in users]
    }), 200

@app.route('/api/admin/products', methods=['POST'])
def admin_create_product():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    
    if not user or not user.is_admin:
        return jsonify({'success': False, 'message': 'Accès non autorisé'}), 403
    
    data = request.json
    
    new_product = Product(
        name=data['name'],
        description=data.get('description'),
        price=data['price'],
        old_price=data.get('old_price'),
        category=data['category'],
        image_url=data.get('image_url'),
        badge=data.get('badge'),
        stock=data.get('stock', 0)
    )
    
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Produit créé avec succès',
        'product': new_product.to_dict()
    }), 201

@app.route('/api/admin/products/<int:product_id>', methods=['PUT'])
def admin_update_product(product_id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    
    if not user or not user.is_admin:
        return jsonify({'success': False, 'message': 'Accès non autorisé'}), 403
    
    product = Product.query.get(product_id)
    
    if not product:
        return jsonify({'success': False, 'message': 'Produit non trouvé'}), 404
    
    data = request.json
    
    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.old_price = data.get('old_price', product.old_price)
    product.category = data.get('category', product.category)
    product.image_url = data.get('image_url', product.image_url)
    product.badge = data.get('badge', product.badge)
    product.stock = data.get('stock', product.stock)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Produit mis à jour avec succès',
        'product': product.to_dict()
    }), 200

@app.route('/api/admin/orders', methods=['GET'])
def admin_get_orders():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    
    if not user or not user.is_admin:
        return jsonify({'success': False, 'message': 'Accès non autorisé'}), 403
    
    orders = Order.query.all()
    
    return jsonify({
        'success': True,
        'orders': [order.to_dict() for order in orders]
    }), 200

@app.route('/api/admin/orders/<int:order_id>', methods=['PUT'])
def admin_update_order(order_id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    
    if not user or not user.is_admin:
        return jsonify({'success': False, 'message': 'Accès non autorisé'}), 403
    
    order = Order.query.get(order_id)
    
    if not order:
        return jsonify({'success': False, 'message': 'Commande non trouvée'}), 404
    
    data = request.json
    
    order.status = data.get('status', order.status)
    
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Commande mise à jour avec succès',
        'order': order.to_dict()
    }), 200

# Route pour soumettre un message de contact
@app.route('/api/contact', methods=['POST'])
def submit_contact_message():
    data = request.json
    
    # Validation des champs requis
    required_fields = ['name', 'email', 'subject', 'message']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'success': False, 'message': f'Le champ {field} est requis'}), 400
    
    try:
        new_message = ContactMessage(
            name=data['name'],
            email=data['email'],
            subject=data['subject'],
            message=data['message']
        )
        
        db.session.add(new_message)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Votre message a été envoyé avec succès',
            'data': new_message.to_dict()
        }), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Erreur lors de l\'envoi du message',
            'error': str(e)
        }), 500

# Route pour récupérer les messages (optionnel - pour interface admin)
@app.route('/api/contact/messages', methods=['GET'])
def get_contact_messages():
    # Vérification du statut admin
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    
    if not user or not user.is_admin:
        return jsonify({'success': False, 'message': 'Accès non autorisé'}), 403
    
    messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
    
    return jsonify({
        'success': True,
        'messages': [msg.to_dict() for msg in messages]
    }), 200
@app.route('/api/contact/messages/<int:message_id>', methods=['PATCH'])
def update_message_status(message_id):
    # Vérification du statut admin
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Non authentifié'}), 401
    
    user = User.query.get(session['user_id'])
    if not user or not user.is_admin:
        return jsonify({'success': False, 'message': 'Accès non autorisé'}), 403
    
    message = ContactMessage.query.get(message_id)
    if not message:
        return jsonify({'success': False, 'message': 'Message non trouvé'}), 404
    
    try:
        data = request.get_json()
        if 'status' not in data:
            return jsonify({'success': False, 'message': 'Statut manquant'}), 400
            
        message.status = data['status']
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Statut mis à jour',
            'data': message.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': 'Erreur serveur',
            'error': str(e)
        }), 500
        
# Point d'entrée principal
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5000, debug=True)
