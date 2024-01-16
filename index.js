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
const eventFolders = fs.readdirSync("./events");

for (const folder of commandFolders) {
    const categoryFiles = fs.readdirSync(`./commands/${folder}`).filter(f => f.endsWith(".js"));

    for (const file of categoryFiles) {
        const command = require(`./commands/${folder}/${file}`);    // Allows folders and subfolders
        client.commands.set(command.name, command);
        console.log(`Loaded command ${command.name}.js`);
    }
}

for (const e of eventFolders) {
    const eventFiles = fs.readdirSync(`./events/${e}`).filter(f => f.endsWith(".js"));

    for (const file of eventFiles) {
        const event = require(`./events/${e}/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        console.log(`Loaded event ${event.name}.js`);
    }
}

client.login(process.env.TOKEN);
