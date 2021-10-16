const fs= require('fs')
const utils = require('../library/utils')
const {MessageType}=require('@adiwajshing/baileys')
const pty = require('../library/pseudo')
module.exports = {
    name:'list TTY',
    author:true,
    regex:/^lstty$/,
    execute: async (this_, message, body)=>{
        if(!(await utils.isAuthor(message.participant||message.key.remoteJid))){
            await this_.sendMessage(message.key.remoteJid, 'Anda Bukan Author Bot', MessageType.text)
            return 
        }
        btn = []
        for(let f of Object.keys(pty.pty)){
            if(pty.pty[f].jid === message.key.remoteJid){
                btn.push({buttonId:`lstty-${f}`,buttonText:{displayText:pty.pty[f].name},type:1})
            }
        }
        const media = await this_.prepareMessage(message.key.remoteJid, fs.readFileSync('../media/bash.jpg'), MessageType.image,{

        })
        if(btn==false){
            await this_.sendMessage(message.key.remoteJid,'Anda Belum mempunyai session', MessageType.text)
            return 
        }
        const btnmsg= {
            contentText:"LIST SESSION",
            footerText:'@anteicodes',
            buttons:btn,
            headerType:4,
            imageMessage: media.message.imageMessage
            
        }
        await this_.sendMessage(message.key.remoteJid, btnmsg, MessageType.buttonsMessage)
    }
}