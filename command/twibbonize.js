const {Axios, default: axios} = require('axios')
const {MessageType, proto} = require('@adiwajshing/baileys')
const instance = axios.create({baseURL:'https://bytescrapper.herokuapp.com'})
module.exports = {
    name:'twibbon',
    help:prefix => `${prefix}twibon`,
    regex: /^twibon/,
    execute: async (this_, message, body)=>{
        const new_message =message.quoted?message.quoted:message
        const name = body.split(' ')[1]
        if(!name){
            await this_.sendMessage(message.key.remoteJid, 'Masukan Nama Twibon', MessageType.text, {quoted: message})
            return
        }
        console.log('test if')
        console.log(new_message)
        if(new_message.message[MessageType.image].mimetype?.includes('image')){
            const image = (await this_.downloadMediaMessage(new_message)).toString('base64')
            console.log(image)
            const data = (await instance({url: '/create', method:'post', data:JSON.stringify({image:image, name: name})})).data.toJson()
            console.log(data)
            if(data.status === false){
                await this_.sendMessage(message.key.remoteJid, 'Twibon tidak ditemukan', MessageType.text, {quoted: message})
            }else{
                await this_.sendMessage(message.key.remoteJid, {url: data.url}, MessageType.image, {quoted: message})   
            }
        }
    }
}