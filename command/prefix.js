const {MessageType} = require('@adiwajshing/baileys')
const lib={
    name:'Prefix',
    help: (prefix)=>`${prefix}prefix <new prefix>`,
    regex:/^set/,
    author: true
}
lib.execute = async (this_, message, body) => {
    this_.prefix=body.slice(lib.regex.exec(body)[0].length+1)
    await this_.sendMessage(message.key.remoteJid, 'Berhasil diganti', MessageType.text, {quoted:message})
}
module.exports = lib