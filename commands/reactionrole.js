const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

/**
 * Command that turns given message into reaction role message.
 */

const requiredPermissions = PermissionFlagsBits.Administrator;
const allowInDMs = false;

const execute = async (interaction) => {
    await interaction.reply(`Command not yet implemented.`);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Turns given message into reaction role message.')
        .setDefaultMemberPermissions(requiredPermissions)
        .setDMPermission(allowInDMs),
    execute,
};
