const validate = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");

const userModels = require("../models/userModels");
const doctorsModels = require("../models/doctorsModels");
const appointmentModels = require("../models/appointmentsModels");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "Missing Details" });
    }

    if (!validate.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: "Enter a strong password (min. 6 chars)" });
    }

    const existingUser = await userModels.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new userModels({ name, email, password: hashPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({ success: true, token });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Missing email or password" });
    }

    const user = await userModels.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await userModels.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, gender, address, dob } = req.body;
    const { id } = req.user;
    const imageFile = req.file;

    if (!name || !phone || !gender || !address || !dob) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const updateData = { name, phone, gender, dob };

    try {
      updateData.address = typeof address === "string" ? JSON.parse(address) : address;
    } catch (parseError) {
      return res.status(400).json({ success: false, message: "Invalid address format" });
    }

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      updateData.image = imageUpload.secure_url;
    }

    const updatedUser = await userModels.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Book Appointments
const bookAppointments = async (req, res) => {

  try {
      let { userId, docId, slotDate, slotTime } = req.body;
  
      // ✅ Convert docId & userId to ObjectId (Prevents BSONError)
      if (!mongoose.Types.ObjectId.isValid(docId) || !mongoose.Types.ObjectId.isValid(userId)) {
          return res.status(400).json({ success: false, message: "Invalid doctor or user ID" });
      }
  
      docId = new mongoose.Types.ObjectId(docId);
      userId = new mongoose.Types.ObjectId(userId);
  
      const docData = await doctorsModels.findById(docId).select("-password");
      if (!docData) return res.status(404).json({ success: false, message: "Doctor not found" });
  
      if (!docData.available) {
          return res.status(400).json({ success: false, message: "Slot not available" });
      }
  
      let slots_booked = docData.slots_booked || {};
  
      // ✅ Check and update slot availability
      if (!slots_booked[slotDate]) {
          slots_booked[slotDate] = [];
      }
      
      if (slots_booked[slotDate].includes(slotTime)) {
          return res.status(400).json({ success: false, message: "Slot already booked" });
      } else {
          slots_booked[slotDate].push(slotTime);
      }
  
      // ✅ Fetch user data safely
      const userData = await userModels.findById(userId).select("-password");
      if (!userData) return res.status(404).json({ success: false, message: "User not found" });
  
      // Remove `slots_booked` from `docData`
      const { slots_booked: _, ...filteredDocData } = docData.toObject();
  
      // ✅ Prepare appointment data
      const appointmentData = {
          userId,
          docId,
          userData,
          docData: filteredDocData,
          amount: docData.fees,
          slotTime,
          slotDate,
          date: Date.now(),
      };
  
      // ✅ Save appointment
      const newAppointment = new appointmentModels(appointmentData);
      await newAppointment.save();
  
      // ✅ Update doctor’s slots
      await doctorsModels.findByIdAndUpdate(docId, { slots_booked });
  
      res.status(201).json({ success: true, message: "Appointment booked successfully" });
  } catch (error) {
      console.error("Error booking appointment:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
  
}

// Cancel Appointments
const cancelAppointments = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointment = await appointmentModels.findById(appointmentId);
    if (!appointment || appointment.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized or not found" });
    }

    await appointmentModels.findByIdAndUpdate(appointmentId, { cancelled: true });

    const doctor = await doctorsModels.findById(appointment.docId);
    if (doctor) {
      doctor.slots_booked[appointment.slotDate] = doctor.slots_booked[appointment.slotDate].filter(time => time !== appointment.slotTime);
      await doctor.save();
    }

    res.json({ success: true, message: "Appointment cancelled" });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// List Appointments
const listAppointments = async (req, res) => {
  try {
    const userId = req.user.id;
    const appointments = await appointmentModels.find({ userId }).sort({ date: -1 });

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile, bookAppointments, cancelAppointments, listAppointments };
