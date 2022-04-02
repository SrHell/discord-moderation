module.exports = async (client) => {
    client.user.setStatus(`online`);
    let guild = await client.guilds.cache.get(process.env.guildID);
    if (guild) {
        client.user.setActivity(`over ${guild.name}`, { type: "WATCHING" });
    }
    console.log(`${client.user.username} is online!`)
}
