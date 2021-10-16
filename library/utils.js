const variable = require('../core/variables')
class utils{
    constructor(){
        this.author = variable.author
    }
    async isAuthor(id){
        console.log(`author: ${this.author.includes(id)}`)
        return this.author.includes(id)
    }
}
module.exports = new utils()