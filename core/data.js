class Voting{
    constructor(){
        this.grouping = {}
        this.buttonId = {}
    }
    async addParticipant(id, jid, text){
        if(!this.buttonId[id]) return 'Button mungkin sudah dihapus'
        for(let btns of Object.keys(this.grouping)){
            if(this.grouping[btns].btn.includes(id)){
                switch(this.grouping[btns].rules.mode){
                    case 'fixed':
                        if(!(this.grouping[btns].btn.filter(x=> this.buttonId[x].participant.includes(jid))==false)){
                            return 'jawaban hanya bisa 1x'
                        }else{
                            this.buttonId[id].participant.push(jid)
                            return `${text} dipilih`
                        }
                        break
                    case 'relative':
                        let old = false
                        for(let vcf of this.grouping[btns].btn){
                            if(this.buttonId[vcf].participant.indexOf(jid) < 0){
                                old = this.buttonId[vcf].name
                                delete this.buttonId[vcf].participant[this.buttonId[vcf].participant.indexOf(jid)]
                            }
                        }
                        this.buttonId[id].participant.push(jid)
                            if(old){
                                return `pilihan di ubah dari ${old} ke ${text}`
                            }
                            return `${text} dipilih`
                        break
                    case 'multichoices':
                        if(this.buttonId[id].participant.includes(jid)){
                            return `Anda memilih "${text}" sebelumnya`
                        }else{
                            this.buttonId[id].participant.push(jid)
                        return `${text} dipilih`
                        }
                        break
                }
            }
        }
    }

    async createVoting(buttons, id, isi, title, author){
        let voting = {isi:isi, author: author, title:title, btn:[], rules:{
            mode:'fixed'
        }}
        for(let btn of buttons){
            voting.btn.push(btn.buttonId)
            this.buttonId[btn.buttonId] = {'name':btn.buttonText.displayText, participant:[], id:btn.buttonId}
        }
        this.grouping[id] = voting
    }
    async changeMode(id, mode){
        if(!this.grouping[id]) return 'vote tidak ditemukan'
        if(this.grouping[id].rules.mode === mode) return 'perubahan tidak berarti ;v'
        const old = this.grouping[id].rules.mode
        let resp = ''
        if(['relative','fixed'].includes(this.grouping[id].rules.mode)){
            resp=`mode button dari ${old} ke ${mode} berhasil tanpa penghapusan data`
        }else{
            for(let cvf of this.grouping[id].btn){
                this.buttonId[cvf].participant = []
            }
            resp=`mode button dari ${old} ke ${mode} dan juga penghapusan data`
        }
        this.grouping[id].rules.mode=mode
        return resp
    }
    async viewVoting(id_voting){
        try{
            let t=JSON.parse(JSON.stringify(this.grouping[id_voting])) //Copy Object With Different Memory addres
            t.btn = t.btn.map(x=>this.buttonId[x])
            return t
        }catch{
            return 'Button Telah dihapus'
        }
    }
    async deleteVoting(id_voting){
        this.grouping[id_voting]&&this.grouping[id_voting].btn.map(x=> delete this.buttonId[x])
        return this.grouping&&delete this.grouping[id_voting]
    }
    async prettyShow(id_voting){
        if(!this.grouping[id_voting]) return 'Button mungkin sudah dihapus'
        const result = await this.viewVoting(id_voting)
        const btn_participant = '\n\t'+this.grouping[id_voting].btn.map(x=>{
            console.log(x)
            return this.buttonId[x].name+'\n\t\t'+this.buttonId[x].participant.join('\n\t\t')
        }).join('\n\t')
        const btn = '\n\t'+result.btn.map(x=>'\n\t\t'+x.name+' : '+x.participant.length+' vote').join('\n\t')
        return `
Title: ${result.title}
Author: ${result.author}
Button: 
${btn}

Participant: 
${btn_participant}`.trim()
    }
}  

module.exports = {voting:new Voting()}