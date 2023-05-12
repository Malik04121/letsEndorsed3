
const express=require("express")
const userRoute=express.Router()
const controllers=require("../controllers/userController")

// userRoute.get("/",controllers.userData)
userRoute.post("/signup",controllers.signup)
userRoute.patch("/resetPassword/:id",controllers.resetPassword)
// userRoute.post("/login",controllers.login)
userRoute.patch("/updateUser/:id",controllers.updateUser)



module.exports={userRoute}