const Discord = require("discord.js");
const fs = require("fs");

// Test123

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

const PERMISSION_LIST = [
    "ADMINISTRATOR",
    "CREATE_INSTANT_INVITE",
    "KICK_MEMBERS",
    "BAN_MEMBERS",
    "MANAGE_CHANNELS",
    "MANAGE_GUILD",
    "MANAGE_MESSAGES",
];

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
});

client.login(process.env.TOKEN);
