# 🛒 TechNova Store — Boutique E-Commerce High-Tech

> **Projet Universitaire — Développement Web Full-Stack**  
> Stack : **Next.js 16** · **Node.js / Express** · **Supabase (PostgreSQL)** · **Tailwind CSS** · **TypeScript**

---

## 📋 Table des matières

1. [Présentation](#-présentation)
2. [Fonctionnalités](#-fonctionnalités)
3. [Architecture technique](#-architecture-technique)
4. [Structure du projet](#-structure-du-projet)
5. [Installation & Démarrage](#-installation--démarrage)
6. [Base de données](#-base-de-données)
7. [Comptes de démonstration](#-comptes-de-démonstration)
8. [Endpoints API](#-endpoints-api)
9. [Gestion des erreurs](#-gestion-des-erreurs-critère-enseignant)
10. [Équipe](#-équipe)

---

## 🌟 Présentation

**TechNova Store** est une boutique en ligne spécialisée dans les **smartphones et laptops haut de gamme** (iPhone, Samsung Galaxy, Google Pixel, MacBook, Dell XPS, Asus ROG…) avec livraison express au **Maroc**.

### Points différenciants
- 🔒 **Authentification JWT sécurisée** avec gestion de rôles (admin / client)
- 🛒 **Panier persistant** (Zustand + localStorage)
- 📱 **Commande par WhatsApp** — pas de paiement en ligne, règlement à la livraison
- 🗂 **Back Office complet** — CRUD produits, stocks, commandes, utilisateurs
- ⚡ **250+ produits** avec caractéristiques détaillées et catégories

---

## ✨ Fonctionnalités

### 🛍 Côté Client
| Fonctionnalité | Détail |
|---|---|
| Catalogue produits | Recherche, filtres par catégorie, pagination |
| Fiche produit | Description, specs, prix MAD, stock en temps réel |
| Panier persistant | Ajout/suppression, quantités, total MAD |
| Commande WhatsApp | Message récapitulatif prérempli + lien `wa.me` |
| Authentification | Inscription, connexion, déconnexion (JWT) |
| Mes commandes | Historique et statut des commandes |

### 🔧 Côté Back Office Admin
| Fonctionnalité | Détail |
|---|---|
| Tableau de bord | KPIs : revenus, commandes en attente, stock faible |
| Catalogue produits | CRUD complet, ajustement stock ± unitaire |
| Gestion commandes | Suivi statuts, contact client direct WhatsApp |
| Catégories | Création, renommage, suppression |
| Utilisateurs | Liste des comptes, bascule de rôle client ↔ admin |

---

## 🏗 Architecture technique

```
┌─────────────────────────────────────────────────────────┐
│                   NAVIGATEUR CLIENT                      │
│           Next.js 16 (App Router, TypeScript)            │
│         Tailwind CSS · Zustand · Sonner · Lucide         │
└────────────────────────┬────────────────────────────────┘
                         │  HTTP REST (fetch)
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  API REST — Express.js                   │
│   routes → controllers → services → middlewares          │
│         Validation Zod · JWT · bcryptjs                  │
└────────────────────────┬────────────────────────────────┘
                         │  @supabase/supabase-js
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Supabase — PostgreSQL                        │
│    users · categories · products · orders · order_items  │
└─────────────────────────────────────────────────────────┘
```

---

## 📁 Structure du projet

```
Projet-Ecommerce-Fillali/
│
├── 📄 README.md                   ← Ce fichier
├── 📄 AGENTS.md                   ← Règles d'architecture
├── 📄 .gitignore
│
├── 🗄 database/
│   ├── schema.sql                 ← Schéma des tables (users, products, orders…)
│   ├── seed.sql                   ← 250+ produits avec specs et images
│   └── seeds/                     ← Scripts SQL modulaires par marque
│       ├── 00_reset_and_categories.sql
│       ├── 02_seed_apple_iphone.sql
│       ├── 03_seed_samsung_galaxy.sql
│       └── …
│
├── ⚙️ backend/                    ← API REST Node.js + Express
│   ├── src/
│   │   ├── config/                ← Supabase client, env
│   │   ├── controllers/           ← auth, products, categories, orders
│   │   ├── middlewares/           ← JWT auth, RBAC, errorHandler
│   │   ├── routes/                ← Endpoints REST
│   │   ├── services/              ← Logique métier + requêtes Supabase
│   │   ├── utils/                 ← AppError, WhatsApp helper, JWT
│   │   ├── validations/           ← Schémas Zod
│   │   └── server.js              ← Point d'entrée Express
│   ├── .env.example
│   └── package.json
│
└── 🎨 frontend/                   ← Application Next.js
    ├── app/
    │   ├── page.tsx               ← Accueil (hero, carrousel, catégories, produits)
    │   ├── products/              ← Catalogue avec filtres
    │   ├── cart/                  ← Panier + validation WhatsApp
    │   ├── orders/                ← Historique commandes
    │   ├── login/ & register/     ← Authentification
    │   ├── admin/                 ← Back Office (protégé rôle admin)
    │   ├── error.tsx              ← Page d'erreur globale
    │   └── not-found.tsx          ← Page 404
    ├── components/
    │   ├── Navbar.tsx             ← Navigation scroll-aware
    │   ├── Footer.tsx
    │   ├── ProductCard.tsx
    │   └── PromoCarouselBanner.tsx ← Carrousel promo style iris.ma
    ├── store/
    │   ├── cartStore.ts           ← Panier Zustand persistant
    │   └── authStore.ts           ← Session utilisateur
    ├── lib/
    │   └── api.ts                 ← Client HTTP centralisé
    ├── .env.example
    └── package.json
```

---

## 🚀 Installation & Démarrage

### Prérequis
- **Node.js** v20+
- Un compte [Supabase](https://supabase.com) (gratuit)
- **Git**

### 1. Cloner le dépôt

```bash
git clone https://github.com/SA-C-H/E-commerce.git
cd E-commerce
```

### 2. Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Ouvrez l'**Éditeur SQL** dans le tableau de bord
3. Exécutez `database/schema.sql` → crée les tables
4. Exécutez `database/seed.sql` → insère 250+ produits

### 3. Démarrer le Backend

```bash
cd backend
npm install

# Copiez et remplissez les variables d'environnement
cp .env.example .env
# → Editez .env avec vos clés Supabase

npm run dev
# ✅ API disponible sur http://localhost:5000
# 🩺 Santé : http://localhost:5000/api/health
```

### 4. Démarrer le Frontend

```bash
# Dans un nouveau terminal
cd frontend
npm install

# Copiez le fichier d'environnement
cp .env.example .env.local

npm run dev
# ✅ Boutique disponible sur http://localhost:3000
```

---

## 🗄 Base de données

### Schéma des tables

```sql
users        — id, name, email, password_hash, role (client|admin), created_at
categories   — id, name, created_at
products     — id, name, description, price, stock, image_url, category_id, created_at
orders       — id, user_id, customer_name, customer_phone, total, status, created_at
order_items  — id, order_id, product_id, quantity, unit_price
```

### Statuts de commande

| Statut | Description |
|---|---|
| `pending` | En attente de confirmation |
| `confirmed` | Commande confirmée par l'admin |
| `delivered` | Livraison effectuée |
| `cancelled` | Commande annulée |

---

## 🔐 Comptes de démonstration

| Rôle | Email | Mot de passe | Accès |
|---|---|---|---|
| **👑 Administrateur** | `admin@technova.ma` | `Admin2026!` | `/admin` — CRUD complet |
| **🛒 Client** | `client@test.ma` | `Client2026!` | Catalogue, panier, commandes |

> Ces comptes existent dans la base Supabase du projet.  
> Pour créer votre propre admin, inscrivez-vous sur `/register` puis changez le rôle dans la table `users` de Supabase ou via le Back Office.

---

## 📡 Endpoints API

### Auth — `/api/auth`
| Méthode | Route | Accès | Description |
|---|---|---|---|
| `POST` | `/register` | Public | Créer un compte |
| `POST` | `/login` | Public | Se connecter (retourne JWT) |
| `GET` | `/me` | 🔒 JWT | Profil de l'utilisateur connecté |
| `GET` | `/users` | 🔒 Admin | Liste de tous les utilisateurs |
| `PATCH` | `/users/:id/role` | 🔒 Admin | Changer le rôle d'un utilisateur |

### Produits — `/api/products`
| Méthode | Route | Accès | Description |
|---|---|---|---|
| `GET` | `/` | Public | Liste avec filtres (search, category, limit, page) |
| `GET` | `/:id` | Public | Détail d'un produit |
| `POST` | `/` | 🔒 Admin | Créer un produit |
| `PUT` | `/:id` | 🔒 Admin | Modifier un produit |
| `PATCH` | `/:id/stock` | 🔒 Admin | Ajuster le stock (+/-) |
| `DELETE` | `/:id` | 🔒 Admin | Supprimer un produit |

### Catégories — `/api/categories`
| Méthode | Route | Accès | Description |
|---|---|---|---|
| `GET` | `/` | Public | Liste des catégories |
| `POST` | `/` | 🔒 Admin | Créer une catégorie |
| `PUT` | `/:id` | 🔒 Admin | Renommer une catégorie |
| `DELETE` | `/:id` | 🔒 Admin | Supprimer une catégorie |

### Commandes — `/api/orders`
| Méthode | Route | Accès | Description |
|---|---|---|---|
| `POST` | `/` | 🔒 JWT | Passer une commande |
| `GET` | `/` | 🔒 Admin | Toutes les commandes |
| `GET` | `/my` | 🔒 JWT | Commandes de l'utilisateur connecté |
| `PATCH` | `/:id/status` | 🔒 Admin | Changer le statut |

---

## 🛡 Gestion des erreurs (Critère Enseignant)

Architecture de gestion d'erreurs multiniveau :

### 1. Validation Zod à l'entrée
```json
{
  "success": false,
  "message": "Données invalides",
  "details": [
    { "field": "email", "message": "Format email invalide" },
    { "field": "password", "message": "Minimum 6 caractères requis" }
  ]
}
```

### 2. Classe `AppError` opérationnelle
```js
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
  }
}
```

### 3. Format uniforme des réponses
```json
// Succès
{ "success": true, "data": { ... } }

// Erreur
{ "success": false, "message": "Message explicite", "details": [] }
```

### 4. Codes HTTP respectés
| Code | Cas d'usage |
|---|---|
| `200` | Succès |
| `201` | Ressource créée |
| `400` | Données invalides (Zod) |
| `401` | Non authentifié (JWT manquant/expiré) |
| `403` | Accès refusé (rôle insuffisant) |
| `404` | Ressource introuvable |
| `409` | Conflit (email déjà utilisé) |
| `500` | Erreur serveur inattendue |

---

## 👥 Équipe

Projet réalisé dans le cadre d'un cours de Développement Web & E-Commerce.

- **Stack Backend :** Node.js, Express, Zod, JWT, bcryptjs, Supabase
- **Stack Frontend :** Next.js 16, TypeScript, Tailwind CSS, Zustand, Lucide React
- **Base de données :** PostgreSQL via Supabase (sans ORM)
- **Déploiement :** Local (démonstration en soutenance)

---

> 💡 **Note soutenance :** Les serveurs backend (port 5000) et frontend (port 3000) doivent être démarrés simultanément. Utilisez deux terminaux distincts.
