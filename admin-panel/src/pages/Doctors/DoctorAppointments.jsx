import React, { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import "./DoctorAppointments.css";

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, completeAppointments, cancelAppointments } = useContext(DoctorContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]); // ✅ Removed getAppointments from dependencies to avoid infinite loop

  const handleCompleteAppointment = async (docId, appointmentId) => {
    await completeAppointments(docId, appointmentId);
    getAppointments(); // ✅ Refresh UI
  };
  
  const handleCancelAppointment = async (docId, appointmentId) => {
    await cancelAppointments(docId, appointmentId);
    getAppointments(); // ✅ Refresh UI
  };
  

  return (
    <div className="doctor-appointments-container">
      <h2 className="doctor-appointments-title">My Appointments</h2>
      <div className="doctor-appointments-list">
        <div className="doctor-appointments-header">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
          <p>Payment</p>
        </div>

        {appointments && appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div key={index} className="doctor-appointment-row">
              <p>{index + 1}</p>
              <div className="patient-info">
                <img
                  src={item.userData?.image || "/default-image.jpg"}
                  alt={item.userData?.name || "Unknown"}
                />
                <p>{item.userData?.name || "No Name"}</p>
              </div>
              <p className="appointment-age">
                {calculateAge(item.userData?.dob || "2000-01-01")}
              </p>
              <p className="appointment-date">
                {slotDateFormat(item.slotDate)}, {item.slotTime}
              </p>
              <p className="appointment-fee">{item.amount}</p>
              <div className="action-buttons">
                {item.cancelled ? (
                  <p className="cancelled-status">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="completed-status">Completed</p>
                ) : (
                  <>
                    <button
                      onClick={() => handleCompleteAppointment(item.docId, item._id)}
                      className="approve-button"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(item.docId, item._id)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
              <p className="payment-method">{item.payment || "Cash"}</p>
            </div>
          ))
        ) : (
          <p>No appointments found</p>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
