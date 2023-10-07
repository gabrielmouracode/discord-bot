const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { jsons } = require('../../index')
module.exports = {
    name: "banner",
    type: 2,
    execute: async (interaction, client) => {
        let member = await interaction.guild.members.fetch(interaction.targetId)
        const user = member.user
        const banner = await (await client.users.fetch(user.id, { force: true })).bannerURL({ size: 4096 })

        if(!banner) return interaction.reply({ content: `O Usuário mencionado não possu banner!`, ephemeral: true })

        const embed = new EmbedBuilder()
            .setTitle(`Banner ${user.username}`)
            .setImage(banner)
            .setColor(jsons.config.color)
        
        const button =  new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel(`Download Avatar`)
                    .setStyle(ButtonStyle.Link)
                    .setURL(banner)
            )

        interaction.reply({ embeds: [embed], components: [button] })
  }
}; 