const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType } = require('discord.js')
const fs = require('fs');
const { jsons:{config}, db:{guilds}  } = require("../../index")

module.exports = {
    name: "channel",
    description: "configurar servidor!",
    type: 1,
    options: [
      {
        name: 'lock',
        description: 'Trancar chat',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'unlock',
        description: 'Destrancar chat',
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: 'nuke',
        description: 'Exclui o canal e o clona para que os pings sejam removidos.',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'canal',
                type: ApplicationCommandOptionType.Channel,
                description: 'Canal para o nuke',
                channelTypes: [
                    ChannelType.GuildText
                ],
            },
        ],
      },
      {
        name: 'clonar',
        description: 'Clone qualquer canal do servidor.',
        type: ApplicationCommandOptionType.Subcommand,
        options: [
            {
                name: 'canal',
                type: ApplicationCommandOptionType.Channel,
                description: 'Canal para o nuke',
                channelTypes: [
                    ChannelType.GuildText
                ],
            },
        ],
      },
      
  ],
    defaultMemberPermissions: PermissionFlagsBits.ManageChannels,
    execute: async (interaction, client) => {
        const subcommand = interaction.options.getSubcommand();

        if(subcommand === "lock"){
            interaction.reply(`Este chat foi bloqueado com êxito por ${interaction.user}.`).then(() => {
                interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: false })
            }).catch(err => {
                interaction.reply("Houve algum erro! Error: "+ err);
            });
        }else if(subcommand === "unlock"){
            interaction.reply(`Este chat foi bloqueado com êxito por ${interaction.user}.`).then(() => {
                interaction.channel.permissionOverwrites.edit(interaction.guild.id, { SendMessages: true })
            }).catch(err => {
                interaction.reply("Houve algum erro! Error: "+err);
            });
        }else if(subcommand === "nuke"){
            const channel = interaction.options.getChannel('canal') || interaction.channel
            const clone = await channel.clone();
            await clone.setPosition(channel.position);
            await channel.delete();
            clone.send(`**Nuked por** ${interaction.user}`)
        }else if(subcommand === "clonar"){
            const channel = interaction.options.getChannel('canal') || interaction.channel
            const clone = await channel.clone();
            clone.send(`**Clonado por** ${interaction.user}`)
        }
    }
}