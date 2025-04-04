const express = require("express");
const { doctorList, loginDoctor, appointmentsDoctor, appointmentCompleted, cancelAppointments, doctorDashboard, doctorProfile, updateDoctorProfile } = require("../controllers/doctorController");
const authDoctor = require("../middlewears/authDoctor");

const doctorRouter = express.Router();

doctorRouter.get("/list", doctorList);
doctorRouter.post("/login", loginDoctor);
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);
doctorRouter.post("/appointment-completed", authDoctor, appointmentCompleted);
doctorRouter.post("/appointment-cancelled", authDoctor, cancelAppointments);
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);
doctorRouter.get("/profile", authDoctor, doctorProfile);
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);






module.exports = doctorRouter;
