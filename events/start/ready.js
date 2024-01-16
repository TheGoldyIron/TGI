const Discord = require("discord.js");

const { connectDB } = require("../../utils/database/databaseHandler.js");

module.exports = {
    name: "ready",
    once: true,

    async execute(client) {
        console.log(`Logged in as ${client.user.tag}!`);

        client.user.setPresence({
            activities: [
                {
                    name: "TGI",
                    type: "PLAYING"
                }
            ],
            status: "busy"
        })

        try {

            // Connect to the database
            connectDB();

            // REMOVE THIS IF ONLY ONE GUILD/SERVER
            const guilds = client.guilds.cache;
            guilds.forEach(async guild => {
                const guildId = guild.id;
                await client.guilds.cache.get(guildId).commands.set(client.commands);
                console.log(`Slash commands for ${guild.name} (${guildId} - ${guild.memberCount})`);
            });
        } catch (e) {
            console.error(e);
        }
    }
}