module.exports = async (client, guild) => {
  client.findOrCreateGuild(guild.id)
}