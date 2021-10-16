const {voting} = require('../core/data.js')
const {MessageType} = require('@adiwajshing/baileys')
module.exports = {
    name:'Create Vote',
    help:(prefix)=>`${prefix}voting`,
    regex:/^voting/,
    execute: async (this_, message, body)=>{
        const text = body.slice('voting'.length+1) // title|isi|button1|button2|button3
        const splt = text.split('|')
        if(splt.length<3){
            return ''
        }
        const title = splt[0]
        const isi = splt[1]
        const id = (new Date()).getTime()
        const btns =splt.slice(2)
        let btn = []
        for(let counter of [...Array(btns.length).keys()]){
            btn.push({buttonId:`${id}+${counter}`,buttonText:{displayText:btns[counter]},type:1})
        }
        await voting.createVoting(btn, id, isi, title, message.key.remoteJid)
        btn=btn.map(x=>{
            x.buttonId = `voting-${x.buttonId}`
            return x
        })
        const btnmsg = {
            contentText:isi,
            footerText:'@anteicodes',
            buttons:btn,
            headerType:1
        }
        await this_.sendMessage(message.key.remoteJid, btnmsg, MessageType.buttonsMessage)
    }
}