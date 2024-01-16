const Discord = require("discord.js");

const PERMISSION_LIST = [
    "ADMINISTRATOR",
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "MANAGE_MESSAGES",
];

module.exports = {
    name: "interactionCreate",
    once: false,

    async execute(interaction, client) {
        if (!interaction.isCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        // Check whether the user has the required permissions to use the command and/or have the ownerID.
        if (command.ownerID && !command.ownerID.includes(interaction.user.id)) return await interaction.reply({ content: "You are not allowed to use this command!", ephemeral: true });
        if (command.permissions && !command.permissions.some(p => interaction.member.permissions.has(p))) return await interaction.reply({ content: "You are not allowed to use this command!", ephemeral: true });

        try {
            await command.execute(interaction);
        } catch (e) {
            await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            console.log(e);
        }
    }
}