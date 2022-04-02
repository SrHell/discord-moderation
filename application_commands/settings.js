const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Configure the database.'),
	async execute(interaction) {
        let guildData = await interaction.client.ConsultSchema.findOneAndUpdate(
            {
                guildID: interaction.guild.id,
            },
            {
                guildID: interaction.guild.id,
                guildConsultParentCategoryID: '956461203771752490',
                guildConsultSupportRoleID: '927072366381649951',
            },
            {
                upsert: true,
                new: true
            }
        );
        interaction.editReply(`This command does nothing.`)
	}
};