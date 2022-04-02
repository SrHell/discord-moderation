const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")
const ms = require("ms")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('antiraid')
		.setDescription('antiraid a user from the guild')
        .addStringOption(option => 
            option
                .setName('length')
                .setDescription('Enter a length of time')
        ),
	async execute(interaction) {
		try {
            async function timeout(interaction, timeInMs) {
                setTimeout( async () => {
                    let guildData = await interaction.client.findOrCreateGuild(interaction.guild.id);
                    await interaction.client.GuildSchema.findOneAndUpdate(
                        {
                            guildID: interaction.guild.id,
                        },
                        {
                            guildID: interaction.guild.id,
                            antiRaidStatus: false
                        },
                        {
                            upsert: true,
                            new: true
                        }
                    );	    
                    const embed = new Discord.MessageEmbed()
                    .setTitle('**AntiRaid**')
                    .setColor(guildData.embedColour)
                    .setDescription(`**ANTI RAID HAS BEEN DEACTIVATED**`)
                    .setThumbnail(interaction.client.user.displayAvatarURL({ size: 2048 }))
                    .setFooter({ text: interaction.client.config.defaults.embedFooter,  iconURL: interaction.client.user.displayAvatarURL()})
                    .setTimestamp();
                    interaction.editReply({embeds: [embed]})
                    let logs = interaction.guild.channels.cache.find(c => c.id === guildData.moderationLogChannel)
                    logs.send({embeds: [embed] })
                }, timeInMs);
            }
            let guildData = interaction.client.findOrCreateGuild(interaction.guild.id)
			if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_MEMBERS)) {
				throw new Error("I am Missing Permission: MANAGE_MEMBERS")
			}
			if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.MANAGE_CHANNELS)) {
				throw new Error("I am Missing Permission: MANAGE_CHANNELS")
			}
			if(!interaction.guild.me.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) {
				throw new Error("I am Missing Permission: BAN_MEMBERS")
            }
            const length = interaction.options.getString('length');
            if (length == null) {
                const embed = new Discord.MessageEmbed()
                    .setTitle('**AntiRaid**')
                    .setColor(guildData.embedColour)
                    .setThumbnail(interaction.client.user.displayAvatarURL({ size: 2048 }))
                    .setFooter({ text: interaction.client.config.defaults.embedFooter,  iconURL: interaction.client.user.displayAvatarURL()})
                    .setTimestamp();              
                let guildData = await interaction.client.guildModel.findOne({ where: {guildID: interaction.guild.id}})
                let state = guildData.get('antiRaidStatus')
                if (state == true) {
                    embed.setDescription(`**ANTI RAID HAS BEEN DEACTIVATED**`)
                    let guildData = await interaction.client.findOrCreateGuild(interaction.guild.id);
                    await interaction.client.GuildSchema.findOneAndUpdate(
                        {
                            guildID: interaction.guild.id,
                        },
                        {
                            guildID: interaction.guild.id,
                            antiRaidStatus: false
                        },
                        {
                            upsert: true,
                            new: true
                        }
                    );	    
                } else {
                    embed.setDescription(`**ANTI RAID HAS BEEN ACTIVATED**`)
                    let guildData = await interaction.client.findOrCreateGuild(interaction.guild.id);
                    await interaction.client.GuildSchema.findOneAndUpdate(
                        {
                            guildID: interaction.guild.id,
                        },
                        {
                            guildID: interaction.guild.id,
                            antiRaidStatus: true
                        },
                        {
                            upsert: true,
                            new: true
                        }
                    );	    
                }
                let logs = interaction.guild.channels.cache.find(c => c.id === guildData.moderationLogChannel)
                logs.send({embeds: [embed] })
                return interaction.editReply({embeds: [embed], fetchReply: true})
            } else {
                const timeInMs = ms(length);
                const embed = new Discord.MessageEmbed()
                .setTitle('**AntiRaid**')
                .setColor(guildData.embedColour)
                .setThumbnail(interaction.client.user.displayAvatarURL({ size: 2048 }))
                .setFooter({ text: interaction.client.config.defaults.embedFooter,  iconURL: interaction.client.user.displayAvatarURL()})
                .setTimestamp();
                if (timeInMs / 60000 == 1) {
                    embed.setDescription(`**ANTI RAID HAS BEEN ACTIVATED FOR ${timeInMs / 60000} MINUTE**`)
                } else {
                    embed.setDescription(`**ANTI RAID HAS BEEN ACTIVATED FOR ${timeInMs / 60000} MINUTES**`)
                }
                interaction.editReply({embeds: [embed], fetchReply: true})
                let guildData = await interaction.client.findOrCreateGuild(interaction.guild.id);
                await interaction.client.GuildSchema.findOneAndUpdate(
                    {
                        guildID: interaction.guild.id,
                    },
                    {
                        guildID: interaction.guild.id,
                        antiRaidStatus: true
                    },
                    {
                        upsert: true,
                        new: true
                    }
                );	    
                timeout(interaction, timeInMs)
                let logs = interaction.guild.channels.cache.find(c => c.id === guildData.moderationLogChannel)
                logs.send({embeds: [embed] })
            }
        } catch (e) {
            console.log(`${e}`)
            interaction.editReply(`${e}`)
        }
	},
};
