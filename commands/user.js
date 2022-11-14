const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('joinage')
        .setDescription('Shows when you joined the server.'),
    async execute(interaction) {
        await interaction.reply(`${interaction.user.username} joined on ${interaction.member.joinedAt}.`);
    },
};
