import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AppContext';
import './Appointments.css'; // Import the CSS file

const Appointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointments } = useContext(AdminContext);
  const { calculateAge, slotDateFormat, currencySymbol } = useContext(AppContext);
  
  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);
    
  return (
    <div className="appointments-container">
      <h2 className="appointments-title">All Appointments</h2>
      <div className="appointments-list">
        <div className="appointments-header">
          <p>#</p>
          <p>Patient Name</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor Name</p>
          <p>Fee</p>
          <p>Action</p>
        </div>
        
        {appointments.map((item, index) => (
          <div key={index} className="appointment-row">
            <p>{index + 1}</p>
            <div className="user-info">
              <img src={item.userData.image} alt={item.userData.name} />
              <p>{item.userData.name}</p>
            </div>
            <p className="appointment-age">{calculateAge(item.userData.dob)}</p>
            <p className="appointment-date">{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            
            <div className="doctor-info">
              <img src={item.docData.image} alt={item.docData.name} />
              <p>{item.docData.name}</p>
            </div>
            
            <p className="appointment-fee">
              {item.amount}
            </p>
            
            {item.cancelled ? (
              <p className="appointment-status">Cancelled</p>
            ) : (
              <button 
                className="cancel-button"
                onClick={() => cancelAppointments(item._id)}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Appointments;