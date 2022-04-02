module.exports = async (client, interaction) => {
    try {
        if (interaction.isCommand()) {
            try {
                const command = client.slashcommands.get(interaction.commandName);
                if (!command) return;
                await interaction.deferReply();
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                try {
                    await interaction.deferReply();
                } catch (err) {
                    if (!err.name == "Error [INTERACTION_ALREADY_REPLIED]") return console.error(err);
                }
                await interaction.editReply({ content: `There was an error while executing this command! Error: ${error}`, ephemeral: true });
            }
        }
    } catch (e) { return console.log(e); }
}