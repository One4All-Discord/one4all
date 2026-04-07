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
            if (role.permissions.has(PermissionFlagsBits.KickMembers) || role.permissions.has(PermissionFlagsBits.BanMembers) || role.permissions.has(PermissionFlagsBits.Administrator) || role.permissions.has(PermissionFlagsBits.ManageChannels) || role.permissions.has(PermissionFlagsBits.ManageGuild) || role.permissions.has(PermissionFlagsBits.ManageRoles)) return message.channel.send(lang.massrole.highPermRole(role.name))

        }
        const add = args[0] === 'add';
        const remove = args[0] === 'remove'
        if (!args[0]) {
            const embed = new EmbedBuilder()
                .setAuthor({ name: `Informations Massrole`, iconURL: `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588` })
                .setColor(`${color}`)
                .setTimestamp()
                .setThumbnail(`https://images-ext-1.discordapp.net/external/io8pRqFGLz1MelORzIv2tAiPB3uulaHCX_QH7XEK0y4/%3Fwidth%3D588%26height%3D588/https/media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg`)
                .setFooter({ text: "Massrole", iconURL: `https://media.discordapp.net/attachments/780528735345836112/780725370584432690/c1258e849d166242fdf634d67cf45755cc5af310r1-1200-1200v2_uhq.jpg?width=588&height=588` })
                .addFields({ name: '👥 MassRole:', value: `[\`massrole add\`](https://discord.gg/h69YZHB7Nh) ・ Ajout de rôle à tout le monde\n[\`massrole remove\`](https://discord.gg/h69YZHB7Nh) ・ Suppression de rôle en masse` })
            message.channel.send({ embeds: [embed] })
        }
        if (!role) return message.channel.send(lang.massrole.errorNoRl);
        if (add) {
            await message.guild.members.fetch().then((members) =>{
                member.set(message.guild.id, members.filter(member => member.roles.highest.comparePositionTo(message.guild.members.me.roles.highest) <= 0 && !member.roles.cache.has(role.id)))
            })

            if (member.get(message.guild.id).size === 0) return message.channel.send(lang.massrole.errorRlAlready(role))
            let timeLeft = ms(`${member.get(message.guild.id).size}s`)
            const embed = new EmbedBuilder()
                .setTitle(lang.massrole.title(role, member.get(message.guild.id).size))
                .setDescription(lang.massrole.descriptionTimeLeft(timeLeft))
                .setColor(`${color}`)
                .setFooter({ text: client.user.username })
                .setTimestamp();
            const msg = await message.channel.send({ embeds: [embed] })


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

                            message.channel.send(lang.massrole.successAdd(role, member.get(message.guild.id).size))
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

            if (member.get(message.guild.id).size === 0) return message.channel.send(lang.massrole.errorRlNot(role))
            let timeLeft = ms(`${member.get(message.guild.id).size}s`)
            const embed = new EmbedBuilder()
                .setTitle(lang.massrole.titleRm(role, member.get(message.guild.id).size))
                .setDescription(lang.massrole.descriptionTimeLeft(timeLeft))
                .setColor(`${color}`)
                .setFooter({ text: client.user.username })
                .setTimestamp();
            const msg = await message.channel.send({ embeds: [embed] })


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

                            message.channel.send(lang.massrole.successRemove(role, member.get(message.guild.id).size))
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

            if(!done.has(message.guild.id) || !member.has(message.guild.id)) return message.channel.send(lang.nickall.noMassrole)
            let timeLeft = ms(`${member.get(message.guild.id).size - done.get(message.guild.id)}s`)
            const status = new EmbedBuilder()
                .setTitle('Status')
                .setDescription(lang.descriptionTimeLeft(timeLeft))
                .setColor(`${color}`)
                .setFooter({ text: client.user.username })
                .setTimestamp()
            message.channel.send({ embeds: [status] })
        }





    }};

