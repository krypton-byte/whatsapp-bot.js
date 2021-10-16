const {MessageType} = require('@adiwajshing/baileys')
const {voting} = require('../core/data')
module.exports = {
    name:'listvote',
    regex: /^listvote/,
    help:p=>`${p}listvote`,
    execute: async(this_, message, body)=>{
        let btn = []
        Object.keys(voting.grouping).map(x=>{
            btn.push({buttonId:`vote-ui-${x}`,buttonText:{displayText:voting.grouping[x].title},type:1})
        })
        const btnmsg = {
            contentText:'LIST VOTE',
            footerText:'@anteicodes',
            buttons:btn,
            headerType:1
        }
        if(!(btn==false)){
            await this_.sendMessage(message.key.remoteJid, btnmsg, MessageType.buttonsMessage)
        }else{
            await this_.sendMessage(message.key.remoteJid, 'Anda Belum Membuat Button', MessageType.text, {quoted: message})
        }
    }
}