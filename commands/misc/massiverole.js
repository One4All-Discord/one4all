const Embed = require('../../structures/Embed');
const { EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const ms = require('ms')
const timer = new Map();
let member = new Map();
let counts = new Map();
let done = new Map();
const Command = require('../../structures/Handler/Command');
module.exports = class Test extends Command{
    constructor() {
        super({
            name: 'massrole',
            description: "Add / Remove a role to all members in a server | Permet d'ajouter / enlver un rôle a tout les membres d'un serveur",
            usage: 'massrole < add / remove> <role>',
            category: 'misc',
            aliases: ['roleall', 'allrole'],
            userPermissions: [PermissionFlagsBits.ManageRoles],
            clientPermissions: [PermissionFlagsBits.ManageRoles],
            cooldown: 5,
            guildOwnerOnly: true

        });
    }
    async run(client, message,args){
        const guildData = client.getGuildData(message.guild.id);

        const lang = client.lang(guildData.lang)
        const color = guildData.color


        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1]);
        if(role){
            if (role.permissions.has(PermissionFlagsBits.KickMembers) || role.permissions.has(PermissionFlagsBits.BanMembers) || role.permissions.has(PermissionFlagsBits.Administrator) || role.permissions.has(PermissionFlagsBits.ManageChannels) || role.permissions.has(PermissionFlagsBits.ManageGuild) || role.permissions.has(PermissionFlagsBits.ManageRoles)) return message.reply(lang.massrole.highPermRole(role.name))

        }
        const add = args[0] === 'add';
        const remove = args[0] === 'remove'
        if (!args[0]) {
            const embed = new Embed(client, guildData)
                .setAuthor({ name: `Informations Massrole`, iconURL: client.user.displayAvatarURL() })
                .setFooter({ text: "Massrole", iconURL: client.user.displayAvatarURL() })
                .addFields({ name: '👥 MassRole:', value: `[\`massrole add\`](https://discord.gg/TfwGcCjyfp) ・ Ajout de rôle à tout le monde\n[\`massrole remove\`](https://discord.gg/TfwGcCjyfp) ・ Suppression de rôle en masse` })
            message.reply({ embeds: [embed] })
        }
        if (!role) return message.reply(lang.massrole.errorNoRl);
        if (add) {
            await message.guild.members.fetch().then((members) =>{
                member.set(message.guild.id, members.filter(member => member.roles.highest.comparePositionTo(message.guild.members.me.roles.highest) <= 0 && !member.roles.cache.has(role.id)))
            })

            if (member.get(message.guild.id).size === 0) return message.reply(lang.massrole.errorRlAlready(role))
            let timeLeft = ms(`${member.get(message.guild.id).size}s`)
            const embed = new Embed(client, guildData)
                .setAuthor({ name: lang.massrole.title(role, member.get(message.guild.id).size), iconURL: client.user.displayAvatarURL() })
                .setDescription(lang.massrole.descriptionTimeLeft(timeLeft))
                .setTimestamp();
            const msg = await message.reply({ embeds: [embed] })


            counts.set(message.guild.id, 0)
            done.set(message.guild.id, 0)


            member.get(message.guild.id).forEach((members) => {
                const adding = setTimeout(async () => {
                    if(done.has(message.guild.id)){
                        members.roles.add(role, `Massrole add all par ${message.author.username}`).then(() =>{
                            const addD = done.get(message.guild.id) + 1
                            if(member.has(message.guild.id)){
                                done.set(message.guild.id, addD)

                            }

                        })
                        if(done.get(message.guild.id) === member.get(message.guild.id).size - 1) {

                            message.reply(lang.massrole.successAdd(role, member.get(message.guild.id).size))
                            counts.delete(message.guild.id)
                            done.delete(message.guild.id)
                            member.delete(message.guild.id)
                            timer.set(message.guild.id, true)
                            return clearTimeout(adding);
                        }

                    }

                }, counts.get(message.guild.id) * 1200)
                const addC = counts.get(message.guild.id) + 1
                counts.set(message.guild.id,  addC)
            })




            setTimeout(async () => {
                timer.delete(message.guild.id)
            },1.8e+6)

        }  else if (remove) {
            await message.guild.members.fetch().then((members) =>{
                member.set(message.guild.id, members.filter(member => member.roles.highest.comparePositionTo(message.guild.members.me.roles.highest) <= 0 && member.roles.cache.has(role.id)))
            })

            if (member.get(message.guild.id).size === 0) return message.reply(lang.massrole.errorRlNot(role))
            let timeLeft = ms(`${member.get(message.guild.id).size}s`)
            const embed = new Embed(client, guildData)
                .setAuthor({ name: lang.massrole.titleRm(role, member.get(message.guild.id).size), iconURL: client.user.displayAvatarURL() })
                .setDescription(lang.massrole.descriptionTimeLeft(timeLeft))
                .setTimestamp();
            const msg = await message.reply({ embeds: [embed] })


            counts.set(message.guild.id, 0)
            done.set(message.guild.id, 0)


            member.get(message.guild.id).forEach((members) => {
                const adding = setTimeout(async () => {
                    if(done.has(message.guild.id)){
                        members.roles.remove(role, `Massrole remove all par ${message.author.username}`).then(() =>{
                            const addD = done.get(message.guild.id) + 1
                            if(member.has(message.guild.id)){
                                done.set(message.guild.id, addD)

                            }

                        })
                        if(done.get(message.guild.id) === member.get(message.guild.id).size - 1) {

                            message.reply(lang.massrole.successRemove(role, member.get(message.guild.id).size))
                            counts.delete(message.guild.id)
                            done.delete(message.guild.id)
                            member.delete(message.guild.id)
                            timer.set(message.guild.id, true)
                            return clearTimeout(adding);
                        }

                    }

                }, counts.get(message.guild.id) * 1200)
                const addC = counts.get(message.guild.id) + 1
                counts.set(message.guild.id,  addC)
            })




            setTimeout(async () => {
                timer.delete(message.guild.id)
            },1.8e+6)



        }else if(args[0] === 'status'){

            if(!done.has(message.guild.id) || !member.has(message.guild.id)) return message.reply(lang.nickall.noMassrole)
            let timeLeft = ms(`${member.get(message.guild.id).size - done.get(message.guild.id)}s`)
            const status = new Embed(client, guildData)
                .setAuthor({ name: 'Status', iconURL: client.user.displayAvatarURL() })
                .setDescription(lang.descriptionTimeLeft(timeLeft))
            message.reply({ embeds: [status] })
        }





    }};

