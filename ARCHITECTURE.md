# Architecture ZeroThreat

## Vue d'ensemble

ZeroThreat est une plateforme de cybersécurité composée de 4 modules principaux qui communiquent entre eux pour fournir une solution complète de scan de vulnérabilités.

## Diagramme d'architecture global

```
┌─────────────────────────────────────────────────────────────────┐
│                     ZEROTHREAT PLATFORM                          │
│                                                                   │
│  ┌─────────────┐      ┌──────────────┐      ┌──────────────┐   │
│  │   Scanner   │─────▶│  Spring Boot │◀─────│    React     │   │
│  │   Python    │ HTTP │   REST API   │ HTTP │   Frontend   │   │
│  │             │ POST │              │ GET  │              │   │
│  └─────────────┘      └──────┬───────┘      └──────────────┘   │
│                              │                                   │
│                              │ JDBC                              │
│                              ▼                                   │
│                       ┌──────────────┐                          │
│                       │  PostgreSQL  │                          │
│                       │   Database   │                          │
│                       └──────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

## Diagramme UML des entités

```
┌─────────────────┐
│      User       │
├─────────────────┤
│ - id: Long      │
│ - username      │
│ - email         │
│ - password      │
│ - createdAt     │
└────────┬────────┘
         │ 1
         │
         │ N
┌────────▼────────┐
│      Scan       │
├─────────────────┤
│ - id: Long      │
│ - target        │
│ - timestamp     │
│ - status        │
│ - createdAt     │
└────────┬────────┘
         │ 1
         ├──────────────────┬──────────────────┐
         │ N                │ N                │ N
┌────────▼────────┐  ┌──────▼──────┐  ┌───────▼──────┐
│  NmapResult     │  │ SqlMapResult│  │ NiktoResult  │
├─────────────────┤  ├─────────────┤  ├──────────────┤
│ - id            │  │ - id        │  │ - id         │
│ - port          │  │ - vulnType  │  │ - osvdbId    │
│ - protocol      │  │ - payload   │  │ - method     │
│ - service       │  │ - parameter │  │ - uri        │
│ - version       │  │ - desc      │  │ - desc       │
│ - state         │  └─────────────┘  └──────────────┘
└─────────────────┘
```

## Flux de données détaillé

### 1. Scan et soumission des résultats

```
┌──────────┐                                    ┌──────────┐
│  Python  │                                    │  Spring  │
│  Scanner │                                    │   Boot   │
└────┬─────┘                                    └────┬─────┘
     │                                                │
     │ 1. Execute Nmap                               │
     ├─────────────────────────────────────────────▶ │
     │                                                │
     │ 2. Execute SQLMap                             │
     ├─────────────────────────────────────────────▶ │
     │                                                │
     │ 3. Execute Nikto                              │
     ├─────────────────────────────────────────────▶ │
     │                                                │
     │ 4. Aggregate results to JSON                  │
     │                                                │
     │ 5. POST /api/scans/results                    │
     ├───────────────────────────────────────────────▶
     │                                                │
     │                                          ┌─────▼─────┐
     │                                          │PostgreSQL │
     │                                          │           │
     │                                          │ INSERT    │
     │                                          │ scan +    │
     │                                          │ results   │
     │                                          └─────┬─────┘
     │                                                │
     │ 6. Response: { success: true, scanId: 42 }    │
     ◀───────────────────────────────────────────────┤
     │                                                │
```

### 2. Authentification utilisateur

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  React   │                  │  Spring  │                  │PostgreSQL│
│ Frontend │                  │   Boot   │                  │          │
└────┬─────┘                  └────┬─────┘                  └────┬─────┘
     │                              │                              │
     │ POST /api/auth/register      │                              │
     ├──────────────────────────────▶                              │
     │ { username, email, password }│                              │
     │                              │                              │
     │                              │ Hash password (BCrypt)       │
     │                              │                              │
     │                              │ INSERT user                  │
     │                              ├──────────────────────────────▶
     │                              │                              │
     │                              │ User created                 │
     │                              ◀──────────────────────────────┤
     │                              │                              │
     │                              │ Generate JWT token           │
     │                              │                              │
     │ Response: { token, user }    │                              │
     ◀──────────────────────────────┤                              │
     │                              │                              │
     │ Store token in localStorage  │                              │
     │                              │                              │
```

### 3. Récupération et affichage des scans

