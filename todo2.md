## 📦 Installation & Lancement de l'Application

Ce projet comporte un **backend en Flask (Python)** et un **frontend statique (HTML/CSS/JS)**.
Suivez les étapes ci-dessous pour l'exécuter en local.

---

### 🔧 Prérequis

* Python 3.7 ou version supérieure
* `pip` installé

---

### 🚀 Backend (API Flask)

#### 1. Créez un environnement virtuel (recommandé) :

```bash
cd backend
python -m venv venv
```

#### 2. Activez l’environnement virtuel :

* **Windows** :

  ```bash
  venv\Scripts\activate
  ```
* **macOS/Linux** :

  ```bash
  source venv/bin/activate
  ```

#### 3. Installez les dépendances :

```bash
pip install -r requirements.txt
```

#### 4. Lancez l’application Flask :

```bash
python main.py
```

L’API est maintenant accessible à l’adresse :

```
http://localhost:5000
```

#### ✅ Exemple de test API :

Vous pouvez tester l’endpoint produits :

[http://localhost:5000/api/products](http://localhost:5000/api/products)

---

### 🌐 Frontend (interface utilisateur)

#### 1. Ouvrez un **nouveau terminal**.

#### 2. Lancez un serveur HTTP local :

```bash
python -m http.server 8000
```

Cela sert les fichiers statiques à :

```
http://localhost:8000
```

#### 3. Accédez à l’application dans votre navigateur :

[http://localhost:8000](http://localhost:8000)

---

### ✅ Résumé rapide

| Composant         | Commande                     | Port             |
| ----------------- | ---------------------------- | ---------------- |
| Backend Flask     | `python main.py`             | `localhost:5000` |
| Frontend statique | `python -m http.server 8000` | `localhost:8000` |

---

### 🛠 Dépannage

* Si l'API ne répond pas, vérifiez que le backend est bien lancé.
* Si vous ouvrez les fichiers HTML en double-cliquant, les appels API ne fonctionneront pas (utilisez toujours `http.server`).
