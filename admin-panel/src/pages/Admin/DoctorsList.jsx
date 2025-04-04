import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import './DoctorsList.css'

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailablity } = useContext(AdminContext);

  useEffect(() => {
    let isMounted = true;

    const fetchDoctors = async () => {
      if (aToken && isMounted) {
        await getAllDoctors();
      }
    };

    fetchDoctors();

    return () => { isMounted = false; };
  }, [aToken, getAllDoctors]);

  return (
    <div className="doctors-container">
      <h1 className="doctors-heading">
        All Doctors
      </h1>

      <div className="doctors-grid">
        {doctors.map((item, index) => (
          <div key={item._id || index} className="doctor-card">
            <div className="doctor-image-container">
              <img src={item.image || "default-image-url.jpg"} alt={item.name || "Doctor"} className="doctor-image"/>
            </div>
            <div className="doctor-info">
              <p className="doctor-name">
                {item.name}
              </p>
              <p className="doctor-speciality">
                {item.speciality}
              </p>
              <div className="availability-container">
                <input 
                  type="checkbox" 
                  checked={item.available} 
                  onChange={() => changeAvailablity(item._id)} 
                  className="availability-checkbox"
                />
                <p className={item.available ? "available" : "unavailable"}>
                  {item.available ? "Available" : "Unavailable"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList
