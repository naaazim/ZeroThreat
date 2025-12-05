# Guide d'installation ZeroThreat

Ce guide vous accompagne pas à pas dans l'installation complète de la plateforme ZeroThreat.

## Étape 1 : Installation des prérequis

### 1.1 Java Development Kit (JDK 17+)

**macOS:**
```bash
brew install openjdk@17
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

**Vérification:**
```bash
java -version
```

### 1.2 Node.js et npm

**macOS:**
```bash
brew install node
```

**Ubuntu/Debian:**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Vérification:**
```bash
node -v
npm -v
```

### 1.3 Python 3.10+

**macOS:**
```bash
brew install python@3.10
```

**Ubuntu/Debian:**
```bash
sudo apt install python3.10 python3-pip
```

**Vérification:**
```bash
python3 --version
pip3 --version
```

### 1.4 PostgreSQL

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian:**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Vérification:**
```bash
psql --version
```

### 1.5 Outils de sécurité

**macOS:**
```bash
brew install nmap sqlmap nikto
```

**Ubuntu/Debian:**
```bash
sudo apt install nmap sqlmap nikto
```

**Vérification:**
```bash
nmap --version
sqlmap --version
nikto -Version
```

## Étape 2 : Configuration de la base de données

### 2.1 Créer la base de données

```bash
# Se connecter à PostgreSQL
sudo -u postgres psql

# Ou sur macOS
psql postgres
```

### 2.2 Exécuter les commandes SQL

```sql
-- Créer la base de données
CREATE DATABASE zerothreat_db;

-- Créer l'utilisateur
CREATE USER zerothreat WITH PASSWORD 'zerothreat_password';

-- Accorder les privilèges
GRANT ALL PRIVILEGES ON DATABASE zerothreat_db TO zerothreat;

-- Quitter
\q
```

### 2.3 Vérifier la connexion

```bash
psql -h localhost -U zerothreat -d zerothreat_db
# Entrer le mot de passe: zerothreat_password
```

## Étape 3 : Installation du Backend Spring Boot

### 3.1 Naviguer vers le dossier backend

```bash
cd /Users/nazim/Desktop/ZeroThreat/backend
```

### 3.2 Vérifier la configuration

Ouvrir `src/main/resources/application.properties` et vérifier :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/zerothreat_db
spring.datasource.username=zerothreat
spring.datasource.password=zerothreat_password
```

### 3.3 Compiler le projet

```bash
mvn clean install
```

### 3.4 Lancer le backend

```bash
mvn spring-boot:run
```

Le backend devrait démarrer sur `http://localhost:8080`

**Vérification:**
```bash
curl http://localhost:8080/api/auth/login
# Devrait retourner une erreur 401 (normal, pas de credentials)
```

## Étape 4 : Installation du Frontend React

### 4.1 Naviguer vers le dossier frontend

```bash
cd /Users/nazim/Desktop/ZeroThreat/frontend
```

### 4.2 Installer les dépendances

```bash
npm install
```

### 4.3 Lancer le serveur de développement

```bash
npm run dev
```

Le frontend devrait démarrer sur `http://localhost:3000`

**Vérification:**
Ouvrir `http://localhost:3000` dans votre navigateur.

## Étape 5 : Configuration du Scanner Python

### 5.1 Naviguer vers le dossier scanner

```bash
cd /Users/nazim/Desktop/ZeroThreat/scanner
```

### 5.2 Installer les dépendances Python

```bash
pip3 install -r requirements.txt
```

### 5.3 Configurer les variables d'environnement

```bash
cp .env.example .env
```

Éditer `.env` :
```bash
nano .env
```

Vérifier que l'API_ENDPOINT pointe vers votre backend :
```
API_ENDPOINT=http://localhost:8080/api/scans/results
```

### 5.4 Tester le scanner

```bash
# Test sans envoi API
python3 scanner.py 127.0.0.1 --no-api --save-local
```

## Étape 6 : Test complet du système

### 6.1 Créer un compte utilisateur

1. Ouvrir `http://localhost:3000`
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire :
   - Username: `admin`
   - Email: `admin@zerothreat.local`
   - Password: `admin123`
4. Cliquer sur "S'inscrire"

### 6.2 Récupérer le token JWT

Après connexion, ouvrir la console du navigateur (F12) et exécuter :
```javascript
localStorage.getItem('token')
```

Copier le token.

### 6.3 Configurer le scanner avec le token

Éditer `scanner/.env` :
```
API_TOKEN=<votre-token-jwt>
```

### 6.4 Lancer un scan complet

```bash
cd scanner
python3 scanner.py 127.0.0.1 --url http://localhost
```

### 6.5 Vérifier les résultats

1. Retourner sur `http://localhost:3000/dashboard`
2. Vous devriez voir votre scan dans la liste
3. Cliquer sur "Détails" pour voir les résultats complets

## Étape 7 : Vérification finale

### 7.1 Checklist

- [ ] PostgreSQL fonctionne
- [ ] Backend Spring Boot démarre sans erreur
- [ ] Frontend React est accessible
- [ ] Inscription/Connexion fonctionne
- [ ] Scanner Python peut envoyer des résultats
- [ ] Dashboard affiche les scans
- [ ] Page de détails affiche les graphiques

### 7.2 Logs à vérifier

**Backend:**
```bash
# Dans le terminal du backend, chercher :
"Started ZeroThreatApplication"
"Flyway migration completed successfully"
```

**Frontend:**
```bash
# Dans le terminal du frontend, chercher :
"Local:   http://localhost:3000/"
```

## Dépannage

### Erreur : "Connection refused" (Backend)

**Problème:** PostgreSQL n'est pas démarré

**Solution:**
```bash
# macOS
brew services start postgresql@15

# Ubuntu
sudo systemctl start postgresql
```

### Erreur : "Port 8080 already in use"

**Problème:** Un autre processus utilise le port 8080

**Solution:**
```bash
# Trouver le processus
lsof -i :8080

# Tuer le processus
kill -9 <PID>
```

### Erreur : "npm ERR! code ELIFECYCLE"

**Problème:** Dépendances npm corrompues

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Erreur : "Nmap not found"

**Problème:** Nmap n'est pas installé ou pas dans le PATH

**Solution:**
```bash
# Installer nmap
brew install nmap  # macOS
sudo apt install nmap  # Ubuntu

# Vérifier
which nmap
```

## Prochaines étapes

Une fois l'installation terminée :

1. **Personnaliser** : Modifier les couleurs, logos, etc.
2. **Sécuriser** : Changer les mots de passe par défaut
3. **Déployer** : Préparer pour la production
4. **Monitorer** : Mettre en place des logs et alertes

## Support

Pour toute question ou problème :
- Consulter le README principal
- Vérifier les logs des différents modules
- Tester chaque composant individuellement

---

**Félicitations ! 🎉 ZeroThreat est maintenant installé et opérationnel !**
