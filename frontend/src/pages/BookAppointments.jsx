import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assetsDoc";
import "../pages/BookAppointments.css";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import axios from "axios";

const BookAppointments = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData, userData } =
    useContext(AppContext);

  const [docInfo, setDocInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [selectedTime, setSelectedTime] = useState(null);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Fetch available slots
  const getAvailableSlots = () => {
    const slots = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const slotDate = new Date(today);
      slotDate.setDate(today.getDate() + i); // Adjust date properly
      const dateString = slotDate.toISOString().split("T")[0]; // Ensure proper date format

      const endTime = new Date(slotDate);
      endTime.setHours(21, 0, 0, 0); // Set end time to 9 PM

      const currentTime = new Date(slotDate);
      if (i === 0 && today.getHours() >= 10) {
        currentTime.setHours(today.getHours() + 1);
        currentTime.setMinutes(today.getMinutes() > 30 ? 30 : 0);
      } else {
        currentTime.setHours(10);
        currentTime.setMinutes(0);
      }

      const dailySlots = [];
      while (currentTime < endTime) {
        dailySlots.push({
          datetime: new Date(currentTime),
          time: currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        currentTime.setMinutes(currentTime.getMinutes() + 30);
      }

      slots.push({ date: dateString, slots: dailySlots });
    }

    setDocSlot(slots);
  };

  // Booking function
  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointments");
      navigate("/login");
      return;
    }

    if (!selectedTime) {
      toast.warn("Please select a time slot");
      return;
    }

    if (!userData || !userData._id) {
      toast.error("User data not found. Please log in again.");
      return;
    }

    try {
      const currentSlot = docSlot[slotIndex];
      if (!currentSlot) {
        toast.error("No slot selected");
        return;
      }

      const timeSlot = currentSlot.slots.find((slot) => slot.time === selectedTime);
      if (!timeSlot) {
        toast.error("Invalid time slot");
        return;
      }

      const [year, month, day] = currentSlot.date.split("-");
      const slotDate = `${day}_${month}_${year}`;
      const slotTime = selectedTime;

      const { data } = await axios.post(
        `${backendUrl}/api/user/book-appointment`,
        { docId, slotDate, slotTime, userId: userData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success(data.message || "Appointment booked successfully!");
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message || "Failed to book appointment");
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  // Fetch doctor details
  useEffect(() => {
    if (doctors.length > 0) {
      const selectedDoc = doctors.find((doc) => String(doc._id) === String(docId));
      setDocInfo(selectedDoc || null);
    }
  }, [doctors, docId]);

  // Initialize available slots
  useEffect(() => {
    getAvailableSlots();
  }, []);

  // Set default time slot
  useEffect(() => {
    if (docSlot.length > 0 && docSlot[slotIndex]?.slots?.length > 0) {
      setSelectedTime(docSlot[slotIndex].slots[0].time);
    } else {
      setSelectedTime(null);
    }
  }, [docSlot, slotIndex]);

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  if (!docInfo) {
    return <p>Doctor not found.</p>;
  }

  return (
    <>
      <div className="appointment-container">
        <div className="doctor-image">
          <img src={docInfo.image || assets.doctor_placeholder} alt={docInfo.name} />
        </div>

        <div className="doctor-details">
          <h2>{docInfo.name}</h2>
          <p>{docInfo.speciality}</p>
          <p>{docInfo.experience} years of experience</p>
          <p>{docInfo.qualification}</p>
        </div>

        <div className="about-section">
          <p>
            About <img src={assets.info_icon} alt="info" />
          </p>
          <p>{docInfo.about}</p>
          <p>
            Appointment fee: <span>{docInfo.fees}{currencySymbol}</span>
          </p>
        </div>

        {/* Booking Slots */}
        <div>
          <h3>Booking Slots</h3>
          <div className="slot-dates">
            {docSlot.map((item, index) => (
              <div
                key={index}
                className={`slot-container ${index === slotIndex ? "active" : ""}`}
                onClick={() => setSlotIndex(index)}
              >
                <p>{days[new Date(item.date).getDay()]}</p>
                <p>{new Date(item.date).getDate()}</p>
              </div>
            ))}
          </div>

          <div className="slot-times">
            {docSlot[slotIndex]?.slots?.length > 0 ? (
              docSlot[slotIndex].slots.map((item, index) => (
                <p
                  key={index}
                  className={selectedTime === item.time ? "active" : ""}
                  onClick={() => handleTimeSelect(item.time)}
                >
                  {item.time}
                </p>
              ))
            ) : (
              <p className="no-slots">No available slots for this day</p>
            )}
          </div>
        </div>

        <button onClick={bookAppointment} className="book-appointment">
          Book Appointment
        </button>
      </div>
      <Footer />
    </>
  );
};

export default BookAppointments;
