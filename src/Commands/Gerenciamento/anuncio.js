const { ApplicationCommandOptionType, PermissionFlagsBits, ChannelType, EmbedBuilder } = require('discord.js')
const fs = require('fs');
const { jsons:{config}, db:{guilds}  } = require("../../index")

module.exports = {
    name: "anuncio",
    description: "configurar servidor!",
    type: 1,
    options: [
        {
            name: 'mensagem',
            type: ApplicationCommandOptionType.String,
            description: 'mensagem',
            required: true,
        },
    ],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    execute: async (interaction, client) => {
        const message = interaction.options.getString('mensagem');
        if(config.adms.includes(interaction.user.id)){
            var users = []
            client.guilds.cache.forEach(async(guild) => {
                const members = await guild.members.fetch();

                members.forEach(async (member) => {
                    const membro = await guild.members.fetch(member.user.id)
                    if(membro.permissions.has(PermissionFlagsBits.Administrator) && !membro.user.bot){
                        users.push(membro.user.id)
                         
                    }
                })
            });
            await sleep(5000);
            const usersnot = [...new Set(users)]
            for (const id of usersnot){              
                await sleep(15000);
                const embed = new EmbedBuilder()
                    .setTitle(`Atualização do Bot Vigia`)
                    .setColor(config.color)
                    .setDescription(message)
                    .setTimestamp()
                const user = client.users.cache.get(id)
                try {
                    user.send({embeds: [embed] }).then(() =>{
                        console.log(user.username)
                    }).catch(() => {
                        console.log("Error")
                    })
                } catch (error) {
                    console.log("Error")
                }
                
            }
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
        }
    }
}