-- Script SQL pour la base de données e-commerce ModaStyle
-- Version mise à jour avec la table contact_message et optimisée pour Flask

-- Suppression de la base de données si elle existe déjà
DROP DATABASE IF EXISTS mydb;

-- Création de la base de données
CREATE DATABASE mydb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Utilisation de la base de données
USE mydb;

-- Table des utilisateurs
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(50) NOT NULL,
    lastname VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_email (email)
) ENGINE=InnoDB;

-- Table des produits
CREATE TABLE product (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    old_price DECIMAL(10, 2),
    category VARCHAR(50) NOT NULL,
    image_url VARCHAR(255),
    badge VARCHAR(20),
    stock INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_category (category),
    INDEX idx_product_name (name)
) ENGINE=InnoDB;

-- Table des commandes
CREATE TABLE `order` (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_order_user (user_id),
    INDEX idx_order_status (status)
) ENGINE=InnoDB;

-- Table des articles de commande
CREATE TABLE order_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES `order`(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE RESTRICT,
    INDEX idx_order_item_order (order_id),
    INDEX idx_order_item_product (product_id)
) ENGINE=InnoDB;

-- Table des messages de contact
CREATE TABLE contact_message (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_contact_email (email),
    INDEX idx_contact_status (status)
) ENGINE=InnoDB;

-- Table des adresses utilisateur (optionnelle)
CREATE TABLE address (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    address_line1 VARCHAR(100) NOT NULL,
    address_line2 VARCHAR(100),
    city VARCHAR(50) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_address_user (user_id)
) ENGINE=InnoDB;

-- Table des catégories (optionnelle)
CREATE TABLE category (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    parent_id INT,
    FOREIGN KEY (parent_id) REFERENCES category(id) ON DELETE SET NULL,
    INDEX idx_category_parent (parent_id)
) ENGINE=InnoDB;

-- Table des avis produits (optionnelle)
CREATE TABLE review (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE KEY unique_review (product_id, user_id),
    INDEX idx_review_product (product_id),
    INDEX idx_review_user (user_id)
) ENGINE=InnoDB;

-- Table des favoris (optionnelle)
CREATE TABLE wishlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist_item (user_id, product_id),
    INDEX idx_wishlist_user (user_id)
) ENGINE=InnoDB;

-- Insertion de données de démonstration

-- Utilisateurs (mot de passe: 'password' hashé avec pbkdf2:sha256 pour compatibilité Flask)
INSERT INTO user (firstname, lastname, email, password, is_admin, created_at) VALUES
('Admin', 'System', 'admin@modastyle.com', 'pbkdf2:sha256:260000$N2x9Q7hG$3f4870e2c3b7e5c8e8e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3', TRUE, '2025-01-01 00:00:00'),
('Marie', 'Dupont', 'marie.dupont@example.com', 'pbkdf2:sha256:260000$N2x9Q7hG$3f4870e2c3b7e5c8e8e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3', FALSE, '2025-02-15 10:30:00'),
('Jean', 'Martin', 'jean.martin@example.com', 'pbkdf2:sha256:260000$N2x9Q7hG$3f4870e2c3b7e5c8e8e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3', FALSE, '2025-03-22 14:45:00'),
('Sophie', 'Petit', 'sophie.petit@example.com', 'pbkdf2:sha256:260000$N2x9Q7hG$3f4870e2c3b7e5c8e8e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3', FALSE, '2025-02-10 09:15:00'),
('Pierre', 'Durand', 'pierre.durand@example.com', 'pbkdf2:sha256:260000$N2x9Q7hG$3f4870e2c3b7e5c8e8e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3e1e4e3e7e3', FALSE, '2025-01-05 16:20:00');

-- Catégories
INSERT INTO category (name, description, parent_id) VALUES
('Hommes', 'Vêtements pour hommes', NULL),
('Femmes', 'Vêtements pour femmes', NULL),
('Enfants', 'Vêtements pour enfants', NULL),
('T-shirts', 'T-shirts et hauts', 1),
('Pantalons', 'Pantalons et jeans', 1),
('Robes', 'Robes et jupes', 2),
('Vestes', 'Vestes et manteaux', 2),
('Ensembles', 'Ensembles pour enfants', 3);

