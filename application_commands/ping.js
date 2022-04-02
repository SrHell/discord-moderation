const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
        let guildData = await interaction.client.findOrCreateGuild(interaction.guild.id);
		const pingEmbed = new Discord.MessageEmbed()
        .setColor(guildData.embedColour)
        .setTitle(`Ping!`)
        .addField(`Bot Latency`, `\`Pinging...\``, true)
        .addField(`API Latency`, `\`${Math.round(interaction.client.ws.ping)}ms\``, true)
    const pingMessage = await interaction.editReply({embeds: [pingEmbed], ephemeral: true , fetchReply: true})
    var ping = pingMessage.createdTimestamp - interaction.createdTimestamp;

    const pongEmbed = new Discord.MessageEmbed()
		.setColor(guildData.embedColour)
        .setTitle(`Pong!`)
        .addField(`Bot Latency`, `\`${ping}ms\``, true)
        .addField(`API Latency`, `\`${Math.round(interaction.client.ws.ping)}ms\``, true)
        .setFooter({ text: guildData.embedFooter, iconURL: interaction.client.user.displayAvatarURL()})
        .setTimestamp();
    return interaction.editReply({embeds: [pongEmbed], ephemeral: true });
	}
};