```
┌──────────┐                  ┌──────────┐                  ┌──────────┐
│  React   │                  │  Spring  │                  │PostgreSQL│
│ Frontend │                  │   Boot   │                  │          │
└────┬─────┘                  └────┬─────┘                  └────┬─────┘
     │                              │                              │
     │ GET /api/scans               │                              │
     │ Authorization: Bearer <JWT>  │                              │
     ├──────────────────────────────▶                              │
     │                              │                              │
     │                              │ Validate JWT                 │
     │                              │                              │
     │                              │ SELECT scans                 │
     │                              ├──────────────────────────────▶
     │                              │                              │
     │                              │ Scan list                    │
     │                              ◀──────────────────────────────┤
     │                              │                              │
     │ Response: Page<ScanDTO>      │                              │
     ◀──────────────────────────────┤                              │
     │                              │                              │
     │ Render dashboard with scans  │                              │
     │                              │                              │
     │ User clicks "Details"        │                              │
     │                              │                              │
     │ GET /api/scans/42            │                              │
     ├──────────────────────────────▶                              │
     │                              │                              │
     │                              │ SELECT scan + results        │
     │                              │ (with JOIN)                  │
     │                              ├──────────────────────────────▶
     │                              │                              │
     │                              │ Complete scan data           │
     │                              ◀──────────────────────────────┤
     │                              │                              │
     │ Response: ScanDetailDTO      │                              │
     ◀──────────────────────────────┤                              │
     │                              │                              │
     │ Render charts and tables     │                              │
     │                              │                              │
```

## Architecture en couches du Backend

```
┌─────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                    │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ScanController│  │AuthController│  │UserController│  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                     SERVICE LAYER                        │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ ScanService  │  │ AuthService  │  │ UserService  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                   REPOSITORY LAYER                       │
│                                                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ScanRepository│  │UserRepository│  │...Repository │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                    DATABASE LAYER                        │
│                                                           │
│                    PostgreSQL Database                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Sécurité

### JWT Authentication Flow

```
1. User logs in
   ↓
2. Server validates credentials
   ↓
3. Server generates JWT token
   ↓
4. Client stores token (localStorage)
   ↓
5. Client sends token in Authorization header
   ↓
6. Server validates token on each request
   ↓
7. Server grants/denies access
```

### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "username",
  "iat": 1701619200,
  "exp": 1701705600
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

## Schéma de base de données

```sql
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ username (UQ)   │
│ email (UQ)      │
│ password        │
│ created_at      │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│     scans       │
├─────────────────┤
│ id (PK)         │
│ target          │
│ timestamp       │
│ status          │
│ user_id (FK)    │
│ created_at      │
└────────┬────────┘
         │
         ├─────────────────┬─────────────────┐
         │ 1:N             │ 1:N             │ 1:N
         │                 │                 │
┌────────▼────────┐ ┌──────▼──────┐ ┌───────▼──────┐
│  nmap_results   │ │sqlmap_results│ │nikto_results │
├─────────────────┤ ├─────────────┤ ├──────────────┤
│ id (PK)         │ │ id (PK)     │ │ id (PK)      │
│ scan_id (FK)    │ │ scan_id(FK) │ │ scan_id (FK) │
│ port            │ │ vuln_type   │ │ osvdb_id     │
│ protocol        │ │ payload     │ │ method       │
│ service         │ │ parameter   │ │ uri          │
│ version         │ │ description │ │ description  │
│ state           │ └─────────────┘ └──────────────┘
└─────────────────┘
```

## Technologies et patterns

### Backend (Spring Boot)
- **Pattern MVC** : Séparation Controller/Service/Repository
- **DTO Pattern** : Séparation entités/DTOs
- **Repository Pattern** : Abstraction de la couche de données
- **Dependency Injection** : Gestion automatique des dépendances
- **JWT Authentication** : Authentification stateless

### Frontend (React)
- **Component-Based Architecture** : Composants réutilisables
- **React Router** : Navigation SPA
- **Axios Interceptors** : Gestion centralisée des requêtes
- **CSS Modules** : Styles scopés par composant
- **Chart.js** : Visualisations de données

### Scanner (Python)
- **Modular Design** : Fonctions séparées par outil
- **Error Handling** : Gestion robuste des erreurs
- **Logging** : Traçabilité complète
- **Configuration** : Variables d'environnement

## Performance et scalabilité

### Optimisations actuelles
- **Indexes PostgreSQL** : Sur les colonnes fréquemment requêtées
- **Lazy Loading** : Chargement à la demande des relations JPA
- **Pagination** : Limitation des résultats API
- **Connection Pooling** : Réutilisation des connexions DB

### Améliorations futures possibles
- **Caching Redis** : Cache des résultats de scans
- **Message Queue** : Traitement asynchrone des scans
- **Load Balancing** : Répartition de charge
- **Microservices** : Séparation en services indépendants

---

Cette architecture assure une séparation claire des responsabilités, une maintenabilité élevée, et une évolutivité future.
