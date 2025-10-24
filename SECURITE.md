# 🔒 Guide de Sécurité Florizar

## Vue d'ensemble

Ce document décrit toutes les mesures de sécurité implémentées dans l'application Florizar pour protéger vos données et prévenir les attaques.

## ✅ Mesures de Sécurité Implémentées

### 1. Protection des Headers HTTP (Helmet.js)

**Protection contre:**
- Clickjacking (X-Frame-Options)
- XSS (Cross-Site Scripting)
- MIME sniffing
- Attaques de sniffing de protocole

**Configuration:** `backend/src/middleware/security.js`

```javascript
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- Referrer Policy
```

### 2. Rate Limiting (Protection contre Force Brute)

**Limitations appliquées:**

| Route | Limite | Durée | Protection |
|-------|--------|-------|------------|
| API générale | 100 requêtes | 15 min | DoS |
| Login/Register | 5 tentatives | 15 min | Force brute |
| Upload fichiers | 20 uploads | 1 heure | Spam |

**Conséquence:** Blocage temporaire de l'IP après dépassement

### 3. Validation des Inputs

**Tous les inputs sont validés avec express-validator:**
- Sanitization des caractères dangereux
- Vérification des types (email, nombres, dates)
- Limitation de la longueur des chaînes
- Protection contre XSS et injections SQL

**Fichier:** `backend/src/middleware/validators.js`

### 4. Politique de Mots de Passe Forts

