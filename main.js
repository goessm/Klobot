const dotenv = require('dotenv')
dotenv.config();
const fs = require('node:fs');
const path = require('node:path');
const {Client, Collection, GatewayIntentBits, Partials} = require('discord.js');
const {loadEventFiles} = require("./actions/loadEventFiles");
const {loadCommandFiles} = require("./actions/loadCommandFiles");
const TOKEN = process.env.TOKEN;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessageReactions],
    partials: [Partials.Message, Partials.Reaction, Partials.User],
});

const start = (client) => {
    loadEventFiles(client);
    loadCommandFiles(client);

    // Log in to Discord
    client.login(TOKEN).then(r => console.log("Client exited with message: " + r));
}

start(client);