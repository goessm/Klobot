/**
 * Subcommand reactionrole message remove
 */
const name = 'remove';

const subCommand = (subcommand) =>
    subcommand
        .setName(name)
        .setDescription('Remove reaction roles from given message')

const execute = async (interaction) => {
    await interaction.reply(`Remove command not yet implemented.`);
}

module.exports = {
    name,
    subCommand,
    execute,
}