const fs = require("fs");
const path = require("path");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
module.exports = async (client) => {
	try {
		const commandFiles = fs.readdirSync(path.join(__dirname, "./../application_commands")).filter(file => file.endsWith('.js'));
        for (const file of commandFiles) {
            const slashcommand = require(path.join(__dirname, `../application_commands/${file}`));
            client.slashcommands.set(slashcommand.data.name, slashcommand);
            client.slash_cmds.push(slashcommand.data.toJSON());
        }
        const rest = new REST({ version: '9' }).setToken(process.env.token);
        (async () => {
            try {
                await rest.put(Routes.applicationGuildCommands(process.env.clientID, process.env.guildID), { body: client.slash_cmds }, );
                
            } catch (error) {
                console.error(error);
            }
        })();
	} catch (e) {
		console.log(e)
	}
};