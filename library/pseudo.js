const {MessageType}= require('@adiwajshing/baileys');
const {spawn} = require('node-pty')
class PtyProcess{
    constructor(){
        this.selected = null
        this.pty = {}
    }
    async parse(text_){
        while(RegExp(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/).exec(text_)|| /\r/.exec('text')){
            text_ = text_.replace(/\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])/, '').replace('\r','')
        }
        return text_
    }
    async create(id, name, jid, this_){
        await this.setup(name, spawn('bash',[],{}),id, jid, this_)
    }
    async select(id){
        for(let f of Object.keys(this.pty)){
            if(id == f){
                this.selected = f
                this.unMute(f)
            }else{
                this.mute(f)
            }
        }
    }
    async setup(name,pty, id ,jid, this_){
        this.pty[id] = {name:name, pty: pty, value:'',mute:true, jid:jid}
        this.select(id)
        pty.on('data', async (data)=>{
            if(!this.pty[id].mute && data.trim()){
                await this_.sendMessage(jid, await this.parse(data), MessageType.text)
            }else{
                this.pty[id].value+=data.trim()
            }
        })
        pty.onExit(async ({exitCode, signal})=>{
            if(!this.pty) return ''
            this.select(Object.keys(this.pty)[0])
            await this_.sendMessage(jid, `<<"${this.pty[id].name}" exited>>`, MessageType.text)
            delete this.pty[id]
        })
    }
    async unMute(id){
        if(!this.pty[id]) return
        this.pty[id].mute = false
        const tmp = await this.parse(this.pty[id].value)
        this.pty[id].value=''
        return tmp
    }
    async mute(id){
        if(!this.pty[id]) return 
        this.pty[id].mute = true
    }
    stop(id){
        if(this.pty[id]) this.pty[id].pty.kill()
    }
    write(text, jid){
        if(this.selected && this.pty[this.selected]){
            this.pty[this.selected].pty.write(text+'\n')
        }
    }
}
module.exports = new PtyProcess()