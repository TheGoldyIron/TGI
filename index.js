const Discord = require("discord.js");
const fs = require("fs");

const client = new Discord.Client({
    intents: [
        Discord.GatewayIntentBits.MessageContent,
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildMessageReactions,
        Discord.GatewayIntentBits.GuildMembers
        //Discord.GatewayIntentBits.GuildVoiceStates        // Activate this if music
        //Discord.GatewayIntentBits.GuildPresences          // Active this if presences should be used and/or collected
    ],
});

require("dotenv").config();
client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
    const categoryFiles = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith(".js"));

    for (const file of categoryFiles) {
        const command = require(`./commands/${folder}/${file}`);    // Allows folders and subfolders
        client.commands.set(command.name, command);
        console.log(`Loaded command ${command.name}.js`);
    }
}

client.on("ready", () => {
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
});

client.on("interactionCreate", async interaction => {


    if (!interaction.isCommand()) return;                               // Check whether the interation is a command
    const command = client.commands.get(interaction.commandName);       // Loads the command
    if (!command) return;                                               // Check if the command loaded correctly

    try {
        await command.execute(interaction);
    } catch (e) {
        await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
        console.log(e);
    }
});

client.login(process.env.TOKEN);
