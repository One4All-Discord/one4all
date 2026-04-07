
const { ChannelType, PermissionFlagsBits } = require('discord.js');

const Event = require('../../structures/Handler/Event');

module.exports = class voiceStateUpdate extends Event {
    constructor() {
        super({
            name: 'voiceStateUpdate',
        });
    }

    async run(client, oldState, newState) {
        //#region tempvoc
        const tempVoc = client.getGuildData(oldState.guild.id).tempVoc;

        if (tempVoc.catId !== "Non définie") {

            if (tempVoc.isOn) {
                const category = oldState.guild.channels.cache.get(tempVoc.catId)

                if (oldState.channelId == null) {
                    if (newState.channelId === tempVoc.chId) {
                        if (!category) return;
                        // create salon with user name
                        const chName = `${tempVoc.chName.replace('{username}', newState.member.user.username)}`
                        oldState.guild.channels.create({
                            name: chName,
                            type: ChannelType.GuildVoice,
                            parent: category,
                            reason: `Vocal temporaire`
                        }).then(c => {
                            c.permissionOverwrites.create(newState.member, {
                                [PermissionFlagsBits.ManageChannels]: true,
                                [PermissionFlagsBits.ManageRoles]: true,
                            });
                            // Move user to ch
                            newState.member.voice.setChannel(c)
                        })
                    }
                } else if (newState.channelId === null) {
                    if (oldState.channel.parentId === tempVoc.catId) {
                        // -- Vérifie aussi que personne est dans le salon
                        if (oldState.channelId === tempVoc.chId) return;
                        if (oldState.channel.members.size === 0) {
                            // -- Supprime le salon si personne est dedans
                            oldState.channel.delete({reason: `Personne dans le salon`})
                        }
                    }
                } else if (oldState.channelId !== null && newState.channelId !== null) {
                    // -- Vérifie si l'ancien salon appartient a la catégorie et que le nouveau salon n'est pas le salon de création
                    if (oldState.channel.parentId === tempVoc.catId && newState.channel.id !== tempVoc.chId) {

                        // -- Vérifie si l'ancien salon est le salon de création (pour éviter de le supprimer)
                        if (oldState.channelId === tempVoc.chId) {
                            null;
                            // -- Ou alors si le salon n'est pas le salon de création:
                        } else {
                            // -- Vérifie que le salon est vide
                            if (oldState.channel.members.size === 0) {
                                // -- Supprime le salon
                                if (oldState.channelId === tempVoc.chId) return;
                                oldState.channel.delete({reason: `Salon temporaire - Plus personne dans le salon`})
                            }
                        }

                        // -- Ou alors vérifie que l'ancien salon appartient a la catégorie, que l'ancien salon n'est pas celui de la création de salon et que le nouveau salon est le salon de création
                    } else if (oldState.channel.parentId === tempVoc.catId && oldState.channelId !== tempVoc.chId && newState.channelId === tempVoc.chId) {
                        // -- Vérifie que l'ancien salon est vide
                        if (oldState.channel.members.size === 0) {
                            // -- Supprime le salon
                            oldState.channel.delete({reason: `Salon temporaire - Plus personne dans le salon`})
                        }
                        // --
                        const chName = `${tempVoc.chName.replace('{username}', newState.member.user.username)}`
                        // -- Crée un salon de type vocal avec comme nom le pseudo de la personne et le définis dans la catégorie
                        oldState.guild.channels.create({
                            name: chName,
                            type: ChannelType.GuildVoice,
                            parent: category,
                            reason: `Vocal temporaire`
                            // -- Après
                        }).then(c => {
                            // -- Ajoute des permissions au salon pour le membre en lui attribuant toutes les permissions sur le salon
                            c.permissionOverwrites.create(newState.member, {
                                [PermissionFlagsBits.ManageChannels]: true,
                                [PermissionFlagsBits.ManageRoles]: true
                            });
                            // -- Déplace l'utilisateur dans le salon
                            newState.member.voice.setChannel(c)
                        })

                    } else if (newState.channel.parentId === tempVoc.catId && oldState.channelId !== tempVoc.chId && newState.channelId === tempVoc.chId) {

                        const chName = `${tempVoc.chName.replace('{username}', newState.member.user.username)}`
                        // -- Crée un salon de type vocal avec comme nom le pseudo de la personne et le définis dans la catégorie
                        oldState.guild.channels.create({
                            name: chName,
                            type: ChannelType.GuildVoice,
                            parent: category,
                            reason: `Vocal temporaire`
                            // -- Après
                        }).then(c => {
                            // -- Ajoute des permissions au salon pour le membre en lui attribuant toutes les permissions sur le salon
                            c.permissionOverwrites.create(newState.member, {
                                [PermissionFlagsBits.ManageChannels]: true,
                                [PermissionFlagsBits.ManageRoles]: true
                            });
                            // -- Déplace l'utilisateur dans le salon
                            newState.member.voice.setChannel(c)
                        })

                    }
                }
            }

        }
        //#endregion tempvoc





    }
}
