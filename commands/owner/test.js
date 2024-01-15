const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "test",
    description: "Test command",
    category: "owner",
    options: [
        {
            name: "test",
            description: "test",
            type: 3,
            required: true
        },
    ],

    execute: async (interaction = new CommandInteraction()) => {
        try {
            await interaction.reply(`Command ran ok!`);
        } catch (e) {
            console.log(e);
        }
    },
}