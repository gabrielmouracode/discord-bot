const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { jsons } = require('../../index')
module.exports = {
    name: "user",
    description: "Ver avatar de um membro!",
    type: 1,
    options: [
        {
          name: 'avatar',
          description: 'Veja o avatar de um usuário',
          type: ApplicationCommandOptionType.Subcommand,
          options: [
                {
                    name: 'membro',
                    type: ApplicationCommandOptionType.User,
                    description: 'Membro que deseja ver o avatar',
                    required: false,
                },
            ],
        },
        {
            name: 'banner',
            description: 'Veja o banner de um usuário',
            type: ApplicationCommandOptionType.Subcommand,
            options: [
                  {
                      name: 'membro',
                      type: ApplicationCommandOptionType.User,
                      description: 'Membro que deseja ver o banner',
                      required: false,
                  },
              ],
          }
    ],
    execute: async (interaction, client) => {
        const subcommand = interaction.options.getSubcommand();
        if(subcommand === "avatar"){
            const user = interaction.options.getUser('membro') || interaction.user

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
        }else if(subcommand === "banner"){
            const user = interaction.options.getUser('membro') || interaction.user
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
        
  }
}; 