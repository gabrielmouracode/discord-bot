const { client } = require('../../index')

client.on("ready", () => {
    console.log(`💻 [App] Conectado`);
    setTimeout(() => console.log(`\n🏰 [Guilds] ${client.guilds.cache.size}\n👤 [Users] ${client.users.cache.size}`), 1000)

});