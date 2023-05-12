const express=require('express')
const cors=require("cors")
const { userRoute } = require('./route/userRoute')
const { connection } = require('./configuration/db')
// const { UserModel } = require("../Model/userModel")


const app=express()
 app.use(cors())
app.use(express.json())


app.get("/",(req,res)=>{
    res.send("welcome to Home page")
})
app.use("/user",userRoute)



app.listen(5800,async()=>{
    try{
        await connection
        console.log("connnected to db")
    }
    catch(err){
        console.log(err)
    }

})