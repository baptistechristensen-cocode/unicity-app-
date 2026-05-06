# UniCity — Manuel utilisateur V2

> **Plateforme de participation citoyenne de Novaville**  
> **Version :** 2.0  
> **Date :** Mai 2026

---

## Introduction

UniCity est votre espace numérique de participation à la vie de Novaville. La plateforme vous permet de :
- Signaler des problèmes dans votre ville
- Participer aux sondages et consultations
- Consulter l'agenda des événements
- Suivre les actualités de la mairie

---

## Accès à la plateforme

### Créer un compte

1. Rendez-vous sur l'adresse de la plateforme
2. Cliquez sur **Créer un compte**
3. Renseignez votre nom, adresse email et mot de passe
4. Validez votre email via le lien reçu

### Se connecter

1. Cliquez sur **Se connecter**
2. Saisissez votre email et mot de passe
3. Vous arrivez sur votre tableau de bord citoyen

---

## Espace citoyen

### Tableau de bord

Le tableau de bord est votre page d'accueil après connexion. Il affiche :
- Vos **3 derniers signalements** et leur statut
- Les **tuiles d'accès rapide** aux 4 modules de la plateforme
- Vos statistiques personnelles (total, en cours, résolus)

---

### Module Signalements

**Signaler un problème**

1. Depuis le tableau de bord, cliquez sur **Signaler un problème** ou allez dans **Mes signalements → Signaler**
2. Renseignez :
   - **Titre** : description courte du problème
   - **Catégorie** : Voirie / Éclairage / Propreté / Autre
   - **Description** : détail du problème
   - **Adresse** (optionnel) : localisation précise
   - **Photo** (optionnel) : image du problème (max 5 Mo)
3. Cliquez sur **Envoyer le signalement**

**Suivre mes signalements**

Depuis **Mes signalements**, retrouvez tous vos signalements avec leur statut :

| Statut | Signification |
|--------|---------------|
| Reçu | Votre signalement a été enregistré |
| En cours | Les services municipaux traitent le problème |
| Résolu | Le problème a été résolu |
| Rejeté | Le signalement n'a pas pu être traité |

Cliquez sur un signalement pour voir son **historique de traitement** et les éventuels **commentaires de la mairie**.

---

### Module Sondages

**Participer à un sondage**

1. Allez dans **Sondages citoyens**
2. Consultez les sondages **Actifs**
3. Cliquez sur **Participer** pour un sondage qui vous intéresse
4. Répondez aux questions (choix unique, choix multiple ou texte libre)
5. Naviguez entre les questions avec **Précédent / Suivant**
6. Cliquez sur **Soumettre mes réponses** à la dernière question

> Vos réponses sont **anonymisées** conformément au RGPD.

**Consulter les résultats**

Une fois votre réponse soumise (ou si le sondage est terminé), cliquez sur **Voir les résultats** pour accéder à la synthèse avec les pourcentages par réponse.

---

### Module Agenda

**Parcourir les événements**

1. Allez dans **Agenda de la ville**
2. Filtrez par thème : Sport / Culture / Citoyenneté / Environnement
3. Consultez les événements à venir

**Marquer votre intérêt**

Sur la page détail d'un événement, cliquez sur **Je suis intéressé(e)** pour suivre l'événement. Le compteur d'intérêt s'affiche en temps réel.

---

### Module Actualités

**Consulter les publications**

1. Allez dans **Actualités**
2. Le fil d'actualités présente les publications de la mairie et ses réseaux sociaux
3. Cliquez sur le bouton ❤ pour liker une publication
4. Suivez la mairie sur ses réseaux sociaux via les liens dans la colonne de droite

---

### Paramètres du compte

Depuis l'icône de votre profil (en bas de la barre latérale) :
- **Profil** : modifier votre nom et email
- **Mot de passe** : changer votre mot de passe
- **Apparence** : basculer entre le mode clair, sombre et... surprise 🦄
- **Double authentification** : activer la 2FA pour plus de sécurité

---

## Espace Back-Office (Élus & Agents municipaux)

> Accessible via **/admin** — réservé aux rôles Agent, Élu et Admin.

### Tableau de bord administrateur

Vue d'ensemble de la plateforme avec :
- **KPIs** : signalements en attente, événements à venir, sondages actifs, citoyens inscrits
- **Graphique** : répartition des signalements par statut
- **Accès rapides** : gérer signalements, créer un sondage, publier un événement

---

### Gestion des signalements

1. Allez dans **Signalements** du menu
2. Utilisez la **recherche** ou les **filtres** par statut
3. Pour chaque signalement, vous pouvez :
   - Modifier le **statut** (Reçu → En cours → Résolu / Rejeté)
   - Ajouter un **commentaire** visible par le citoyen

---

### Gestion des sondages

**Créer un sondage**

1. Cliquez sur **Sondages → Créer un sondage**
2. Renseignez les informations générales (titre, description, dates, audience)
3. Ajoutez vos questions en cliquant sur **Ajouter une question**
4. Pour chaque question, choisissez le type :
   - **Choix unique** : le citoyen choisit une seule option
   - **Choix multiple** : le citoyen peut cocher plusieurs options
   - **Texte libre** : réponse ouverte
5. Cliquez sur **Sauvegarder en brouillon** ou **Publier le sondage**

**Gérer les sondages**

Depuis la liste des sondages, changez le statut (Brouillon / Actif / Terminé) via le menu déroulant. Supprimez un sondage avec l'icône poubelle (action irréversible).

---

### Gestion de l'agenda

**Publier un événement**

1. Cliquez sur **Agenda → Publier un événement**
2. Renseignez : titre, description, date et heure, lieu, thème, organisateur
3. Ajoutez une **image de bannière** (optionnel)
4. Cliquez sur **Publier l'événement**

---

### Gestion des publications

**Créer une publication**

1. Allez dans **Publications → Nouvelle publication**
2. Renseignez le titre, la source (Mairie / Facebook / Instagram / Twitter) et le contenu
3. Ajoutez une image (optionnel)
4. Cliquez sur **Publier**

---

### Gestion des utilisateurs *(Admin uniquement)*

1. Allez dans **Utilisateurs**
2. Consultez la liste de tous les citoyens inscrits
3. Pour modifier le rôle d'un utilisateur : cliquez sur **Modifier le rôle** et sélectionnez le nouveau rôle

---

## Assistance

Pour toute question ou problème technique, contactez l'administrateur de la plateforme.

---

*Manuel utilisateur UniCity V2 — Mairie de Novaville — Mai 2026*