-- Produits
INSERT INTO product (name, description, price, old_price, category, image_url, badge, stock, created_at) VALUES
('T-shirt Premium Coton', 'T-shirt en coton premium, coupe régulière et confortable.', 29.99, 39.99, 'Hommes', 'images/product-1.jpg', 'Nouveau', 45, '2025-04-01 08:00:00'),
('Robe d\'Été Fleurie', 'Robe légère à motifs floraux, parfaite pour l\'été.', 49.99, 69.99, 'Femmes', 'images/product-2.jpg', '-30%', 8, '2025-04-02 09:30:00'),
('Jean Slim Stretch', 'Jean slim avec stretch pour un confort optimal.', 59.99, NULL, 'Hommes', 'images/product-3.jpg', NULL, 32, '2025-04-03 10:45:00'),
('Veste Légère Imperméable', 'Veste légère et imperméable, idéale pour les journées pluvieuses.', 79.99, 99.99, 'Femmes', 'images/product-4.jpg', 'Populaire', 0, '2025-04-04 11:15:00'),
('Pull en Laine Mérinos', 'Pull en laine mérinos de haute qualité, chaud et confortable.', 69.99, 89.99, 'Hommes', 'images/product-5.jpg', '-20%', 15, '2025-04-05 12:30:00'),
('Chemisier en Soie', 'Chemisier élégant en soie, parfait pour les occasions spéciales.', 59.99, NULL, 'Femmes', 'images/product-6.jpg', NULL, 20, '2025-04-06 13:45:00'),
('Ensemble Sport Enfant', 'Ensemble sport confortable et résistant pour enfants actifs.', 39.99, 49.99, 'Enfants', 'images/product-7.jpg', 'Nouveau', 25, '2025-04-07 14:00:00'),
('Robe de Princesse', 'Robe de princesse pour les petites filles qui rêvent en grand.', 34.99, NULL, 'Enfants', 'images/product-8.jpg', NULL, 18, '2025-04-08 15:15:00');

-- Adresses
INSERT INTO address (user_id, address_line1, address_line2, city, postal_code, country, is_default) VALUES
(2, '123 Rue de Paris', 'Apt 4B', 'Paris', '75001', 'France', TRUE),
(3, '45 Avenue Victor Hugo', NULL, 'Lyon', '69002', 'France', TRUE),
(4, '78 Boulevard Saint-Michel', '3ème étage', 'Paris', '75006', 'France', TRUE),
(5, '12 Rue de la République', NULL, 'Marseille', '13001', 'France', TRUE);

-- Commandes
INSERT INTO `order` (user_id, total_amount, status, shipping_address, created_at) VALUES
(2, 129.99, 'completed', '123 Rue de Paris, Apt 4B, 75001 Paris, France', '2025-05-23 09:00:00'),
(3, 89.50, 'pending', '45 Avenue Victor Hugo, 69002 Lyon, France', '2025-05-22 14:30:00'),
(4, 245.00, 'completed', '78 Boulevard Saint-Michel, 3ème étage, 75006 Paris, France', '2025-05-21 11:15:00'),
(5, 75.25, 'cancelled', '12 Rue de la République, 13001 Marseille, France', '2025-05-20 16:45:00');

-- Articles de commande
INSERT INTO order_item (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 29.99),
(1, 3, 1, 59.99),
(1, 7, 1, 39.99),
(2, 2, 1, 49.99),
(2, 8, 1, 34.99),
(3, 4, 1, 79.99),
(3, 5, 1, 69.99),
(3, 6, 1, 59.99),
(3, 8, 1, 34.99),
(4, 1, 1, 29.99),
(4, 7, 1, 39.99);

-- Messages de contact
INSERT INTO contact_message (name, email, subject, message, status, created_at) VALUES
('Jean Dupont', 'jean.dupont@example.com', 'Question sur ma commande', 'Bonjour, je voudrais savoir quand ma commande sera livrée?', 'pending', '2025-05-24 10:00:00'),
('Marie Leroy', 'marie.leroy@example.com', 'Problème avec un produit', 'Le produit reçu ne correspond pas à la description', 'completed', '2025-05-23 14:30:00'),
('Paul Martin', 'paul.martin@example.com', 'Demande de partenariat', 'Nous souhaiterions établir un partenariat avec votre boutique', 'pending', '2025-05-25 09:15:00');

-- Avis produits
INSERT INTO review (product_id, user_id, rating, comment, created_at) VALUES
(1, 2, 5, 'Excellent t-shirt, très confortable et de bonne qualité.', '2025-05-24 10:00:00'),
(1, 3, 4, 'Bon produit, taille un peu grande.', '2025-05-25 11:30:00'),
(2, 4, 5, 'Magnifique robe, parfaite pour l\'été !', '2025-05-26 09:45:00'),
(3, 5, 4, 'Très bon jean, confortable et stylé.', '2025-05-27 14:20:00'),
(4, 2, 5, 'Veste parfaite pour la pluie, légère et efficace.', '2025-05-28 16:15:00');

