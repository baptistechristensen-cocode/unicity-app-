# UniCity — Document de reprise du développement

> **Destinataires :** équipe de développement reprenant le projet  
> **Version applicative :** V2  
> **Date :** Mai 2026

---

## 1. Vue d'ensemble de l'application

UniCity est une plateforme de participation citoyenne pour la ville de Novaville. Elle permet aux citoyens de signaler des problèmes, participer à des sondages, consulter l'agenda municipal et suivre les actualités de la mairie.

### Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend | PHP 8.4 / Laravel 12 |
| Frontend | React 19 / TypeScript / Inertia.js |
| Base de données | SQLite (dev) / PostgreSQL Neon (prod) |
| Styles | Tailwind CSS v4 |
| Composants UI | ShadCN (Radix UI) |
| Déploiement | Docker / Render.com |

---

## 2. Architecture des dossiers clés

```
UnicityApp/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── SignalementController.php      ← Espace citoyen : signalements
│   │       ├── SondageController.php          ← Espace citoyen : sondages
│   │       ├── EvenementController.php        ← Espace citoyen : agenda
│   │       ├── PublicationController.php      ← Espace citoyen : discussion
│   │       └── Admin/
│   │           ├── AdminDashboardController.php
│   │           ├── AdminSignalementController.php
│   │           ├── AdminSondageController.php
│   │           ├── AdminEvenementController.php
│   │           ├── AdminPublicationController.php
│   │           └── AdminUserController.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Signalement.php + SignalementTimeline.php
│   │   ├── Sondage.php + QuestionSondage.php + OptionQuestion.php
│   │   │   + ReponseSondage.php + ReponseQuestion.php
│   │   ├── Evenement.php + EvenementInteret.php
│   │   └── Publication.php + PublicationLike.php
│   └── Policies/
│       └── SignalementPolicy.php              ← Contrôle d'accès (view/update)
│
├── routes/
│   └── web.php                                ← Toutes les routes de l'application
│
├── database/
│   ├── migrations/                            ← 1 fichier par table, ordonné chronologiquement
│   └── seeders/
│       └── UserSeeder.php                     ← Comptes de test (admin/agent/elu/citoyen)
│
└── resources/
    └── js/
        ├── pages/                             ← 1 fichier TSX par page Inertia
        │   ├── dashboard.tsx                  ← Tableau de bord citoyen
        │   ├── signalements/                  ← index, create, show
        │   ├── sondages/                      ← index, show, resultats
        │   ├── agenda/                        ← index, show
        │   ├── discussion/                    ← index
        │   └── admin/                         ← index, signalements, sondages/, agenda/, publications, utilisateurs
        ├── layouts/
        │   ├── app-layout.tsx                 ← Layout espace citoyen
        │   └── admin-layout.tsx               ← Layout back-office (+ mode MLP)
        └── components/
            ├── admin-sidebar.tsx              ← Navigation back-office
            ├── status-badge.tsx               ← Badge de statut signalement
            └── ui/                            ← Composants ShadCN (button, card, dialog…)
```

---

## 3. Schéma de base de données (V2)

### Tables principales

| Table | Description | Relations clés |
|-------|-------------|----------------|
| `users` | Utilisateurs (citoyen, agent, élu, admin) | — |
| `signalements` | Signalements citoyens | `user_id → users` |
| `signalement_timelines` | Historique de traitement | `signalement_id → signalements` |
| `sondages` | Sondages / consultations | `user_id → users` |
| `questions_sondages` | Questions d'un sondage | `sondage_id → sondages` |
| `options_questions` | Options de réponse (radio/checkbox) | `question_id → questions_sondages` |
| `reponses_sondages` | 1 ligne par citoyen ayant répondu | `sondage_id, user_id` (unique) |
| `reponses_questions` | Réponse détaillée par question | `reponse_sondage_id, question_id, option_id` |
| `evenements` | Événements de l'agenda | `user_id → users` |
| `evenement_interets` | Intérêts citoyens pour un événement | `evenement_id, user_id` (unique) |
| `publications` | Actualités publiées par la mairie | `user_id → users` |
| `publication_likes` | Likes sur les publications | `publication_id, user_id` (unique) |

### Rôles utilisateurs (Spatie Permission)

| Rôle | Accès |
|------|-------|
| `Citoyen` | Espace citoyen uniquement |
| `Agent` | Citoyen + back-office (sans gestion utilisateurs) |
| `Elu` | Citoyen + back-office (sans gestion utilisateurs) |
| `Admin` | Accès complet (y compris gestion des rôles) |

---

## 4. Points d'entrée pour une nouvelle itération

### 4.1 Ajouter un nouveau module fonctionnel

Le pattern à suivre est identique pour chaque module. Exemple pour ajouter un module "Pétitions" :

**Étape 1 — Migration**
```bash
php artisan make:migration create_petitions_table
```

**Étape 2 — Modèle**
```bash
php artisan make:model Petition
```

