const { EmbedBuilder } = require('discord.js')
const { jsons } = require('../../index')
const { translate } = require('@vitalets/google-translate-api');

module.exports = {
    name: "Translate en",
    type: 3,
    execute: async (interaction, client) => {      
        const message = interaction.targetMessage.content 
        if(!message) return interaction.reply({ content: `Não consigo encontrar nenhum texto na mensagem!`, ephemeral: true })

        const translation = await translate(message, { to: "en" });
        const embed = new EmbedBuilder()
          .setTitle(`Translator`)
          .setColor(jsons.config.color)
          .setDescription(`**Original text: (${translation.raw.src})** \`\`\`${message} \`\`\`**Translated text: (en)**\`\`\`${translation.text} \`\`\``)
        
        interaction.reply({ embeds: [embed] })
  }
}; 