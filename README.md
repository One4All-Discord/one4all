<div align="center">

# One4All

**Bot Discord tout-en-un** | Moderation, Antiraid, Musique, Economie & plus

[![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.js.org)
[![Node.js](https://img.shields.io/badge/Node.js-16.11+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-Sequelize-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://sequelize.org)

<br>

[Invite le bot]([https://discord.gg/h69YZHB7Nh](https://discord.com/oauth2/authorize?client_id=1491570460092006672&permissions=8&integration_type=0&scope=bot)) | [Support](https://discord.gg/TfwGcCjyfp) | [Documentation](#installation)

</div>

---

## Apercu

One4All est un bot Discord complet concu pour la **securite**, la **gestion** et le **divertissement** de vos serveurs. Developpe en Node.js avec discord.js v14 et une base de donnees MySQL.

> **98 commandes** | **54 events** | **3 langues** | **Multi-sources musique**

---

## Fonctionnalites

<table>
<tr>
<td width="50%">

### Securite & Moderation
- **Antiraid** — anti-spam, anti-link, anti-mass ban/kick, anti-bot, anti-webhook
- **Moderation** — ban, kick, mute, tempmute, warn, clear, nuke, derank
- **Blacklist** — systeme cross-serveur
- **Logs** — vocal, ban, kick, roles, channels, messages
- **Permissions** — systeme perm1-4 configurable

</td>
<td width="50%">

### Musique & Divertissement
- **Musique** — play, skip, queue, filtres, lyrics, playlists
- **Sources** — YouTube, Spotify, SoundCloud, Deezer, Apple Music
- **Giveaways** — creation, reroll, stockage BDD
- **Economie** — coins, shop, inventaire, leaderboard
- **React Roles** — menu de roles par reactions

</td>
</tr>
<tr>
<td width="50%">

### Gestion de serveur
- **Backup** — sauvegarde & restauration complete
- **Compteurs** — membres, bots, en ligne, vocaux, salons
- **Invitations** — tracking, leaderboard, fake detection
- **Statistiques** — activite par utilisateur

</td>
<td width="50%">

### Technique
- **Multi-langue** — Francais, Anglais, Roumain
- **Sharding** — support multi-shards pour la production
- **Auto-setup** — creation automatique de la BDD
- **Versioning** — increment automatique a chaque restart

</td>
</tr>
</table>

---

## Stack

| Technologie | Version | Role |
|---|---|---|
| **discord.js** | v14 | Framework Discord |
| **discord-player** | v7 | Systeme musical multi-sources |
| **Sequelize** | v6 | ORM base de donnees |
| **MySQL** | 5.7+ | Stockage persistant |
| **Node.js** | 16.11+ | Runtime |

---

## Installation

```bash
# Cloner le repo
git clone https://github.com/One4All-Discord/one4all.git
cd one4all

# Installer les dependances
npm install
```

### Configuration

Copier `.env.example` en `.env` et remplir :

```env
TOKEN=ton_token_discord
DB_USER=root
DB_PASS=ton_mot_de_passe
DB_NAME=oneforall
```

### Lancement

```bash
node index.js        # Mode standard
node shard.js        # Mode sharding (production)
```

---

## Architecture

```
one4all/
|-- commands/           # 98 commandes (16 categories)
|   |-- moderation/     # ban, kick, clear, nuke...
|   |-- music/          # play, skip, queue, filter...
|   |-- owner/          # setup, backup, blacklist...
|   |-- antiraid/       # config antiraid
|   |-- oneforallCoins/ # economie, shop, pay...
|   `-- ...
|-- events/             # 54 event handlers
|   |-- antiraid/       # protections temps reel
|   |-- logs/           # systeme de logs
|   `-- ...
|-- structures/
|   |-- Client/         # Client principal
|   |-- Music/          # Systeme musical (discord-player)
|   |-- Models/         # 18 modeles Sequelize
|   |-- Handler/        # Command & Event handler
|   `-- DiscordClasses/ # GuildData, UserData, MemberData
|-- lang/               # fr.js, en.js, ro.js
`-- utils/              # Mute, Coins, StateManager
```

---

## Commandes principales

| Categorie | Commandes |
|---|---|
| **Moderation** | `ban` `kick` `mute` `tempmute` `warn` `clear` `nuke` `derank` `unban` |
| **Antiraid** | `antiraidconfig` |
| **Musique** | `play` `skip` `stop` `queue` `np` `volume` `filter` `loop` `lyrics` `search` `shuffle` `autoplay` `playlist` |
| **Owner** | `setup` `backup` `blacklist` `owner` `wl` `setlogs` `soutien` |
| **Economie** | `coins` `pay` `shop` `buy` `inventory` `leaderboard` |
| **Invites** | `invite` `addinvite` `removeinvite` `topinvite` |
| **Info** | `serverinfo` `userinfo` `botinfo` `ping` |
| **Permissions** | `permconfig` `perm` |

---

<div align="center">

**Developpe par [KhdDev](https://github.com/KhdDev)**

One4All Discord &copy; 2026

</div>
