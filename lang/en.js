
const prettyMilliseconds = require('pretty-ms');
const ms = require('ms')
const { EmbedBuilder } = require('discord.js')
module.exports = {
    clic : "Click here",
    yes : "yes",
    no : "no",
    cancel : "Operation canceled",
    loading : `Loading... ⏳`,

    error: {
        YesNo : `Please answer with \`yes or no\` only !`,
        timeout : `Time elapsed !`,
        noSetup : "You need to setup the bot to be able to use this command (!setup)",
        errorNoOwner : (ownerTag) => `◈ \`ERROR\` Only owners can execute this command \`(${ownerTag.join(",")})\`!`,
        NoYes : "You must answer only with yes or no !",

    },
    ping: {
        pinging : "Pinging...",
        success: (ping, client) => `Bot latency: \`${ping}\` ms, API latency: \`${Math.round(parseInt(client.ws.ping))}\` ms`,
    },
    help: {
        information2: (prefix) => `◈ The prefix for this server is \`${prefix}\`.\n📋 To get more information about a command, just type \`${prefix}help\` \`command\`.\n📁 You can also type \`${prefix}help commands\` or press on 📄 to get all my commands.`,
        noCommand: (args) => `I don't find this command (${args}) in my commands`,
        information: `Information and commands`,
        noAliases : `No aliases`,
        cmdTitle :`Command help`,
        footer : `Asked by `,
        titleNoArgs : `General help page`,
        command : `Show all commands`,
        search : `Find detailed help on a command`,
        noUsage : `No particular use`,
        requiredOrNot : `\`< >\` are the required arguments and \`[ ]\` are optional arguments`
    },
    helpall: {
        botOwner: `List of botOwner commands`,
        moderation : `List of Moderation commands`,
        antiriraid : `List of Antiraid commands`,
        giveaway : `List of Giveaway commands`,
        reactrole : `List of ReactRole & Embed commands`,
        general : `List of General commands`,

    },
    snipe: {
        error : "There is no deleted message in this channel",
        link : "Sorry but it's a link"
    },
    inviteBot : {
        invite : `Invite bot`,
    },
    support: {
        support: `Support Server`,
    },
    vocal: {
        msg: (count, muteCount, streamingCount, muteHeadSetCount, openMicCount) => 
        `🔊 Stats vocal :
        > 🔈 Open microphone : **${openMicCount}**
        > 📺 Streaming : **${streamingCount}**
        > 🔇 Headphone mute : **${muteHeadSetCount}**
        > 🔇 Mute microphone : **${muteCount}**\n\n➡️ Total of members in voice channel : **${count}**`,
    },
    authorinfo: {
        description: `__**OneforAll**__\n\n*OneforAll is a bot owned by* \`KhdDev\`\n\n**Developer :**\n[KhdDev](https://discord.gg/TfwGcCjyfp) -> Bot & Host\n`,
    },
    alladmins: {
        error : `There is 0 admins on server.`,
        list : `List of admins`,
    },
    ban: {
        noBan : "◈ `ERROR` You must specify a member to ban (`\mention / id`\)",
        errorRl : (member) => `◈ \`ERROR\` You cannot ban **\`${member.username}\`** because they have roles above yours !`,
        errorBanSelf : "◈ \`ERROR\` You cannot ban yourself !",
        noReason : "No reason specified",
        success : (member) => `◈ \`SUCCES\` ${member.username} was banned.`,
        error : (member) => `◈ \`ERROR\` Sorry, i just couldn't ban ${member.username}`,
        alreadyBan : (member) => `◈ \`ERROR\` **${member.username}** is already ban`,
        missingPerm : (member) => `◈ \`ERROR\`I don't have enought permissions to ban **${member}**`,
        dm : (guildName, bannerName) => `You've been ban from ${guildName} by ${bannerName}`
    },
    banlist : {
        title : (guild) => `Member(s) banned from the server __${guild.name}__`,
        description : (banned, list) => ` There is 🔨 **${banned.size}** banned member(s):  \n  \`${list}\` `,
        descriptionInf : (banned) =>`There is 🔨 **${banned.size}** banned member(s). `
    },
    clear: {
        error100 : '◈ \`ERROR\` You cannot delete more than 100 messages !',
        errorNaN : '◈ \`ERROR\` Put only numbers !',
        success : (deleteAmount) => `◈ \`SUCCES\` You deleted ${deleteAmount} messages.`
    },
    derank: {
        errorNoMember : "◈ `ERROR` You must specify a member to unrank (`\mention / id`\)",
        errorUnrankMe : "◈ `ERROR` You can\'t unrank me.",
        errorRl : (member) => `◈ \`ERROR\` You can't unrank **\`${member}\`** ecause they have roles above yours`, 
        errorUnrankSelf : "◈ \`ERROR\` You can't unrank yourself",
        errorNoRl : (member) => `◈ \`ERROR\` **${member}** has no role !`,
        reason : (executor) => `OneForAll - Type: unrank by ${executor.user.username}`,
        success : (member) =>`◈ \`SUCCES\` **${member}** was unranked.`
    },
    dero : {
        success : "◈ \`SUCCES\` All waivers have been updated.",
    },
    embedBuilder : {
        loading : `Loading... ⏳`,
        title : `Embed creation menu !`,
        description : ` 🦈 Welcome to the embed creation menu ! \n🖼️ Cliquez sur les reactions pour pouvoir personnaliser votre embed !`,
        
        titleField: `・Allows you to edit the title`,
        descriptionField : `・Allows you to modify the description`, 
        authorField : `・Allows you to modify the author`,
        footerField : `・Allows you to modify the footer`,
        thumbnailField : `・Allows you to edit the thumbnail`,
        imageField : `・Allows you to edit the image`,
        urlField : `・Allows you to modify the url`,
        colorField : `・Allows you to change the color`,
        timestampField : `・Allows you to add a timestamp`,
        copyField : `Copy an embed and edit it`,
        cancelField : `・Allows to cancel the creation of the embed`,
        sendField :  `・Allows to send the embed with the bot`,

        titleMsg : `✏ What title do you want for your embed ?`,
        descriptionMsg : `📝 What description do you want for your embed ?`,
        authorMsg : `🗣 Which author do you want for your embed ?`,
        footerMsg : `🖍 What footer do you want for your embed ?`,
        thumbnailMsg : `💶 Which thumbnail do you want for your embed ?`,
        imageMsg : `🖼 What image do you want for your embed ?`,
        urlMsg : `🌐 What url do you want for your embed ?`,
        colorMsg : `🎨 What color do you want for your embed (\`HEX or rouge/vert/jaune/violet/rose/noir/blanc/bleu/orange/invisible\`)?`,
        timestampMsg : `⏲ Do you want to add a timestamp to your embed (\`oui/non\`)?`,
        copyMsg : `© What is the channel where the embed is located (\`mention / id\`)?`,
        messageId : `© What is the id of the embed message (\`id\`)?`,
        cancelMsg :`❌ Do you want to cancel the creation of the embed ? (\`oui/non\`)?`,
        sendMsg : `✅ In which channel do you want to send the embed \`mention ou id\`?`,


        errorUrl : `The url must start with __http/https__`,
        errorColor : `Please enter a valid color \`HEX or rouge/vert/jaune/violet/rose/noir/blanc/bleu/orange/invisible\``,
        errorChannel : `I can't find this channel !`,
        errorWrongId : `Please enter a valid id !`,
        errorMessage : (ch) => `I can't find the message in the channel ${ch} !`,
    },
    kick: {
        noKick : "◈ `ERROR` You must specify a member to kick (`\mention / id`\)",
        errorRl : (tag) => `◈ \`ERROR\` You cannot ban **\`${tag}\`** because they have roles above yours`,
        errorKickSelf : "◈ \`ERROR\` You can't exclude yourself",
        noReason : "No specific reason",
        success : (member) => `◈ \`SUCCES\` ${member} was kicked.`,
        error : (member) => `◈ \`ERROR\` Sorry, i didn't manage to kick ${member}`
     
    },
    lock : {
        successLockAll : "◈ \`SUCCES\` All channels have been closed.",
        successOpenAll : "◈ \`SUCCES\` All channels have been opened.",
        successLock : "◈ \`SUCCES\` The channel was closed.", 
        successOpen : "◈ \`SUCCES\` The channel was opened.",
    },
    massrole: {
        errorNoRl : "You must specify a role / id to add to all members!",
        errorRlAlready : (role) => `The role \`${role.name}\` is already added to all server members !`,
        title : (role, member) => `I add the role ${role.name} to **${memberlength}** members`,
        descriptionTimeLeft : (timeLeft) => `🕙 __Remaining time__ : **${prettyMilliseconds(timeLeft)}**`,
        descriptionFinish : `  🕙 __Remaining time__ : **Fini**`,
        successAdd : (role, member) => `I added the role \`${role.name}\` to ${memberlength} members`,
        errorRlNot : (role) => `The role \`${role.name}\` is not added to anyone !`,
        titleRm : (role, member) => `I remove the role ${role.name} from **${memberlength}** members`,
        descriptionTimeLeft : (timeLeft) => `🕙 __Remaining time__ : **${prettyMilliseconds(timeLeft)}**`,
        successRemove : (role, member) => `I took off the role \`${role.name}\` from ${memberlength} members`
    },
    mute : {
        errorNoMember : `◈ \`ERROR\` You must specify a member to mute \`id/mention\`.`,
        errorCantFindRole : `◈ \`ERROR\` I can't find the mute role.`,
        errorAlreadyMute : (member) => `◈ \`ERROR\` You can't mute \`${member}\` because he is already muted !`,
        success : (member) => `◈ \`SUCCES\` I mute \`${member}\` !`
    },
    nuke : {
        success : (member) => `💥 The channel was recreated by ${member}.`,
        

    },
    role : {
        author : `Informations rôle`,
        errorAlreadyRl : (member, role) => `◈ \`ERROR\` **${member}** already has the role ${role.name}.`,
        succcessAdd : (member, role) => `◈ \`SUCCES\` I added the role (${role.name}) at **${member}**`,
        errorNoRl : (member, role) => `◈ \`ERROR\` **${member}** does not have the role ${role.name}.`,
        errorCantRm : (member) =>`◈ \`ERROR\` There was an error I could not remove the role from **${member}**`,
        successRemove : (member, role) => `◈ \`SUCCES\` I removed the role (${role.name}) from **${member}**`,
        error : (member) => `◈ \`ERROR\` There was an error I could not remove the role from **${member}**`
    },
    setcolor : {
        noColor : "◈ `ERROR` You must specify a color !" ,
        success : (color) => `◈ \`SUCCES\` The color of the embeds has been changed to ${color} `,
        successDescription : "This is the new embeds colors.",
        titleDescription : "Result !",
        errorSql : (color) => `◈ \`ERROR\` Oops, updating the embeds color in ${color} failed.`,
        errorNoArgs : "◈ \`ERROR\` You must specify a valid color (``#8B5CF6``) !"
    },
    setprefix: {
        errorNoValid : "Please use the following prefixes: ``!‎``, ``@``, ``#‎``, ``$‎``, ``%‎``, ``^‎``, ``&‎``, ``*‎``, ``(‎``, ``)‎``, ``_‎``, ``+‎``, ``\\‎``, ``-‎``, ``=‎``, ``{‎``, ``}‎``, ``;‎``, ``'‎``, ``:‎``, ``\"‎``, ``|‎``, ``,‎``, ``.‎``, ``<‎``, ``>‎``, ``\/‎``, ``?``",
        success : (newPrefix) => `◈ \`SUCCES\` The prefix has been updated to **${newPrefix}** `,
        errorSql : (newPrefix) => `◈ \`ERROR\` Oops, updating the prefix to ${newPrefix} failed.`,
        errorNoArgs : "◈ \`ERROR\`Incorrect number of arguments"
    },
    tempmute : {
        errorNoMember : `◈ \`ERROR\` You must specify a member to mute \`id/mention\`.`,
        errorCantFindRole : `◈ \`ERROR\` I can't find the mute role.`,
        errorTime : `You must specify a valid duration !`,
        errorAlreadyMute : (member) => `◈ \`ERROR\` You can't mute \`${member}\` because he is already muted !`,
        success : (member, time) => `◈ \`SUCCES\` I mute \`${member}\` while **${prettyMilliseconds(ms(time))}**.`,
        errorUnMute : (member, time) => `◈ \`ERROR\` I tried to unmute \`${member}\` after **${prettyMilliseconds(ms(time))}**, but he's already no longer muted...`,
        successUnMute : (member, time) => `◈ \`SUCCES\` \`${member}\` no longer muted after **${prettyMilliseconds(ms(time))}**`
    },
    unban : {
        unbanAll : `I've unban everybody`,
        notBan : (member) => `◈ \`ERROR\` ${member.username} was not banned`,
        noUnBanAll : `◈ \`ERROR\` I can't find any member to unban !`,
        unbanSelf : "◈ \`ERROR\` You can't unban yourself !",
        noMember : "◈ `ERROR` You must specify a member to be unbanned (`\mention / id`\)",
        noReason : "Aucune raison spécifique",
        success : (member) => `◈ \`SUCCES\` ${member.username} was unban.`,
        error : (member) => `◈ \`ERROR\` Sorry, i can't unban <@${member}>`
    },
    unmute : {
        noMember : `◈ \`ERROR\` You must specify a member to unmute \`id/mention\`.`,
        errorCantFindRole : `◈ \`ERROR\` I can't find the mute role.`,
        success : (member) =>`◈ \`SUCCES\` I unmuted \`${member}\` !`,
        errorAlreadyUnMute : (member) => `◈ \`ERROR\` You can't unmute \`${member}\` because he is already unmute !`
    },
    webhook : {
        replyMsg : (guild, webhooks) => '◈ The server **' + guild.name + '** contient **' + webhooks.size + '** webhook.',
        replyMsgDelete : '◈ All webhooks have been deleted.'
    },
    wl : {
        errorSyntax :"◈ `ERROR` Syntax error : (!wl add/remove/list/clear @KhdDev)",
        errorSyntaxAdd : "◈ `ERROR` Syntax error : !wl\`<add/ remove/ list>\` \`<mention / id>\`",
        errorAlreadyWl : (member) => `◈ \`ERROR\` **${member}** is already in the whitelist`,
        successWl : (member) => `◈ \`SUCCES\` I added **${member}** to the whitelist`,
        clearWl : `Are you sure you want to clear the whitelist ?`,
        successClearWl : `I have cleared the whitelist`,
        error :`Oops an error was detected, so I could not clear the whitelist`,
        cancel : `Move me in the channel you want me to move all people`,
        errorNotWl: (member) => `◈ \`ERREUR\` **${member}** n'est pas dans les whitelist`,

    },
    voicemove : {
        success :  (author) => `◈ \`SUCCES\` ${author}, move me in the channel you want me to move all people!`,

    },
    soutien : {
        title : `◈ __Support Parameter__`,
        description :(soutienId,soutienMsg, isOnS, guild) => `
        1 ・ Configure the role that will be given to the member who has the required personalized status. \n
            __Current role__ : **<@&${soutienId.get(guild.id)}>** \n
        2 ・ Configure the personalized status message that members should have.\n
            __Current message__ : **${soutienMsg.get(guild.id)}** \n
        3 ・ Enable or disable support \n
                __Active__ : ${isOnS}
        `,
        roleQ : `⏳ Mention the role the supporters will receive (cancel to cancel)`,
        success : (response) => `◈ \`SUCCES\` Supporters will now receive the role: ${response}.`,
        errorAdd : (response) =>`◈ \`ERROR\` I have not been able to define the role where the supporters will receive                                               ${response}`,
        errorTimeOut : "◈ \`ERROR\` No response after 30 seconds operation will be canceled",
        msgQ : `⏳ Please define your message to acquire the support role (cancel to cancel)`, 
        successEditRl : `◈ \`SUCCES\` I have changed the support message to : `,
        rmAllRlQ : `⏳ You have changed the support message. Do you want to remove the role from all the people who have the support role? Yes / No (cancel to cancel)`, 
        errorRmAllRl : (rlId) => `I didn't manage to remove the role <@&${rlId}> to the supports`,
        successNo : "The support role is therefore not taken away from former support",
        removingRl : (rlId) => `I am removing the whole role <@&${rlId}> support (this may take a little time!).`,
        errorTimeout2M :"◈ \`ERROR\` No response after 2 minutes operation will be canceled",
        errorChMsg : `◈ \`ERROR\` I was unable to change the support message to:`,
        enableQ : `⏳ Do you want to activate support? Yes / No (cancel to cancel)`,
        successEnable : `◈ \`SUCCES\` I have activated the support!`,
        errorEnable : `◈ \`ERROR\` I have not arrived to activate the support...`,
        successDisable : `◈ \`SUCCES\` I have deactivate  the support !`,
        errorDisable : `◈ \`ERROR\` I didn't manage to deactivate the support...`,
        descriptionCount : (count) => "There is currently 🆘 **" + count + " ** people who support the server.",

    },
    setup : {
        muteQ : "◈ \`SUCCES\` Mention the mute role! (Timeout in 30s & \`cancel \` to cancel)",
        memberRoleQ :"◈ \`SUCCES\` Mention the member role (if it's everyone put the id of everyone)! (Timeout in 30s & \`cancel \` to cancel)",
        success : (mureRoleId, memberRoleId) => `◈ \`SUCCES\` The roles \`(${mureRoleId}, ${memberRoleId})\` have been added`,
        error : (mureRoleId, memberRole) =>`◈ \`ERROR\` Oops an error occured adding the roles ${mureRoleId} ${memberRole} in the database list.`,

    },
    setlogs : {
        embedTitle : `Logs parameter`,
        embedDescription : (raid, mod, voc, msg, react) => `
        \n
           To disable a log just put off as a channel
            
            1 ・ Raid Logs
            ***${raid}***\n
            2 ・ Moderation logs
            ***${mod}***\n
            3 ・ voice chat Logs 
            ***${voc}***\n
            4 ・ Message Logs 
            ***${msg}***\n
            ❌ ・ Close the panel\n
            ✅ ・ Save the logs
        `,
        errorNotChannel : `You've specified a invalid channel or an id `,
        
        raidChQ : `What is the channel for the raid logs ?`,
        successRaidCh : (ch) => `You've defined the raid logs for ${ch}`,
        disable : (type) => `The logs ${type} has been disable`,
        modChQ : `What is the channel for the moderation logs ?`,
        successModCh : (ch) => `You've defined the moderation logs for ${ch}`,
        vocChQ : `What is the channel for the voice chat logs ?`,
        successVocCh : (ch) => `You've defined the voice chat logs for  ${ch}`,
        msgChQ : `What is the channel for the message logs ?`,
        successMsgCh : (ch) => `You've defined the message logs for ${ch}`,
        cancel :  `You've cancel the configuration`,
        save :  `You've save the configuration`,

    },
    owner : {
        noMember: `Please specify a member`,
        errorSyntax :"◈ `ERROR` Syntax error (!owner add/remove/list/clear @KhdDev)",
        errorSyntaxAdd : "◈ `ERROR` Syntax error : !owner\`<add/ remove/ list>\` \`<mention / id>\`",
        errorAlreadyOwner : (member) => `◈ \`ERROR\` **${member}** is already in the owner list`,
        successOwner : (member) => `◈ \`SUCCES\` I added **${member}** to the owner list`,
        errorNotOwner : (member) => `◈ \`ERROR\` **${member}** it is not in the owner list`,
        successRmOwner : (member) => `◈ \`SUCCES\` I removed **${member}** from owner list`,
        clearOwner : `Are you sure you want to clear the owner list?`,
        successClearOwner : `I have cleared the owner list`,
        error :`Oops an error was detected, so I could not clear the owner list`,
        cancel : `I have not cleared the owner list`,
        titleList : `◈ List of owners`,

    },
    addinvite: {
        noMember: `I can't find this member`,
        noNumber: `Please specify a correct number to add`,
        success: (number, tag) => `I added **${number}** ${number > 1 ? 'invites' : 'invite'} at ${tag}`,
    },
    rminvite: {
        success: (number, tag) => `I removed **${number}** ${number > 1 ? 'invites' : 'invite'} from ${tag}`,

    },
    clearInv: {
        success: (tag) => `I have cleared the on ${tag}`
    },
    invite : {
        countDesc : (author, userInviteCount, inv) => `
        **${author.username}** currently owns : \n
        👥 **${userInviteCount}** ${inv}. `,
        titleConfig : `◈ __Invitations settings__`,
        descConfig : (inviteChannel, guild, isOnS, inviteMsg) => `
        1 ・Configure the channel where messages will be sent\n
            __Current channel__ : **<#${inviteChannel.get(guild.id)}>**\n
        2 ・ Configure the welcome message\n
            __Current message__ : **${inviteMsg.get(guild.id)}** \n
        3 ・ Help for the welcome message  \n
        4 ・ Activate or deactivate the welcome message \n
        __Active__ : ${isOnS}`,
        chQ : `⏳ Mention the channel where the welcome messages will be sent (cancel to cancel)`,
        successCh : (response) => `◈ \`SUCCES\` Welcome messages will now be sent to the channel ${response}.`,
        errorCh : (response) => `◈ \`ERROR\` I have not been able to define the channel where the welcome messages will be sent to ${response}`,
        timeout : "◈ \`ERROR\` No response after 30 seconds operation will be canceled",
        msgQ : `⏳ Please define your welcome message (cancel to cancel)`,
        successMsg : `◈ \`SUCCES\` I have modified the welcome message to :`, 
        errorMsg : `◈ \`ERROR\` I have not been able to change the welcome message to :`,
        timeout2M : "◈ \`ERROR\` No response after 2 minutes operation will be canceled",
        helpTitle : `◈ __Help on configuring the welcome message__`,
        helpDesc: (invitedHelp, inviterHelp, invitedMention, inviterMention, accountCreate, countHelp, fakeHelp, leaveHelp, totalMemberHelp, space) => `
        ${invitedHelp} \n
        ${inviterHelp} \n
        ${invitedMention}\n
        ${inviterMention}\n
        ${accountCreate}\n 
        ${countHelp} \n
        ${fakeHelp}\n
        ${leaveHelp}\n
        ${totalMemberHelp} \n
        ${space}  `,
        enableQ : `⏳ Do you want to activate welcome messages? Yes / No (cancel to cancel)`,
        successEnable : `◈ \`SUCCES\` I have activated the welcome messages !`,
        errorEnable : `◈ \`ERROR\` I have not arrived to activate the welcome messages...`,
        successDisable : `◈ \`SUCCES\` I have deactivated the welcome messages !`,
        errorDisable : `◈ \`ERROR\` I have not been able to deactivate the welcome messages...`,
        cantTrace: (invited) => `I don't know how ${invited} was invited on the server`,
        vanity: (invited) => `${invited} has been invited with custom server url`,
        syncSuccess: `The invations have been synchronized`,
        oauth: (invited) => `${invited} was invited using oauth `


    },
    password : {
        reply : `look your private message`,
        resetQ : `What was your old password ?  (timeout 30 seconds)`,
        errorNotClient : `Sorry but you are not client. To be a client please subscribe to an offer !`,
        wrongPassword : `The password is incorrect`,
        newPasswordQ : `What is the new password ? (timeout 30 seconds)`,
        successChange : `You've correctly change your password !`
    },
    authorinfo: {
        description: `__**OneforAll**__\n\n*OneforAll is a bot owned by* \`KhdDev\`\n\n**Developer :**\n[KhdDev](https://discord.gg/TfwGcCjyfp) -> Bot & Host\n`,
    },
    setlang : {
        title : `Change language`,
        description :(lang) =>  `Actual language : **${lang}**    \n\n 🇫🇷 ・ French \n\n 🇬🇧 ・ English`,
        errorSelected : `◈ \`ERROR\` The lang you wanted is already the actual language.`,
        success : (lang) => `◈ \`SUCCES\` The bot language as been set for : **${lang}**`,
    },
    addemoji : {
        missingUrl : `◈ \`ERROR\` You need to provide an emoji`,
        missingName : `◈ \`ERROR\` You need to provide a name for the emoji`,
        invalidName : `◈ \`ERROR\` You need to provide a valid name (between 3 and 31 characters)`,
        success : (emoji) => `◈ \`SUCCES\` The emoji **${emoji}** has been added`,
        error : (name) => `◈ \`ERROR\` A error has occurred during adding the emoji **${name}**`
    },
    removeemoji : {
        missingUrl : `◈ \`ERROR\` You need to provide an emoji`,
        success : (emoji) => `◈ \`SUCCES\` The emoji **${emoji}**  has been delete`,
        error : (name) => `◈ \`ERROR\` A error has occurred during deleting the emoji **${name}**`
    },
    backup : {
        configEmbedT : `🏠 Backup configuration`,
        configEmbedDesc : (ignoreCh, ignoreRl, ignoreEmo, ignoreBans) =>`
        **1** ・ Ignore channels (**${ignoreCh}**)
        **2** ・ Ignore roles (**${ignoreRl}**)
        **3** ・ Ignore emojis (**${ignoreEmo}**)
        **4** ・ Ignore bans (**${ignoreBans}**)\n
        **❌** ・ Close menu
        **✅** ・ Create the backup
        
        `,
        cancel : `◈ \`SUCCES\` Backup creation canceled!`,
        successDelete : (backupId) =>  `◈ \`SUCCES\` I deleted the backup **${backupId}** !`,
        successCreate : (id) => `◈ \`SUCCES\` The backup was created with the id **${id}**`,
        successLoad : (guildName) => `◈ \`SUCCES\` The backup was loaded on **${guildName}** !`,
        errorToManyBackup : `◈ \`ERROR\` You have reached the maximum backup quota created (5 backups)`,
        noLoadId : `◈ \`ERROR\` You must specify the id of a backup`,
        backupNoFound : `◈ \`ERROR\` I can't find this backup in my database!`,
        error : `◈ \`ERROR\` An error has occurred`,
        timeout : `◈ \`ERROR\` You must wait \`20 minutes\` before you can load a backup !`
    },
    blacklist : {
        errorCantFindMember : `◈ \`ERROR\` I can't find this member mentioned try with member id! `, 
        successEnable : `◈ \`SUCCES\` I activated the blacklist for owner(s)!`,
        successDisable : `◈ \`SUCCES\` I deactivated the blacklist for owner(s)`,
        errorAlreadyOff : `◈ \`ERROR\` The blacklist is already deactivated.`,
        errorAlreadyOn : `◈ \`ERROR\` The blacklist is already activated.`,
        errorSyntax : "◈ `ERROR` Syntax error : !blacklist on/off/add/remove/list/clear @KhdDev",
        errorSyntaxAdd : "◈ `ERROR` Syntax error : !blacklist \`<add/ remove/ list>\` \`<mention / id>\`",
        errorTryBlOwner : (member) => `◈ \`ERROR\` You cannot blacklist **${member.username}** because you are part of the owner list and he too.`,
        errorTryUnBlOwner : (member) => `◈ \`ERROR\` You cannot unblacklist **${member.username}** because you are part of the owner list and he too.`,
        successBanBl : (member) => `◈ \`SUCCES\` I banned **${member.username}**`,
        successBanGuild : (guildCount) => `◈ \`SUCCES\` He was banned on **${guildCount}** servers...`,
        successUnBanBl : (member) => `◈ \`SUCCES\` I unbanned **${member.username}**`,
        successUnBanGuild : (guildCount) => `◈ \`SUCCES\` He was unban on **${guildCount}** servers...`,
        errorAlreadyBl : (member) => `◈ \`ERROR\` **${member.username}** is already in the blacklist.`,
        successBl : (member) => `◈ \`SUCCES\` I added **${member.username}** to the blacklist`,
        errorNotBl : (member) => `◈ \`ERROR\` **${member.username}** is not in the blacklist`,
        successRmBl : (member) => `◈ \`SUCCES\` I removed **${member.username}** from blacklist`,
        errorCrown : `◈ \`ERROR\` Sorry, you can't blacklist the server owner`,
        errorBannable : `◈ \`ERROR\` Sorry, I cannot ban this person from this server`,
        clearBl : `Are you sure you want to clear the blacklist?`,
        successClearBl : `◈ \`SUCCES\` I cleared the blacklist`,
        error :`◈ \`ERROR\` Oops, an error was detected, so I couldn't clear the blacklist`,
        cancel : `◈ \`SUCCES\` I have not cleared the blacklist`,
        titleList : `◈ Blacklist list`,
        errorMe : `◈ \`ERROR\` Sorry, you can't blacklist me!`,
        errorNotInDb: (prefix) => `◈ \`ERROR\` You are not registered in my database please use \` ${prefix}bl on\``,

    },
    allbot : {
        title : (bots) => `Number of bots : ${bots}`,
    },
    warn: {
        warnDm: (tag, reason, amount) => `Vous avez été warn par **${tag}** pour ${reason}, vous avez au total : \`${amount}\` warn(s)`,
        warnSuccess: (tag, reason, amount) => `J'ai warn **${tag}** pour ${reason}, **${tag}** est actuellement à ${amount} warn(s)`,
        banDm: (amount, serverName) => `Vous avez été banni de **${serverName}** car vous avez atteind la limite de warn avec \`(${amount})\` warn(s)  `,
        kickDm: (amount, serverName) => `Vous avez été kick de **${serverName}** car vous avez atteind la limite de warn avec \`(${amount})\` warn(s)  `,
        muteDm: (amount, serverName) => `Vous avez été mute de **${serverName}** car vous avez atteind la limite de warn avec \`(${amount})\` warn(s)  `,

        settingsTitle: `Configuration des warns`,
        description: (ban, kick, mute) => ` \n
        Cliquez sur les reactions pour pouvoir configurer les warns !
        Pour mettre aucune sanction il suffit de mettre __0__

        \`💥\` ・ Modifier le nombre de warn avant de ban
        ***${ban}***\n
        \`💢\` ・ Modifier le nombre de warn avant de kick
        ***${kick}***\n
        \`😶\` ・ Modifié le  nombre de warn avant de mute
        **${mute}**\n
        
        \`❌\` ・ Fermer le menu\n
        \`✅\` ・ Sauvegarder la configuration
        `,
        banQ: `Quel doit être le nouveau nombre de warn avant de ban ? **Cancel pour annuler**`,
        onlyNumber: `Vous devez entrer uniquement des nombres`,
        kickQ: `Quel doit être le nouveau nombre de warn avant de kick ? **Cancel pour annuler**`,
        muteQ: `Quel doit être le nouveau nombre de warn avant de mute ? **Cancel pour annuler**`,
        cancel: `La configuration du nombre de warn a été annulé`,
        save: `La configuration a été sauvegardé`,
        error: `J'ai rencontré une erreur lors de la mis à jour`,
        listTitle: (tag) => `Liste des warns de ${tag}`,
        reason: `Raison`,
        noWarn: `Aucun warn enregistré`,
        nothingToClear: `Il n'y a aucun warn a clear sur ce membre`,
        successClear: (tag) => `J'ai clear tout les warns de ${tag}`,
        amountHigherThanWarnTotal: `Le nombre de warn à supprimer est supérieur au nombre total de warn que ce membre possède`,
        successClearAmount: (tag, amount) => `J'ai clear __${amount}__ warn(s) de **${tag}**`,
        warnNotFound: `Le warn n'existe pas`,
        successDelete: (tag, amount) => `J'ai enlevé le warn numéro ${amount} a **${tag}**`,
        noReason: "Aucune raison spécifique",
        notNumber: `You must enter the warn number to delete`,
        noMember: "◈ `ERROR` You must specify a member (`\mention / id`\)",
        noGuildWarn: `No warn on this server `


    },
    counter : {
        embedTitle : `Counters Parameter`,
        embedDescription : (member, bot, voc, online, offline, channel, role, booster) => `
        \n
           To deactivate a counter just put off as channel  !
            
            \`👥\`・ Member counter
            ***${member}***\n
            \`🤖\` ・ Robot counter
            ***${bot}***\n
            \`🔊\`・ Voice connections counter 
            ***${voc}***\n
            \`🟢\` ・ Online members counter 
            ***${online}***\n
            \`⭕\` ・ Offline members counter 
            ***${offline}***\n
            \`📖\` ・ Channel counter
            ***${channel}***\n
            \`✨\` ・ Roles counter
            ***${role}***\n
            \`💠\` ・ Boosts counter 
            ***${booster}***\n
           
            \`❌\` ・ Close menu\n
            \`✅\` ・ Save counters
        `,
        notVoice : `◈ \`ERROR\` The desired channel is not a vocal channel`,
        nameQ : `What must be the name of the **salon** \`ex : 💥・ Members:\`?`,
       
        errorNotChannel : `◈ \`ERROR\` You must specify a valid channel or id`,
        disable : (type) => `◈ \`SUCCES\` The counter ${type} has been disabled`,
        successMemberCh : (ch) => `◈ \`SUCCES\` You have defined the channel for the members counter to ${ch}`,
        memberChQ : `What is the voice channel for the members counter ?`,
        successMemberName : (name) => `◈ \`SUCCES\` You have defined the name of the channel for the members counter to ${name}`,
        
        botChQ : `What is the voice channel for the bots counter ?`,
        successBotName : (name) => `◈ \`SUCCES\` You have defined the name of the channel for the bots counter to ${name}`,
        successBotCh : (ch) => `◈ \`SUCCES\` You have defined the channel for the bots to ${ch}`,
        
        vocalChQ : `What is the voice channel for the voice connections counter?`,
        successVocalName : (name) => `◈ \`SUCCES\` You have defined the name of the channel for the voice connections counter to ${name}`,
        successVocalCh : (ch) => `◈ \`SUCCES\` You have defined the channel for the voice connections counter to ${ch}`,

        onlineChQ : `What is the voice channel for the online members counter?`,
        successOnlineName : (name) => `◈ \`SUCCES\` You have defined the name of the channel for the online members counter to ${name}`,
        successOnlineCh : (ch) => `◈ \`SUCCES\` You have defined the channel for the online members counter to ${ch}`,

        offlineChQ : `What is the voice channel for the offline members counter?`,
        successOfflineName : (name) => `◈ \`SUCCES\` You have defined the channel name for the offline members counter to ${name}`,
        successOfflineCh : (ch) => `◈ \`SUCCES\` You have defined the channel for the offline members counter to ${ch}`,

        channelChQ : `What is the voice channel for the channels counter?`,
        successChannelName : (name) => `◈ \`SUCCES\` You have defined the channel name for the channels counter to ${name}`,
        successChannelCh : (ch) => `◈ \`SUCCES\` You have defined the channel for the channels counter to ${ch}`,
        
        roleChQ : `What is the voice channel for the roles counter?`,
        successRoleName : (name) => `◈ \`SUCCES\` You have defined the channel name for the roles counter to ${name}`,
        successRoleCh : (ch) => `◈ \`SUCCES\` You have defined the channel for the roles counter to ${ch}`,

        boostChQ : `What is the voice channel for the boosts counter?`,
        successBoostName : (name) => `◈ \`SUCCES\` You have defined the channel name for the boosts counter to ${name}`,
        successBoostCh : (ch) => `◈ \`SUCCES\` You have defined the channel for the boosts counter to ${ch}`,

        
    },
    reactionRole :{
        embedTitle: `Role reaction creation menu`,
        embedDescription : (channel, id,emoji, role) => `
        \n
            Click on the reactions to be able to configure the role reaction !
            
            \`📖\` ・ Choose the channel where the reaction role should be
            ***${channel}***\n
            \`🆔\` ・ Define the message id associated with the reaction role
            ***${id}***\n
            \`💠\` ・ Add a role\n
            **${emoji.join(`\n`)}**\n
            \`🚫\` ・ Delete a role\n
            \`📛\` ・ Delete an existing role reaction
            
           
            \`❌\` ・ Close menu\n
            \`✅\` ・ Save the reaction role
        `,
        notText : `The channel should only be of the type **text**`,
        chQ : `📖 What is the channel where you would like to have your reaction role ? (\`mention/id\`) (cancel to cancel)`,
        successCh: (ch) => `You have defined the channel to **${ch}**`,
        msgIdQ : `🆔 What is the message id for your reaction role ? (\`id\`) (cancel to cancel)`,
        notId : `Please enter a valid id !`,
        noChannel: `You have not defined a channel so I could not retrieve the message`,
        invalid : `The channel or the message id is invalid`,
        roleQ : `💠 What is the role to add for the reaction role ? (\`mention/id\`) (cancel to cancel)`,
        noRole : `Please define a role`,
        managedRole : `This role cannot be added because it is a role **managed by an application**`,
        emojiQ : `💠 What is the emoji for this role ? (\`send emoji\`)`,
        emojiDoesNotExist :`The desired emoji does not exist I am ready to add an emoji to the server what name should it have? (cancel to cancel)`,
        roleAlready :`The desired role is already associated with an emoji`,
        emojiAlready :`The desired emoji is already associated with a role`,
        roleDelQ : `🚫 What is the role to remove from the reaction role ? (\`mention/id\`) (cancel to cancel)`,
        roleNotFound : `The role is not part of the configuration of a role reaction`,
        noRole : `Before deleting a role please define it`,
        cancel : `Creating a role reaction canceled.`,
        chDeleteQ : `📛 What is the channel where the reaction plays a role? ? (\`mention/id\`) (cancel to cancel)`,
        msgDeleteQ : `📛 What is the id of the message associated with the reaction role ? (cancel to cancel)`,
        msgNotFound : `The message was not found.`,
        successDel : `The reaction role has been deleted.`,
        noMsg : `You have not defined a message.`,
        noEmoji : `You haven't set an emoji and role.`,
        alreadyReact : `A reaction role already exists with this message`,
        success : `The reaction role has been perfectly saved and created !`,
    },
    antiraidConfig :{
        noVote : `🖼️ This feature is not available.`,
        allOn : `All events have been activated `,
        allOff : `All events have been disabled `,
        opti : `The antiraid was configured with the optimized parameters `,
        antiSpamOn : `Antispam has been activated !`,
        antiSpamOff : `Antispam has been disabled !`,
        antilinkOn : `The antilink has been activated !`,
        antilinkOff : `The antilink has been deactivated  !`,
        p1Title : `➡️__Event configuration__ (__15__)`,
        p2Title : `➡️__Event configuration__ (__15__)`,
        p3Title : `➡️__Event configuration__ (__15__)`,
        timeoutmsg : `Elapsed time your settings are not saved!`,
        savedmsg : `Anti raid parameters have been saved `,
        reactsave : `To save your settings, please **react** to this message with **✅ ** `,
        anulee : `The operation was canceled `,
        active : `The event has been activated`,
        deactive : `The event has been deactivated`,
    },
    tempvoc: {
        embedTitle: `Temporary voice creation menu`,
        embedDescription : (tempname, enable) => `
        \n
            Click on the reactions to be able to configure the temporary voice !
            
            \`🕳\` ・ Auto configure temporary voice 
            \`💬\` ・ Change the name of the user's temporary room 
            ***${tempname}***\n
            \`💨\` ・ Activate / deactivate temporary voice 
            **${enable}**\n
            \`💥\` ・ Delete an existing temporary voice 
            
           
            \`❌\` ・ Close menu\n
            \`✅\` ・ Save temporary voice 
        `,
        loadingCreation : `Creation in progress...`,
        autoCat : `Temporary channel`,
        autoChName : `➕ Create your channel`,
        autoConfigFinish : `Creation is complete`,
        nameQ : `What should be the name of the channel? \`ex : ❤ - {username}\` (cancel to cancel)`,
        errorNoUsername: `You have to put **{username}** in the name of the channel`,
        cancel : `Creation of a temporary voice canceled`,
        alreadyTempvoc : `There is already a temporary voice on this server please delete it .`,
        success : `The temporary voice is well saved `,
        noCat : `Please configure temporary voice `,
        tempVocNotFound : `I cannot find any temporary channel for this server`,
        successDel : `Temporary vocal has been deleted`
    },
    serverlist: {
        title: `List of all the guild`,
        leave : `To remove the bot from a guild do !serverlist <the number associate to the guild>`, 
        success: (name) => `The bot has left **${name}**`
    },
    ball : {
        noQuestion :  `Please enter a question.`,
        reponseQuestion : ["Oui.","Non.","Oui bien sûr","Oui définitivement !","Il ne vaut mieux pas en parler !","J'ai pas envie de répondre à cette question.","j'espère","J'imagine bien"],
        reponse : `Reply`

    },
    meme : {
        reponse :  (random) =>`Your meme was found on /r${random} (if the picture does not load please click the link)`
    },
    gaydetector : {
        title : `Gay Detector Machine`
    },
 

    addShop : {
        noItem : `Please enter an item for the shop`,
        noPrice : `Please enter a correct price to add the item to the shop`,
        successAdd : (item, price) => `You have added the item **${item}** at the price of ${price}`,
        priceInf0 : `You must enter a price greater than 0`,
        noShop : `◈ \`ERROR\` Your store is not in our database (\`shop create\` to create the shop)`,
        alreadyShop : `◈ \`ERROR\` Your server already have a store to delete it use \`shop delete\` `,
        create : `◈ \`SUCCES\` The store has been created `,
        delete : `◈ \`SUCCES\` The store has been deleted `,
        successRemove : (item) => `◈ \`SUCCES\` You removed the item **${item}** from the shop`,
        successAdd : (item, price) => `◈ \`SUCCES\` You added the item **${item}** at the price of ${price}`,
        shopShowTitle : (guildName) => `Store on the server ${guildName}`,
        nothingInShop : `Nothing in the store`,
        notFoundItem : `◈ \`ERROR\` I can't find the item associated with this id try wtih another id `,
        editCondition : `Only the price and the name of the item can be edited`,
        newNameQ : `What should the new name of the item be? (cancel for cancel)`,
        successEditItemName : (name) => `◈ \`SUCCES\` You have changed the name of the item to ${name}`,
        newPriceQ : `What should be the new price for the item ? (cancel for cancel)`,
        successEditItemPrice : (price) => `◈ \`SUCCES\` You have changed the price of the item to ${price}`,
        cancel : `◈ \`SUCCES\` You canceled the modification of the item`,
        onlyNumber : `◈ \`ERROR\` You must enter numbers only`,
        syntaxEdit : `◈ \`ERROR\` Syntax Error: (!shop edit <itemId>)`,
        noModification : `You have not modified anything in the item`,
        successEdit : `◈ \`SUCCES\` The item has been modified`,
        shopDesc : (guildName) => `:shopping_cart: Store on the server **${guildName}**.\n💰 Buy an item with the \`buy [number]\` command.`
    
    },
    buy : {
        shoDisable : `◈ \`ERREUR\` The store is deactivated`,
        syntaxError : `◈ \`ERREUR\` Syntax Error: !buy <itemId>`,
        noCoins : `◈ \`ERREUR\` You don't have coins.`,
        nothingInShop : `◈ \`ERREUR\` There is nothing in the store `,
        notEnoughCoins : `◈ \`ERREUR\` You have not enough coins to buy this item`,
        itemNotInShop : `◈ \`ERREUR\` The item is not in the store`,
        success : (name, price) => `◈ \`SUCCÈS\` You bought **${name}** for 💰 **${price}** coins.`,
        alreadyRole : `◈ \`ERREUR\` You already have this role so you cannot purchase this item.`,
        buyLog : (memberPing, itemName, price) => `◈ \`SUCCÈS\` ${memberPing} bought **${itemName}** for 💰 **${price}** coins.`

    },
    coins: {
        description: (coins) => `__${coins}__ coins`,
    },
    pay: {
        noMember : `Please specify a member to pay`,
        noCoins : `Please specify a number of coins to pay`,
        coinsInf0 : `Please specify a number of coins to pay greater than 0`,
        coinsDec2 : `The number of coins have too many decimals (2 maximum)`,
        noGoinsToGive : `You don't have coins.`,
        notEnoughtCoins : (coins) => `You don't have enough coins to give ${coins}`,
        giveCoins : (coins, member) => `You paid \`${coins}\` coins at ${member}`,
        logs : (coins, giver, receiver) => `${giver} gave \`${coins}\` coins at ${receiver}`
    },
    lb :{
        title : `Top 10 members with the most coins`,
        noCoins : `Nobody has coins on the server.`
    },

    music:{
        filter: {
            noArgs: `🎵 \`ERREUR\` You must choose an effect option \`3d, bassboost, echo, karaoke, nightcore, vaporwave, flanger, gate,haas, reverse, surround, mcompand, phaser, tremolo, earwax\``,
            success: (addedFilter, filter) => `🎵 Success the filter ${addedFilter} has been added to the filter list (${filter || "Off"}) `,
            successOff: `🎵 The filter is deactivated`,

        },
        requestedBy : `Asked by:`,
        playing : `🎵 Playing`,
        nothingInQueue : `🎵 There is nothing in the queue at the moment `,
        play:{
            noMusic: `🎵 \`ERROR\` You must enter a url or a music to search  !`
        },
        pause:{
            unPause : `🎵 Music is no longer paused`,
            pause : `🎵 Music is now paused `,
        },
        queue : `🎵 **Server Queue**`,
        skip : `🎵 Skipped! I play now:`,
        repeatMode : (mode) => `🎵 Loop mode is now set to \`${mode}\``,
        stop : `🎵 The music is now stopped `,
        volume :{
            notNumber : `🎵 \`ERROR\` Please enter a valid number `,
            changed : (volume) => `🎵 The volume is now set for \`${volume}%\``
        },
        noAvgRate :`Aucune information disponible`,
        lyrics :{
            notFound : `🎵 \`ERROR\` No lyrics found for: `
        },
        currentPlaying: {
            timeLeft : `Temps restant:`,
        },
        autoplay: {
            missingArgs : `🎵 \`ERROR\` Please enter \`on\` or \`off\`.`,
            on : `🎵 Autoplay is now activated`,
            off : `🎵 Autoplay is now disabled `,
            alreadyOn : `🎵 \`ERROR\` Autoplay is already activated `,
            alreadyOff : `🎵 \`ERROR\` Autoplay is already disabled `,
        },
        events :{
            addToQueue : {
                add: (songName, time, url) => `🎵 I added [${songName} - \`${time}\`](${url}) in the queue`
            },
            empty : `No one is in the channel. I leave him`,
            

        },
        importPlaylist:{
            description : `Do you want to import this playlist into your personal playlist ?`,
            nameQ : `What should be the name of this playlist ?`,
            success : `The playlist has been saved`,
            toManySongs : `Your playlist has too much music, please take another one with less music (35 max)`
        },
        search : {
            searching : `🎵 Browsing the web ...`,
            title : `List of music found:`,
            noArgs: `🎵 \`ERREUR\` Please enter something to look for it`,
            nothingFound: `🎵 \`ERREUR\` Nothing was found`,
            end: `🎵 The search is finished`
        },
        playlist:{
            noPlaylist: `🎵 \`ERREUR\` You do not have a saved playlist to save it, do \`!play <playlistUrl>\``,
            noPlaylistName : `🎵 \`ERREUR\` You must enter the name of one of your playlists.`,
            notFound : `🎵 \`ERREUR\` This playlist is not part of your playlist .`,
            urlQ : (name) => `🎵 What is the url of the music to add to the playlist  ${name} ?`,
            urlPlaylistQ: `🎵 What is the url of the playlist to import?`,
            provideOnlyValidUrl: `🎵 \`ERREUR\` Please enter only valid urls \`(youtube)\``,
            successAdd : (name) => `The music has been added to the playlist ${name}`,
            successImport: (name) => `🎵 La playlist a bien été importé avec le nom ${name}`,
            successDelete: (name) => `🎵 La playlist ${name} a bien été supprimé`,
            successRemove: (name) => `🎵 J'ai enlevé la music souhaité de ${name}`,
            successCreate: (name) => `🎵 J'ai créé la playlist ${name}`,
            playlistToLong: `🎵 La playlist comporte plus de 50 musics, je prend les 50 premières musics`,
            removeQ: `🎵 Quel est l'url de la music à enlever (cancel pour annuler)`,
            songNotFound: `🎵 La music à supprimer n'est pas dans cette playlist`,
            toManyPlaylist: `🎵 \`ERREUR\` Vous ne pouvez pas avoir plus de 10 playlist`,
            alreadyName: `🎵 \`ERREUR\` Une playlist comportant déjà ce nom existe veuillez choisir un autre nom de playlist`,
            createQ: `🎵 Quel est la première music à ajouter dans votre playlist ?`
        },
        shuffle: `🎵 The musics will be played randomly `
    },

    logs: {
        targetExecutorLogs: (type, executor, target, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: `${type.toUpperCase()}`, iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**Executor** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Target** — ${target.username} (\`${target.id}\`)\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : color),

        editionMsg: (executor, before, after, color, extra) => new EmbedBuilder()
            .setAuthor({ name: 'Message edited', iconURL: executor.user.displayAvatarURL() })
            .setDescription(`**By** — ${executor.user} (\`${executor.id}\`)\n[Go to message](${extra})\n\u200b`)
            .addFields(
                { name: 'Before', value: before.slice(0, 1024), inline: true },
                { name: 'After', value: after.slice(0, 1024), inline: true },
            )
            .setTimestamp()
            .setColor(color),

        edtionChannel: (executor, channel, before, after, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Channel modified', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Channel** — <#${channel}>\n` +
                (sanction ? `**Sanction** — \`${sanction}\`` : '')
            )
            .addFields(
                { name: 'Before', value: before, inline: true },
                { name: 'After', value: after, inline: true },
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : color),

        edtionRole: (executor, role, before, after, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Role modified', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Role** — <@&${role}>\n` +
                (sanction ? `**Sanction** — \`${sanction}\`` : '')
            )
            .addFields(
                { name: 'Before', value: before, inline: true },
                { name: 'After', value: after, inline: true },
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : color),

        guildNameUpdate: (executor, before, after, guild, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Server name changed', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                (sanction ? `**Sanction** — \`${sanction}\`\n` : '') + '\u200b'
            )
            .addFields(
                { name: 'Before', value: before, inline: true },
                { name: 'After', value: after, inline: true },
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : color),

        guildVanityUpdate: (executor, before, after, guild, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Vanity URL changed', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                (sanction ? `**Sanction** — \`${sanction}\`\n` : '') + '\u200b'
            )
            .addFields(
                { name: 'Before', value: before || 'None', inline: true },
                { name: 'After', value: after || 'None', inline: true },
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : color),

        voiceChange: (executor, target, before, after, color) => new EmbedBuilder()
            .setAuthor({ name: executor.id === target.id ? 'Channel switch' : 'Member moved', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user}\n` +
                (executor.id !== target.id ? `**Target** — ${target.username}\n` : '') + '\u200b'
            )
            .addFields(
                { name: 'Before', value: `<#${before}>`, inline: true },
                { name: 'After', value: `<#${after}>`, inline: true },
            )
            .setTimestamp()
            .setColor(color),

        voiceConnect: (executor, channel, color) => new EmbedBuilder()
            .setAuthor({ name: 'Voice connected', iconURL: executor.user.displayAvatarURL() })
            .setDescription(`${executor.user} joined <#${channel}>`)
            .setTimestamp()
            .setColor('#2ECC71'),

        voiceLeave: (executor, channel, color) => new EmbedBuilder()
            .setAuthor({ name: 'Voice disconnected', iconURL: executor.user.displayAvatarURL() })
            .setDescription(`${executor.user} left <#${channel}>`)
            .setTimestamp()
            .setColor('#E74C3C'),

        voiceMute: (executor, channel, color) => new EmbedBuilder()
            .setAuthor({ name: 'Voice muted', iconURL: executor.user.displayAvatarURL() })
            .setDescription(`${executor.user} muted in <#${channel}>`)
            .setTimestamp()
            .setColor('#F39C12'),

        voiceUnMute: (executor, channel, color) => new EmbedBuilder()
            .setAuthor({ name: 'Voice unmuted', iconURL: executor.user.displayAvatarURL() })
            .setDescription(`${executor.user} unmuted in <#${channel}>`)
            .setTimestamp()
            .setColor('#2ECC71'),

        messageDelete: (executor, target, channel, color, content) => new EmbedBuilder()
            .setAuthor({ name: 'Message deleted', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user}` +
                (executor.id !== target.id ? ` (message from **${target.username}**)` : '') +
                `\n**Channel** — <#${channel}>\n\u200b`
            )
            .addFields({ name: 'Content', value: content.slice(0, 1024) || '*Empty*' })
            .setTimestamp()
            .setColor(color),

        memberRole: (executor, target, role, color, sanction, type) => new EmbedBuilder()
            .setAuthor({ name: `Role ${type === 'ADD' || type === 'ADDED' ? 'added' : 'removed'}`, iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Target** — ${target.username} (\`${target.id}\`)\n` +
                `**Role** — <@&${role}>\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : color),

        webhookCreate: (executor, channel, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Webhook created', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Channel** — <#${channel}>\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : '#F39C12'),

        roleCreate: (executor, roleName, roleId, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Role created', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Role** — ${roleName} (\`${roleId}\`)\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : color),

        roleDelete: (executor, roleName, roleId, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Role deleted', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Role** — ${roleName} (\`${roleId}\`)\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : '#F39C12'),

        channelCreate: (executor, channelName, channelId, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Channel created', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Channel** — ${channelName} (\`${channelId}\`)\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : color),

        channelDelete: (executor, channelName, channelId, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Channel deleted', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Channel** — ${channelName} (\`${channelId}\`)\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : '#F39C12'),

        antiDc: (executor, time, limit, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Account too recent', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**Member** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Created** — ${time}\n` +
                `**Limit** — \`${limit}\`\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor('#E74C3C'),

        botAdd: (executor, bot, id, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Bot added', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Bot** — ${bot} (\`${id}\`)\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : '#F39C12'),

        blacklist: (executor, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Blacklist detected', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**Member** — ${executor.user} (\`${executor.id}\`)\n` +
                `This member is blacklisted.\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor('#E74C3C'),

        changeRegion: (executor, oldRegion, newRegion, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Region changed', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                (sanction ? `**Sanction** — \`${sanction}\`\n` : '') + '\u200b'
            )
            .addFields(
                { name: 'Before', value: oldRegion, inline: true },
                { name: 'After', value: newRegion, inline: true },
            )
            .setTimestamp()
            .setColor(sanction ? '#E74C3C' : '#F39C12'),

        antiSpam: (executor, channel, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Spam detected', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**Member** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Channel** — <#${channel}>\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor('#E74C3C'),

        antiLink: (executor, channel, link, color, sanction) => new EmbedBuilder()
            .setAuthor({ name: 'Link detected', iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**Member** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Channel** — <#${channel}>\n` +
                `**Link** — \`${link.slice(0, 200)}\`\n` +
                (sanction ? `\n**Sanction** — \`${sanction}\`` : '')
            )
            .setTimestamp()
            .setColor('#F39C12'),

        mute: (executor, target, time, color, type) => new EmbedBuilder()
            .setAuthor({ name: type.charAt(0).toUpperCase() + type.slice(1), iconURL: executor.user.displayAvatarURL() })
            .setDescription(
                `**By** — ${executor.user} (\`${executor.id}\`)\n` +
                `**Target** — ${target.username} (\`${target.id}\`)\n` +
                `**Duration** — \`${time}\``
            )
            .setTimestamp()
            .setColor('#F39C12'),

        unmute: (target, time, color) => new EmbedBuilder()
            .setAuthor({ name: target.username, iconURL: target.displayAvatarURL() })
            .setDescription(`**${target.username}** a été unmute:`)
            .addFields({ name: 'TIME', value: time })
            .addFields({ name: `ID:`, value: `\`\`\`js\nTarget = ${target.id}\`\`\`` })
            .setTimestamp()
            .setFooter({ text: "🕙" })
            .setColor(color),


    },
    perm: {
        noPermEnough : `Vous n'avez pas assez de permissions`,
        permNotFound : `La nom de la perm est invalide (1,2,3,4,everyone)`,
        commandNotFound: `La nom de la commande est introuvable`,
        noRoleConfig : `Aucun role n'est spécifié pour cette perm`,
        noRole: `Aucun rôle`,
        noCommand : `Aucune commandes`,
        noSetup : (prefix) => `Les perm ne sont pas configuré veuillez faire la commande ${prefix}permconfig`,
        successCommand : (name, perm) =>  `La commande **${name}** est maintenant en perm __${perm}__`,
        setupPerm: (role, perm) => `Le role **${role}** est maintenant en perm **${perm}**`,
        enable: (type) => `Les perm sont maintenant ${type}`
    }
}