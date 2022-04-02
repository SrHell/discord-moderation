// Declare
const fs = require('fs');
const Discord = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purge chat')
        .addStringOption(option => 
            option
                .setName('amount')
                .setDescription('Enter a amount a messages to purge')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            
            let guildData = await interaction.client.findOrCreateGuild(interaction.guild.id);
            if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)) {
                throw new Error("I am Missing Permission: MANAGE_MESSAGES")
            }
            const moderator = interaction.guild.members.cache.get(interaction.user.id);
            if (!moderator.permissions.has(Discord.Permissions.FLAGS.MANAGE_MESSAGES)){
                throw new Error("You are Missing Permission: MANAGE_MESSAGES")
            }
            let amount = interaction.options.getString('amount');
            const msgAmtCleared = new Discord.MessageEmbed()
                .setTitle("PURGE")
                .setColor(guildData.embedColour)
                .addField(`${moderator.user.username} Cleared `, `${amount} messages.`)
                .setTimestamp()
            await interaction.editReply({embeds: [msgAmtCleared], ephemeral: true });
            let logs = interaction.guild.channels.cache.find(c => c.id === guildData.moderationLogChannel)
            logs.send({embeds: [msgAmtCleared.addField(`Channel`, `${interaction.channel}`)]})
            await interaction.channel.bulkDelete(amount);
        } catch (e) {
            interaction.editReply({ content: `${e}`, ephemeral: false })
        }
    }
}