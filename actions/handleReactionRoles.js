const reactionRoleStorage = require("./reactionRoleStorage");
const guildUtils = require("../utils/guildUtils");
const {PermissionsBitField} = require("discord.js");


const handleReactionRoleAdd = async (reaction, user) => {
    const reactionRoleData = await reactionRoleStorage.getData();
    if (reactionRoleData.length === 0) return;
    for (const entry of reactionRoleData) {
        if (reaction.message.channel.id === entry.channelId && reaction.message.id === entry.messageId) {
            await _addReactionRole(reaction, user, entry);
        }
    }
}

const handleReactionRoleRemove = async (reaction, user) => {
    const reactionRoleData = await reactionRoleStorage.getData();
    if (reactionRoleData.length === 0) return;
    for (const entry of reactionRoleData) {
        if (reaction.message.channel.id === entry.channelId && reaction.message.id === entry.messageId) {
            await _removeReactionRole(reaction, user, entry);
        }
    }
}

const _addReactionRole = async (reaction, user, roleData) => {
    if (! await guildUtils.checkClientPermission(reaction.message.guild, PermissionsBitField.Flags.ManageRoles)) {
        console.error('Bot is missing Manage Roles permission: Cannot add role');
        return;
    }
    const role = _getRoleFromEmoji(reaction.emoji.name, roleData);
    if (!role) {
        console.log('Unknown reaction on reactionrole message');
        return;
    }
    const member = await reaction.message.guild.members.fetch(user.id);
    console.log(`Adding role ${role} to ${member.nickname}`);
    await member.roles.add(role).catch(e => console.error(e));
}

const _removeReactionRole = async (reaction, user, roleData) => {
    if (!await guildUtils.checkClientPermission(reaction.message.guild, PermissionsBitField.Flags.ManageRoles)) {
        console.error('Bot is missing Manage Roles permission: Cannot remove role');
        return;
    }
    const role = _getRoleFromEmoji(reaction.emoji.name, roleData);
    if (!role) {
        console.log('Unknown reaction on reactionrole message');
        return;
    }
    const member = await reaction.message.guild.members.fetch(user.id);
    console.log(`Removing role ${role} from ${member.nickname}`);
    await member.roles.remove(role).catch(e => console.error(e));
}

const _getRoleFromEmoji = (emoji, roleData) => {
    let role;
    for (const entry of roleData.roles) {
        const roleEmoji = entry[0];
        if (emoji === roleEmoji) {
            role = entry[1];
            break;
        }
    }
    return role;
}

/**
 * Not using this, because collectors seemingly cannot collect old reaction removals
 */
const _createCollectors = async (client) => {
    const reactionRoleData = await reactionRoleStorage.getData();
    let messageData = [];
    for (const entry of reactionRoleData) {
        messageData.push({
            guildId: entry.guildId,
            channelId: entry.channelId,
            messageId: entry.messageId,
        });
    }
    if (messageData.length === 0) return;
    for (const data of messageData) {
        const guild = await client.guilds.fetch(data.guildId);
        if (!guild) {
            console.log('reactionrole: Error fetching guild ' + data.guildId);
            continue;
        }
        const channel = await guild.channels.fetch(data.channelId);
        const message = await channel?.messages.fetch(data.messageId);
        if (!message) {
            console.log('reactionrole: Error fetching message ' + data.messageId);
        }
        _createCollector(client, message);
    }
}

/**
 * Not using this, because collectors seemingly cannot collect old reaction removals
 */
const _createCollector = (client, message) => {
    const collector = message.createReactionCollector({dispose: true});

    collector.on('collect', (reaction, user) => {
        console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    });

    collector.on('remove', (reaction, user) => {
        // Issue: this doesn't get called if an old reaction is removed. Not using collectors because of this
        console.log('remove')
    })
}

module.exports = {
    handleReactionRoleAdd,
    handleReactionRoleRemove
}