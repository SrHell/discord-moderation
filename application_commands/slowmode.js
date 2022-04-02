const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require("ms")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('slowmode')
		.setDescription('Set the slowmode of the current channel.')
    .addStringOption(option => 
        option
            .setName('length')
            .setDescription('The length of the slowmode.')
            .setRequired(true)
    ),
	async execute(interaction) {
    if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
        throw new Error("I am Missing Permission: MANAGE_CHANNELS")
    }
    const user = interaction.guild.members.cache.get(interaction.user.id);
    if (!user.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)){
        throw new Error("You are Missing Permission: MANAGE_CHANNELS")
    }
    let duration = interaction.options.getString('length');
    await interaction.channel.setRateLimitPerUser(duration)
    let guildData = await interaction.client.findOrCreateGuild(interaction.guild.id);
    let embed = new Discord.MessageEmbed()
      .setTitle(`**SLOWMODE**\n Slowmode has been changed in ${interaction.channel.name}\n Interval: ${duration == 1 ? `${duration} second` : `${duration} seconds`}\n Started by: ${interaction.user.tag}`)
      .setColor(`${guildData.embedColour}`)
      .setFooter( { text: `${guildData.embedFooter}`, iconURL: `${interaction.client.user.displayAvatarURL()}` } )
    interaction.editReply({embeds: [embed]})
    console.log(`Slowmode has been changed by ${interaction.user.tag} in ${interaction.channel.name} at a interval of ${duration}`)
    let logs = interaction.guild.channels.cache.find(c => c.id === guildData.moderationLogChannel)
    if (logs) {
      logs.send({embeds: [embed] })
    }
  }
}