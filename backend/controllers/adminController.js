const validator = require("validator");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const doctorModels = require("../models/doctorsModels");
const jwt = require("jsonwebtoken");
const appointmentsModels = require("../models/appointmentsModels");
const userModels = require("../models/userModels");


// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// API for adding doctors
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        // Check if image file exists
        if (!imageFile) {
            return res.status(400).json({ success: false, message: "Image file is required" });
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(imageFile.mimetype)) {
            return res.status(400).json({ success: false, message: "Invalid file type. Only JPEG, PNG and JPG are allowed" });
        }

        // Check for missing details
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({ success: false, message: "Missing Details" });
        }

        try {
            // Validate address format
            const parsedAddress = JSON.parse(address);
            if (!parsedAddress.line1) {
                return res.status(400).json({ success: false, message: "Address line1 is required" });
            }
        } catch (error) {
            return res.status(400).json({ success: false, message: "Invalid address format" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        // Check if email already exists
        const existingDoctor = await doctorModels.findOne({ email });
        if (existingDoctor) {
            return res.status(400).json({ success: false, message: "Email already registered" });
        }

        // Validate password length
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters long" });
        }

        // Hash doctor password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        let imageUpload;
        try {
            imageUpload = await cloudinary.uploader.upload(imageFile.path, { 
                resource_type: "image",
                folder: "doctors",
                transformation: [{ width: 500, height: 500, crop: "fill" }]
            });
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            return res.status(500).json({ 
                success: false, 
                message: "Error uploading image to cloud storage",
                error: error.message 
            });
        }

        const doctorData = {
            name,
            email,
            image: imageUpload.secure_url,
            password: hashPassword,
            speciality,
            degree,
            experience,
            about,
            fees: Number(fees),
            address: JSON.parse(address),
            date: Date.now()
        };

        // Save doctor to database
        const newDoctor = new doctorModels(doctorData);
        await newDoctor.save();

        res.status(201).json({ success: true, message: "Doctor added successfully" });
    } catch (error) {
        console.error("Error in addDoctor:", error);
        res.status(500).json({ 
            success: false, 
            message: "Error adding doctor", 
            error: error.message,
            details: error.stack
        });
    }
};


// api for admin login;


const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });

      res.json({ success: true, token });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


//API to get all doctors list in admin panel;

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModels.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.error("Error fetching doctors:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};


//api for appointments admin

const appointmentAdmin = async(req,res)=>{
    try {
        const appointments = await appointmentsModels.find({})
        res.json({ success: true, appointments });
    } catch (error) {
        console.error( error);
        res.status(500).json({ success: false, message: "Internal server error" })
    }
}

//api for appointments cancellation

const appoinmentsCancel = async (req, res) => {
    try {
      const { appointmentId } = req.body;
      
      if (!appointmentId) {
        return res.status(400).json({ success: false, message: 'Appointment ID is required' });
      }

      const appointmentData = await appointmentsModels.findById(appointmentId);
      if (!appointmentData) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      if (appointmentData.cancelled) {
        return res.status(400).json({ success: false, message: 'Appointment is already cancelled' });
      }

      // Mark appointment as cancelled
      await appointmentsModels.findByIdAndUpdate(appointmentId, { cancelled: true });

      // Release doctor slot
      const { docId, slotDate, slotTime } = appointmentData;
      const docData = await doctorModels.findById(docId);

      if (!docData) {
        return res.status(404).json({ success: false, message: 'Doctor not found' });
      }

      let slots_booked = docData.slots_booked || {};

      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
      }

      await doctorModels.findByIdAndUpdate(docId, { slots_booked });

      res.json({ success: true, message: 'Appointment cancelled successfully' });
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  };


  //Api to get dashboard data 

  const adminDashboard = async(req,res)=>{
     try {
      const doctors = await doctorModels.find({})
      const user = await userModels.find({})
      const appointment = await appointmentsModels.find({})

      const dashData = {
        doctors:doctors.length,
        appointment : appointment.length,
        patients : appointment.length,
        latestAppointments : appointment.reverse().slice(0,5)

      }

      res.json({ success: true, dashData });
      
     } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error });
     }
  }
  

module.exports = { addDoctor,loginAdmin,allDoctors ,appointmentAdmin,appoinmentsCancel,adminDashboard};
