const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('ban a user from the guild')
        .addUserOption(option => 
            option
                .setName('member')
                .setDescription('Select a user')
                .setRequired(true)
        )
        .addStringOption(option => 
            option
                .setName('reason')
                .setDescription('Enter a reason')
        ),
	async execute(interaction) {
		try {
			let guildData = await client.findOrCreateGuild(interaction.guild.id)
			const member = interaction.options.getUser('member')
			const memberid = interaction.options.getUser('member').id;
			const guildMember = interaction.guild.members.cache.get(memberid);
			const reason = interaction.options.getString('reason') || "No Reason Provided";
	
			if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
				throw new Error("I am Missing Permission: BAN_MEMBERS")
			}
			const moderator = interaction.guild.members.cache.get(interaction.user.id);
			if (!moderator.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)){
				throw new Error("You are Missing Permission: BAN_MEMBERS")
			}
			if (memberid === interaction.user.id) {
				throw new Error("You aren't able to ban yourself.");
			}
			if (!guildMember) {
				throw new Error("I can't find that user.");
			}
			if (guildMember.roles.highest.position >= moderator.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
				throw new Error("You can't ban this member due to your role being lower or equal than that member role.");
			}
			member.send(`Hello, you have been **BANNED** from **${interaction.guild.name}** for: **${reason}**`).catch(err =>{
				throw new Error("I have banned them but can't send them a message.")
			})
			interaction.guild.bans.create(memberid, { days: 0, reason: `Banned By: ${interaction.user.tag} Reason: ${reason}` })
			console.log(`${member.username  + '#' + member.discriminator} has been banned by ${interaction.user.username} for reason: ${reason}`)
	
			let banembed = new Discord.MessageEmbed()
				.setTitle("**USER BANNED**")
				.setColor(guildData.embedColour)
				.setFooter({ text: interaction.client.config.defaults.embedFooter,  iconURL: interaction.client.user.displayAvatarURL()})
				.setThumbnail(interaction.client.user.displayAvatarURL({ size: 2048 }))
				.addField("User:", member.username +  '#' + member.user.discriminator)
				.addField("Moderator:", interaction.user.username)
				.addField("Reason", reason)
			interaction.editReply({embeds: [banembed] })
			let moderationLog = guildData.get('moderationLogChannel')
			let logs = interaction.guild.channels.cache.find(c => c.id === moderationLog)
			logs.send({embeds: [banembed] })
		} catch (e) {
			interaction.editReply(`${e}`);
		}
	},
};