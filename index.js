const {watch} = require('fs')
const {spawn} = require('node-pty')
class shell{
  constructor(){
    this.status = false
  }
  start(){
    if(!this.status){
      this.pty = spawn('node', ['.'], {
        cwd: process.env.PWD+'/core/'
      })
      this.status= true
      this.message()
    }
  }
  stop(){
    if(this.status){
      this.pty.kill('SIGINT')
      this.status = false
      this.start()
    }
  }
  message(){
    this.pty.on('data', console.log)
    this.pty.resize(process.stdout.rows, process.stdout.columns)
    this.pty.write('node .\n')
    this.pty.onExit(({exitCode, signal})=>{
      this.start()
    })
  }
}
const process_ = new shell()
process_.start()
if(process.argv.includes('--debug')){
  watch('./library',(eventype, filename)=>{
    console.log(eventype, filename) 
    process_.stop()
  })
  watch('./wrappers',(eventype, filename)=>{
    console.log(eventype, filename) 
    process_.stop()
  })
  watch('./core',(eventype, filename)=>{
    console.log(eventype, filename) 
    process_.stop()
  })
}