-- Favoris
INSERT INTO wishlist (user_id, product_id, added_at) VALUES
(2, 5, '2025-05-20 09:30:00'),
(2, 6, '2025-05-20 09:35:00'),
(3, 1, '2025-05-21 10:45:00'),
(4, 3, '2025-05-22 11:20:00'),
(4, 7, '2025-05-22 11:25:00'),
(5, 2, '2025-05-23 12:10:00');

-- Procédures stockées et triggers (inchangés)
DELIMITER //
CREATE PROCEDURE update_stock_after_order(IN order_id_param INT)
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE product_id_var INT;
    DECLARE quantity_var INT;
    
    DECLARE cur CURSOR FOR 
        SELECT product_id, quantity FROM order_item WHERE order_id = order_id_param;
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    
    OPEN cur;
    
    read_loop: LOOP
        FETCH cur INTO product_id_var, quantity_var;
        IF done THEN
            LEAVE read_loop;
        END IF;
        
        UPDATE product SET stock = stock - quantity_var WHERE id = product_id_var;
    END LOOP;
    
    CLOSE cur;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_order_item_insert
AFTER INSERT ON order_item
FOR EACH ROW
BEGIN
    UPDATE product SET stock = stock - NEW.quantity WHERE id = NEW.product_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_order_item_delete
AFTER DELETE ON order_item
FOR EACH ROW
BEGIN
    UPDATE product SET stock = stock + OLD.quantity WHERE id = OLD.product_id;
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_user_insert
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
    VALUES (NULL, 'create', 'user', NEW.id, CONCAT('Nouvel utilisateur: ', NEW.firstname, ' ', NEW.lastname));
END //
DELIMITER ;

DELIMITER //
CREATE TRIGGER after_order_insert
AFTER INSERT ON `order`
FOR EACH ROW
BEGIN
    INSERT INTO activity_log (user_id, action, entity_type, entity_id, details)
    VALUES (NEW.user_id, 'create', 'order', NEW.id, CONCAT('Nouvelle commande: ', NEW.total_amount, ' €'));
END //
DELIMITER ;

-- Vues (inchangées)
CREATE VIEW product_stats AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    p.stock,
    COUNT(DISTINCT oi.order_id) AS order_count,
    SUM(oi.quantity) AS total_sold,
    AVG(r.rating) AS average_rating,
    COUNT(r.id) AS review_count
FROM 
    product p
LEFT JOIN 
    order_item oi ON p.id = oi.product_id
LEFT JOIN 
    review r ON p.id = r.product_id
GROUP BY 
    p.id, p.name, p.category, p.price, p.stock;

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.firstname,
    u.lastname,
    u.email,
    u.created_at,
    COUNT(DISTINCT o.id) AS order_count,
    SUM(o.total_amount) AS total_spent,
    MAX(o.created_at) AS last_order_date
FROM 
    user u
LEFT JOIN 
    `order` o ON u.id = o.user_id
GROUP BY 
    u.id, u.firstname, u.lastname, u.email, u.created_at;

CREATE VIEW top_selling_products AS
SELECT 
    p.id,
    p.name,
    p.category,
    p.price,
    SUM(oi.quantity) AS total_sold,
    COUNT(DISTINCT oi.order_id) AS order_count
FROM 
    product p
JOIN 
    order_item oi ON p.id = oi.product_id
JOIN 
    `order` o ON oi.order_id = o.id
WHERE 
    o.status = 'completed'
GROUP BY 
    p.id, p.name, p.category, p.price
ORDER BY 
    total_sold DESC;

CREATE VIEW recent_orders_with_details AS
SELECT 
    o.id AS order_id,
    o.created_at AS order_date,
    o.status,
    o.total_amount,
    u.id AS user_id,
    CONCAT(u.firstname, ' ', u.lastname) AS customer_name,
    u.email AS customer_email,
    COUNT(oi.id) AS item_count,
    GROUP_CONCAT(p.name SEPARATOR ', ') AS products
FROM 
    `order` o
JOIN 
    user u ON o.user_id = u.id
JOIN 
    order_item oi ON o.id = oi.order_id
JOIN 
    product p ON oi.product_id = p.id
GROUP BY 
    o.id, o.created_at, o.status, o.total_amount, u.id, customer_name, u.email
ORDER BY 
    o.created_at DESC;
