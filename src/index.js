// require('dotenv').config({path:'./env'})

import dotenv from "dotenv"
import connectDB from "./db/db.js";
import { app } from './app.js'

dotenv.config({
    path:'./env'
})

const port = process.env.PORT || 8000

connectDB()
.then(()=>{
    app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error
        })
    app.listen(port,()=>{
        console.log(`Server is Running at port: ${port}`);
    })
})
.catch(()=>{
    console.log("Mongo DB connection failed");
})







/*
( async ()=>{
    try {
       await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
       app.on("error",(error)=>{
        console.log("ERROR:",error);
        throw error
        })
        app.listen(process.env.PORT,()=>{
           console.log(`Server is running at PORT ${process.env.PORT}`);    
        })
    } catch (error) {
        console.error("Error",error)
    }
})()
 */   

