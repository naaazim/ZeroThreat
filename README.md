# ZeroThreat 🛡️

**ZeroThreat** est une plateforme SaaS professionnelle de scan automatisé de vulnérabilités. Elle centralise et orchestre trois outils de sécurité majeurs (**Nmap**, **SQLMap**, **Nikto**) et intègre la base de données **NVD** pour la détection automatique des CVEs, le tout via une interface web moderne et intuitive.

![ZeroThreat Dashboard Header](https://via.placeholder.com/800x200?text=ZeroThreat+Platform)

## 🚀 Fonctionnalités

- **Orchestration de Scans** : Lancement automatisé et séquentiel de Nmap, SQLMap et Nikto.
- **Détection de Ports & Services** : Identification précise des ports ouverts et des versions de services.
- **Détection de Vulnérabilités Web** : Scan des failles web courantes (XSS, configurations par défaut, fichiers sensibles).
- **Détection d'Injections SQL** : Tests automatisés sur les paramètres GET/POST.
- **Intégration CVE (NVD)** : Corrélation automatique des services détectés avec la base de données nationale des vulnérabilités (NVD) pour identifier les CVEs critiques.
- **Tableau de Bord Unifié** : Visualisation centralisée des résultats avec graphiques interactifs et statistiques.
- **Authentification Sécurisée** : Gestion des utilisateurs via JWT (JSON Web Tokens).

## 🛠️ Stack Technique

### Backend
- **Langage** : Java 17
- **Framework** : Spring Boot 3.2
- **Sécurité** : Spring Security + JWT
- **Base de données** : PostgreSQL 15
- **Migration** : Flyway
- **Build** : Maven

### Frontend
- **Framework** : React 18
- **UI Library** : Material-UI (MUI) v5
- **Visualisation** : Chart.js
- **Build** : Vite
- **Client HTTP** : Axios

### Scanner Engine
- **Langage** : Python 3.10+
- **Outils intégrés** : Nmap, SQLMap, Nikto
- **Communication** : API REST & WebSocket

## Prérequis

- Java 17+
- Node.js 18+
- Python 3.10+
- PostgreSQL 15+
- Outils systèmes : `nmap`, `sqlmap`, `nikto` installés et accessibles dans le PATH.

## Installation

### 1. Base de Données

Créez une base de données PostgreSQL :

```sql
CREATE DATABASE zerothreat_db;
CREATE USER zerothreat WITH PASSWORD '<your_database_password>';
GRANT ALL PRIVILEGES ON DATABASE zerothreat_db TO zerothreat;
```

### 2. Backend (Spring Boot)

Configuration dans `backend/src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/zerothreat_db
spring.datasource.username=zerothreat
spring.datasource.password=<your_database_password>
nvd.api.key=<votre-cle-api-nvd>
```

Lancer le serveur :

```bash
cd backend
mvn clean install
mvn spring-boot:run
```
*Le serveur démarrera sur http://localhost:8080*

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```
*L'application sera accessible sur http://localhost:3000*

### 4. Scanner (Python)

Configurer l'environnement :

```bash
cd scanner
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Créer un fichier `.env` dans `scanner/` :
```env
API_ENDPOINT=http://localhost:8080/api/scans/results
API_TOKEN=<votre-token-jwt-admin>
```

## Utilisation

1. **Accédez au Dashboard** : Ouvrez `http://localhost:3000` et créez un compte.
2. **Lancez un Scan** : Utilisez le scanner Python pour cibler une machine.
   ```bash
   python scanner/scanner.py <TARGET_IP>
   ```
3. **Analysez les Résultats** :
   - Les résultats apparaissent en temps réel sur le dashboard.
   - Consultez la page de détails pour voir les ports, les failles web, les injections SQL et les **CVEs associées** (avec scores CVSS).

##  Sécurité & Légal

**IMPORTANT** : Cet outil est destiné à être utilisé **uniquement** sur des systèmes dont vous êtes propriétaire ou pour lesquels vous avez une autorisation écrite explicite. L'utilisation non autorisée d'outils de scan est illégale.

## Auteur

**Abderahmane Nazim HAMIA**

---
*ZeroThreat - Analysez, détectez, sécurisez.*
