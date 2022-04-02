//> Dependencies
const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deploy')
		.setDescription('Deploy Slash Guild Slash commands in a guild.')
        .addStringOption(option => 
            option
                .setName('guildid')
                .setDescription('The title in the embed.')
                .setRequired(true)
        ),
	async execute(interaction, client) {
        try {
            let slash_cmds = [];
            const commandFiles = fs.readdirSync(path.join(__dirname, "./../application_commands")).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const slashcommand = require(path.join(__dirname, `../application_commands/${file}`));
                slash_cmds.push(slashcommand.data.toJSON());
            }
            const rest = new REST({ version: '9' }).setToken(process.env.token);
            (async () => {
                try {
                    let guildID = interaction.options.getString('guildid');
                    await rest.put(Routes.applicationGuildCommands(process.env.clientID, guildID), { body: slash_cmds }, );
                    interaction.editReply('Deployed Slash Guild Slash commands in the guild.');
                    
                } catch (error) {
                    console.error(error);
                }
            })();
        } catch (e) {
            console.log(e)
        }
    }
}