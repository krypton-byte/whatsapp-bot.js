const fs = require('fs')
const dir = '../wrappers'
class Wrappers{
    constructor(){
        console.log('[•] Load Wrapper-Function')
        this.name = 'Wrapper-Function'
        this.function = fs.readdirSync(dir).filter(x=> /.js$/.exec(x)).map(x=>require(`${dir}/${x}`))
        for(let load of this.function){
            console.log(`\t ‣ ${load.name} Loaded`)
        }
    }
    async check(this_, message, body, func){
        console.log('Wrap Function')
        let fun = func
        let args = [this_, message, body]
        for(let f of this.function){
            console.log(`function ${f.name}`)
            const resp = (await f.wraps(fun, ...args))
            if(resp){
                [fun, args] = resp
            }else{
                break
            }
        }
        if(fun && args){
            console.log('Call Function in wrapper')
            //console.log(args[2])
            await fun(...args)
        }
    }
}

module.exports = {wrap: (new Wrappers())}
console.log(`[*] Wrapper-Function Loaded`)
