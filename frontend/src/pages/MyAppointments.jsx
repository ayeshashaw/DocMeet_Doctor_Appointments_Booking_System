import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import "./MyAppointments.css"; // Import the CSS file

const MyAppointments = () => {
  const { doctors, backendUrl, token, getDoctorsData, userData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);

  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    if (!slotDate || typeof slotDate !== "string" || !slotDate.includes("_")) {
      return "Invalid Date";
    }
    const dateArray = slotDate.split("_").map(Number);
    if (dateArray.length !== 3 || isNaN(dateArray[0]) || isNaN(dateArray[1]) || isNaN(dateArray[2])) {
      return "Invalid Date";
    }
    return `${dateArray[0]} ${months[dateArray[1]]} ${dateArray[2]}`;
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch appointments");
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { userId: userData._id, appointmentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.success) {
        toast.success("Appointment cancelled successfully");
        getUserAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const getInitials = (name) => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleImageError = (e) => {
    e.target.style.display = "none";
    const fallback = e.target.nextElementSibling;
    if (fallback) {
      fallback.style.display = "flex";
    }
  };

  return (
    <div className="appointments-container">
      <h2 className="section-title">My Appointments</h2>
      <div className="appointments-list">
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div key={index} className={`appointment-card ${item.cancelled ? "cancelled" : ""}`}>
              <div className="doctor-image-container">
                <img
                  className="doctor-image"
                  src={item.docData?.image || ""}
                  alt={item.docData?.name || "Doctor"}
                  onError={handleImageError}
                />
                <div className="doctor-image-fallback" style={{ display: "none" }}>
                  {getInitials(item.docData?.name)}
                </div>
              </div>
              <div className="appointment-details">
                <p className="doctor-name">{item.docData?.name || "Doctor"}</p>
                <p className="doctor-specialty">{item.speciality || "Speciality not available"}</p>
                <p className="appointment-time">
                  <span>Date & Time:</span> {slotDateFormat(item.slotDate)} {item.slotTime || ""}
                </p>
              </div>
              <div>
                {!item.cancelled && !item.isCompleted ? (
                  <button className="action-button cancel-button" onClick={() => cancelAppointment(item._id)}>
                    Cancel
                  </button>
                ) : (
                  <button className="action-button cancelled-badge" disabled>
                    {item.cancelled ? "Cancelled" : "Completed"}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">No appointments found</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;
