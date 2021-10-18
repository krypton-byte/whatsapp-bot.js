const fs = require('fs');
const {WAConnection, MessageType} = require('@adiwajshing/baileys');
const library_dir = '../command'
const {wrap} = require('./wrapper')
const utils = require('../library/utils')
const library = fs.readdirSync(library_dir).filter(x=> /.js$/.exec(x)).map(x=>require(`${library_dir}/${x}`))
console.log('[•] Load Command')
for(let load of library){
    console.log(`\t‣ ${load.name} Loaded`)
}
class BotWhatsApp extends WAConnection{
    constructor(prefix, nama_bot, author, server=false){
        super()
        console.log(`server ${Boolean(server)}`)
        this.server = server
        this.prefix = prefix;
        this.nama_bot = nama_bot;
        this.author = author;
    }
    async search_command(this_, message, body){
        if(message.message.ButtonsMessage) return  //pengecualian untuk button
        if(body.constructor() !== '') return ''
        for(let listCommand of library){
            if(this_.prefix===body.toLowerCase().slice(0, this_.prefix.length)&&listCommand.regex.exec(body.toLowerCase().slice(this_.prefix.length))){
                console.log(body)
                if(listCommand.author){
                    if(await utils.isAuthor(message.participant||message.key.remoteJid)){
                        await listCommand.execute(this_, message, body.slice(this_.prefix.length))
                        break
                    }else{
                        await this_.sendMessage(message.key.remoteJid, 'Anda Bukan Author', MessageType.text, {quoted: message})
                        break
                    }
                }else{
                    await listCommand.execute(this_, message, body.slice(this_.prefix.length))
                    break
                }
            }
        }
    }
    list_help(){
        return library.map(x=>x.help(this.prefix)).join('\n')
    }
    async ephemeral(msg){
        
    }
    set_(auth){
        auth&&fs.existsSync(auth) && this.loadAuthInfo(auth);
        this.on('open', async()=>{
            auth&&fs.writeFileSync(auth, JSON.stringify(this.base64EncodedAuthInfo(), null, '\t'))
        })
        this.on('qr', async function(data){
            this.server.send(data)
        })
        this.on('chat-update', async (chat)=>{
            if(chat.messages){
                let message = chat.messages.all()[0]
                if(message.key.fromMe){
                    console.log('Dari saya')
                    return
                }
                if(message.message !== null || message.message !== undefined){
                    console.log('pesan masuk')
                    //console.log(message.message.ephemeralMessage?message.message.ephemeralMessage.message.extendedTextMessage.text:false)
                    const eph = message.message?.ephemeralMessage?message.message.ephemeralMessage?.message?message.message.ephemeralMessage.message?.extendedTextMessage?message.message.ephemeralMessage.message.extendedTextMessage.text:false:false:false
                    if(eph){
                        console.log({eph: message.message.ephemeralMessage.message.extendedTextMessage})
                        console.log({eph:eph})

                    }
                    console.log(message.message)
                    let [mess, messagesd] = [message,eph.constructor()==='' ?eph:message.message?.imageMessage?message.message.imageMessage?.caption:message.message.conversation]
                    await wrap.check(this, mess, messagesd, this.search_command)
                } 
            }
              
        })
    }
}
const kbot = new BotWhatsApp(prefix='!',
    nama_bot='ntah',
    author='meh'
)
kbot.set_('../session/anu.json')
kbot.connect({timeoutMs: 3000, maxRetries: Infinity}) 




// const app = express();

// // Set up a headless websocket server that prints any
// // events that come in.
// const wsServer = new ws.Server({ noServer: true });
// wsServer.on('connection', socket => {
//   const bot = new BotWhatsApp('!', 'anu', 'anux', socket)
//   socket.on('message', message => {
//       const data = JSON.parse(message)
//       if(data.type ==='connect'){
//           bot.connect()
//       }else if(data.type === 'kill'){
//           socket.close()
//       }
//   });
//   socket.on('close', (code, reason)=>{
//     console.log('closed')
//   })
// });

// // `server` is a vanilla Node.js HTTP server, so use
// // the same ws upgrade process described here:
// // https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
// const server = app.listen(3000);
// server.on('upgrade', (request, socket, head) => {
//   wsServer.handleUpgrade(request, socket, head, socket => {
//     wsServer.emit('connection', socket, request);
//   });
// });
