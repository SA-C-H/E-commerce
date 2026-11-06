# Consignes et Règles pour l'Assistant de Code

Ce projet est un site e-commerce d'accessoires téléphone et high-tech réalisé avec Express (backend), Next.js (frontend) et Supabase (PostgreSQL).

## Règles Architecturales & Techniques

1. **Frontend (Next.js)** :
   - Utilisé uniquement pour l'interface utilisateur (App Router, TypeScript, Tailwind CSS, shadcn/ui, Zustand).
   - **Aucune route API dans Next.js** (`/app/api/...` interdit) : toutes les données proviennent de l'API Express du dossier `backend/`.

2. **Backend (Node.js + Express)** :
   - Écrit en JavaScript ES modules (`"type": "module"`).
   - Organisation stricte en couches :
     - `src/config/` : variables d'environnement, client Supabase
     - `src/routes/` : définition des endpoints
     - `src/controllers/` : validation des requêtes et coordination
     - `src/services/` : logique métier et requêtes Supabase
     - `src/middlewares/` : JWT, contrôle des rôles, gestion des erreurs
     - `src/utils/` : `AppError`, fonctions utilitaires
     - `src/server.js` : point d'entrée

3. **Base de données (Supabase / PostgreSQL)** :
   - Utiliser exactement le schéma défini dans `database/schema.sql`.
   - Ne pas ajouter ni renommer de table ou de colonne sans demande explicite.
   - Accès via `@supabase/supabase-js` avec la clé de service (côté backend uniquement). Aucun ORM (Prisma/TypeORM/Sequelize interdit).

4. **Paiement et Commandes** :
   - **Pas de paiement en ligne** (pas de Stripe, Paypal, etc.).
   - La validation du panier enregistre la commande en base puis génère un message récapitulatif avec redirection vers WhatsApp via un lien `https://wa.me/...`.

5. **Gestion des Erreurs (Priorité Enseignant)** :
   - Utilisation systématique de la classe `AppError` avec code HTTP et message compréhensible.
   - Middleware d'erreurs centralisé dans Express.
   - Validation stricte des données entrantes avec **Zod**.
   - Format standardisé des réponses :
     - Succès : `{ "success": true, "data": { ... } }`
     - Erreur : `{ "success": false, "message": "...", "details": [ ... ] }`
   - Codes HTTP conformes : 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 409 (Conflict), 500 (Internal Server Error).

6. **Sécurité & Bonnes pratiques** :
   - Mots de passe hashés avec `bcryptjs`.
   - Authentification par jeton JWT (`Authorization: Bearer <token>`).
   - Routes admin protégées par vérification du rôle (`role === 'admin'`).
   - Ne jamais exposer de secret ni la clé de service Supabase côté frontend.

7. **Qualité et Clarté** :
   - Code lisible et concis avec courts commentaires en français (l'équipe doit pouvoir tout expliquer à l'oral lors de la soutenance).
   - Thème visuel sombre : Fond `#0B0B1A`, Accent `#7C5CFF`, Accent secondaire `#22D3EE`.
   - Travailler **une étape à la fois** et valider avant de passer à l'étape suivante.

