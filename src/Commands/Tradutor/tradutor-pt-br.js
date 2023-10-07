const { EmbedBuilder } = require('discord.js')
const { jsons } = require('../../index')
const { translate } = require('@vitalets/google-translate-api');

module.exports = {
    name: "Traduzir pt-BR",
    type: 3,
    execute: async (interaction, client) => {      
        const message = interaction.targetMessage.content 
        if(!message) return interaction.reply({ content: `Não consigo encontrar nenhum texto na mensagem!`, ephemeral: true })

        const translation = await translate(message, { to: "pt-br" });
        const embed = new EmbedBuilder()
          .setTitle(`Tradutor`)
          .setColor(jsons.config.color)
          .setDescription(`**Texto Original: (${translation.raw.src})** \`\`\`${message} \`\`\`**Texto Traduzido: (pt-BR)**\`\`\`${translation.text} \`\`\``)
        
        interaction.reply({ embeds: [embed] })
  }
}; 