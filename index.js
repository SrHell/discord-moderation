//> Dependencies
const { Client, Intents } = require('discord.js');
require('dotenv').config();

// Initialize Discord Client
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_WEBHOOKS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGE_TYPING
    ]
});

//> Handlers
(async () => {
    await require("./handlers/client")(client);
    await require("./handlers/backup")(client);
    await require("./handlers/slash_commands")(client);
    await require("./handlers/events")(client);
})();

//> Mainline
client.login(process.env.token).catch(error => {
    console.log("\x1b[31mYour bot token is incorrect! Shutting Down.....\x1b[39m");
    process.exit()
});