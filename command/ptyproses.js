const pty = require('../library/pseudo')
let obj ={
    name:'Ptyprocess',
    regex: /^>/,
    execute: async (this_, message, body)=>{
        const args = body.slice('>'.length+1)
        pty.write(args)
    },
    author: true
}
module.exports = obj