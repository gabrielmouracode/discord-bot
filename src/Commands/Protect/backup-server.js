const { AttachmentBuilder, EmbedBuilder, Guild, PermissionFlagsBits } = require('discord.js')
const fs = require('fs');
module.exports = {
    name: "backup",
    description: "Faça Backup dos canais e cargos do servidor!",
    type: 1,
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    execute: async (interaction, client) => {
      if(!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return interaction.reply({ content: `Apenas moderadores podem usar essa função.`, ephemeral: true })
      const fs = require('fs');

      function criarBackup(servidor) {
        const dadosServidor = {
          categorias: [],
          cargos: []
        };
        const categorias = interaction.guild.channels.cache.filter((channel) => channel.type === 4).sort((a, b) => a.rawPosition - b.rawPosition);
        const cargo = interaction.guild.roles.cache.sort((a, b) => b.rawPosition - a.rawPosition)
        cargo.forEach(role => {
          dadosServidor.cargos.push({name: role.name, permissions: role.permissions.toArray(), color: role.color})
        })
        categorias.forEach(async element => {
          const channels = {
            channel: []
          }
          const canal = servidor.channels.cache.filter((channel) => channel.parentId === element.id).sort((a, b) => a.rawPosition - b.rawPosition);
          canal.forEach(async canal => {
            const perm ={
              permissions: []
            }
            const permissionOverwrites = interaction.channel.permissionOverwrites.cache
            permissionOverwrites.forEach((overwrite) => {
              const role = interaction.guild.roles.cache.get(overwrite.id)
              perm.permissions.push({name: role.name, permissions: { allow: overwrite.allow.toArray(), deny: overwrite.deny.toArray()}})
            });

            channels.channel.push({name: canal.name, type: canal.type, roles: perm.permissions })

          })
          dadosServidor.categorias.push({ name: element.name, channel: channels.channel })

        });
        const backupJSON = JSON.stringify(dadosServidor);

        fs.writeFileSync(`./src/DataBase/Backup/${interaction.guild.id}.json`, backupJSON)

        const attachment = new AttachmentBuilder(`./src/DataBase/Backup/${interaction.guild.id}.json`, `${interaction.guild.id}.json`)
        interaction.reply({ content: `Backup do servidor feito com sucesso!`, files: [attachment], ephemeral: true }).then(() => {
          fs.unlinkSync(`./src/DataBase/Backup/${interaction.guild.id}.json`);
        })
      }

      criarBackup(interaction.guild);

      
  }
}; 