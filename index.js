require('dotenv').config()
console.log(process.env);
const express = require('express')

const app = express()

const port = 3000

app.get('/',(req,res)=>{
    res.send('Hello World')
})
app.get('/login',(req , res)=>{
    res.send('<h2>Please Login in our Page</h2>')
})
app.get('/youtube',(req,res)=>{
      res.send('<h1>Please Subscribe me on the You tube</h1>')
})
app.listen(process.env.port,()=>{
    console.log(`Express is running at port ${port}`);
})