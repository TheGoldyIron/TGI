const { CommandInteraction } = require("discord.js");

module.exports = {
    name: "test",
    description: "Test command",
    category: "owner",
    ownerID: ["303956449011171329", "223832182261547008"],
    permissions: ["ADMINISTRATOR"],
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