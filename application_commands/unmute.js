const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require("ms")
module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmute Members')
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('Select a user')
                .setRequired(true)
        ),
	async execute(interaction) {
        const memberid = interaction.options.getUser('member').id;
        const member = interaction.guild.members.cache.get(memberid);
        try {
            let guildData = await interaction.client.findOrCreateGuild(interaction.guild.id);
            let length = "1s"
            let reason = "Timeout Unmute"
            const timeInMs = ms(`${length}`);
            if (!timeInMs) {
                throw new Error("Invalid time format!");
            }
            if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.TIMEOUT_MEMBERS)) {
                throw new Error("I am Missing Permission: TIMEOUT_MEMBERS")
            }
            const moderator = interaction.guild.members.cache.get(interaction.user.id);
            if (!moderator.permissions.has(Discord.Permissions.FLAGS.TIMEOUT_MEMBERS)){
                throw new Error("You are Missing Permission: TIMEOUT_MEMBERS")
            }
            try {
                member.timeout(timeInMs, reason)
            } catch (err) {
                return interaction.editReply({ content: `${err}`, ephemeral: false })
            }
    
            member.send(`You have been muted by ${interaction.user.username} in ${interaction.guild.name} for ${length}, for this reason: ${reason}`);   
            console.log(`${member} has been muted by ${interaction.user.username} in ${interaction.guild.name} for ${length} for this reason: ${reason}`)    
            
            let muteEmbed = new Discord.MessageEmbed()
            .setColor(guildData.embedColour)
            .setTitle("**Unmute**")
            .setDescription(`**<@${member.id}> has been unmuted by <@${interaction.user.id}>**`)
            .addField(`**Action:**`, `Unmute`)
            .addField(`**Moderator:**`, `${interaction.user}`)
    
            interaction.editReply({embeds: [muteEmbed], ephemeral: false })
            let logs = interaction.guild.channels.cache.find(c => c.id === guildData.moderationLogChannel)
            logs.send({embeds: [muteEmbed]})
    
        } catch (err) {
            return interaction.editReply({ content: `${err}`, ephemeral: false })
        }
	},
};