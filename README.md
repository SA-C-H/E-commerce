# 🛒 TechNova Store — Boutique E-Commerce High-Tech

> **Projet Universitaire — Développement Web Full-Stack**
> Stack : **Next.js 16** · **Node.js / Express** · **Supabase (PostgreSQL)** · **Tailwind CSS** · **TypeScript**

---

## 🚀 Démarrage Rapide (3 terminaux)

```bash
# Terminal 1 — Backend
cd backend && cp .env.example .env   # puis remplir le .env
npm install && npm run dev
# ✅ http://localhost:5000/api/health

# Terminal 2 — Frontend
cd frontend && cp .env.example .env.local
npm install && npm run dev
# ✅ http://localhost:3000

# Optionnel — Terminal 3 — Supabase local (si Supabase CLI installé)
supabase start
```

---

## 📋 Table des matières

1. [Présentation](#-présentation)
2. [Fonctionnalités](#-fonctionnalités)
3. [Prérequis](#-prérequis)
4. [Installation pas-à-pas](#-installation-pas-à-pas)
5. [Variables d'environnement](#-variables-denvironnement)
6. [Structure du projet](#-structure-du-projet)
7. [Architecture technique](#-architecture-technique)
8. [Base de données](#-base-de-données)
9. [Endpoints API](#-endpoints-api)
10. [Comptes de démonstration](#-comptes-de-démonstration)
11. [Gestion des erreurs](#-gestion-des-erreurs)
12. [Déploiement en production](#-déploiement-en-production)

---

## 🌟 Présentation

**TechNova Store** est une boutique en ligne spécialisée dans les smartphones et laptops haut de gamme (iPhone, Samsung Galaxy, MacBook, Dell XPS, Asus ROG…) avec livraison express au Maroc.

| Élément | Valeur |
|---------|--------|
| **Frontend** | https://e-commerce-brown-nu.vercel.app |
| **Backend** | https://backend-production-5ffe3.up.railway.app/api |
| **Health check** | https://backend-production-5ffe3.up.railway.app/api/health |

---

## ✨ Fonctionnalités

### Côté Client
- Catalogue 757 produits avec recherche, filtres par catégorie, pagination
- Panier persistant (Zustand + localStorage) avec drawer latéral
- Commande par WhatsApp — message récapitulatif pré-rempli
- Authentification JWT (inscription, connexion, déconnexion)
- Profil utilisateur avec modification infos et changement de mot de passe
- Historique des commandes avec possibilité d'annuler une commande en attente
- Chatbot assistant IA (Google Gemini)

### Côté Back Office Admin (`/admin`)
- Tableau de bord avec KPIs et graphiques
- CRUD produits avec gestion du stock
- Gestion des commandes avec panneau détail, changement de statut, fiche imprimable
- Gestion des catégories
- Gestion des utilisateurs (rôles, suppression)

---

## 🔧 Prérequis

Vérifiez que vous avez les outils suivants avant de commencer :

```bash
node --version    # v18.0.0 ou supérieur (recommandé : v20 LTS)
npm --version     # v9.0.0 ou supérieur
git --version     # toute version récente
```

Vous avez également besoin :
- D'un compte **[Supabase](https://supabase.com)** (gratuit)
- D'un compte **[Google AI Studio](https://aistudio.google.com)** pour la clé Gemini (optionnel, pour le chatbot)

---

## 📦 Installation pas-à-pas

### Étape 1 — Cloner le dépôt

```bash
git clone https://github.com/SA-C-H/E-commerce.git
cd E-commerce
```

### Étape 2 — Configurer Supabase

1. Créez un projet sur [supabase.com](https://supabase.com)
2. Dans le tableau de bord Supabase, allez dans **SQL Editor**
3. Exécutez `database/schema.sql` → crée les 5 tables
4. Exécutez `database/seed.sql` → insère 757 produits de démo
5. Récupérez vos clés dans **Project Settings → API** :
   - `Project URL` → `SUPABASE_URL`
   - `service_role` (Legacy API Keys) → `SUPABASE_SERVICE_KEY`

> ⚠️ Utilisez bien la clé **service_role** (commence par `eyJ...`), pas la clé `anon`.

### Étape 3 — Configurer et démarrer le Backend

```bash
cd backend

# Copier et remplir le fichier d'environnement
cp .env.example .env
```

Éditez `backend/.env` avec vos vraies valeurs (voir section Variables d'environnement).

```bash
# Installer les dépendances
npm install

# Démarrer en mode développement (redémarrage automatique)
npm run dev
```

Vérifiez que le backend fonctionne :
```bash
curl http://localhost:5000/api/health
# Réponse attendue : {"success":true,"data":{"status":"OK","database":"connecté"}}
```

### Étape 4 — Configurer et démarrer le Frontend

```bash
# Dans un nouveau terminal
cd frontend

# Copier le fichier d'environnement
cp .env.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api  ← déjà correct pour le local

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Étape 5 — Vérification

| Service | URL | Statut attendu |
|---------|-----|----------------|
| Frontend | http://localhost:3000 | Page d'accueil TechNova |
| Backend | http://localhost:5000/api/health | `{"success":true}` |
| Admin | http://localhost:3000/admin/login | Page de connexion admin |

---

## 🔑 Variables d'environnement

### `backend/.env`

```env
# Port du serveur Express
PORT=5000

# Supabase — Project Settings > API dans votre tableau de bord Supabase
SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# JWT — Chaine aléatoire longue et secrète (minimum 32 caractères)
JWT_SECRET=votre_secret_jwt_tres_long_et_aleatoire_ici
JWT_EXPIRES_IN=7d

# WhatsApp — Numéro du service client au format international sans +
# Exemple Maroc : 212612345678
WHATSAPP_NUMBER=212600000000

# CORS — URL du frontend
FRONTEND_URL=http://localhost:3000

# Optionnel — Clé Google Gemini pour le chatbot IA
# Obtenez-la sur https://aistudio.google.com (plan gratuit disponible)
GEMINI_API_KEY=votre_cle_gemini_optionnelle
```

### `frontend/.env.local`

```env
# URL de l'API backend Express
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

> En production sur Vercel, cette variable est automatiquement redirigée vers Railway.

---

## 📁 Structure du projet

```
E-commerce/
│
├── 📄 README.md                    ← Ce fichier
├── 📄 AGENTS.md                    ← Règles d'architecture pour les assistants IA
│
├── 🗄️ database/
│   ├── schema.sql                  ← Schéma des 5 tables (à exécuter en 1er)
│   ├── seed.sql                    ← 757 produits de démo (à exécuter en 2nd)
│   ├── rls_policies.sql            ← Politiques Row Level Security Supabase
│   └── seeds/                      ← Scripts SQL modulaires par marque
│
├── ⚙️ backend/                     ← API REST Node.js + Express
│   ├── .env.example                ← Modèle de configuration (copier en .env)
│   ├── src/
│   │   ├── config/
│   │   │   └── supabase.js         ← Client Supabase (service role)
│   │   ├── controllers/            ← Coordination requête → service → réponse
│   │   │   ├── auth.controller.js
│   │   │   ├── product.controller.js
│   │   │   ├── category.controller.js
│   │   │   └── order.controller.js
│   │   ├── services/               ← Logique métier + requêtes Supabase
│   │   │   ├── auth.service.js
│   │   │   ├── product.service.js
│   │   │   └── order.service.js
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.js  ← Vérification JWT (protect + restrictTo)
│   │   │   └── errorHandler.js     ← Middleware d'erreurs centralisé
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── product.routes.js
│   │   │   ├── category.routes.js
│   │   │   └── order.routes.js
│   │   ├── utils/
│   │   │   ├── AppError.js         ← Classe d'erreur avec code HTTP
│   │   │   ├── jwt.js              ← generateToken / verifyToken
│   │   │   └── whatsapp.js         ← Génération du lien wa.me
│   │   └── server.js               ← Point d'entrée Express
│   └── package.json
│
├── 🎨 frontend/                    ← Application Next.js 16 (App Router)
│   ├── .env.example                ← Modèle de configuration (copier en .env.local)
│   ├── app/
│   │   ├── page.tsx                ← Accueil (hero, carousel, catalogue)
│   │   ├── products/               ← Catalogue avec filtres
│   │   ├── cart/                   ← Panier + validation WhatsApp
│   │   ├── orders/                 ← Historique commandes client
│   │   ├── login/                  ← Connexion
│   │   ├── register/               ← Inscription
│   │   └── admin/                  ← Back Office (protégé rôle admin)
│   ├── components/
│   │   ├── Navbar.tsx              ← Navigation avec mega menu
│   │   ├── CartDrawer.tsx          ← Panier latéral
│   │   ├── ProfileModal.tsx        ← Profil utilisateur (drawer)
│   │   ├── OrdersDrawer.tsx        ← Historique (drawer)
│   │   ├── Chatbot.tsx             ← Assistant IA
│   │   └── ui/                     ← Composants shadcn/ui
│   ├── store/
│   │   ├── authStore.ts            ← Session utilisateur (Zustand)
│   │   ├── cartStore.ts            ← Panier persistant (Zustand)
│   │   └── themeStore.ts           ← Thème clair/sombre (Zustand)
│   ├── lib/
│   │   └── api.ts                  ← Client HTTP centralisé
│   └── package.json
│
└── 📄 rapport/
    └── rapport_technova.tex        ← Rapport technique LaTeX
```

---

## 🏗️ Architecture technique

```
┌──────────────────────────────────────────────────────────────┐
│                    NAVIGATEUR CLIENT                          │
│            Next.js 16 (App Router, TypeScript)               │
│          Tailwind CSS · Zustand · shadcn/ui · Sonner         │
└──────────────────────────┬───────────────────────────────────┘
                           │  HTTP REST (fetch + Bearer JWT)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                   API REST — Express.js                       │
│   routes → controllers → services → middlewares              │
│         Validation Zod · JWT · bcryptjs · morgan             │
└──────────────────────────┬───────────────────────────────────┘
                           │  @supabase/supabase-js (service role)
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              Supabase — PostgreSQL                            │
│   users · categories · products · orders · order_items       │
└──────────────────────────────────────────────────────────────┘
```

> **Règle fondamentale :** le frontend ne communique **jamais** directement avec Supabase. Toutes les opérations passent par l'API Express.

---

## 🗄️ Base de données

### Schéma des tables

```sql
users        — id, name, email, password_hash, role (client|admin), created_at
categories   — id, name
products     — id, name, description, price, stock, image_url, category_id, created_at
orders       — id, user_id, customer_name, customer_phone, total, status, created_at
order_items  — id, order_id, product_id, quantity, unit_price
```

### Statuts des commandes

| Statut | Description | Transitions autorisées |
|--------|-------------|----------------------|
| `pending` | En attente de confirmation | → `confirmed`, `cancelled` |
| `confirmed` | Confirmée par l'admin | → `delivered`, `cancelled` |
| `delivered` | Livrée | _(statut final)_ |
| `cancelled` | Annulée | _(statut final)_ |

> Le client peut annuler une commande uniquement si elle est encore `pending`.

---

## 📡 Endpoints API

### Auth — `/api/auth`

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| `POST` | `/register` | Public | Créer un compte |
| `POST` | `/login` | Public | Connexion (retourne JWT) |
| `GET` | `/me` | 🔒 JWT | Profil connecté |
| `PATCH` | `/profile` | 🔒 JWT | Modifier nom / email |
| `PATCH` | `/change-password` | 🔒 JWT | Changer le mot de passe |
| `GET` | `/users` | 🔒 Admin | Liste tous les utilisateurs |
| `PATCH` | `/users/:id/role` | 🔒 Admin | Changer le rôle |
| `DELETE` | `/users/:id` | 🔒 Admin | Supprimer un utilisateur |

### Produits — `/api/products`

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| `GET` | `/` | Public | Liste avec filtres (search, category, page) |
| `GET` | `/:id` | Public | Détail d'un produit |
| `POST` | `/` | 🔒 Admin | Créer |
| `PUT` | `/:id` | 🔒 Admin | Modifier |
| `PATCH` | `/:id/stock` | 🔒 Admin | Ajuster le stock |
| `DELETE` | `/:id` | 🔒 Admin | Supprimer |

### Catégories — `/api/categories`

| Méthode | Route | Accès |
|---------|-------|-------|
| `GET` | `/` | Public |
| `POST` | `/` | 🔒 Admin |
| `PUT` | `/:id` | 🔒 Admin |
| `DELETE` | `/:id` | 🔒 Admin |

### Commandes — `/api/orders`

| Méthode | Route | Accès | Description |
|---------|-------|-------|-------------|
| `POST` | `/` | 🔒 JWT | Passer une commande |
| `GET` | `/` | 🔒 JWT | Ses commandes (client) ou toutes (admin) |
| `PATCH` | `/:id/cancel` | 🔒 JWT | Annuler (si pending, par le client) |
| `PATCH` | `/:id/status` | 🔒 Admin | Changer le statut |

---

## 🔐 Comptes de démonstration

Ces comptes existent dans la base Supabase du projet de démo.

| Rôle | Email | Mot de passe | Accès |
|------|-------|--------------|-------|
| **👑 Administrateur** | `admin@technova.ma` | `Admin2026!` | `/admin` — toutes fonctionnalités |
| **🛒 Client** | `client@test.ma` | `Client2026!` | Catalogue, panier, commandes |

> Pour créer votre propre admin : inscrivez-vous via `/register`, puis dans Supabase SQL Editor :
> ```sql
> UPDATE users SET role = 'admin' WHERE email = 'votre@email.com';
> ```

---

## 🛡️ Gestion des erreurs

Architecture multiniveau — critère d'évaluation prioritaire du professeur.

### Format de réponse uniforme

```json
// Succès
{ "success": true, "data": { ... } }

// Erreur
{ "success": false, "message": "Message explicite", "details": [] }
```

### Codes HTTP

| Code | Cas d'usage |
|------|-------------|
| `200` | Succès |
| `201` | Ressource créée |
| `400` | Données invalides (Zod) |
| `401` | Non authentifié (JWT manquant ou expiré) |
| `403` | Accès refusé (rôle insuffisant) |
| `404` | Ressource introuvable |
| `409` | Conflit (email déjà utilisé, stock insuffisant) |
| `500` | Erreur serveur inattendue |

### Exemple — Validation Zod

```json
{
  "success": false,
  "message": "Données invalides",
  "details": [
    { "field": "email", "message": "Format email invalide" },
    { "field": "password", "message": "Minimum 8 caractères requis" }
  ]
}
```

---

## 🌐 Déploiement en production

| Couche | Plateforme | URL |
|--------|-----------|-----|
| Frontend | Vercel | https://e-commerce-brown-nu.vercel.app |
| Backend | Railway | https://backend-production-5ffe3.up.railway.app |
| Base de données | Supabase | Projet `xsqdhrvasebhjdxnezrt` |

### Variables de production (Vercel)

```
NEXT_PUBLIC_API_URL = https://backend-production-5ffe3.up.railway.app/api
```

### Variables de production (Railway)

```
PORT=5000
SUPABASE_URL=https://xsqdhrvasebhjdxnezrt.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc...  (service_role key)
JWT_SECRET=...
JWT_EXPIRES_IN=7d
WHATSAPP_NUMBER=212600000000
FRONTEND_URL=https://e-commerce-brown-nu.vercel.app
```

---

## 🧰 Stack technique complète

| Domaine | Technologie | Version | Usage |
|---------|------------|---------|-------|
| Framework frontend | Next.js (App Router) | 16 | Pages, routage, SSR |
| Langage frontend | TypeScript | 5 | Typage statique |
| Style | Tailwind CSS | 4 | Mise en page, thème |
| Composants UI | shadcn/ui (base-ui) | — | Dialog, Tabs, Input... |
| État global | Zustand | 5 | Panier, auth, thème |
| Notifications | Sonner | 2 | Toasts |
| Icônes | lucide-react | 1.69 | Icônes |
| Framework backend | Express.js | 4 | API REST |
| Runtime backend | Node.js | 20+ | Serveur |
| Validation | Zod | 4 | Données entrantes |
| Auth | jsonwebtoken | — | JWT |
| Hash MDP | bcryptjs | — | Mots de passe |
| Sécurité | helmet, cors, rate-limit | — | HTTP |
| BDD | Supabase (PostgreSQL) | — | Données |
| IA | Google Gemini | — | Chatbot |

---

## 👥 Équipe

Projet réalisé dans le cadre d'un cours de Développement Web & E-Commerce.

- **Membre 1** — Backend (API Express, middlewares, services)
- **Membre 2** — Frontend (Next.js, composants, stores)
- **Membre 3** — Base de données (Supabase, schéma) & Interface Admin

---

## 📝 Notes pour le Professeur

> Ce README couvre l'installation complète en local. Pour toute question :
> - Le code source complet est sur GitHub : https://github.com/SA-C-H/E-commerce
> - La démo en production est accessible 24h/7j aux URLs indiquées ci-dessus
> - Les comptes de démonstration fonctionnent en production et en local (si la même base Supabase est utilisée)
