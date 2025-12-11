# ZeroThreat Scanner Module

Module Python de scan automatisé de vulnérabilités pour la plateforme ZeroThreat.

## Fonctionnalités

- **Scan Nmap** : Détection des ports ouverts, services et versions
- **Scan SQLMap** : Détection des injections SQL
- **Scan Nikto** : Détection des vulnérabilités web
- **Agrégation JSON** : Résultats normalisés et structurés
- **Intégration API** : Envoi automatique des résultats au backend Spring Boot
- **Mode Socket** : Envoi des résultats via sockets pour scanning sur n'importe quelle IP
- **Interface Web** : Visualisation des résultats dans un navigateur web

## Prérequis

### Outils de sécurité

Les outils suivants doivent être installés sur votre système :

```bash
# macOS
brew install nmap sqlmap nikto

# Ubuntu/Debian
sudo apt-get install nmap sqlmap nikto

# Arch Linux
sudo pacman -S nmap sqlmap nikto
```

### Python

Python 3.10+ requis.

## Installation

1. **Installer les dépendances Python** :

```bash
cd scanner
pip install -r requirements.txt
```

2. **Configurer les variables d'environnement** :

```bash
cp .env.example .env
# Éditer .env avec vos paramètres
```

## Utilisation

### Scan basique

```bash
python scanner.py 192.168.1.10
```

### Scan avec URL personnalisée

```bash
python scanner.py 192.168.1.10 --url http://example.com
```

### Sauvegarder les résultats localement

```bash
python scanner.py 192.168.1.10 --save-local
```

### Désactiver l'envoi à l'API

```bash
python scanner.py 192.168.1.10 --no-api
```

### Utilisation du mode Socket (nouveau)

Pour utiliser le nouveau système basé sur sockets avec interface web:

1. **Démarrer le serveur socket** (dans un terminal):

```bash
./run_socket_server.sh
```

2. **Exécuter un scan avec sortie socket** (dans un autre terminal):

```bash
./run_scanner_socket.sh 192.168.1.10
```

3. **Visualiser les résultats** dans votre navigateur:

```
http://localhost:8000
```

Voir [SOCKET_USAGE.md](SOCKET_USAGE.md) pour plus de détails sur le mode socket.

## Format des résultats

```json
{
  "target": "192.168.1.10",
  "timestamp": "2025-12-03T14:30:00",
  "nmap": [
    {
      "port": 80,
      "protocol": "tcp",
      "state": "open",
      "service": "http",
      "version": "Apache 2.4.41"
    }
  ],
  "sqlmap": [
    {
      "vulnerability_type": "Boolean-based blind",
      "parameter": "id",
      "payload": "AND 1=1",
      "description": "SQL injection vulnerability detected"
    }
  ],
  "nikto": [
    {
      "osvdb_id": "3233",
      "method": "GET",
      "uri": "/admin/",
      "description": "Admin directory found"
    }
  ],
  "summary": {
    "total_open_ports": 5,
    "sql_vulnerabilities": 1,
    "web_vulnerabilities": 3,
    "scan_completed": "2025-12-03T14:35:00"
  }
}
```

## Logs

Les logs sont enregistrés dans `scanner.log` et affichés dans la console.

## Sécurité

⚠️ **ATTENTION** : Ce scanner doit être utilisé uniquement sur des systèmes pour lesquels vous avez l'autorisation explicite. L'utilisation non autorisée de ces outils peut être illégale.
