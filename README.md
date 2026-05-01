# 🌐 The Moroccan Network - Plateforme de Gestion

Bienvenue sur le dépôt officiel de la plateforme de gestion pour l'association **The Moroccan Network**. 
Cette application permet la gestion des adhérents (HelloAsso), la billetterie événementielle, la presse (actualités) et le suivi administratif.

## 🛠 Stack Technique
- **Backend** : Symfony 7 / PHP 8.4
- **Frontend** : React 19 / TypeScript / Vite / TailwindCSS v4
- **Base de données** : MySQL 8.0
- **Sécurité** : JWT (LexikJWTAuthenticationBundle)
- **Déploiement** : CI/CD via GitHub Actions

## 🚀 Installation & Développement

### 1. Prérequis
- PHP 8.4 & Composer
- Node.js 20+ & npm
- MySQL 8.0

### 2. Backend (Symfony)
1. Aller dans le dossier api : `cd api`
2. Installer les dépendances : `composer install`
3. Configurer les variables d'environnement : 
   - Copier `.env` vers `.env.local`
   - Configurer `DATABASE_URL`, `MAILER_DSN`, `HELLOASSO_CLIENT_ID`
4. Créer la base : `php bin/console doctrine:database:create`
5. Lancer les migrations : `php bin/console doctrine:migrations:migrate`
6. Générer les clés JWT : `php bin/console lexik:jwt:generate-keypair`
7. Lancer le serveur : `symfony serve`

### 3. Frontend (React)
1. Aller dans le dossier react : `cd react`
2. Installer les dépendances : `npm install`
3. Créer le fichier `.env.local` et définir `VITE_API_URL=http://localhost:8000`
4. Lancer le serveur : `npm run dev`

## 🔐 Sécurité & Rôles
Le système repose sur 3 niveaux d'accès :
- **ROLE_USER** : Membres du bureau (Logistique événementielle, rédaction news).
- **ROLE_ADMIN** : Bras droit du président (Gestion staff, outils de communication).
- **ROLE_SUPER_ADMIN** : Président (Accès total, gestion des rôles et invitations).

## 🚀 Déploiement (Production)
Pour préparer le déploiement sur un serveur Nginx/Apache :
1. **Frontend** : Lancer `npm run build` pour générer les assets statiques dans `/dist`.
2. **Backend** : 
   - Configurer `APP_ENV=prod`.
   - Lancer `composer install --no-dev --optimize-autoloader`.
   - Utiliser `php bin/console cache:warmup`.
   - Configurer les headers de sécurité (HSTS, CSP) via Nginx.

## 🧪 Tests
- Lancer les tests unitaires et fonctionnels avec : `php bin/phpunit`