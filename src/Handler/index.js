//  Configuração Seguraça ENV

const dotenv = require('dotenv')
const path = require('path');
const configPath = path.resolve(__dirname, '../Authentication/', '.env');
dotenv.config({ path: configPath });

//  FS
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const commands = [];

module.exports = async (client) => {
    fs.readdir(`./src/Commands`, (error, folder) => {

        folder.forEach(subfolder => {
    
          fs.readdir(`./src/Commands/${subfolder}/`, (error, files) => {
    
            files.forEach(files => {
    
    
    
              if (!files?.endsWith('.js')) return;
    
              files = require(`../Commands/${subfolder}/${files}`);
    
              if (!files?.name) return;
    
              client.commands.set(files?.name, files);
    
    
    
              commands.push(files)
    
            });
    
          });
    
        });
    
      });

    fs.readdir(`./src/Events/`, (erro, pasta) => {
        pasta.forEach(subpasta => {
          fs.readdir(`./src/Events/${subpasta}/`, (erro, arquivos) => {
            arquivos.forEach(arquivo => {
                if (!arquivo.endsWith('.js')) {
                    fs.readdir(`./src/Events/${subpasta}/${arquivo}`, (erro, folder) => {
                        folder.forEach(file => {
                            if (!file.endsWith('.js')) return
                            require(`../Events/${subpasta}/${arquivo}/${file}`);
                        })
                    })
                }else{
                    require(`../Events/${subpasta}/${arquivo}`);
                }
                         
            });
          });
        });
    });

//  Registrar Commands

    const rest = new REST().setToken(process.env.TOKEN_DISCORD);
    client.on("ready", async () => {
        (async () => {
            try {
                console.log(`⏱  [comandos] carregando ${commands.length}.`);
                // await rest.put(
                //     Routes.applicationCommands(`${process.env.CLIENT_ID}`),
                //     { body: commands },
                // );
                client.application.commands.set(commands)
                //console.log(`✅ [comandos] ${data.length} carregado.`);
            } catch (error) {
                console.error(error);
            }
        })();
    });
};