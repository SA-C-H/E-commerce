# Cahier des charges – Site e-commerce d'accessoires téléphone et high-tech

Projet universitaire en équipe de trois – Octobre 2026

## 1. Présentation du projet

### 1.1 Contexte

Ce projet est proposé par l'enseignant dans le cadre du module de développement web. Il consiste à concevoir et réaliser un site e-commerce fonctionnel. L'enseignant impose l'utilisation de Node.js et attache une importance particulière à la gestion des erreurs. Le projet est rendu avec son code source.

### 1.2 Objectif

Réaliser une boutique en ligne d'accessoires téléphone et high-tech (coques, chargeurs, câbles, écouteurs, supports, etc.) permettant à un client de parcourir le catalogue, de remplir un panier et de finaliser sa commande par WhatsApp.

### 1.3 Équipe

- Membre 1 : backend (API Express)
- Membre 2 : frontend (Next.js)
- Membre 3 : base de données (Supabase) et interface d'administration

## 2. Périmètre

### 2.1 Inclus

- Catalogue de produits avec catégories, recherche et filtres
- Fiche détaillée de chaque produit
- Panier (ajout, modification des quantités, suppression)
- Validation de la commande avec redirection vers WhatsApp
- Inscription et connexion des utilisateurs
- Interface d'administration (produits, catégories, commandes)

### 2.2 Exclu

- Paiement en ligne
- Gestion automatisée de la livraison
- Application mobile native
- Diagrammes et maquettes (le rendu porte directement sur le résultat et le code)

## 3. Acteurs et rôles

| Acteur | Droits |
| --- | --- |
| Visiteur | Consulter le catalogue, rechercher, filtrer, voir les fiches produits, gérer un panier, s'inscrire, se connecter |
| Client | Droits du visiteur, plus consultation de son historique de commandes et de son profil |
| Administrateur | Gérer les produits, les catégories, le stock et le statut des commandes |

## 4. Besoins fonctionnels

Priorité : **P1** indispensable, **P2** souhaitable.

| Réf. | Fonctionnalité | Priorité |
| --- | --- | --- |
| F1 | Afficher la liste des produits avec pagination | P1 |
| F2 | Filtrer par catégorie et par prix, rechercher par mot-clé | P1 |
| F3 | Afficher la fiche détaillée d'un produit (images, description, prix, stock) | P1 |
| F4 | Ajouter un produit au panier, modifier la quantité, le supprimer | P1 |
| F5 | Calculer le total du panier | P1 |
| F6 | Valider le panier : générer un message récapitulatif et rediriger vers WhatsApp | P1 |
| F7 | Créer un compte, se connecter, se déconnecter | P1 |
| F8 | Enregistrer la commande en base avant la redirection WhatsApp | P1 |
| F9 | Administration : créer, modifier, supprimer un produit et une catégorie | P1 |
| F10 | Administration : consulter les commandes et changer leur statut | P1 |
| F11 | Consulter l'historique de ses commandes (client) | P2 |
| F12 | Téléverser des images de produits | P2 |
| F13 | Favoris ou liste de souhaits | P2 |

### Détail de la validation de commande (F6 et F8)

1. Le client clique sur « Commander » depuis le panier.
2. Le backend vérifie le stock et les données du panier.
3. La commande est enregistrée en base avec le statut « en attente ».
4. Un message récapitulatif est généré : produits, quantités, total, nom du client.
5. Le client est redirigé vers WhatsApp avec ce message prérempli (lien `wa.me`).

## 5. Besoins non fonctionnels

- **Sécurité** : mots de passe hashés (bcrypt), authentification par JWT, routes d'administration protégées par rôle, validation et nettoyage de toutes les entrées, variables sensibles dans un fichier `.env`.
- **Performance** : pages produits rendues côté serveur, images optimisées, pagination des listes.
- **Ergonomie** : interface responsive (mobile en priorité), navigation simple, thème premium sombre.
- **Qualité du code** : code organisé en couches (routes, contrôleurs, services), nommage cohérent, README d'installation.

## 6. Contraintes techniques

### 6.1 Architecture

- **Frontend** : Next.js (React), pour l'interface client et l'interface d'administration.
- **Backend** : Node.js avec Express, qui expose une API REST au format JSON.
- **Base de données** : Supabase (PostgreSQL).
- **Communication** : le frontend appelle l'API Express, avec authentification par JWT.

### 6.2 Organisation du dépôt

- `frontend/` : application Next.js
- `backend/` : API Express (routes, contrôleurs, services, middlewares)

### 6.3 Modèle de données (tables principales)

