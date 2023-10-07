const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { jsons } = require('../../index')

module.exports = {
    name: "avatar",
    type: 2,
    execute: async (interaction, client) => {
        
        let member = await interaction.guild.members.fetch(interaction.targetId)
        const user = member.user

        const embed = new EmbedBuilder()
            .setTitle(`Avatar ${user.username}`)
            .setImage(user.avatarURL({ dynamic: true, size: 2048 }))
            .setColor(jsons.config.color)
        
        const button =  new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Download Avatar`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(user.avatarURL({ dynamic: true, size: 2048 }))
            )

        interaction.reply({ embeds: [embed], components: [button] })
  }
}; 