//  Configuração Seguraça ENV


const dotenv = require('dotenv')
const path = require('path');
const configPath = path.resolve(__dirname, './Authentication/', '.env');
dotenv.config({ path: configPath });


//  Anti-Crash


//  process.on('unhandRejection', (reason, promise) => {
//    console.log(`🚨 | [Erro]\n\n` + reason, promise);
//  });
//  process.on('uncaughtException', (error, origin) => {
//    console.log(`🚨 | [Erro]\n\n` + error, origin);
//  });
//  process.on('uncaughtExceptionMonitor', (error, origin) => {
//    console.log(`🚨 | [Erro]\n\n` + error, origin);
// });


//  Conexão Discord

const { Client, GatewayIntentBits, Collection, InteractionType } = require('discord.js')

const client = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.GuildModeration,
  GatewayIntentBits.GuildIntegrations,
  GatewayIntentBits.MessageContent,
  GatewayIntentBits.DirectMessages,
  GatewayIntentBits.GuildVoiceStates
]})
client.setMaxListeners(100)


//  Run SlashCommands


client.on('interactionCreate', async(interaction) => {
  if(interaction.type === InteractionType.ApplicationCommand){

    const cmd = client.commands.get(interaction.commandName);

    if(!cmd) return interaction.reply('erro');
    
    interaction["member"] = interaction.guild.members.cache.get(interaction.user.id);

    cmd.execute(interaction, client)
  }

});

client.commands = new Collection();

require('./Handler')(client);
client.login(process.env.TOKEN_DISCORD);


//  DataBase


const { JsonDatabase } = require("wio.db");

const guilds = new JsonDatabase({
  databasePath:"./src/DataBase/guilds.json"
});


const db = { guilds }

// Config
const config = require(`./Configs/config.json`)
const jsons = { config } 
module.exports = { client, jsons, db}
