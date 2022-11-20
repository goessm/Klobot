const {Collection} = require("discord.js");
const path = require("node:path");
const fs = require("node:fs");

const loadCommandFiles = (client) => {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '/../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if (!('data' in command && 'execute' in command)) {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
            continue;
        }
        client.commands.set(command.data.name, command);
    }
}

module.exports = {
    loadCommandFiles
}