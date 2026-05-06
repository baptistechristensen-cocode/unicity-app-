# UniCity — Guide d'installation client

> **Version :** 2.0  
> **Date :** Mai 2026  
> **Destinataire :** équipe technique cliente (TALENTIA / Mairie de Novaville)

---

## Prérequis

### Option A — Déploiement cloud (recommandé)

Aucun prérequis serveur. Un compte sur les services suivants suffit :
- [Render.com](https://render.com) — hébergement de l'application (plan gratuit disponible)
- [Neon](https://neon.tech) — base de données PostgreSQL cloud (plan gratuit disponible)

### Option B — Déploiement sur serveur propre

| Prérequis | Version minimale |
|-----------|-----------------|
| Docker | 24+ |
| Docker Compose | 2.0+ |
| Accès SSH au serveur | — |
| Nom de domaine (optionnel) | — |

---

## Option A — Déploiement automatique sur Render.com

C'est la méthode la plus simple. L'application se déploie automatiquement à chaque mise à jour du code.

### Étape 1 — Créer la base de données PostgreSQL

1. Connectez-vous sur [neon.tech](https://neon.tech)
2. Créez un nouveau projet (nom : `unicity`)
3. Copiez la **Connection string** au format :
   ```
   postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
   ```

### Étape 2 — Déployer sur Render

1. Connectez-vous sur [render.com](https://render.com)
2. Cliquez sur **New → Web Service**
3. Choisissez **Deploy from existing image** ou connectez votre dépôt Git
4. Si dépôt Git : sélectionnez le dépôt `unicity` et la branche `v1`
5. Render détecte automatiquement le `Dockerfile`

### Étape 3 — Configurer les variables d'environnement

Dans Render, section **Environment**, renseignez :

| Variable | Valeur |
|----------|--------|
| `APP_NAME` | UniCity |
| `APP_ENV` | production |
| `APP_DEBUG` | false |
| `APP_KEY` | *(générer via `php artisan key:generate --show`)* |
| `APP_URL` | https://votre-app.onrender.com |
| `ASSET_URL` | https://votre-app.onrender.com |
| `DB_CONNECTION` | pgsql |
| `DB_URL` | *(votre connection string Neon)* |
| `SESSION_DRIVER` | database |
| `CACHE_STORE` | database |
| `SESSION_SECURE_COOKIE` | true |
| `APP_LOCALE` | fr |

### Étape 4 — Déployer

Cliquez sur **Create Web Service**. Le déploiement dure environ 3 à 5 minutes. Render :
- Construit l'image Docker
- Installe les dépendances PHP et Node.js
- Compile les assets frontend
- Exécute les migrations de base de données
- Lance les seeders (comptes de test)
- Démarre l'application

### Étape 5 — Vérifier le déploiement

Ouvrez l'URL fournie par Render. La page d'accueil UniCity doit s'afficher.

**Comptes créés automatiquement :**

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@test.com | password |
| Élu | elu@test.com | password |
| Agent | agent@test.com | password |
| Citoyen | citoyen@test.com | password |

> **Important :** changez ces mots de passe immédiatement après le premier déploiement.

---

## Option B — Déploiement sur serveur avec Docker

### Étape 1 — Récupérer le code source

```bash
git clone https://github.com/baptistechristensen-cocode/unicity-app-.git
cd unicity-app-
git checkout v1
```

### Étape 2 — Configurer l'environnement

```bash
cp .env.example .env
```

Éditez le fichier `.env` avec vos valeurs :

```env
APP_NAME=UniCity
APP_ENV=production
APP_DEBUG=false
APP_URL=https://votre-domaine.com

DB_CONNECTION=pgsql
DB_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require

SESSION_DRIVER=database
CACHE_STORE=database
```

Générez la clé d'application :
```bash
docker run --rm -v $(pwd):/app composer php artisan key:generate
```

### Étape 3 — Construire et lancer l'application

```bash
docker build -t unicity-app .
docker run -d \
  --name unicity \
  -p 8080:8080 \
  --env-file .env \
  unicity-app
```

L'application est accessible sur `http://votre-serveur:8080`.

### Étape 4 — Configurer un reverse proxy (Nginx)

Pour exposer l'application sur le port 80/443 avec HTTPS :

```nginx
server {
    listen 443 ssl;
    server_name votre-domaine.com;

    ssl_certificate /etc/letsencrypt/live/votre-domaine.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/votre-domaine.com/privkey.pem;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Installation locale pour le développement

### Prérequis

| Outil | Version |
|-------|---------|
| PHP | 8.4+ |
| Composer | 2.0+ |
| Node.js | 20+ |
| npm | 10+ |

### Procédure

```bash
# 1. Cloner le dépôt
git clone https://github.com/baptistechristensen-cocode/unicity-app-.git
cd unicity-app-
git checkout v1

# 2. Installer les dépendances PHP
composer install

# 3. Installer les dépendances Node
npm install

# 4. Configurer l'environnement
cp .env.example .env
php artisan key:generate

# 5. Créer la base de données SQLite
touch database/database.sqlite

# 6. Exécuter les migrations et les seeders
php artisan migrate --seed

# 7. Créer le lien de stockage public
php artisan storage:link

# 8. Lancer les serveurs (deux terminaux)
php artisan serve       # Terminal 1 → http://localhost:8000
npm run dev             # Terminal 2 → http://localhost:5173
```

---

## Déploiement continu (mise à jour de l'application)

### Sur Render.com

Tout push sur la branche `v1` du dépôt Git déclenche automatiquement un nouveau déploiement sur Render. Aucune action manuelle nécessaire.

### Sur serveur propre

```bash
# Récupérer les mises à jour
git pull origin v1

# Reconstruire et redémarrer
docker build -t unicity-app .
docker stop unicity && docker rm unicity
docker run -d --name unicity -p 8080:8080 --env-file .env unicity-app
```

---

## Dépôts de code source

| Dépôt | URL | Branche |
|-------|-----|---------|
| GitHub | https://github.com/baptistechristensen-cocode/unicity-app- | `v1` |
| GitLab | https://gitlab.com/antoine.mouezant/unicity | `v1` |

---

## Support

Pour toute question technique, contacter l'équipe de développement initiale.

---

*Guide d'installation UniCity V2 — Mai 2026*
