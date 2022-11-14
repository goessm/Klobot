const {SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
const reactionRoleMessageGroup = require('./subcommands/reactionrole/reactionRoleMessageGroup.js');

/**
 * Command that turns given message into reaction role message.
 */

const requiredPermissions = PermissionFlagsBits.Administrator;
const allowInDMs = false;
const subCommandGroups = [reactionRoleMessageGroup];
const subCommands = [];

const data = new SlashCommandBuilder()
    .setName('reactionrole')
    .setDescription('Turns given message into reaction role message.')
    .setDefaultMemberPermissions(requiredPermissions)
    .setDMPermission(allowInDMs)
    .addSubcommandGroup(subCommandGroups[0].subCommandGroup);

const execute = async (interaction) => {
    // Handle subcommand groups
    const subCommandGroup = interaction.options.getSubcommandGroup()
    if (subCommandGroup) {
        for (const group of subCommandGroups) {
            if (group.name === subCommandGroup) {
                await group.execute(interaction);
                return;
            }
        }
    }

    // Handle direct subcommands
    const subCommand = interaction.options.getSubcommand();
    if (subCommand) {
        for (const sub of subCommands) {
            if (sub.name === subCommandGroup) {
                sub.execute(interaction);
                return;
            }
        }
    }
    await interaction.reply(`Command not found.`);
}

module.exports = {
    data, execute,
};
