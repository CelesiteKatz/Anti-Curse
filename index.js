const {Collection, Client, Discord} = require('discord.js')
const fs = require('fs')
const words = require('./curse.json');
const client = new Client({
    disableEveryone: true
})
const config = require('./config.json')
const prefix = config.prefix
const token = config.token
client.commands = new Collection();
client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
    require(`./handlers/${handler}`)(client);
}); 
//Bot Online
client.on('ready', () => {
    client.user.setActivity(`${prefix}help`)
    console.log(`${client.user.username} ✅`)
})
//Command Handler
client.on('message', async message =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(prefix)) return;
    if(!message.guild) return;
    if(!message.member) message.member = await message.guild.fetchMember(message);
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(cmd.length == 0 ) return;
    let command = client.commands.get(cmd)
    if(!command) command = client.commands.get(client.aliases.get(cmd));
    if(command) command.run(client, message, args) 
})

//Anti-Curse
client.on('message', async(message) => {

    for (let i = 0; i < words.length; i++) {
        if(message.content.includes(words[i])) {
            message.delete();
            message.reply('Please Dont Swear In This Server Thank You :3')
                .then(m => m.delete({ timeout: 3000 }))
        }
    }
})
client.login(token)
