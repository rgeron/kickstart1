# Features Architecture - ilovemeudon.fr

## 📁 Structure des Features

Chaque feature suit une architecture modulaire standardisée :

```
src/features/
├── [feature-name]/
│   ├── types/           # Types TypeScript et interfaces
│   ├── schemas/         # Schémas de validation Zod
│   ├── components/      # Composants React spécifiques
│   ├── actions/         # Server Actions Next.js
│   ├── queries/         # Requêtes de données
│   ├── utils/           # Utilitaires et helpers
│   └── hooks/           # Hooks React personnalisés
```

## 🎯 Features Implémentées

### Phase 1 - Core Features (MVP)

#### ✅ Posts
- **Path**: `src/features/posts/`
- **Status**: Partiellement implémenté
- **Description**: CRUD posts avec structure complète (header, contenu, interactions)

#### 🆕 Voting
- **Path**: `src/features/voting/`
- **Status**: Structure créée
- **Description**: Système de votes upvote/downvote avec calcul karma logarithmique

#### 🆕 Geolocation
- **Path**: `src/content/geolocation.ts` (existant)
- **Status**: Configuration créée
- **Description**: 6 zones de Meudon avec coordonnées et descriptions

#### 🆕 Tags
- **Path**: `src/content/tags.ts` (existant)
- **Status**: Configuration créée
- **Description**: Système hiérarchique à 2 niveaux (type principal + contexte)

### Phase 2 - Engagement Features

#### 🆕 Comments
- **Path**: `src/features/comments/`
- **Status**: Structure créée
- **Description**: Threading hiérarchique style Reddit avec collapse/expand

#### 🆕 Mentions
- **Path**: `src/features/mentions/`
- **Status**: Structure créée
- **Description**: Système @mentions avec autocomplete pour users/lieux/commerces

#### 🆕 Badges
- **Path**: `src/features/badges/`
- **Status**: Structure créée
- **Description**: Badges karma + awards locaux + reconnaissance communautaire

#### 🆕 Search
- **Path**: `src/features/search/`
- **Status**: Structure créée
- **Description**: Recherche avancée avec syntaxe spéciale et filtres intelligents

### Phase 3 - Advanced Features

#### 🆕 Map
- **Path**: `src/features/map/`
- **Status**: Structure créée
- **Description**: Carte interactive Leaflet avec zones cliquables et pins dynamiques

#### 🆕 Moderation
- **Path**: `src/features/moderation/`
- **Status**: Structure créée
- **Description**: Outils d'administration, modération, posts épinglés

#### ✅ File Upload
- **Path**: `src/features/r2-bucket/` (existant)
- **Status**: Implémenté
- **Description**: Upload S3/R2 pour images dans posts

## 🔧 Conventions de Développement

### Types et Interfaces
- Tous les types sont définis dans `types/index.ts`
- Utilisation de TypeScript strict
- Interfaces pour les objets complexes, types pour les unions

### Schémas de Validation
- Utilisation de Zod pour la validation
- Schémas dans `schemas/index.ts`
- Export des types inférés avec `z.infer<>`

### Composants
- Composants React dans `components/`
- Utilisation de Tailwind CSS
- Composants réutilisables dans `src/components/ui/`

### Actions et Queries
- Server Actions Next.js dans `actions/`
- Requêtes de lecture dans `queries/`
- Gestion d'erreur avec try/catch

### Utilitaires
- Fonctions pures dans `utils/`
- Pas d'effets de bord
- Tests unitaires recommandés

## 🚀 Prochaines Étapes

### Priorité 1 - Compléter le MVP
1. **Voting System**: Implémenter les actions de vote et composants UI
2. **Comments**: Créer le système de commentaires hiérarchiques
3. **Enhanced Posts**: Intégrer voting, comments, et geolocation

### Priorité 2 - Engagement
4. **Mentions**: Système d'autocomplétion et parsing
5. **Search**: Interface de recherche avancée
6. **Badges**: Système de récompenses et karma

### Priorité 3 - Advanced
7. **Map**: Carte interactive avec Leaflet
8. **Moderation**: Interface d'administration
9. **Real-time**: WebSockets pour notifications

## 📊 Métriques et KPIs

### Engagement Utilisateur
- Nombre de posts par jour
- Ratio upvotes/downvotes
- Nombre de commentaires par post
- Temps passé sur l'application

### Qualité du Contenu
- Score moyen des posts
- Taux de modération
- Diversité des tags utilisés
- Couverture géographique (posts par zone)

### Communauté
- Nombre d'utilisateurs actifs
- Progression des badges karma
- Utilisation des mentions
- Participation aux discussions

## 🛠️ Technologies Utilisées

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Next.js Server Actions, Prisma
- **Database**: PostgreSQL
- **Storage**: Cloudflare R2
- **Auth**: Better Auth
- **Maps**: Leaflet + OpenStreetMap
- **Validation**: Zod
- **State**: React hooks + Context
