const StateManager = require('../../utils/StateManager');
const { EmbedBuilder } = require('discord.js');
const Event = require('../../structures/Handler/Event');
module.exports = class guildCreate extends Event {
    constructor() {
        super({
            name: 'guildCreate',
        });
    }

    async run(client, guild) {
        const newInv = await guild.invites.fetch()
        for (const [code, invite] of newInv) {
            client.getGuildData(guild.id).cachedInv.set(code, invite)
        }


        const { owners } = guild;
        let owner;
        if (client.botperso) {
            const fs = require('fs');
            const path = './config.json';
            if (fs.existsSync(path)) {
               owner =  await client.users.fetch(require('../../config.json').owner, true);
            } else {
                owner = await client.users.fetch(process.env.OWNER, true)
            }
        }
        if (!client.botperso) {
            owners.push(guild.ownerId);
            guild.updateOwner = owners
        }
        if (client.guilds.cache.size > 10) {
            owner.send(`Vous ne pouvez plus ajouter votre bot dans des serveurs il atteind le quota maximum de 10`)
            return guild.leave()
        }
        const guildMember = await guild.members.fetch();

        if(!guildMember.has(owner.id)){
            owner.send(`J'ai leave ${guild.name} aucune présence de l'acheteur du bot`)
            return guild.leave();
        }
        const embed = new EmbedBuilder()
            .setTitle(`J'ai été ajouté a un nouveau serveur`)
            .setDescription(
                `▫️ Nom : **${guild.name}**\n
     ▫️ GuildId : **${guild.id}**\n
     ▫️ GuildCount : **${guild.memberCount}**\n
     ▫️ OnwerName : **<@${guild.ownerId}>**\n
  `)

        await owner.send({ embeds: [embed] });

    }
}
