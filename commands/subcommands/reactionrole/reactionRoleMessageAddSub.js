/**
 * Subcommand reactionrole message add
 */
const {ActionRowBuilder, Events, SelectMenuBuilder, SlashCommandMentionableOption, Collection, TextInputBuilder, TextInputStyle,
    ModalBuilder,
    ButtonBuilder, ButtonStyle,
    SelectMenuOptionBuilder
} = require("discord.js");
const reactionRoleStorage = require("../../../actions/reactionRoleStorage");
const guildUtils = require("../../../utils/guildUtils");

const name = 'add';
const messageModalId = 'modal-reactionrole-message-add-getmessage';
const messageInputId = 'input-reactionrole-message';
const roleSelectMenuId = 'select-reactionrole-message-add-roles'

const subCommand = (subcommand) =>
    subcommand
        .setName(name)
        .setDescription('Add reaction roles to given message')

const execute = async (interaction) => {
    // Keeps a reference to the currently active interaction object
    const interactionRef = {
        current: interaction
    }
    const noBotReactions = interaction.options.getBoolean('nobotreactions');
    // Get Message
    const message = await _getMessageWithModal(interactionRef);
    if (!message) return;
    // Get Emojis
    const emojis = await _getEmojisFromMessage(message);
    if (emojis.length === 0) {
        interactionRef.current.reply({ content: 'React to the message with emojis first!', ephemeral: true});
        return;
    }
    // Get Roles
    const emojiRoles = await _getRolesWithSelectMenu(emojis, interactionRef);
    // React to message
    if (!noBotReactions) {
        emojiRoles.forEach((value, key, map) => {
            message.react(key);
        })
    }
    // Save reaction role data
    const reactionRoleData = {
        guildId: message.guildId,
        channelId: message.channelId,
        messageId: message.id,
        roles: [...emojiRoles]
    }
    await reactionRoleStorage.addData(reactionRoleData);
}

const _getMessageWithModal = async (interactionRef) => {
    await _showGetMessageIdModal(interactionRef.current);
    const modalInteraction = await _getNextModalInteraction(interactionRef.current, messageModalId);
    interactionRef.current = modalInteraction;
    return await _getMessageFromModalInput(modalInteraction);
}

const _getEmojisFromMessage = async (message) => {
    const emojis = message.reactions.cache.keys();
    return [...emojis];
}

const _getRolesWithSelectMenu = async (emojis, interactionRef) => {
    const emojiRoles = new Map();
    if (emojis.size < 1) return emojiRoles;
    const selectMenu = new SelectMenuBuilder()
        .setCustomId(roleSelectMenuId)
        .setPlaceholder('Select role for emoji')

    const clientMember = await guildUtils.getClientMember(interactionRef.current.guild);
    const highestClientRole = clientMember.roles.highest;
    const roles = interactionRef.current.guild.roles.cache.values();
    for (const role of roles) {
        if (role.permissions.has('Administrator')) continue; // Exclude admin roles
        if (role.managed) continue; // Exclude managed roles
        if (role.comparePositionTo(highestClientRole) >= 0) continue; // Exclude roles above bot role
        const option = new SelectMenuOptionBuilder()
            .setValue(role.id)
            .setLabel(role.name);
        selectMenu.addOptions(option);
    }

    const actionRow = new ActionRowBuilder()
        .addComponents(selectMenu);

    let menuMessage;
    for (const emoji of emojis) {
        if (!menuMessage) {
            menuMessage = await interactionRef.current.reply({ content: 'Select role for emoji: ' + emojis[0], components: [actionRow], ephemeral: true, fetchReply: true});
        } else {
            interactionRef.current.update({ content: 'Select role for emoji: ' + emoji});
        }
        const filter = (i) => i.customId === roleSelectMenuId && i.user.id === interactionRef.current.user.id;
        interactionRef.current = await menuMessage.awaitMessageComponent({ filter, time: 150_000 });
        const selectedRole = interactionRef.current.values[0];
        emojiRoles.set(emoji, selectedRole);
    }
    interactionRef.current.update({ content: 'Roles set.', components: []})
    return emojiRoles;
}

const _showGetMessageIdModal = async (interaction) => {
    const modal = new ModalBuilder()
        .setCustomId(messageModalId)
        .setTitle('Choose message');

    const messageIdInput = new TextInputBuilder()
        .setCustomId(messageInputId)
        .setLabel("Enter message ID")
        .setStyle(TextInputStyle.Short);

    const actionRow = new ActionRowBuilder().addComponents(messageIdInput);

    modal.addComponents(actionRow);

    await interaction.showModal(modal);
}

const _getNextModalInteraction = async (interaction, modalId) => {
    // Listen for modal submit
    const filter = (i) => i.customId === modalId && i.user.id === interaction.user.id;
    return await interaction.awaitModalSubmit({ filter, time: 15_000 });
}

const _getMessageFromModalInput = async (interaction) => {
    const messageId = interaction.fields.getTextInputValue(messageInputId);
    if (isNaN(parseInt(messageId))) return null;
    try {
        return await interaction.channel.messages.fetch(messageId);
    } catch (e) {
        await interaction.reply({ content: 'Message not found.', ephemeral: true});
        return null;
    }

}

const _getNextButtonInteraction = async (interaction, buttonId) => {
    // Listen for button
    const filter = (interaction) => interaction.customId === buttonId && interaction.user.id === interaction.user.id;
    const collector = interaction.channel.createMessageComponentCollector({filter, time: 15_000});
    collector.on('collect', async i => {
        console.log('button pressed')
    });

}

module.exports = {
    name,
    subCommand,
    execute,
}