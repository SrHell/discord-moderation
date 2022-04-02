module.exports = async (client, member) => {
    client.findOrCreateGuild(member.guild.id)
    const guilddata = await client.guildModel.findOne({ where: { guildID: member.guild.id } });
    if (Date.now() - member.user.createdAt < 1000*60*60*24*2 == true && guilddata.antiRaidStatus == true) {
    	member.ban("This account is younger than 2 days old")
  	}
}