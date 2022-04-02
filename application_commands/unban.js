const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('unban a user from the guild')
        .addStringOption(option => 
            option
                .setName('userid')
                .setDescription('Enter a userid')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('Enter a reason')
        ),
	async execute(interaction) {
		try {
			const memberid = interaction.options.getUser('userid');
			const reason = interaction.options.getString('reason') || "No Reason Provided";
	
			if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
				throw new Error("I am Missing Permission: BAN_MEMBERS")
			}
			const moderator = interaction.guild.members.cache.get(interaction.user.id);
			if (!moderator.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)){
				throw new Error("You are Missing Permission: BAN_MEMBERS")
			}
			if (memberid === interaction.user.id) {
				throw new Error("You aren't able to unban yourself.");
			}
			member.send(`Hello, you have been **UNBANNED** from **${interaction.guild.name}** for: **${reason}**`).catch(err =>{
				throw new Error("I have unbanned them but can't send them a message.")
			})
            interaction.guild.members.unban(memberid)
			let guildData = await client.findOrCreateGuild(interaction.guild.id)
			let unbanembed = new Discord.MessageEmbed()
				.setTitle("**USER UNBANNED**")
				.setColor(guildData.embedColour)
				.setFooter({ text: interaction.client.config.defaults.embedFooter,  iconURL: interaction.client.user.displayAvatarURL()})
				.setThumbnail(interaction.client.user.displayAvatarURL({ size: 2048 }))
				.addField("UserID:", memberid)
				.addField("Moderator:", interaction.user.username)
				.addField("Reason", reason)
			interaction.editReply({embeds: [unbanembed] })
			let moderationLog = guildData.get('moderationLogChannel')
			let logs = interaction.guild.channels.cache.find(c => c.id === moderationLog)
			logs.send({embeds: [unbanembed] })
		} catch (e) {
			interaction.editReply(`${e}`);
		}
	},
};