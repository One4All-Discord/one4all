const {Collection, Client} = require('discord.js');
const {Sequelize} = require('sequelize');
const config = require('../../config')
const fs = require('fs')
const MusicPlayer = require('../Music/MusicPlayer');
const mysql = require('mysql2/promise');
const GuildData = require('../DiscordClasses/GuildData');
const UserData = require('../DiscordClasses/UserData');
const MemberData = require('../DiscordClasses/MemberData');

let user =  config.database.user;
let name = config.database.name;
let pass = config.database.password;
let token = config.token;
let owner = [...config.owners];
if(config.botperso){
    const path = './config.json';
    if (fs.existsSync(path)) {
        const configs = require('../../config.json')
        owner.push(configs.owner);
        user = configs.dbuser;
        name = configs.dbName;
        pass = configs.dbPass
        token = configs.token
    } else {
        owner.push(process.env.OWNER)
        user = process.env.DB_USER
        token = process.env.TOKEN
        pass = process.env.DB_PASS
        name = process.env.DB_NAME
    }
}

module.exports = class OneForAll extends Client {
    constructor(options) {
        super(options);
        this.login(token);

        this.commands = new Collection();
        this.events = new Collection();
        this.aliases = new Collection();
        this.config = config;
        this.owners = owner;
        this.cooldown = new Collection();
        this.guildData = new Collection();
        this.userData = new Collection();
        this.memberData = new Collection();
        this.loadCommands();
        this.loadEvents();
        mysql.createConnection({ user, password: pass }).then(async (connection) => {
            await connection.query(`CREATE DATABASE IF NOT EXISTS \`${name}\`;`);
            await connection.end();
            this.database = new Sequelize(name, user, pass, {
                dialect: 'mysql',
                define: {
                    charset: 'utf8mb4',
                    collate: 'utf8mb4_general_ci',
                    timestamps: false,
                    freezeTableName: true,
                },
                dialectOptions: {
                    connectTimeout: 60000
                },
                logging: false
            });
            this.initDatabase();
        });
        this.botperso = config.botperso;
        this.maintenance = false;
        this.musicPlayer = new MusicPlayer(this);
        this.musicPlayer.init();
        this.music = this.musicPlayer.player;

    }

    lang(translate) {
        return require(`../../lang/${translate}`);
    }

    getGuildData(guildId) {
        if (!this.guildData.has(guildId)) {
            this.guildData.set(guildId, new GuildData(this, guildId));
        }
        return this.guildData.get(guildId);
    }

    getUserData(user) {
        const id = typeof user === 'string' ? user : user.id;
        if (!this.userData.has(id)) {
            const username = typeof user === 'string' ? 'unknown' : user.username;
            const bot = typeof user === 'string' ? false : user.bot;
            this.userData.set(id, new UserData(this, id, username, bot));
        }
        return this.userData.get(id);
    }

    getMemberData(guildId, userId) {
        const key = `${guildId}-${userId}`;
        if (!this.memberData.has(key)) {
            this.memberData.set(key, new MemberData(this, userId, guildId));
        }
        return this.memberData.get(key);
    }

    loadCommands() {
        const commmandsFolder = fs.readdirSync('./commands/').filter(name => name !== 'stats');
        console.log(`[Starting] Loading ${commmandsFolder.length} category`)

        for (const category of commmandsFolder) {

            const commandFiles = fs.readdirSync(`./commands/${category}/`).filter(file => file.endsWith('.js'));
            console.log(`[Loading commands] Loading: ${commandFiles.length} commands in ${category}`)

            for (const file of commandFiles) {
                const CommandFile = require(`../../commands/${category}/${file}`)
                const Command = new CommandFile();
                this.commands.set(Command.name, Command);
                for (const alias of Command.aliases) {
                    this.aliases.set(alias, Command)
                }

                console.log(`[Loading commands] Loaded: ${Command.name}`)
            }
        }
    }

    loadEvents() {
        const eventsFolder = fs.readdirSync('./events/')
        console.log(`[Starting] Loading ${eventsFolder.length} events category`)
        for (const category of eventsFolder) {
            const eventsFile = fs.readdirSync(`./events/${category}/`).filter(file => file.endsWith('.js'))
            console.log(`[Loading events] Loading: ${eventsFile.length} events in ${category}`)

            for (const event of eventsFile) {

                const EventFile = require(`../../events/${category}/${event}`);
                const Event = new EventFile(this);
                this.on(Event.name, (...args) => Event.run(this, ...args))
                this.events.set(Event.name, Event);

                console.log(`[Binding events] Bind: ${event.split('.js')[0]}`)
            }
        }

    }

    initDatabase() {
        this.database.authenticate().then(async () => {
            console.log("login");

            const modelsFile = fs.readdirSync('./structures/Models');
            for await (const model of modelsFile) {
                await require(`../Models/${model}`)(Sequelize, this)
                console.log(`[LOADED DATABASE] ${model.split('.')[0]}`)
            }
            await this.database.sync({
                alter: true,
                force: false
            })
            setTimeout(async () => {
                await this.database.models.maintenance.findOrCreate({where: {client: this.user.id}}).then(res => {
                    this.maintenance = res[0].dataValues.enable;
                })
            }, 10000)


        })
    }

    isOwner(checkId) {
        return !!this.owners.includes(checkId)
    }
}