- `users` : id, nom, email, mot de passe hashé, rôle, date de création
- `categories` : id, nom
- `products` : id, nom, description, prix, stock, image, catégorie
- `orders` : id, utilisateur, total, statut, date
- `order_items` : id, commande, produit, quantité, prix unitaire

### 6.4 Points d'API principaux

- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/products`, `GET /api/products/:id`
- `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id` (admin)
- `GET /api/categories`
- `POST /api/orders` (création de la commande et génération du lien WhatsApp)
- `GET /api/orders` (admin : toutes ; client : les siennes)
- `PATCH /api/orders/:id/status` (admin)

## 7. Gestion des erreurs

Le professeur y accorde une attention particulière. Les règles suivantes s'appliquent à tout le projet.

- **Middleware d'erreurs centralisé** dans Express : toutes les erreurs passent par un seul point de traitement.
- **Classe d'erreur personnalisée** portant un code HTTP et un message clair.
- **Validation des entrées** sur chaque route (type, format, champs obligatoires) avec réponse 400 détaillée.
- **Codes HTTP cohérents** : 400 données invalides, 401 non authentifié, 403 accès refusé, 404 ressource introuvable, 409 conflit (email déjà utilisé), 500 erreur serveur.
- **Format de réponse uniforme** : `{ "success": false, "message": "...", "details": [...] }`.
- **Routes asynchrones sécurisées** : aucune exception non gérée, gestion des promesses rejetées.
- **Erreurs de base de données** interceptées et traduites en messages compréhensibles, sans exposer les détails internes.
- **Côté frontend** : messages d'erreur visibles pour l'utilisateur, pages 404 et d'erreur dédiées, états de chargement et d'échec pour chaque appel à l'API.
- **Journalisation** des erreurs serveur dans la console avec horodatage.

## 8. Identité visuelle

- Thème : accessoires téléphone et high-tech, rendu premium.
- Palette « Minuit et violet électrique » : fond `#0B0B1A`, accent `#7C5CFF`, accent secondaire cyan `#22D3EE`.

## 9. Organisation et planning

| Phase | Contenu | Responsable |
| --- | --- | --- |
| 1 | Mise en place des dépôts, schéma Supabase, structure de l'API | Tous |
| 2 | Authentification et gestion des produits (API) | Backend |
| 3 | Pages catalogue, fiche produit, panier | Frontend |
| 4 | Commandes, redirection WhatsApp | Backend et frontend |
| 5 | Interface d'administration | Base de données et admin |
| 6 | Gestion des erreurs, tests, README | Tous |

Date de rendu : à compléter.

## 10. Livrables

- Code source complet (frontend et backend)
- Application fonctionnelle démontrable
- README avec les instructions d'installation et de lancement
- Script ou fichier de création des tables Supabase

## 11. Critères de réussite

- Le parcours complet fonctionne : catalogue, panier, commande, redirection WhatsApp.
- Les erreurs sont gérées proprement sur tout le projet.
- Le backend repose sur Node.js/Express, conformément à la consigne.
- Le code est lisible et chaque membre sait expliquer sa partie.

## 12. Structure des dossiers

```
projet-ecommerce/
├── frontend/                 (Next.js)
│   ├── app/                  pages : accueil, produits, panier, connexion, admin
│   ├── components/           composants réutilisables
│   ├── lib/                  client API, utilitaires
│   └── .env.local
├── backend/                  (Node.js + Express)
│   ├── src/
│   │   ├── config/           connexion Supabase, variables d'environnement
│   │   ├── routes/           auth, products, categories, orders
│   │   ├── controllers/      logique des requêtes
│   │   ├── services/         accès à la base de données
│   │   ├── middlewares/      auth JWT, rôle admin, validation, erreurs
│   │   ├── utils/            AppError, génération du lien WhatsApp
│   │   └── server.js
│   └── .env
├── database/
│   └── schema.sql
└── README.md
```

## 13. Schéma de la base de données (Supabase)

Script à exécuter dans l'éditeur SQL de Supabase :

```sql
create extension if not exists "pgcrypto";

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  password_hash text not null,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text unique not null
);

create table products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null check (price >= 0),
  stock integer not null default 0 check (stock >= 0),
  image_url text,
  category_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create table orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create table order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid references products(id) on delete set null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null check (unit_price >= 0)
);

create index idx_products_category on products(category_id);
create index idx_orders_user on orders(user_id);
create index idx_order_items_order on order_items(order_id);
```

Le backend se connecte avec la clé de service Supabase. Cette clé ne doit jamais apparaître dans le frontend.

## 14. Spécification de l'API

Toutes les réponses sont en JSON. Les routes marquées *auth* exigent un jeton JWT dans l'en-tête `Authorization: Bearer <token>`.