**Exigences minimales:**
- ✅ Minimum 8 caractères
- ✅ Au moins 1 lettre majuscule
- ✅ Au moins 1 lettre minuscule
- ✅ Au moins 1 chiffre
- ✅ Au moins 1 caractère spécial (!@#$%^&*...)

**Validation:** Double vérification (middleware + controller)

### 5. Sécurisation des Uploads

**Protection contre les fichiers malveillants:**
- ✅ Vérification stricte du type MIME
- ✅ Vérification de l'extension
- ✅ Noms de fichiers aléatoires (crypto.randomBytes)
- ✅ Taille maximale: 10MB par fichier
- ✅ Maximum 10 fichiers simultanés
- ✅ Types autorisés uniquement: JPEG, PNG, GIF, WEBP

**Logging:** Tous les uploads sont loggés pour audit

### 6. CORS (Cross-Origin Resource Sharing)

**Configuration stricte:**
- Origines autorisées en whitelist
- Pas de wildcard (*) en production
- Credentials autorisés uniquement pour origines connues
- Méthodes HTTP limitées

**Origines autorisées par défaut:**
```javascript
- http://localhost:3000 (Dev frontend)
- http://localhost:5173 (Vite dev)
- http://localhost (Production locale)
- Variable d'environnement FRONTEND_URL
```

### 7. JWT (JSON Web Tokens)

**Sécurité des tokens:**
- ✅ Secret JWT minimum 32 caractères (vérifié au démarrage)
- ✅ Expiration après 24h
- ✅ Vérification de l'intégrité à chaque requête
- ✅ Erreur si JWT_SECRET non défini ou trop court

**Configuration:** Variable `JWT_SECRET` dans `.env`

### 8. Logs de Sécurité

**Événements loggés:**
- ✅ Tentatives de connexion réussies/échouées avec IP
- ✅ Création/modification/suppression d'entités
- ✅ Activités suspectes (patterns XSS, SQL injection, path traversal)
- ✅ Uploads de fichiers autorisés/refusés
- ✅ Erreurs avec contexte (route, IP, timestamp)

**Format des logs:**
```
🚨 [SÉCURITÉ] 2024-10-24T10:30:45.123Z - Activité suspecte détectée!
   IP: 192.168.1.100
   URL: POST /api/users
   User-Agent: Mozilla/5.0...
```

### 9. Sanitization des Données

**Protection contre:**
- Injections NoSQL (bien que SQLite soit utilisé)
- Caractères dangereux dans les inputs
- HTTP Parameter Pollution (HPP)
- Double soumission de paramètres

**Middlewares:**
- `mongoSanitize` - Remplace les caractères dangereux
- `hpp` - Protection HPP

### 10. Gestion des Erreurs Sécurisée

**En production:**
- ❌ Pas de stack traces exposées
- ❌ Pas de détails d'erreurs sensibles
- ✅ Messages génériques seulement

**En développement:**
- ✅ Stack traces complètes pour debugging
- ✅ Détails d'erreurs

**Messages d'erreur non-révélateurs:**
```javascript
// ✅ BON
"Identifiants incorrects"

// ❌ MAUVAIS
"Le mot de passe pour l'utilisateur 'admin' est incorrect"
```

### 11. Protection de la Base de Données

**Mesures:**
- ✅ WAL mode pour durabilité
- ✅ Transactions pour les migrations
- ✅ Rollback automatique en cas d'erreur
- ✅ Sauvegardes avant migrations
- ✅ .gitignore complet (impossible de commiter la BDD)

### 12. Sécurité Docker (À venir)

**Prochaines améliorations:**
- [ ] Utilisateur non-root dans les containers
- [ ] Secrets Docker pour JWT_SECRET
- [ ] Scan de vulnérabilités des images
- [ ] Limitations de ressources

## 🛡️ Configuration Requise

### 1. Variables d'Environnement

**Fichier `.env` obligatoire:**

```bash
# Générer un JWT_SECRET sécurisé
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copier dans .env
JWT_SECRET=votre_cle_generee_ici
```

### 2. En Production

**Checklist avant déploiement:**

- [ ] JWT_SECRET unique et fort (32+ caractères)
- [ ] NODE_ENV=production
- [ ] FRONTEND_URL configuré
- [ ] Logs de sécurité activés
- [ ] Certificat SSL/TLS configuré
- [ ] Firewall configuré
- [ ] Sauvegardes automatiques planifiées

## 🚨 Détection et Réponse aux Incidents

### Patterns Détectés Automatiquement

L'application détecte et log les patterns suivants:

```javascript
XSS:          <script>, javascript:, onerror=
SQL Injection: UNION, SELECT, INSERT, DROP, DELETE
Path Traversal: ../, ..\
Encoded Attacks: %27, %22, %3C, %3E
```

### Que Faire en Cas d'Attaque ?

1. **Vérifier les logs:**
   ```bash
   # Filtrer les activités suspectes
   grep "🚨 \[SÉCURITÉ\]" logs.txt
   ```

2. **Identifier l'IP de l'attaquant** dans les logs

3. **Bloquer l'IP** au niveau du firewall:
   ```bash
   # Exemple avec ufw
   sudo ufw deny from IP_ADDRESS
   ```

4. **Analyser l'impact:**
   - Vérifier si des données ont été compromises
   - Vérifier les tentatives de connexion réussies
   - Vérifier les modifications dans la base de données

5. **Restaurer si nécessaire:**
   ```bash
   ./RESTORE.sh
   ```

## 📊 Monitoring

### Logs à Surveiller

**Logs critiques:**
- Tentatives de connexion échouées répétées
- Accès à des routes inexistantes (reconnaissance)
- Activités suspectes détectées
- Erreurs 403/401 en masse
- Uploads refusés répétés

### Outils Recommandés

- **Fail2ban:** Bannir automatiquement les IPs malveillantes
- **Logwatch:** Surveillance quotidienne des logs
- **OSSEC:** Détection d'intrusion

## 🔄 Mises à Jour de Sécurité

### Process de Mise à Jour

1. **Sauvegarde avant MAJ:**
   ```bash
   ./BACKUP.bat  # ou BACKUP.sh
   ```

2. **Vérifier les dépendances:**
   ```bash
   npm audit
   npm audit fix
   ```

3. **Tester en environnement de dev**

4. **Déployer en production**

5. **Vérifier les logs post-déploiement**

### Audit de Sécurité Régulier

**Commandes utiles:**

```bash
# Audit des dépendances npm
npm audit

# Voir les vulnérabilités
npm audit --json

# Corriger automatiquement (avec prudence)
npm audit fix

# Vérifier les packages outdated
npm outdated
```

## 📝 Bonnes Pratiques

### Pour les Développeurs

1. ✅ **Jamais** de secrets en dur dans le code
2. ✅ **Toujours** valider les inputs utilisateur
3. ✅ **Toujours** utiliser les middlewares de validation
4. ✅ **Ne jamais** révéler d'informations sensibles dans les erreurs
5. ✅ **Toujours** logger les actions critiques
6. ✅ **Utiliser** les requêtes préparées (protection SQL injection native avec better-sqlite3)

### Pour les Utilisateurs

1. ✅ Utiliser des mots de passe forts et uniques
2. ✅ Ne jamais partager les credentials
3. ✅ Se déconnecter après utilisation
4. ✅ Vérifier l'URL (pas de phishing)
5. ✅ Faire des sauvegardes régulières

## 📚 Références

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)

## 🆘 Support

En cas de découverte d'une vulnérabilité, contactez immédiatement l'équipe de développement.

**Ne divulguez JAMAIS publiquement une vulnérabilité avant qu'elle ne soit corrigée.**

---

*Dernière mise à jour: 2024-10-24*
