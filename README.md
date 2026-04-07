# One4All

Bot Discord multifonction developpe en **Node.js** avec **discord.js v14**.

## Fonctionnalites

- **Moderation** — ban, kick, mute, tempmute, warn, clear, nuke, derank
- **Antiraid** — protection anti-spam, anti-link, anti-mass ban/kick, anti-bot, anti-webhook, detection de modifications serveur
- **Musique** — play, skip, queue, filtres audio, lyrics, playlists sauvegardees (YouTube, Spotify, SoundCloud, Deezer, Apple Music)
- **Giveaways** — creation, reroll, stockage en base de donnees
- **Economie** — systeme de coins, shop, inventaire, leaderboard, pay
- **Invitations** — tracking des invites, leaderboard, bonus/fake detection
- **Logs** — join/leave vocal, ban/unban, kick, roles, channels, messages, vanity
- **Backup** — sauvegarde et restauration complete de serveur
- **Blacklist** — systeme de blacklist cross-serveur
- **Permissions** — systeme de permissions par roles (perm1-4) configurable
- **React Roles** — menu de roles par reactions
- **Compteurs** — membres, bots, en ligne, vocaux, salons, roles, boosters
- **Statistiques** — tracking d'activite par utilisateur
- **Multi-langue** — Francais, Anglais, Roumain

## Stack technique

- **discord.js** v14
- **discord-player** v7 + extracteurs multi-sources
- **Sequelize** v6 + **MySQL**
- **Node.js** 16.11+

## Installation

```bash
git clone https://github.com/One4All-Discord/one4all.git
cd one4all
npm install
```

Copier `.env.example` en `.env` et remplir les variables :

```env
TOKEN=ton_token_discord
DB_USER=root
DB_PASS=ton_mot_de_passe
DB_NAME=oneforall
```

## Lancement

```bash
node index.js        # Mode standard
node shard.js        # Mode sharding (production)
```

## Structure

```
commands/        # 98 commandes en 16 categories
events/          # 54 event handlers
structures/      # Client, Models, Handler, Embed, Music
lang/            # Fichiers de langue (fr, en, ro)
utils/           # Utilitaires (Mute, Coins, StateManager)
```

## Licence

Projet prive — One4All Discord.