| Méthode | Route | Accès | Rôle |
| --- | --- | --- | --- |
| POST | /api/auth/register | public | Créer un compte |
| POST | /api/auth/login | public | Se connecter, reçoit un JWT |
| GET | /api/auth/me | auth | Profil de l'utilisateur connecté |
| GET | /api/categories | public | Liste des catégories |
| POST, PUT, DELETE | /api/categories | admin | Gérer les catégories |
| GET | /api/products | public | Liste, avec `?page=`, `?category=`, `?search=`, `?minPrice=`, `?maxPrice=` |
| GET | /api/products/:id | public | Détail d'un produit |
| POST, PUT, DELETE | /api/products | admin | Gérer les produits |
| POST | /api/orders | auth | Créer une commande, retourne le lien WhatsApp |
| GET | /api/orders | auth | Ses commandes (client) ou toutes (admin) |
| PATCH | /api/orders/:id/status | admin | Changer le statut |

### Format des réponses

Succès :

```json
{ "success": true, "data": { } }
```

Erreur :

```json
{ "success": false, "message": "Message clair", "details": [ ] }
```

### Règles de validation

- Inscription : nom non vide, email valide, mot de passe d'au moins 8 caractères.
- Produit : nom obligatoire, prix positif ou nul, stock entier positif ou nul.
- Commande : au moins un article, quantités entières supérieures à 0, produits existants, stock suffisant, sinon erreur 409.

### Message WhatsApp

Le backend construit le texte puis l'encode dans le lien `https://wa.me/<numéro>?text=<message encodé>` :

```
Bonjour, je souhaite commander :
- 2 x Coque iPhone 15 : 200 MAD
- 1 x Chargeur rapide 30W : 150 MAD
Total : 350 MAD
Nom : <nom du client>
Commande n° <id>
```

## 15. Variables d'environnement

`backend/.env.example` :

```
PORT=5000
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
JWT_SECRET=
JWT_EXPIRES_IN=7d
WHATSAPP_NUMBER=
FRONTEND_URL=http://localhost:3000
```

`frontend/.env.example` :

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Les fichiers `.env` et `.env.local` sont à ajouter au `.gitignore`.

## 16. Règles pour l'assistant de code (Cursor, Antigravity)

À copier dans un fichier `AGENTS.md` ou `.cursor/rules` à la racine du projet.

- Le frontend utilise **Next.js uniquement pour l'interface**. Il n'y a aucune route API dans Next.js : tout passe par l'API Express du dossier `backend/`.
- Le backend est en **Node.js avec Express**, organisé en routes, contrôleurs, services et middlewares.
- La base est **Supabase (PostgreSQL)**. Utiliser exactement le schéma de `database/schema.sql`, sans ajouter ni renommer de table ou de colonne sans demander.
- **Pas de paiement en ligne.** La commande se termine par une redirection vers WhatsApp.
- **Gestion des erreurs obligatoire** : classe `AppError`, middleware d'erreurs centralisé, validation de toutes les entrées, codes HTTP cohérents, format de réponse `{ success, message, details }`. Aucune route sans gestion d'erreur.
- Les mots de passe sont hashés avec bcrypt, l'authentification se fait par JWT, les routes d'administration sont protégées par un middleware de rôle.
- Ne jamais mettre de clé secrète dans le code ni dans le frontend.
- Le code doit rester simple et lisible, avec des commentaires courts en français, car l'équipe doit pouvoir l'expliquer à l'oral.
- Ne pas créer de diagrammes ni de maquettes.
- Travailler **une étape à la fois** (voir section 17) et s'arrêter après chaque étape pour que l'équipe teste.
- Interface en français, responsive, thème sombre : fond `#0B0B1A`, accent `#7C5CFF`, accent secondaire `#22D3EE`.

## 17. Plan de réalisation par étapes

| Étape | Travail | Test avant de continuer |
| --- | --- | --- |
| 1 | Initialiser `backend/` et `frontend/`, exécuter `schema.sql`, connecter Express à Supabase, ajouter le middleware d'erreurs et la classe `AppError` | Une route `/api/health` répond |
| 2 | Authentification : inscription, connexion, JWT, middleware d'authentification et de rôle admin | Créer un compte et se connecter avec Postman |
| 3 | Catégories et produits : CRUD, pagination, recherche et filtres | Toutes les routes testées, erreurs 400, 404 et 403 vérifiées |
| 4 | Frontend : thème, mise en page, page d'accueil, liste et fiche produit | Le catalogue s'affiche depuis l'API |
| 5 | Frontend : panier (état local, persistance dans le navigateur), pages de connexion et d'inscription | Le panier garde son contenu au rechargement |
| 6 | Commandes : création en base, vérification du stock, génération du lien WhatsApp, redirection | Une commande est enregistrée et WhatsApp s'ouvre avec le message |
| 7 | Interface d'administration : produits, catégories, commandes et statuts | Un admin gère tout, un client est refusé |
| 8 | Finitions : pages 404 et d'erreur, états de chargement, responsive, README | Parcours complet sans erreur |

