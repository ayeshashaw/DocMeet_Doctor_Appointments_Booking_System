const express = require("express");
const { addDoctor,loginAdmin, allDoctors, appointmentAdmin, appoinmentsCancel, adminDashboard } = require("../controllers/adminController");
const uploads = require("../middlewears/multer"); 
const authAdmin = require("../middlewears/authAdmin");
const { changeAvailblity } = require("../controllers/doctorController");

const adminRouter = express.Router();

// Route to add a doctor (with image upload)
adminRouter.post("/add-doctor", authAdmin, uploads.single("image"), addDoctor);

// Admin login route
adminRouter.post("/login", loginAdmin);
adminRouter.get("/all-doctors",authAdmin, allDoctors);
adminRouter.post("/change-availablity",authAdmin, changeAvailblity);
adminRouter.get("/appointments",authAdmin, appointmentAdmin);
adminRouter.post("/cancel-appointments",authAdmin, appoinmentsCancel);
adminRouter.get("/dashboard",authAdmin, adminDashboard);




module.exports = adminRouter;