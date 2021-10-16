const utils = require('../library/utils')
const { MessageType } = require('@adiwajshing/baileys')
const pty = require('../library/pseudo')
let obj ={
    name:'create tty',
    regex: /^tty/,
    execute: async (this_, message, body)=>{
        if(!(await utils.isAuthor(message.participant||message.key.remoteJid))){
            await this_.sendMessage(message.key.remoteJid, `Anda Buka Author Bot`, MessageType.text)
            return
        }
        const args = body.slice('tty'.length+1)
        switch(args.split(' ')[0]){
            case 'create':
                pty.create((new Date()).getTime().toString(), args.slice('create'.length+1), message.key.remoteJid, this_) 
                break
            case 'kill':
                if(pty.pty.selected){
                    pty.pty.stop(pty.selected)
                }
                break
            case 'mute':
                if(pty.selected){
                    pty.pty[pty.selected].mute = true
                    await this_.sendMessage(message.key.remoteJid, `${pty.pty[pty.selected].name} Berhasil dimute`, MessageType.text)
                }else{
                    //await this_.sendMessage(message.key.remoteJid, `${pty.pty[pty.selected].name} Berhasil dimute`, MessageType.text)
                }
                break
            case 'unmute':
                await this_.sendMessage(message.key.remoteJid, await pty.unMute(pty.selected), MessageType.text)
                break
        }
    },
    author: true,
}
module.exports = obj