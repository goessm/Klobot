const {PermissionsBitField} = require("discord.js");
/**
 * Returns member object of client in given guild.
 */
const getClientMember = async (guild) => {
    return await guild.members.fetch(guild.client.user.id);
}


/**
 * Returns whether the client has given permission in given guild
 */
const checkClientPermission = async (guild, permission) => {
    const clientMember = await getClientMember(guild);
    return clientMember.permissions.has(permission);
}

module.exports = {
    getClientMember,
    checkClientPermission,
}