**Étape 3 — Controllers**
```
app/Http/Controllers/PetitionController.php        ← côté citoyen
app/Http/Controllers/Admin/AdminPetitionController.php ← back-office
```

**Étape 4 — Routes** dans `routes/web.php` :
```php
// Citoyen
Route::get('petitions', [PetitionController::class, 'index'])->name('petitions.index');
// Admin
Route::get('admin/petitions', [AdminPetitionController::class, 'index'])->name('admin.petitions.index');
```

**Étape 5 — Pages frontend**
```
resources/js/pages/petitions/index.tsx
resources/js/pages/petitions/show.tsx
resources/js/pages/admin/petitions.tsx
```

**Étape 6 — Mise à jour de la sidebar admin** dans `resources/js/components/admin-sidebar.tsx` (ajouter l'entrée dans `mainItems`)

**Étape 7 — Dashboard citoyen** dans `resources/js/pages/dashboard.tsx` (ajouter la tuile dans `quickActions`)

---

### 4.2 Fonctionnalités prioritaires pour la V3

Les points suivants sont identifiés comme prochaines étapes naturelles :

| Priorité | Fonctionnalité | Fichiers concernés |
|----------|----------------|-------------------|
| Haute | Notifications (email/push) lors du changement de statut d'un signalement | `SignalementController.php`, `AdminSignalementController.php` + mail templates |
| Haute | Géolocalisation réelle sur carte (Leaflet.js ou Mapbox) | `signalements/create.tsx`, `signalements/show.tsx`, `agenda/show.tsx` |
| Haute | Upload de photos pour les publications (déjà présent, à brancher sur CDN) | `AdminPublicationController.php` → S3/Cloudinary |
| Moyenne | Module Pétitions citoyennes | Nouveau module (voir 4.1) |
| Moyenne | Commentaires citoyens sur les signalements | Migration + `SignalementController` + `signalements/show.tsx` |
| Moyenne | Statistiques avancées (graphiques d'évolution) | `AdminDashboardController.php` + recharts |
| Basse | Authentification FranceConnect (OAuth2) | `app/Http/Controllers/Auth/` + fortify config |
| Basse | Application mobile (React Native / Capacitor) | Réutilisation de l'API Laravel |

---

### 4.3 Points techniques à surveiller

**Base de données**
- En production, la BDD est PostgreSQL (Neon). En développement local, SQLite.
- Éviter `->enum()` dans les migrations : utiliser `->string()` pour la compatibilité SQLite/PostgreSQL.
- Les migrations sont ordonnées chronologiquement — ne jamais modifier une migration déjà exécutée en production.

**Authentification**
- Gérée par Laravel Fortify (`app/Actions/Fortify/`, `config/fortify.php`).
- Les rôles sont gérés par Spatie Laravel Permission.
- Le middleware `role:Admin,Elu,Agent` protège les routes admin.

**Frontend**
- Toutes les pages utilisent Inertia.js : les données PHP sont passées via `Inertia::render('page', [...])`.
- Le layout citoyen est `AppLayout`, le layout admin est `AdminLayout`.
- Les composants UI sont dans `resources/js/components/ui/` (ShadCN).

**Uploads de fichiers**
- Stockés dans `storage/app/public/` (local) ou à migrer vers S3 en production.
- Lien symbolique nécessaire : `php artisan storage:link` (automatisé dans le Dockerfile).

---

## 5. Procédure de développement

### Lancer l'environnement local

```bash
# Backend
php artisan serve          # http://localhost:8000

# Frontend (dans un second terminal)
npm run dev                # http://localhost:5173 (HMR)
```

### Créer et exécuter une migration

```bash
php artisan make:migration nom_de_la_migration
php artisan migrate
```

### Lancer les seeders (données de test)

```bash
php artisan db:seed
```

### Comptes de test

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@test.com | password |
| Élu | elu@test.com | password |
| Agent | agent@test.com | password |
| Citoyen | citoyen@test.com | password |

### Build de production

```bash
npm run build              # Compile les assets
php artisan config:cache   # Cache la configuration
php artisan route:cache    # Cache les routes
```

---

## 6. Dépôts de code source

| Dépôt | URL | Branche principale |
|-------|-----|--------------------|
| GitLab (principal) | https://gitlab.com/antoine.mouezant/unicity | `v1` |
| GitHub (miroir) | https://github.com/baptistechristensen-cocode/unicity-app- | `v1` |

---

## 7. Infrastructure de déploiement

- **Hébergeur :** Render.com (plan gratuit)
- **URL de production :** https://unicity-app.onrender.com
- **Base de données prod :** PostgreSQL Neon (connexion dans `render.yaml`)
- **Pipeline :** Push sur la branche `v1` → build Docker automatique sur Render

Le fichier `Dockerfile` contient la procédure complète : installation des dépendances, build des assets, migration automatique, seed automatique au démarrage.

---

*Document établi par l'équipe de développement initiale — Mai 2026*
