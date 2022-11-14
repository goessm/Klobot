/**
 * Subcommand reactionrole message add
 */
const name = 'add';

const subCommand = (subcommand) =>
    subcommand
        .setName(name)
        .setDescription('Add reaction roles to given message')

const execute = async (interaction) => {
    await interaction.reply(`Add command not yet implemented.`);
}

module.exports = {
    name,
    subCommand,
    execute,
}