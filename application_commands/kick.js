const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('kick a user from the guild')
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
		const member = interaction.options.getUser('member')
        const memberid = interaction.options.getUser('member').id;
        const reason = interaction.options.getString('reason') || "No Reason Provided";

        if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
            throw new Error("I am Missing Permission: KICK_MEMBERS")
        }
        const moderator = interaction.guild.members.cache.get(interaction.user.id);
        if (!moderator.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)){
            throw new Error("You are Missing Permission: KICK_MEMBERS")
        }
		if (memberid === interaction.user.id) {
			throw new Error("You aren't able to kick yourself.");
	    }
		if (member.roles.highest.position >= moderator.roles.highest.position && interaction.user.id !== interaction.guild.ownerId) {
			throw new Error("You can't kick this member due to your role being lower or equal than that member role.");
		}

		member.send(`Hello, you have been **KICKED** from **${message.guild.name}** for: **${reason}**`);
		member.kick(`Kicked By: ${message.author.tag} Reason: ${reason}`);
		console.log(`${member.user.username  + '#' + member.user.discriminator} has been kicked by ${message.author.username} for reason: ${reason}`)

        let guildData = await client.findOrCreateGuild(interaction.guild.id)
		let kickembed = new MessageEmbed()
			.setTitle("**USER KICKED**")
			.setColor(guildData.embedColour)
			.setFooter({ text: interaction.client.config.defaults.embedFooter,  iconURL: interaction.client.user.displayAvatarURL()})
			.setThumbnail(interaction.client.user.displayAvatarURL({ size: 2048 }))
			.addField("User:", member.user.username +  '#' + member.user.discriminator)
			.addField("Moderator:", message.author.username)
			.addField("Reason", reason)
		interaction.editReply({embeds: [kickembed] })
        let moderationLog = guildData.get('moderationLogChannel')
		let logs = interaction.guild.channels.cache.find(c => c.id === moderationLog)
        logs.send({embeds: [kickembed] })
	},
};