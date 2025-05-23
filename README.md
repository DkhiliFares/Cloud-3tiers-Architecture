# README - Projet d’Évaluation AWS : Déploiement d’une Application 3 Niveaux

## Description du Projet
Ce projet consiste à déployer une application web moderne avec une architecture cloud sécurisée et scalable sur AWS. L'application est composée de trois niveaux :
- **Frontend** : Développé avec React ou Angular.
- **Backend** : Développé avec Node.js, Python ou Java.
- **Base de données** : Utilise Amazon RDS (PostgreSQL ou MySQL) pour une gestion simplifiée.

## Architecture du Projet
L'architecture AWS comprend les composants suivants :
- **VPC** avec des sous-réseaux publics et privés répartis sur deux zones de disponibilité (AZ A et AZ B).
- **Load Balancers** (ALB) pour distribuer le trafic vers les instances frontend et backend.
- **Instances EC2** pour le frontend, le backend, et une machine Bastion pour l'accès sécurisé.
- **Amazon RDS** en configuration Multi-AZ pour la haute disponibilité.
- **Amazon S3 et CloudFront** pour le stockage et la diffusion optimisée des fichiers statiques.
- **Sécurité avancée** avec groupes de sécurité, CloudWatch, CloudTrail, et certificats SSL via AWS Certificate Manager.

## Étapes de Déploiement

### Étape 1 : Configuration du VPC et des Composants Réseau
1. Créez un VPC avec une plage CIDR (ex: `10.0.0.0/16`).
2. Créez 6 sous-réseaux :
   - 2 sous-réseaux publics (un dans chaque zone de disponibilité).
   - 6 sous-réseaux privés (3 pour le frontend/backend/RDS(database) dans chaque zone).
3. Attachez une Internet Gateway (IGW) au VPC.
4. Déployez 2 NAT Gateways (un par AZ) dans les sous-réseaux publics.
5. Configurez les tables de routage pour les sous-réseaux publics et privés.
![image](https://github.com/user-attachments/assets/0d348fc6-6493-4c71-8a69-31917fa9b1eb)


### Étape 2 : Configuration des Groupes de Sécurité
- **SG-LB** : Autorise HTTP/HTTPS depuis Internet.
- **SG-FE** : Autorise le trafic depuis SG-LB.
- **SG-BE** : Autorise le trafic depuis SG-FE (ex: port 8080).
- **SG-DB** : Autorise le trafic depuis SG-BE (ex: port 3306).
- **SG-Bastion** : Autorise l'accès SSH depuis une IP fixe.

### Étape 3 : Déploiement des Ressources EC2
1. Déployez deux instances EC2 pour le frontend (une par AZ) dans les sous-réseaux privés.
2. Déployez deux instances EC2 pour le backend (une par AZ) dans les sous-réseaux privés.
3. Déployez une instance Bastion dans un sous-réseau public.
4. Configurez un Application Load Balancer (ALB) pour le frontend et le backend.
5. Configurez des groupes Auto Scaling pour le frontend et le backend avec des règles basées sur l'utilisation CPU ou le nombre de requêtes.

### Étape 4 : Déploiement de la Base de Données (Amazon RDS)
1. Créez une instance RDS (MySQL ou PostgreSQL) dans les sous-réseaux privés.
2. Activez Multi-AZ pour la haute disponibilité.
3. Attachez le groupe de sécurité SG-DB.

### Étape 5 : Configuration de S3 et CloudFront
1. Créez un bucket S3 pour stocker les fichiers statiques.
2. Configurez une distribution CloudFront pour optimiser la diffusion des fichiers.

### Étape 6 : Sécurité Avancée
1. Activez Amazon CloudWatch pour le suivi des métriques et des logs.
2. Configurez des alarmes CloudWatch pour les seuils critiques (ex: CPU > 70%).
3. Activez les sauvegardes automatiques pour RDS.
4. Activez CloudTrail pour enregistrer les actions sur l'infrastructure.
5. Configurez AWS Certificate Manager (ACM) pour les certificats SSL et appliquez-les aux load balancers.

### Étape 7 : Documentation et Présentation
1. Fournissez une documentation complète incluant des schémas d'architecture et les étapes de déploiement.
2. Préparez une présentation finale pour démontrer le déploiement et les fonctionnalités.

## Fichiers et Captures d'Écran
- **Schémas d'architecture** : Diagrammes du VPC, des sous-réseaux, et de l'architecture globale.
- **Captures d'écran** : Configurations des groupes de sécurité, instances EC2, ALB, RDS, S3, CloudFront, et CloudWatch.

## Auteur
- [Votre Nom]
- Contact : [votre.email@example.com]

## Date
[Date de réalisation du projet]
