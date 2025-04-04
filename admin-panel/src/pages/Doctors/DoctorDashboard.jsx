import React, { useContext, useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Clock, Users, UserPlus } from 'lucide-react';
import '../../pages/Admin/Dashboard.css'

const DoctorDashboard = () => {
  const {dToken,dashData,setDashData,getDashData,completeAppointments, cancelAppointments} = useContext(DoctorContext);
  const { slotDateFormat ,currencySymbol} = useContext(AppContext);

  useEffect(()=>{

    if(dToken){
      getDashData()
    }

  },[dToken])


  const handleCompleteAppointment = async (docId, appointmentId) => {
    await completeAppointments(docId, appointmentId);
    getAppointments(); // ✅ Refresh UI
  };
  
  const handleCancelAppointment = async (docId, appointmentId) => {
    await cancelAppointments(docId, appointmentId);
    getAppointments(); // ✅ Refresh UI
  };
  


  // Sample chart data - you would replace with actual data
  const appointmentData = [
    { name: 'Mon', count: 12 },
    { name: 'Tue', count: 19 },
    { name: 'Wed', count: 15 },
    { name: 'Thu', count: 18 },
    { name: 'Fri', count: 22 },
    { name: 'Sat', count: 10 },
    { name: 'Sun', count: 8 },
  ];

  const formatAppointments = () => {
    if (!dashData.dashData?.latestAppointments || !Array.isArray(dashData.dashData.latestAppointments)) {
      return [];
    }
    return dashData.dashData.latestAppointments.slice(0, 5);
  };

  const latestAppointments = formatAppointments();

  return dashData && dashData.dashData && (
    <div className="dashboard-container">
    <h1 className="dashboard-title">Doctors Dashboard</h1>
    
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon">
          <Users color="#4361ee" size={28} />
        </div>
        <div className="stat-content">
          <h3>Earnings</h3>
          <p className="stat-value">{dashData.dashData.earnings || 0}{currencySymbol}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <Calendar color="#4cc9f0" size={28} />
        </div>
        <div className="stat-content">
          <h3>Appointments</h3>
          <p className="stat-value">{dashData.dashData.appointments || 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon">
          <UserPlus color="#4895ef" size={28} />
        </div>
        <div className="stat-content">
          <h3>Patients</h3>
          <p className="stat-value">{dashData.dashData.patients || 0}</p>
        </div>
      </div>
    </div>

    <div className="dashboard-content">
      <div className="chart-section">
        <h2>Appointments Overview</h2>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4361ee" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="latest-appointments">
        <h2>Latest Appointments</h2>
        {latestAppointments.length > 0 ? (
          <div className="appointments-list">
            {dashData.dashData.latestAppointments.map((item, index) => (
              <div className="appointment-item" key={index}>
                <div className="appointment-info">
                  <div className="appointment-patient">
                    {item.userData.name || 'Doctor Name'}
                  </div>
                  <div className="doctor-details">
                    {item.userData.image && (
                      <div className="doctor-image">
                        <img src={item.userData.image} alt={item.userData.name} />
                      </div>
                    )}
                    <div className="appointment-details">
                      <span className="appointment-time">
                        <Clock size={14} />
                        {item.slotTime || '9:00 AM'}
                      </span>
                      <span className="appointment-date">
                        {slotDateFormat(item.slotDate) || '2025-04-02'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="appointment-status" 
                     data-status={item.status || 'scheduled'}>
                  {item.status || 'Scheduled'}
                </div>
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
            ))}
          </div>
        ) : (
          <div className="no-data">No recent appointments</div>
        )}
      </div>
    </div>
  </div>
  )
}

export default DoctorDashboard
