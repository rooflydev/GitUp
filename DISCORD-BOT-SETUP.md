# 🤖 GitUp Discord Bot - GUIDE COMPLET

## 📋 TABLE DES MATIÈRES

1. [Créer l'application Discord](#1-créer-lapplication-discord)
2. [Configurer le bot](#2-configurer-le-bot)
3. [Installation locale](#3-installation-locale)
4. [Installation sur Replit](#4-installation-sur-replit)
5. [Commandes disponibles](#5-commandes-disponibles)
6. [Utilisation](#6-utilisation)

---

## 1️⃣ Créer l'Application Discord

### Étape 1: Aller sur le portail développeur

1. Va sur https://discord.com/developers/applications
2. Clique sur **"New Application"**
3. Donne un nom à ton app (exemple: "GitUp Bot")
4. Accepte les conditions et clique **"Create"**

### Étape 2: Récupérer le Client ID

1. Dans l'onglet **"General Information"**
2. Copie l'**APPLICATION ID** (c'est ton Client ID)
3. Garde-le quelque part, tu en auras besoin !

### Étape 3: Créer le Bot

1. Va dans l'onglet **"Bot"** (menu de gauche)
2. Clique sur **"Add Bot"** → Confirme
3. Dans **"TOKEN"**, clique **"Reset Token"**
4. **COPIE LE TOKEN** immédiatement (tu ne pourras plus le revoir !)
5. ⚠️ **NE PARTAGE JAMAIS TON TOKEN !**

### Étape 4: Configurer les permissions du bot

Toujours dans l'onglet **"Bot"** :

1. **Privileged Gateway Intents** :
   - ❌ PRESENCE INTENT (pas besoin)
   - ❌ SERVER MEMBERS INTENT (pas besoin)
   - ✅ MESSAGE CONTENT INTENT (optionnel)

2. **Bot Permissions** :
   - Scroll down vers "Bot Permissions"
   - Sélectionne :
     - ✅ Read Messages/View Channels
     - ✅ Send Messages
     - ✅ Use Slash Commands
     - ✅ Read Message History

### Étape 5: Inviter le bot sur ton serveur

1. Va dans l'onglet **"OAuth2"** → **"URL Generator"**
2. Dans **SCOPES**, sélectionne :
   - ✅ `bot`
   - ✅ `applications.commands`
3. Dans **BOT PERMISSIONS**, sélectionne :
   - ✅ Send Messages
   - ✅ Use Slash Commands
   - ✅ Read Message History
4. Copie l'URL générée en bas
5. Ouvre l'URL dans ton navigateur
6. Sélectionne ton serveur Discord
7. Autorise → **Le bot est maintenant sur ton serveur !**

---

## 2️⃣ Configurer le Bot

### Créer le fichier .env

Dans le dossier `discord-bot/`, crée un fichier `.env` :

```env
DISCORD_TOKEN=TON_TOKEN_ICI
DISCORD_CLIENT_ID=TON_CLIENT_ID_ICI
```

**Remplace** :
- `TON_TOKEN_ICI` par le token que tu as copié à l'étape 3
- `TON_CLIENT_ID_ICI` par l'Application ID de l'étape 2

**Exemple** :
```env
DISCORD_TOKEN=MTIzNDU2Nzg5MDEyMzQ1Njc4OQ.GaBcDe.1234567890abcdefghijklmnopqrstuv
DISCORD_CLIENT_ID=1234567890123456789
```

---

## 3️⃣ Installation Locale

### Prérequis

- Node.js 16+ installé ([Télécharger](https://nodejs.org))

### Installation

```bash
# Va dans le dossier du bot
cd discord-bot

# Installe les dépendances
npm install

# Lance le bot
npm start
```

### Tu devrais voir

```
🤖 GitUp Bot is online!
📝 Logged in as GitUp Bot#1234
🌐 Serving 1 servers
🔄 Registering slash commands...
✅ Slash commands registered successfully!
📊 Data loaded successfully
```

✅ **Le bot est en ligne !**

---

## 4️⃣ Installation sur Replit (Gratuit)

### Pourquoi Replit ?

- ✅ Gratuit
- ✅ Toujours en ligne (avec un ping)
- ✅ Facile à setup

### Étapes

1. **Créer un compte** sur https://replit.com

2. **Créer un nouveau Repl** :
   - Clique "Create Repl"
   - Template: **Node.js**
   - Nom: `gitup-bot`

3. **Upload les fichiers** :
   - Upload `bot.js`
   - Upload `package.json`
   - Upload `.env.example` (et renomme en `.env`)

4. **Configurer les secrets** :
   - Dans le menu de gauche, clique sur **"Secrets"** (icône cadenas)
   - Ajoute :
     - Key: `DISCORD_TOKEN` → Value: Ton token
     - Key: `DISCORD_CLIENT_ID` → Value: Ton client ID

5. **Modifier .replit** :
   Crée un fichier `.replit` :
   ```
   run = "node bot.js"
   ```

6. **Lance le bot** :
   - Clique sur le bouton **"Run"**
   - Le bot démarre !

### Garder le bot en ligne 24/7

Replit endort les Repls après inactivité. Pour éviter ça :

**Option 1: UptimeRobot (gratuit)**
1. Va sur https://uptimerobot.com
2. Crée un compte
3. Add New Monitor:
   - Type: HTTP(s)
   - URL: L'URL de ton Repl (ex: `https://gitup-bot.username.repl.co`)
   - Interval: 5 minutes
4. Save → Ton bot restera en ligne !

**Option 2: Ping depuis un autre service**
- Utilise Cron-Job.org
- Configure un ping toutes les 5 minutes

---

## 5️⃣ Commandes Disponibles

### Pour les Admins

#### `/gen`
Génère un code d'invitation général.

**Utilisation** :
```
/gen
```

**Résultat** :
```
🎫 Code: AB12CD34
⏰ Expire dans 7 jours
```

#### `/genfor <user>`
Génère un code pour un utilisateur spécifique et le lui envoie en DM.

**Utilisation** :
```
/genfor @JohnDoe
```

**Résultat** :
- L'utilisateur reçoit le code en DM
- Le code lui est réservé

#### `/codes`
Liste tous les codes d'invitation (actifs, utilisés, expirés).

**Utilisation** :
```
/codes
```

#### `/revoke <code>`
Révoque un code non utilisé.

**Utilisation** :
```
/revoke AB12CD34
```

#### `/stats`
Affiche les statistiques du bot.

**Utilisation** :
```
/stats
```

**Résultat** :
```
📊 Total codes: 25
✅ Codes actifs: 5
🔗 Comptes liés: 18
```

### Pour tous les utilisateurs

#### `/link <code>`
Lie ton compte Discord à GitUp avec un code d'invitation.

**Utilisation** :
```
/link AB12CD34
```

**Résultat** :
```
✅ Compte lié avec succès !
Tu peux maintenant login avec Discord sur GitUp
```

#### `/me`
Affiche ton profil et tes statistiques GitUp.

**Utilisation** :
```
/me
```

**Résultat** :
```
🔗 Statut: Lié
📅 Membre depuis: Il y a 3 jours
🎫 Code utilisé: AB12CD34
```

---

## 6️⃣ Utilisation

### Workflow Classique

#### Scénario 1: Inviter un nouveau membre

```
Admin:
1. /genfor @NewUser

NewUser reçoit en DM:
"🎉 Tu as reçu une invitation GitUp !
Code: AB12CD34"

NewUser:
2. Va sur le site GitUp
3. Clique "Get Started"
4. Entre le code AB12CD34
5. Crée son compte

Sur Discord:
6. /link AB12CD34
   → "✅ Compte lié !"

7. Maintenant peut login avec Discord sur le site !
```

#### Scénario 2: Code général pour partage

```
Admin:
1. /gen
   → Reçoit code: XY78ZW90

Admin partage le code dans #annonces:
"Hey, nouveau code d'invitation: XY78ZW90
Valide 7 jours !"

Utilisateur:
2. Va sur GitUp → signup avec XY78ZW90
3. Sur Discord: /link XY78ZW90
4. ✅ Lié !
```

### Conseils

**📌 Sécurité**
- Ne partage jamais ton token de bot
- Utilise `.env` pour les secrets
- N'ajoute jamais `.env` à Git

**📌 Gestion**
- Vérifie régulièrement les codes avec `/codes`
- Révoque les codes non utilisés si besoin
- Check les stats avec `/stats`

**📌 Support**
- Si un utilisateur ne reçoit pas le DM, vérifie qu'il a les DMs activés
- Les codes expirent après 7 jours
- Un code ne peut être utilisé qu'une fois

---

## ❓ Troubleshooting

### Le bot ne répond pas

**Solution** :
1. Vérifie que le bot est en ligne (vert sur Discord)
2. Check les logs dans la console
3. Vérifie que les commandes sont enregistrées : `/gen` devrait apparaître

### "Invalid Token"

**Solution** :
1. Régénère le token sur Discord Developer Portal
2. Met à jour le `.env`
3. Redémarre le bot

### Les commandes n'apparaissent pas

**Solution** :
1. Attends 1-2 minutes (sync Discord)
2. Relance Discord (`Ctrl+R`)
3. Vérifie que le bot a les permissions `applications.commands`

### Le bot se déconnecte sur Replit

**Solution** :
- Configure UptimeRobot (voir section 4)
- Ou upgrade vers Replit Hacker (payant mais reste en ligne)

### Impossible d'envoyer des DMs

**Solution** :
- L'utilisateur doit activer les DMs depuis les serveurs
- Discord → Paramètres → Confidentialité → Autoriser les DMs

---

## 🎊 C'EST FAIT !

Ton bot est maintenant opérationnel ! 🚀

**Prochaines étapes** :
1. Génère ton premier code avec `/gen`
2. Teste le linking avec `/link`
3. Invite des membres sur ton GitUp !

---

**Questions ?** Reviens vers moi si besoin ! 💜
