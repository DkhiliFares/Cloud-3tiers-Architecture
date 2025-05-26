# Projet d’Évaluation AWS : Déploiement d’une Application 3 Niveaux

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
![image](https://github.com/user-attachments/assets/935ba238-bc58-4876-a525-ab7bf2c86125)

3. Attachez une Internet Gateway (IGW) au VPC.
![image](https://github.com/user-attachments/assets/0bed00db-4a6c-4a0f-a017-0b12e1f5e02c)

4. Déployez 2 NAT Gateways (un par AZ) dans les sous-réseaux publics.
![image](https://github.com/user-attachments/assets/dfbfb7a5-0ae4-4db8-ae29-8a6a77ea868d)

5. Configurez les tables de routage pour les sous-réseaux publics et privés.
![image](https://github.com/user-attachments/assets/50089191-4b41-4963-9233-22becdfd19b8)

6. Architecture Globlale du Vpc 
![image](https://github.com/user-attachments/assets/0d348fc6-6493-4c71-8a69-31917fa9b1eb)


### Étape 2 : Configuration des Groupes de Sécurité

- **SG-LB** : Autorise HTTP/HTTPS depuis Internet.
- **SG-FE** : Autorise le trafic depuis SG-LB.
- **SG-BE** : Autorise le trafic depuis SG-FE (ex: port 8080).
- **SG-DB** : Autorise le trafic depuis SG-BE (ex: port 3306).
- **SG-Bastion** : Autorise l'accès SSH depuis une IP fixe.
![image](https://github.com/user-attachments/assets/85c9dca6-70c3-44c5-a5ea-c84ed443537e)


#### 1. 🔁 **SG-LB** (Load Balancer ou accès frontend direct)

* **Nom** : `SG-LB`
* **Utilisation** : Autoriser le trafic HTTP/HTTPS public vers le frontend

| Type  | Protocole | Port | Source      |
| ----- | --------- | ---- | ----------- |
| HTTP  | TCP       | 80   | `0.0.0.0/0` |
| HTTPS | TCP       | 443  | `0.0.0.0/0` |

---
![image](https://github.com/user-attachments/assets/d227c9e5-9b03-4cfd-b342-b67db7f8779f)

---

#### 2. 🎨 **SG-FE** (Frontend)

* **Nom** : `SG-FE`
* **Utilisation** : Autoriser uniquement le trafic du SG-LB

| Type  | Protocole | Port | Source                       |
| ----- | --------- | ---- | ---------------------------- |
| HTTP  | TCP       | 80   | `SG-LB` (sélectionner le SG) |
| HTTPS | TCP       | 443  | `SG-LB`                      |

---
![image](https://github.com/user-attachments/assets/726eafd9-e8c6-4930-9ff7-8d8ff628c9f9)

---

#### 3. ⚙️ **SG-BE** (Backend)

* **Nom** : `SG-BE`
* **Utilisation** : Autoriser le frontend à appeler les APIs backend (ex: port 8080)

| Type          | Protocole | Port | Source  |
| ------------- | --------- | ---- | ------- |
| HTTP (custom) | TCP       | 8080 | `SG-FE` |


---
![image](https://github.com/user-attachments/assets/ee197618-c332-4fc2-b960-a588eedd2835)

#### 4. 🗃️ **SG-DB** (Base de données)

* **Nom** : `SG-DB`
* **Utilisation** : Autoriser uniquement le backend à accéder à la base (port 3306)

| Type         | Protocole | Port | Source  |
| ------------ | --------- | ---- | ------- |
| MySQL/Aurora | TCP       | 3306 | `SG-BE` |

---
![image](https://github.com/user-attachments/assets/691b89c9-b639-40f0-b780-c22c0e03c4d1)


#### 5. 💻 **SG-Bastion** (accès SSH)

* **Nom** : `SG-Bastion`
* **Utilisation** : Te connecter en SSH depuis ton PC

| Type | Protocole | Port | Source                                      |
| ---- | --------- | ---- | ------------------------------------------- |
| SSH  | TCP       | 22   | `Ton IP publique` (ex: `41.226.xxx.xxx/32`) |

---
![image](https://github.com/user-attachments/assets/e8ab8fb8-eafa-490f-9a93-6eb20e0227f3)


### Étape 3 : Déploiement des Ressources EC2
1. Déployez deux instances EC2 pour le frontend (une par AZ) dans les sous-réseaux privés.
*Frontend EC2-A*
![image](https://github.com/user-attachments/assets/816262d3-5cfa-4afb-85be-31a16f191b1c)

Accés à l'instance EC2-Fronted-A depuis bastionHost en utilisant le key AccesSSHBastionHost.pem 
![Capture d'écran 2025-05-23 220207](https://github.com/user-attachments/assets/99ee1388-aee4-4b8f-8d46-7b50e05341b3)


*Fronted EC2-B*
![image](https://github.com/user-attachments/assets/73319a8b-2d7e-46d2-bfaa-7539a2f5b04b)

3. Déployez deux instances EC2 pour le backend (une par AZ) dans les sous-réseaux privés.
   Instance EC2-Backend-A
   ![image](https://github.com/user-attachments/assets/3828c6dd-3e93-4332-803b-0f843963b55e)

   Instance EC2-Backend-B
   ![image](https://github.com/user-attachments/assets/90692dc3-b701-48df-b804-032e129ac79b)

5. Déployez une instance Bastion dans un sous-réseau public(publicSubnetB).
![image](https://github.com/user-attachments/assets/15eea3dc-a430-461e-8fdf-a6af838c41a8)

Accés au bastion host depuis mon pc local en utilisant le key AccesSSHBastionHost.pem 
![image](https://github.com/user-attachments/assets/a62e2dc7-b5cf-41c5-8c9e-82c24d8730dc)

7. Configurez un Application Load Balancer (ALB) pour le frontend et le backend.
   ![image](https://github.com/user-attachments/assets/b6541762-7124-4b54-a9be-fe65fee294d3)
   
   ALB pour la frontend
   ![image](https://github.com/user-attachments/assets/4c808f61-63e0-4a1f-982a-f955a49e1e56)
   Forward to Target group TG-Frontend
   ![image](https://github.com/user-attachments/assets/08c0aefc-9619-471d-af1a-ac861b02a8d5)

   ALB pour le backend
   ![image](https://github.com/user-attachments/assets/86bc5573-76fb-4fd5-b59a-f3156b78776e)
   Forward to Target group TG-Backend 
   ![image](https://github.com/user-attachments/assets/4288bb1d-6df7-4d44-a66a-e22678ac2886)



9. Configurez des groupes Auto Scaling pour le frontend et le backend avec des règles basées sur l'utilisation CPU ou le nombre de requêtes.

### Étape 4 : Déploiement de la Base de Données (Amazon RDS)
1. Créez une instance RDS (MySQL ou PostgreSQL) dans les sous-réseaux privés.
2. Activez Multi-AZ pour la haute disponibilité.
3. Attachez le groupe de sécurité SG-DB.
![Capture d'écran 2025-05-24 052618](https://github.com/user-attachments/assets/5505e715-28eb-4584-87b8-50c2cf158409)

Connexion et Creation de la db 'mydb'
![image](https://github.com/user-attachments/assets/5db701d0-639c-48bf-8f76-895ec689dc39)

### Étape 5 : Configuration de S3 et CloudFront
1. Créez un bucket S3 pour stocker les fichiers statiques.
2. Configurez une distribution CloudFront pour optimiser la diffusion des fichiers.

### Étape 6 : Sécurité Avancée
1. Activez Amazon CloudWatch pour le suivi des métriques et des logs.
2. Configurez des alarmes CloudWatch pour les seuils critiques (ex: CPU > 70%).
3. Activez les sauvegardes automatiques pour RDS.
4. Activez CloudTrail pour enregistrer les actions sur l'infrastructure.
5. Configurez AWS Certificate Manager (ACM) pour les certificats SSL et appliquez-les aux load balancers.

## Auteur
- Dkhili Fares
- Contact : dkhili.fares2002@gmail.com

## Date
mai 2025
