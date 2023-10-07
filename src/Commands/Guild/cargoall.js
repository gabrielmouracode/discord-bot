const { ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js')
const fs = require('fs');
module.exports = {
    name: "cargoall",
    description: "Adicionar cargo a todos membros!",
    type: 1,
    options: [
        {
            name: 'cargo',
            type: ApplicationCommandOptionType.Role,
            description: 'Cargo que será adicionado a todos usuários',
            required: true,
        },
    ],
    defaultMemberPermissions: PermissionFlagsBits.ManageRoles,
    execute: async (interaction, client) => {

      if(!interaction.member.permissions.has(PermissionFlagsBits.ManageRoles)) return interaction.reply({ content: `Apenas moderadores podem usar essa função.`, ephemeral: true })
        
        const role = interaction.options.getRole('cargo')
        const members = await interaction.guild.members.fetch()
        members.forEach(async member => {
          member.user.roles.add(role.id).catch();
          await new Promise(resolve => setTimeout(resolve, 200))
        });
      

      interaction.reply({ content: `<@&${role.id}> Adicionados em todos usuários do servidor!`, ephemeral: true })
  }
}; 