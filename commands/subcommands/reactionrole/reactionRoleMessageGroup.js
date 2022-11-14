/**
 * SubCommandGroup message of reactionRoleCommand
 */
const subCommandAdd = require('./reactionRoleMessageAddSub');
const subCommandRemove = require('./reactionRoleMessageRemoveSub');

const name = 'message';
const subCommands = [subCommandAdd, subCommandRemove];

const subCommandGroup = (group) =>
    group
        .setName(name)
        .setDescription('message desc test')
        .addSubcommand(subCommandAdd.subCommand)
        .addSubcommand(subCommandRemove.subCommand)

const execute = async (interaction) => {
    const subCommand = interaction.options.getSubcommand();
    console.log("aa " + subCommand);
    for (const sub of subCommands) {
        if (sub.name === subCommand) {
            await sub.execute(interaction);
            return;
        }
    }
    console.log("reactionrole/message called with invalid subcommand");
}

module.exports = {
    name,
    subCommandGroup,
    execute
}