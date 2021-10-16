const {voting} = require('../core/data')
const {MessageType} = require('@adiwajshing/baileys')
module.exports = {wraps: async (f, this_, message, body)=>{
    const btn_ = message.message.buttonsResponseMessage
    if(btn_){
        const context = btn_.contextInfo
        const id_=btn_.selectedButtonId
        const text = btn_.selectedDisplayText
        const cmd = id_.split('-')
        console.log(context)
        switch(cmd[0]){
            case 'voting':
                const id_s = cmd[1]
                console.log(voting)
                const s=await voting.addParticipant(id_s, message.participant, text)
                if(s){
                    await this_.deleteMessage(message.key.remoteJid, {
                        id: context.stanzaId,
                        remoteJid: message.key.remoteJid,
                        fromMe: true
                    })
                    await this_.sendMessage(message.key.remoteJid, s, MessageType.text, {quoted:message})
                    for(let counter of Object.keys(voting.grouping)){
                        if(voting.grouping[counter].btn.includes(id_s)){
                            const btnx=[]
                            for( let id_s of voting.grouping[counter].btn){
                                btnx.push({buttonId:`voting-${id_s}-${(new Date()).getTime()}`,buttonText:{displayText:voting.buttonId[id_s].name},type:1})
                            }
                            let btnxmsg = {
                                contentText:voting.grouping[counter].isi,
                                footerText:'@anteicodes',
                                buttons:btnx,
                                headerType:1
                            }
                            await this_.sendMessage(message.key.remoteJid, btnxmsg, MessageType.buttonsMessage)
                            break
                        }
                    }
                }
                break
            case 'vote':
                const id= cmd[2]
                for(let k of Object.keys(voting.grouping)){
                    if(voting.grouping[k].btn.includes(id) && !(voting.grouping[k].author===message.key.remoteJid)){
                        await this_.sendMessage(message.key.remoteJid, `anda bukan autor buton *${voting.grouping[k].title}*`, MessageType.text)
                        return 
                    }
                }
                switch(cmd[1]){
                    case 'delete':
                        await voting.deleteVoting(id)
                        break
                    case 'show':
                        const value = JSON.parse(JSON.stringify(await voting.viewVoting(id)))
                        if(!value.btn){
                            await this_.sendMessage(message.key.remoteJid, 'Button Telah dihapus', MessageType.text)
                            return 
                        } 
                        let btn = []
                        value.btn.map(x=>{
                            btn.push({buttonId: x.id, buttonText: {displayText: x.name}, type: 1})
                        })
                        let btnmsg = {
                            contentText:value.isi,
                            footerText:'@anteicodes',
                            buttons:btn,
                            headerType:1
                        }
                        await this_.sendMessage(message.key.remoteJid, btnmsg, MessageType.buttonsMessage)
                        break
                    case 'result':
                        await this_.sendMessage(message.key.remoteJid, await voting.prettyShow(id), MessageType.text)
                    break
                    case 'mode': // vote-mode-cmd-id // vote-mode-id
                        const cmd_=cmd[2]
                        const _id_ =cmd[3]
                        switch(cmd_){
                            case 'relative':
                                await this_.deleteMessage(message.key.remoteJid, {
                                    id: context.stanzaId,
                                    remoteJid: message.key.remoteJid,
                                    fromMe: true
                                })
                                await this_.sendMessage(message.key.remoteJid, await voting.changeMode(_id_,'relative'), MessageType.text)
                                break
                            case 'fixed':
                                await this_.deleteMessage(message.key.remoteJid, {
                                    id: context.stanzaId,
                                    remoteJid: message.key.remoteJid,
                                    fromMe: true
                                })
                                await this_.sendMessage(message.key.remoteJid, await voting.changeMode(_id_,'fixed'), MessageType.text)
                                break
                            case 'multichoices':
                                await this_.deleteMessage(message.key.remoteJid, {
                                    id: context.stanzaId,
                                    remoteJid: message.key.remoteJid,
                                    fromMe: true
                                })
                                await this_.sendMessage(message.key.remoteJid, await voting.changeMode(_id_,'multichoices'), MessageType.text)
                                break
                            default:
                                await this_.deleteMessage(message.key.remoteJid, {
                                    id: context.stanzaId,
                                    remoteJid: message.key.remoteJid,
                                    fromMe: true
                                })
                                const mode= ['relative', 'fixed', 'multichoices']
                                let _btn__=[]
                                for(let md of mode){
                                    if(voting.grouping[id].rules.mode !== md){
                                        _btn__.push({buttonId:`vote-mode-${md}-${id}-${(new Date()).getTime()}`,buttonText:{displayText:md},type:1})
                                    }
                                }
                                let btnmsgx__ = {
                                    contentText:`set Mode ${voting.grouping[id].title}\nMode ${voting.grouping[id].rules.mode}`,
                                    footerText:'@anteicodes',
                                    buttons:_btn__,
                                    headerType:1
                                }
                                await this_.sendMessage(message.key.remoteJid, btnmsgx__, MessageType.buttonsMessage)
                            break
                        }
                        break
                    case 'ui':
                        await this_.deleteMessage(message.key.remoteJid, {
                            id: context.stanzaId,
                            remoteJid: message.key.remoteJid,
                            fromMe: true
                        })
                        let btn___ = [
                            {buttonId:`vote-mode-${id}-${(new Date()).getTime()}`,buttonText:{displayText:'SET MODE'},type:1},
                            {buttonId:`vote-info-${id}-${(new Date()).getTime()}`,buttonText:{displayText:'INFO'},type:1}
                        ]
                        let __btnmsg__ = {
                            contentText:voting.grouping[id].title,
                            footerText:'@anteicodes',
                            buttons:btn___,
                            headerType:1
                        }
                        await this_.sendMessage(message.key.remoteJid, __btnmsg__, MessageType.buttonsMessage)
                        break
                    case 'info':
                        await this_.deleteMessage(message.key.remoteJid, {
                            id: context.stanzaId,
                            remoteJid: message.key.remoteJid,
                            fromMe: true
                        })
                        if(!voting.grouping[id]) this_.sendMessage(message.key.remoteJid, 'Button Mungkin telah dihapus', MessageType.text, {quoted: message})
                        let btn__ = [
                            {buttonId:`vote-delete-${id}-${(new Date()).getTime()}`,buttonText:{displayText:'Delete'},type:1},
                            {buttonId:`vote-show-${id}-${(new Date()).getTime()}`,buttonText:{displayText:'Show'},type:1},
                            {buttonId:`vote-result-${id}-${(new Date()).getTime()}`,buttonText:{displayText:'Result'},type:1},
                        ]
                        let btnmsg__ = {
                            contentText:voting.grouping[id].title,
                            footerText:'@anteicodes',
                            buttons:btn__,
                            headerType:1
                        }
                        await this_.sendMessage(message.key.remoteJid, btnmsg__, MessageType.buttonsMessage)
                    break
                }
            default:
                return [f, [this_, message, body]]
        }
    }else{
        return [f, [this_, message, body]]
    }
}, name: 'button'}