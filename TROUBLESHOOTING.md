# ZeroThreat - Guide de Dépannage

## 🔧 Problème : 403 Forbidden sur le Dashboard

### Cause
Vous n'êtes pas connecté ou votre token JWT a expiré.

### Solution

**1. Connectez-vous d'abord**
1. Allez sur http://localhost:3000/login
2. Entrez vos identifiants
3. Ou créez un compte sur http://localhost:3000/register

**2. Vérifiez le token**
Ouvrez la console du navigateur (F12) et tapez :
```javascript
localStorage.getItem('token')
```

Si c'est `null`, vous devez vous reconnecter.

**3. Videz le cache si nécessaire**
```javascript
localStorage.clear()
```
Puis reconnectez-vous.

## 📊 Tester l'application

### Étape 1 : Inscription
1. Allez sur http://localhost:3000/register
2. Créez un compte :
   - Username : `test`
   - Email : `test@test.com`
   - Password : `password123`

### Étape 2 : Lancer un scan
1. Cliquez sur "Nouveau Scan"
2. Entrez une cible :
   - `scanme.nmap.org` (recommandé pour les tests)
   - Ou `127.0.0.1` (votre machine locale)
3. Cliquez sur "Scanner"
4. Attendez 20-30 secondes

### Étape 3 : Voir les résultats
1. Le scan apparaît dans le tableau
2. Vous devriez voir le nombre de ports détectés
3. Cliquez sur "Détails" pour voir les informations complètes

## 🐛 Autres problèmes courants

### Backend ne démarre pas
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend ne compile pas
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### PostgreSQL n'est pas démarré
```bash
# macOS
brew services start postgresql@14

# Vérifier
psql -U postgres -d zerothreat
```

### Scanner Python ne fonctionne pas
```bash
cd scanner
python3 -m pip install --user -r requirements.txt

# Tester manuellement
python3 scanner.py 127.0.0.1 --no-api --save-local
```

## ✅ Checklist de vérification

- [ ] Backend Spring Boot démarré (port 8080)
- [ ] Frontend React démarré (port 3000)
- [ ] PostgreSQL démarré
- [ ] Compte utilisateur créé
- [ ] Connecté avec un token valide
- [ ] Nmap, SQLMap, Nikto installés

## 🔍 Logs utiles

**Backend :**
```bash
cd backend
mvn spring-boot:run
# Regardez les logs pour les erreurs
```

**Scanner :**
```bash
cd scanner
tail -f scanner.log
```

**Frontend :**
Ouvrez la console du navigateur (F12) pour voir les erreurs JavaScript.

---

**Besoin d'aide ?** Vérifiez que tous les services sont démarrés et que vous êtes bien connecté !
