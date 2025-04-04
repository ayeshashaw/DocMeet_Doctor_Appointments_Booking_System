const doctorModels = require("../models/doctorsModels");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const appointmentsModels = require("../models/appointmentsModels");


const changeAvailblity = async (req, res) => {
  try {
    const { docId } = req.body;

    // Find doctor by ID
    const docData = await doctorModels.findById(docId);

    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    // Toggle availability
    await doctorModels.findByIdAndUpdate(docId, { available: !docData.available });

    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.error("Error changing availability:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModels.find({}).select('-password -email');
    res.json({ success: true, doctors });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//api for doctor login

const loginDoctor = async(req,res)=>{
  try {

    const {email,password} = req.body;
    const doctor = await doctorModels.findOne({email});

    if(!doctor){
      return res.json({success:false,message:"Invalid Credentials"})
    }
    
    const isMatch = await bcrypt.compare(password,doctor.password);

    

    if(isMatch){
      const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
      res.json({success:true,token})
    }else{
      res.json({success:false,message:"Invalid Credentials"})
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

//api to get doctor appointments;

const appointmentsDoctor = async (req, res) => {
  try {
    // Ensure the doctor is authenticated
    if (!req.doctor || !req.doctor.id) {
      return res.status(401).json({ success: false, message: "Unauthorized access" });
    }

    // Retrieve doctor ID from authenticated user
    const { id: docId } = req.doctor;

    // Fetch appointments for the doctor
    const appointments = await appointmentsModels.find({ docId });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching doctor appointments:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//api for complete the appointments

const appointmentCompleted = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentsModels.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.docId.toString() !== String(docId)) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    await appointmentsModels.findByIdAndUpdate(appointmentId, { isCompleted: true });

    return res.json({ success: true, message: "Appointment marked as completed" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const cancelAppointments = async (req, res) => {
  try {
    const { docId, appointmentId } = req.body;

    const appointmentData = await appointmentsModels.findById(appointmentId);

    if (!appointmentData) {
      return res.status(404).json({ success: false, message: "Appointment not found" });
    }

    if (appointmentData.docId.toString() !== String(docId)) {
      return res.status(403).json({ success: false, message: "Unauthorized access" });
    }

    await appointmentsModels.findByIdAndUpdate(appointmentId, { cancelled: true });

    return res.json({ success: true, message: "Appointment successfully cancelled" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


//Api to get dashboard data for doctor panel

const doctorDashboard = async(req,res)=>{
  try {
    // Get docId from authenticated doctor
    const docId = req.doctor.id;

    // Get all appointments for the doctor
    const appointments = await appointmentsModels.find({docId});
    
    // Calculate total earnings from completed appointments
    const earnings = appointments.reduce((total, appointment) => {
      return appointment.isCompleted ? total + appointment.amount : total;
    }, 0);

    const uniquePatients = new Set(appointments.map(item => item.userId.toString()));

    // Get latest 5 appointments (sort by date in descending order)
    const latestAppointments = [...appointments]
      .sort((a, b) => b.date - a.date)
      .slice(0, 5);

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients: uniquePatients.size,
      latestAppointments
    }

    return res.json({ success: true, dashData});

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

const doctorProfile = async(req,res)=>{
  try {
    const docId = req.doctor.id;

    const profileData = await doctorModels.findById(docId).select("-password")

    res.json({success:true,profileData})
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

//api to update Doctor profile data

const updateDoctorProfile = async(req,res)=>{
  try {

    const{docId,fees,available,address} = req.body;

    await doctorModels.findByIdAndUpdate(docId,{fees,address,available})
    res.json({success:true,message: "Profile updated" })


    
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

module.exports = { 
  changeAvailblity, 
  doctorList, 
  loginDoctor, 
  appointmentsDoctor, 
  appointmentCompleted, 
  cancelAppointments ,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile
};
