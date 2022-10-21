/**
 * Run this script to deploy/refresh all slash commands inside commands/ to Discord.
 * It only needs to be run once, unless commands are added / removed.
 */

const dotenv = require('dotenv')
dotenv.config();
const { REST, Routes } = require('discord.js');
const { clientId, guildId, TOKEN} = process.env;
const fs = require('node:fs');

const commands = [];

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Refresh all commands
        const data = await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();
