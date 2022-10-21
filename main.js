const dotenv = require('dotenv')
dotenv.config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Partials} = require('discord.js');
const TOKEN = process.env.TOKEN;

const loadEventFiles = () => {
    const eventsPath = path.join(__dirname, 'events');
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (!('name' in event && 'execute' in event)) {
            console.log(`[WARNING] The event at ${filePath} is missing a required "name" or "execute" property.`);
            continue;
        }
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
    }
}

const loadCommandFiles = () => {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, 'commands');
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

// Create a new client instance
const client = new Client({
    intents: [GatewayIntentBits.Guilds],
    partials: [Partials.Message, Partials.Reaction],
});

// Load events and commands
loadEventFiles();
loadCommandFiles();



// Log in to Discord
client.login(TOKEN).then(r => console.log("Client exited with message: " + r));
