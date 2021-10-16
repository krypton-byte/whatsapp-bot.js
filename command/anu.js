const {MessageType} = require('@adiwajshing/baileys')
module.exports = {
    name:'Ping',
    help: (prefix)=>`${prefix}ping`,
    regex:/^ping/,
    execute: async (this_, message, body) => {
        await this_.sendMessage(message.key.remoteJid, 'PONG', MessageType.text, {quoted: message})
    }
}
