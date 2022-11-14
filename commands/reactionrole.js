const { SlashCommandBuilder, PermissionsBitField} = require('discord.js');

/**
 * Command that turns given message into reaction role message.
 */

const requiredPermissions = [PermissionsBitField.Flags.Administrator];

const execute = async (interaction) => {
    if (!interaction.member.permissions.has(requiredPermissions)) {
        console.log("Non-admin tried to use reactionrole command.");
        return;
    }
    await interaction.reply(`Command not yet implemented.`);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reactionrole')
        .setDescription('Turns given message into reaction role message.'),
    execute,
};
