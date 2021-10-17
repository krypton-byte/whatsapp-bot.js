const {MessageType} = require('@adiwajshing/baileys')
const list_kata = ['ajg', 'babi']
async function func(f,this_, message, body){
    console.log({body: body})
    if(body.constructor() !== '') return null
    if(!message.message.ButtonsMessage&&!message.key.fromMe && !(list_kata.filter(x=>body.split(' ').includes(x)) == false)){
        await this_.sendMessage(message.key.remoteJid,'Kata Kata Kotor Terdeteksi', MessageType.text)
    }else{
        return [f, [this_, message, body]]
    }
}
module.exports = {wraps: func, name:'badword'}

