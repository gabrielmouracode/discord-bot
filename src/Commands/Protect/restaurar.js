const { ChannelType, PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
module.exports = {
    name: "restaurar",
    description: "Restaurar configurações salvas no backup",
    type: 1,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    options: [
        {
          name: 'backup',
          description: 'Arquivo JSON do backup do servidor',
          type: ApplicationCommandOptionType.Attachment,
          required: true,
        },
    ],
    execute: async (interaction, client) => {
        if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Apenas moderadores podem usar essa função.`, ephemeral: true })
        
        const attachment = interaction.options.getAttachment('backup');
        if(attachment.name.endsWith('.json')){
            const response = await axios.get(attachment.url)
            const jsonData = response.data;
            restaurarBackup(interaction.guild, jsonData)
        }else{
            interaction.reply({ content: `Arquivo não pode ser executado pois não é JSON!`, ephemeral: true })
            
        }
        
        async function restaurarBackup(servidor, backupJSON) {

            servidor.channels.cache.forEach(async (canal) => {
                try {
                    await canal.delete();
                  } catch (error) {
                  }
                
            })
            servidor.roles.cache.forEach(async (role) => {
                try {
                    await role.delete();
                  } catch (error) {
                  }
                
            })
            
            const dadosServidor = backupJSON
            async function executarForEach() {
                
                for (const role of dadosServidor.cargos) {
                    if(role.name === "@everyone"){
                        const cargo = interaction.guild.roles.cache.find((role) => role.name === "@everyone");
                        cargo.setPermissions(role.permissions)
                    }else{
                        interaction.guild.roles.create({
                            name: role.name,
                            color: role.color,
                            hoist: role.hoist || false,
                            permissions: role.permissions
                        })
                        await new Promise(resolve => setTimeout(resolve, 200));
                    }
                }
                for (const element of dadosServidor.categorias) {
                    await new Promise(resolve => setTimeout(resolve, 200));
                    servidor.channels.create({
                        name: element.name,
                        type: ChannelType.GuildCategory,
        
                    }).then(categoria =>{
                        element.channel.forEach(canal => {
                            const permissionOverwrites = [
    
                            ]
                            canal.roles.forEach(role => {
                                const cargo = interaction.guild.roles.cache.find((r) => r.name === role.name);
                                permissionOverwrites.push({id: cargo.id, allow: role.permissions.allow, deny: role.permissions.deny })
                            })
                            servidor.channels.create({
                                name: canal.name,
                                type: canal.type,
                                parent: categoria.id,
                                permissionOverwrites: permissionOverwrites
                            })
                        })
                        
                    })
                }
            }
            await new Promise(resolve => setTimeout(resolve, 3000));
            executarForEach()
          }
  }
};