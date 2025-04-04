const express = require("express");
const {registerUser,loginUser, getProfile,updateProfile, bookAppointments, cancelAppointments, listAppointments} = require("../controllers/userControllers");
const authUser = require("../middlewears/authUsers");
const uploads = require("../middlewears/multer");

const userRouter = express.Router();

userRouter.post("/register",registerUser)
userRouter.post("/login",loginUser)
userRouter.get("/get-profile",authUser,getProfile)
userRouter.put("/update-profile",uploads.single('image'),authUser,updateProfile)
userRouter.post("/book-appointment",bookAppointments)
userRouter.post("/cancel-appointment",authUser,cancelAppointments)
userRouter.get("/appointments",authUser,listAppointments)






module.exports= userRouter;