## 18. Jeu de données de démonstration

Pour la démonstration au professeur, prévoir au moins :

- 5 catégories : coques, chargeurs, câbles, écouteurs, supports
- 15 à 20 produits avec images, prix et stock
- 1 compte administrateur et 1 compte client de test

## 19. Critères d'évaluation visés

| Critère | Ce qui sera montré |
| --- | --- |
| Respect de la consigne Node.js | API Express complète |
| Gestion des erreurs | Middleware central, validation, codes HTTP, messages côté interface |
| Fonctionnement | Parcours complet : catalogue, panier, commande, WhatsApp |
| Qualité du code | Architecture en couches, code lisible, README |
| Maîtrise | Chaque membre explique sa partie |

## 20. Stack technique détaillée

Cette section complète la section 6. Les versions exactes sont celles de la dernière version stable au moment de l'installation, sauf indication contraire.

### 20.1 Frontend

| Domaine | Technologie | Usage |
| --- | --- | --- |
| Framework | Next.js (App Router) | Pages, routage, rendu serveur des pages produits |
| Bibliothèque UI | React | Composants |
| Langage | TypeScript | Typage du code frontend |
| Style | Tailwind CSS | Mise en page et thème sombre |
| Composants | shadcn/ui (Radix UI) | Boutons, formulaires, dialogues, tableaux |
| Animations | Framer Motion | Transitions et effets d'apparition |
| Icônes | lucide-react | Icônes de l'interface |
| Formulaires | react-hook-form + zod | Gestion et validation des formulaires |
| État du panier | Zustand (avec middleware `persist`) | Panier conservé dans le navigateur |
| Appels API | `fetch` natif, dans un client centralisé (`lib/api.ts`) | Communication avec l'API Express |
| Notifications | sonner | Messages de succès et d'erreur |

### 20.2 Backend

| Domaine | Technologie | Usage |
| --- | --- | --- |
| Environnement | Node.js (version LTS, 20 ou supérieure) | Exécution du serveur |
| Framework | Express | API REST |
| Langage | JavaScript (modules ES) | Code du backend |
| Base de données | `@supabase/supabase-js` | Accès à Supabase (PostgreSQL) |
| Authentification | `jsonwebtoken` | Génération et vérification des JWT |
| Mots de passe | `bcryptjs` | Hashage des mots de passe |
| Validation | zod | Validation des corps de requête et des paramètres |
| Sécurité | helmet, cors, express-rate-limit | En-têtes HTTP, origines autorisées, limitation des tentatives |
| Journalisation | morgan | Journal des requêtes |
| Configuration | dotenv | Lecture des variables d'environnement |
| Développement | nodemon | Rechargement automatique |

### 20.3 Base de données et stockage

- **Supabase** : PostgreSQL pour les données, Supabase Storage (bucket `product-images`) pour les images des produits.
- Le schéma est défini dans `database/schema.sql` (section 13).

### 20.4 Outils de développement

| Outil | Usage |
| --- | --- |
| Git et GitHub | Versionnement et travail à trois (une branche par fonctionnalité) |
| Postman | Test des routes de l'API |
| ESLint et Prettier | Qualité et formatage du code |
| Cursor ou Antigravity | Assistant de code, encadré par `AGENTS.md` (section 16) |

### 20.5 Déploiement (optionnel)

- Frontend : Vercel.
- Backend : un hébergeur Node.js (Render ou Railway).
- Base de données : Supabase (hébergé).
- La variable `NEXT_PUBLIC_API_URL` du frontend pointe alors vers l'URL publique du backend, et `FRONTEND_URL` du backend vers celle du frontend.

### 20.6 Choix techniques à respecter

- Le JWT est renvoyé à la connexion, conservé côté client et envoyé dans l'en-tête `Authorization: Bearer <token>`.
- La validation se fait avec zod des deux côtés : côté frontend pour l'expérience utilisateur, côté backend pour la sécurité.
- Aucune bibliothèque de paiement (Stripe, etc.) ni service d'authentification externe (Clerk, etc.) : tout est géré par l'API Express.
- Aucun ORM : les requêtes passent par `@supabase/supabase-js`, pour garder le code simple à expliquer.
