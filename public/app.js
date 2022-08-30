/**
 * global imports
 */
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require ('dotenv');
dotenv.config();

/**
 * Register a slash command against the Discord API
 * Commands are retreived from ./commands/ directory
 */
const { REST, Routes } = require('discord.js');

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  commands.push(command.data.toJSON());
}
 
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);
 
rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: commands })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);

/**
 * Delete command
 * Change the command_id variable with the command id to delete
 */

const command_id = "";
if (command_id !== "") {
  rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, command_id))
    .then(() => console.log('Successfully deleted application commad'))
    .catch(console.error);
}


/**
 * Create bot commands from ./commands/ directory and bot events from ./events/ directory
 */
 const { Client, Collection, GatewayIntentBits } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers] });

client.commands = new Collection();
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventsFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventsFiles) {
  const filePath = path.join(eventsPath, file);
  const event = require(filePath);
  if (event.once)
    client.once(event.name, (...args) => event.execute(...args));
  else
    client.on(event.name, (...args) => event.execute(...args));
}

client.login(process.env.BOT_TOKEN);