const { ApplicationCommandOptionType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ChannelSelectMenuBuilder, ChannelType } = require('discord.js')
const fs = require('fs');
const { jsons:{config}, db:{guilds}  } = require("../../index")

module.exports = {
    name: "config",
    description: "configurar servidor!",
    type: 1,
    options: [
      {
        name: 'logs',
        description: 'configurar message de logs;',
        type: ApplicationCommandOptionType.SubcommandGroup,
        options: [
          {
            name: 'entrada',
            description: 'Mensagem de boas vindas do servidor',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
              name: 'saída',
              description: 'Mensagem de saida do servidor',
              type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'banimento',
            description: 'Mensagem de banimento e expulsao do servidor',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'mensagem',
            description: 'Logs de mensagens apagadas e editadas',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'canal',
            description: 'Logs de canais apagados e editados',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'trafego',
            description: 'Logs de usuarios em call',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'cargo',
            description: 'Logs de cargos apagados e editados',
            type: ApplicationCommandOptionType.Subcommand,
          },
          {
            name: 'usuário',
            description: 'Logs de usuários nome, avatar etc',
            type: ApplicationCommandOptionType.Subcommand,
          }
        ]
      }
      
  ],
    defaultMemberPermissions: PermissionFlagsBits.Administrator,
    execute: async (interaction, client) => {
      const gruopsubcommand = interaction.options.getSubcommandGroup();
      const subcommand = interaction.options.getSubcommand();
      if(gruopsubcommand === "logs"){
        if(subcommand === "entrada"){
          const embed = new EmbedBuilder()
            .setTitle(`Titulo da Mensagem`)
            .setDescription(`Descrição da Mensagem`)

          const button = new ActionRowBuilder()
              .addComponents(
                new ButtonBuilder()
                  .setCustomId(`wellcome-title-embed`)
                  .setLabel(`Titulo`)
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId(`wellcome-description-embed`)
                  .setLabel(`Descrição`)
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId(`wellcome-imagem-embed`)
                  .setLabel(`Imagem`)
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId(`wellcome-thumbnail-embed`)
                  .setLabel(`Thumbnail`)
                  .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                  .setCustomId(`wellcome-color-embed`)
                  .setLabel(`Color`)
                  .setStyle(ButtonStyle.Secondary),
                   
              )
              const finalizar = new ActionRowBuilder()
                .addComponents(
                  new ButtonBuilder()
                  .setCustomId(`wellcome-finalizar-embed`)
                  .setLabel(`Finalizar`)
                  .setStyle(ButtonStyle.Success)
                )
  
              interaction.reply({ embeds: [embed], components: [button, finalizar], ephemeral: true }).then((message) =>{
                const collector = message.createMessageComponentCollector({ time: 300000 });
  
                collector.on('collect', async i => {
                  if(i.customId === "wellcome-title-embed"){
                    const modal = new  ModalBuilder()
                      .setCustomId(`wellcome-title-embed-modal`)
                      .setTitle(`Título Boas-Vindas`)
  
                    const input = new TextInputBuilder()
                      .setCustomId(`input`)
                      .setLabel(`Título`)
                      .setPlaceholder(`{user} {server} {counter}`)
                      .setStyle(TextInputStyle.Short)
  
                    const actionRow = new ActionRowBuilder().addComponents(input)
  
                    modal.addComponents(actionRow)
                    await i.showModal(modal)
  
                    i.awaitModalSubmit({ time: 60_000 }).then((modal) => {
                      const title = modal.fields.getTextInputValue('input');
                      embed.setTitle(title)
  
                      message.edit({ embeds: [embed] })
                      modal.deferUpdate();
                    }).catch(err => {});
                  }else if (i.customId === "wellcome-description-embed"){
                    const modal = new  ModalBuilder()
                    .setCustomId(`wellcome-description-embed-modal`)
                    .setTitle(`Descrição Boas-Vindas`)
  
                    const input = new TextInputBuilder()
                      .setCustomId(`input`)
                      .setLabel(`Descrição`)
                      .setPlaceholder(`{user} {server} {counter}`)
                      .setStyle(TextInputStyle.Short)
  
                    const actionRow = new ActionRowBuilder().addComponents(input)
  
                    modal.addComponents(actionRow)
                    await i.showModal(modal)
  
                    i.awaitModalSubmit({ time: 60_000 }).then((modal) => {
                      const description = modal.fields.getTextInputValue('input');
                      embed.setDescription(description)
  
                      message.edit({ embeds: [embed] })
                      modal.deferUpdate();
                    }).catch(err => {});
                  }else if (i.customId === "wellcome-imagem-embed"){
                    const modal = new  ModalBuilder()
                    .setCustomId(`wellcome-img-embed-modal`)
                    .setTitle(`Imagem de Boas-Vindas`)
  
                    const input = new TextInputBuilder()
                      .setCustomId(`input`)
                      .setLabel(`Imagem URL`)
                      .setPlaceholder(`URL`)
                      .setStyle(TextInputStyle.Short)
  
                    const actionRow = new ActionRowBuilder().addComponents(input)
  
                    modal.addComponents(actionRow)
                    await i.showModal(modal)
  
                    i.awaitModalSubmit({ time: 60_000 }).then((modal) => {
                      const img = modal.fields.getTextInputValue('input');
                      embed.setImage(img || null)
  
                      message.edit({ embeds: [embed] })
                      modal.deferUpdate();
                    }).catch(err => {});
                  }else if (i.customId === "wellcome-thumbnail-embed"){
                    if(embed.data.thumbnail){
                      delete embed.data.thumbnail
                    }else{
                      embed.setThumbnail(i.user.avatarURL())
                    }
                    message.edit({ embeds: [embed] })
                    i.deferUpdate();
                  }else if (i.customId === "wellcome-color-embed"){
                    const options = config['color-criar-embed'].map(cor => {
                      return {
                          label: cor.name,
                          value: `${cor.color}`
                      }
                    })
                      const select = new ActionRowBuilder()
                        .addComponents(
                          new StringSelectMenuBuilder()
                            .setCustomId(`wellcome-color-embed-select`)
                            .setPlaceholder('Selecione uma opção')
                            .addOptions(
                              new StringSelectMenuOptionBuilder()
                                .setLabel('Adicionar Código HEX')
                                .setValue(`select-adicionar-hex`)
                            )
                            .addOptions(options)
                        )
                      const button = new ActionRowBuilder()
                        .addComponents(
                          new ButtonBuilder()
                            .setURL(`https://htmlcolorcodes.com/`)
                            .setLabel('Encontrar Cores')
                            .setStyle(ButtonStyle.Link),
                          new ButtonBuilder()
                            .setCustomId(`wellcome-voltar-embed`)
                            .setLabel('Voltar')
                            .setStyle(ButtonStyle.Secondary)
                        )   
  
                      message.edit({ components: [select, button] })
                      i.deferUpdate();     
                  }else if (i.customId === "wellcome-finalizar-embed"){
                    const select = new ActionRowBuilder()
                      .addComponents(
                        new ChannelSelectMenuBuilder()
                          .setChannelTypes(ChannelType.GuildText)
                          .setCustomId(`wellcome-channels-embed`)
                          .setPlaceholder(`Selecione um canal`)
                      )
                    const button = new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`wellcome-voltar-embed`)
                          .setLabel('Voltar')
                          .setStyle(ButtonStyle.Secondary)
                      )   
                    message.edit({ components: [select, button] })
                    i.deferUpdate();  
                    //
                  }else if(i.customId === "wellcome-color-embed-select"){
                    const color = i.values[0].replace(/#/g, '')
                    embed.setColor(parseInt(color, 16))
                    message.edit({ embeds: [embed] })
                    i.deferUpdate();
                  }else if(i.customId === "wellcome-voltar-embed"){
                    message.edit({ components: [button, finalizar] })
                    i.deferUpdate();
                  }else if(i.customId === "wellcome-channels-embed"){
                    const channel = i.values[0]
                    if(embed.data.thumbnail){
                      embed.data.thumbnail.url = `{user.avatar}`
                    }
                    guilds.set(`${i.guild.id}.logs.entrada.message`, embed.data)
                    guilds.set(`${i.guild.id}.logs.entrada.channel`, channel)
                    if(embed.data.thumbnail){
                      embed.data.thumbnail.url = i.user.avatarURL();
                    }
                    embed.data.title = embed.data.title.replace('{user}', i.user.username).replace('{server}', i.guild.name).replace('{counter}', i.guild.memberCount)
                    embed.data.description = embed.data.description.replace('{user}', i.user).replace('{server}', i.guild.name).replace('{counter}', i.guild.memberCount)
                    client.channels.cache.get(channel).send({embeds: [embed]}).then(() => {
                      
                      
    
                      message.delete()
                      i.deferUpdate();
                    })
  
                    
                  }
                })
              })
        }else if(subcommand === "saída"){
          const button = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`active-logs-saida`)
                .setLabel('Ativar')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`diseble-logs-saida`) 
                .setLabel('Desativar')
                .setStyle(ButtonStyle.Danger)
            )

          interaction.reply({ components: [button], ephemeral: true }).then((message) => {
            const collector = message.createMessageComponentCollector({ time: 300000 });

            collector.on('collect', async i => {
              if(i.customId === "active-logs-saida"){
                const select = new ActionRowBuilder()
                      .addComponents(
                        new ChannelSelectMenuBuilder()
                          .setChannelTypes(ChannelType.GuildText)
                          .setCustomId(`bye-channels-embed`)
                          .setPlaceholder(`Selecione um canal`)
                      )
                    const button = new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`bye-voltar-embed`)
                          .setLabel('Voltar')
                          .setStyle(ButtonStyle.Secondary)
                      )   
                    message.edit({ components: [select, button] })
                    i.deferUpdate(); 
              }else if(i.customId === "diseble-logs-saida"){
                guilds.set(`${i.guild.id}.logs.saida.status`, false)
                i.reply({ content: '✅ Logs de saída desativado com sucesso!', ephemeral: true }).then(() => {
                  message.delete();
                })
              }else if(i.customId === "bye-channels-embed"){
                const channel = i.values[0]

                guilds.set(`${i.guild.id}.logs.saida.status`, true)
                guilds.set(`${i.guild.id}.logs.saida.channel`, channel)
                
                i.reply({ content: '✅ Logs de saída ativado com sucesso!', ephemeral: true }).then(() => {
                  const embed = new EmbedBuilder()
                    .setTitle(`@${i.user.username}`)
                    .setDescription(`**${i.user.username}** saiu do servidor...\n**Membros:** ${i.guild.memberCount}`)
                    .setColor("Red")
                    .setThumbnail(i.user.avatarURL())

                  client.channels.cache.get(channel).send({ embeds: [embed] }).then(() => {
                    message.delete();
                  })
                })
              }else if(i.customId === "bye-voltar-embed"){
                message.edit({ components: [ button] })
                i.deferUpdate();
              }
            })
          })
        }else if(subcommand === "banimento"){
          const button = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`active-logs-banimento`)
                .setLabel('Ativar')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`diseble-logs-banimento`) 
                .setLabel('Desativar')
                .setStyle(ButtonStyle.Danger)
            )

          interaction.reply({ components: [button], ephemeral: true }).then((message) => {
            const collector = message.createMessageComponentCollector({ time: 300000 });

            collector.on('collect', async i => {
              if(i.customId === "active-logs-banimento"){
                const select = new ActionRowBuilder()
                      .addComponents(
                        new ChannelSelectMenuBuilder()
                          .setChannelTypes(ChannelType.GuildText)
                          .setCustomId(`banimento-channels-embed`)
                          .setPlaceholder(`Selecione um canal`)
                      )
                    const button = new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`banimento-voltar-embed`)
                          .setLabel('Voltar')
                          .setStyle(ButtonStyle.Secondary)
                      )   
                    message.edit({ components: [select, button] })
                    i.deferUpdate(); 
              }else if(i.customId === "diseble-logs-banimento"){
                guilds.set(`${i.guild.id}.logs.banimento.status`, false)
                i.reply({ content: '✅ Logs de banimento desativado com sucesso!', ephemeral: true }).then(() => {
                  message.delete();
                })
              }else if(i.customId === "banimento-channels-embed"){
                const channel = i.values[0]

                guilds.set(`${i.guild.id}.logs.banimento.status`, true)
                guilds.set(`${i.guild.id}.logs.banimento.channel`, channel)
                
                i.reply({ content: '✅ Logs de banimento ativado com sucesso!', ephemeral: true }).then(() => {
                  const embed = new EmbedBuilder()
                    .setTitle(`@${i.user.username}`)
                    .setDescription(`**${i.user.username}** foi banido do servidor...\n**Membros:** ${i.guild.memberCount}\n**Adiministrador:** ${client.user}\n**Motivo:** Tenstando logs banimentos!`)
                    .setColor("Red")
                    .setThumbnail(i.user.avatarURL())

                  client.channels.cache.get(channel).send({ embeds: [embed] }).then(() => {
                    message.delete();
                  })
                })
              }else if(i.customId === "banimento-voltar-embed"){
                message.edit({ components: [ button] })
                i.deferUpdate();
              }
            })
          })
        }else if(subcommand === "mensagem"){
          const button = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`active-logs-mensagem`)
                .setLabel('Ativar')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`diseble-logs-mensagem`) 
                .setLabel('Desativar')
                .setStyle(ButtonStyle.Danger)
            )

          interaction.reply({ components: [button], ephemeral: true }).then((message) => {
            const collector = message.createMessageComponentCollector({ time: 300000 });

            collector.on('collect', async i => {
              if(i.customId === "active-logs-mensagem"){
                const select = new ActionRowBuilder()
                      .addComponents(
                        new ChannelSelectMenuBuilder()
                          .setChannelTypes(ChannelType.GuildText)
                          .setCustomId(`mensagem-channels-embed`)
                          .setPlaceholder(`Selecione um canal`)
                      )
                    const button = new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`mensagem-voltar-embed`)
                          .setLabel('Voltar')
                          .setStyle(ButtonStyle.Secondary)
                      )   
                    message.edit({ components: [select, button] })
                    i.deferUpdate(); 
              }else if(i.customId === "diseble-logs-mensagem"){
                guilds.set(`${i.guild.id}.logs.mensagem.status`, false)
                i.reply({ content: '✅ Logs de expulsão desativado com sucesso!', ephemeral: true }).then(() => {
                  message.delete();
                })
              }else if(i.customId === "mensagem-channels-embed"){
                const channel = i.values[0]

                guilds.set(`${i.guild.id}.logs.mensagem.status`, true)
                guilds.set(`${i.guild.id}.logs.mensagem.channel`, channel)
                
                i.reply({ content: '✅ Logs de mensagem ativado com sucesso!', ephemeral: true }).then(() => {
                  const deletada = new EmbedBuilder()
                    .setTitle(`📝 Mensagem Deletada`)
                    .setDescription(`**Usuário:** ${i.user}\n**Canal:** <#${channel}>\n**Mensagem:** \`\`\`Logs teste de mensagem deletada\`\`\``)
                    .setColor("Red")
                    .setThumbnail(i.user.avatarURL())

                  const editada = new EmbedBuilder()
                    .setTitle(`📝 Mensagem Editada`)
                    .setDescription(`**Usuário:** ${i.user}\n**Canal:** <#${channel}>\n**Mensagem Antiga:** \`\`\`Logs teste de mensagem editada\`\`\`\n**Mensagem Atual:** \`\`\`Logs de mensagem editada funcionando\`\`\``)
                    .setColor("Yellow")
                    .setThumbnail(i.user.avatarURL())

                  client.channels.cache.get(channel).send({ embeds: [deletada, editada] }).then(() => {
                    message.delete();
                  })
                })
              }else if(i.customId === "mensagem-voltar-embed"){
                message.edit({ components: [ button] })
                i.deferUpdate();
              }
            })
          })
        }else if(subcommand === "canal"){
          const button = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`active-logs-canal`)
                .setLabel('Ativar')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`diseble-logs-canal`) 
                .setLabel('Desativar')
                .setStyle(ButtonStyle.Danger)
            )

          interaction.reply({ components: [button], ephemeral: true }).then((message) => {
            const collector = message.createMessageComponentCollector({ time: 300000 });

            collector.on('collect', async i => {
              if(i.customId === "active-logs-canal"){
                const select = new ActionRowBuilder()
                      .addComponents(
                        new ChannelSelectMenuBuilder()
                          .setChannelTypes(ChannelType.GuildText)
                          .setCustomId(`canal-channels-embed`)
                          .setPlaceholder(`Selecione um canal`)
                      )
                    const button = new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`canal-voltar-embed`)
                          .setLabel('Voltar')
                          .setStyle(ButtonStyle.Secondary)
                      )   
                    message.edit({ components: [select, button] })
                    i.deferUpdate(); 
              }else if(i.customId === "diseble-logs-canal"){
                guilds.set(`${i.guild.id}.logs.canal.status`, false)
                i.reply({ content: '✅ Logs de canal desativado com sucesso!', ephemeral: true }).then(() => {
                  message.delete();
                })
              }else if(i.customId === "canal-channels-embed"){
                const channel = i.values[0]

                guilds.set(`${i.guild.id}.logs.canal.status`, true)
                guilds.set(`${i.guild.id}.logs.canal.channel`, channel)
                
                i.reply({ content: '✅ Logs de canal ativado com sucesso!', ephemeral: true }).then(() => {
                  const deletada = new EmbedBuilder()
                    .setTitle(`📝 Canal Deletada`)
                    .setDescription(`**Usuário:** ${i.user}\n**Canal:** <#${channel}>\n**Tipo:** Texto`)
                    .setColor("Red")
                    .setThumbnail(i.user.avatarURL())

                  client.channels.cache.get(channel).send({ embeds: [deletada] }).then(() => {
                    message.delete();
                  })
                })
              }else if(i.customId === "canal-voltar-embed"){
                message.edit({ components: [ button] })
                i.deferUpdate();
              }
            })
          })
        }else if(subcommand === "trafego"){
          const button = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`active-logs-trafego`)
                .setLabel('Ativar')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`diseble-logs-trafego`) 
                .setLabel('Desativar')
                .setStyle(ButtonStyle.Danger)
            )

          interaction.reply({ components: [button], ephemeral: true }).then((message) => {
            const collector = message.createMessageComponentCollector({ time: 300000 });

            collector.on('collect', async i => {
              if(i.customId === "active-logs-trafego"){
                const select = new ActionRowBuilder()
                      .addComponents(
                        new ChannelSelectMenuBuilder()
                          .setChannelTypes(ChannelType.GuildText)
                          .setCustomId(`trafego-channels-embed`)
                          .setPlaceholder(`Selecione um canal`)
                      )
                    const button = new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`trafego-voltar-embed`)
                          .setLabel('Voltar')
                          .setStyle(ButtonStyle.Secondary)
                      )   
                    message.edit({ components: [select, button] })
                    i.deferUpdate(); 
              }else if(i.customId === "diseble-logs-trafego"){
                guilds.set(`${i.guild.id}.logs.trafego.status`, false)
                i.reply({ content: '✅ Logs de trafego desativado com sucesso!', ephemeral: true }).then(() => {
                  message.delete();
                })
              }else if(i.customId === "trafego-channels-embed"){
                const channel = i.values[0]

                guilds.set(`${i.guild.id}.logs.trafego.status`, true)
                guilds.set(`${i.guild.id}.logs.trafego.channel`, channel)
                
                i.reply({ content: '✅ Logs de trafego ativado com sucesso!', ephemeral: true }).then(() => {
                  const entrou = new EmbedBuilder()
                    .setTitle(`👤 Entrou em call`)
                    .setDescription(`**Usuário:** ${i.user}\n**Canal:** <#${channel}>\n`)
                    .setColor("Green")
                    .setThumbnail(i.user.avatarURL())

                  const saiu = new EmbedBuilder()
                    .setTitle(`👤 Saiu da call`)
                    .setDescription(`**Usuário:** ${i.user}\n**Canal:** <#${channel}>\n`)
                    .setColor("Yellow")
                    .setThumbnail(i.user.avatarURL())

                  client.channels.cache.get(channel).send({ embeds: [entrou, saiu] }).then(() => {
                    message.delete();
                  })
                })
              }else if(i.customId === "trafego-voltar-embed"){
                message.edit({ components: [ button] })
                i.deferUpdate();
              }
            })
          })
        }else if(subcommand === "cargo"){
          const button = new ActionRowBuilder()
            .addComponents(
              new ButtonBuilder()
                .setCustomId(`active-logs-cargo`)
                .setLabel('Ativar')
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`diseble-logs-cargo`) 
                .setLabel('Desativar')
                .setStyle(ButtonStyle.Danger)
            )

          interaction.reply({ components: [button], ephemeral: true }).then((message) => {
            const collector = message.createMessageComponentCollector({ time: 300000 });

            collector.on('collect', async i => {
              if(i.customId === "active-logs-cargo"){
                const select = new ActionRowBuilder()
                      .addComponents(
                        new ChannelSelectMenuBuilder()
                          .setChannelTypes(ChannelType.GuildText)
                          .setCustomId(`cargo-channels-embed`)
                          .setPlaceholder(`Selecione um canal`)
                      )
                    const button = new ActionRowBuilder()
                      .addComponents(
                        new ButtonBuilder()
                          .setCustomId(`cargo-voltar-embed`)
                          .setLabel('Voltar')
                          .setStyle(ButtonStyle.Secondary)
                      )   
                    message.edit({ components: [select, button] })
                    i.deferUpdate(); 
              }else if(i.customId === "diseble-logs-cargo"){
                guilds.set(`${i.guild.id}.logs.cargo.status`, false)
                i.reply({ content: '✅ Logs de cargo desativado com sucesso!', ephemeral: true }).then(() => {
                  message.delete();
                })
              }else if(i.customId === "cargo-channels-embed"){
                const channel = i.values[0]

                guilds.set(`${i.guild.id}.logs.cargo.status`, true)
                guilds.set(`${i.guild.id}.logs.cargo.channel`, channel)
                
                i.reply({ content: '✅ Logs de cargo ativado com sucesso!', ephemeral: true }).then(() => {
                  const entrou = new EmbedBuilder()
                    .setTitle(`📝 Cargo Criado`)
                    .setDescription(`**Usuário:** ${i.user}\n**Cargo:** Exemplo\n**permissões:** administrator, send_message`)
                    .setColor("Green")
                    .setThumbnail(i.user.avatarURL())

                  client.channels.cache.get(channel).send({ embeds: [entrou] }).then(() => {
                    message.delete();
                  })
                })
              }else if(i.customId === "cargo-voltar-embed"){
                message.edit({ components: [ button] })
                i.deferUpdate();
              }
            })
          })
        }else{
          return;
        }
      }
      
  }
}; 