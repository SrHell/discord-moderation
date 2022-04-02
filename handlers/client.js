const { Collection } = require("discord.js");

module.exports = async (client) => {
    client.config = require("../config.js");
    client.slashcommands = new Collection();
    client.slash_cmds = [];
}