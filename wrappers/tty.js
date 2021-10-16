
const {MessageType} = require('@adiwajshing/baileys')
const fs = require('fs')
const { mute } = require('../library/pseudo')
const pty = require('../library/pseudo')
const utils = require('../library/utils')
module.exports = {
    wraps:async (f, this_, message, body)=>{
        const btn_ = message.message.buttonsResponseMessage
        if(btn_){
            const id = btn_.selectedButtonId
            const idTty = id.split('-')[1]
            console.log(pty.pty)
            switch(id.split('-')[0]){
                case 'lstty':
                    if(!(await utils.isAuthor(message.participant||message.key.remoteJid))){
                        await this_.sendMessage(message.key.remoteJid, 'Anda Bukan Author Bot', MessageType.text)
                        return
                    }
                    const media = await this_.prepareMessage(message.key.remoteJid, fs.readFileSync('../media/bash.jpg'), MessageType.image)
                    const btn__ = [
                        {buttonId:`select-${idTty}`,buttonText:{displayText:'SELECT'},type:1},
                        {buttonId:`kill-${idTty}`,buttonText:{displayText:'KILL'},type:1},
                        {buttonId:`${pty.pty[idTty].mute?'unmute':'mute'}-${idTty}`,buttonText:{displayText:pty.pty[idTty].mute?'UnMute':'Mute'},type:1}
                    ]
                    const btnmsg= {
                        contentText:`${pty.pty[idTty].name} *ACTION*`,
                        footerText:'@anteicodes',
                        buttons:btn__,
                        headerType:4,
                        imageMessage: media.message.imageMessage
                    }
                    await this_.sendMessage(message.key.remoteJid, btnmsg, MessageType.buttonsMessage)
                    break
                case 'select':
                    if(!(await utils.isAuthor(message.participant||message.key.remoteJid))){
                        await this_.sendMessage(message.key.remoteJid, 'Anda Bukan Author Bot', MessageType.text)
                        return
                    }
                    pty.mute(pty.pty.selected).then(()=>{
                        pty.selected = idTty
                    })
                    const tmp_ = await pty.unMute(idTty)
                    if(tmp_) await this_.sendMessage(message.key.remoteJid, tmp_, MessageType.text)
                    break
                case 'kill':
                    if(!(await utils.isAuthor(message.participant||message.key.remoteJid))){
                        await this_.sendMessage(message.key.remoteJid, 'Anda Bukan Author Bot', MessageType.text)
                        return
                    }
                    pty.stop(idTty)
                    break
                case 'mute':
                    await pty.mute(idTty)
                    break
                case 'unmute':
                    if(!(await utils.isAuthor(message.participant||message.key.remoteJid))){
                        await this_.sendMessage(message.key.remoteJid, 'Anda Bukan Author Bot', MessageType.text)
                        return
                    }
                    const tmp = await pty.unMute(idTty)
                    if (tmp) await this_.sendMessage(message.key.remoteJid, tmp, MessageType.text)
                    break
                default:
                    return [f, [this_, message, body]]
            }
        }else{
            return [f, [this_, message, body]]
        }
    }, name:'tty'
}