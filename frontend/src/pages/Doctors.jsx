import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext.jsx';
import './Doctors.css';

const Doctors = () => {
  const { doctors } = useContext(AppContext);
  const navigate = useNavigate();
  const [filteredDocs, setFilteredDocs] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('All');

  const specialities = [
    'All',
    'General Physician',
    'Gynecologist',
    'Dermatologist',
    'Pediatricians',
    'Neurologist',
    'Gastroenterologist'
  ];

  // Function to filter doctors based on selected speciality
  const applyFilter = (speciality) => {
    setSelectedSpeciality(speciality);
    if (speciality === 'All') {
      setFilteredDocs(doctors);
    } else {
      setFilteredDocs(
        doctors.filter((item) => item.speciality.toLowerCase() === speciality.toLowerCase())
      );
    }
  };

  // Update filter when doctors or selectedSpeciality change
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      applyFilter(selectedSpeciality);
    }
  }, [doctors, selectedSpeciality]);

  // Initialize filteredDocs when component mounts
  useEffect(() => {
    if (doctors && doctors.length > 0) {
      setFilteredDocs(doctors);
    }
  }, []);

  return (
    <div className="doctors-container">
      <h1 className="doctors-title">Find the Right Doctor</h1>
      
      {/* Speciality Filter */}
      <div className="specialities-container">
        {specialities.map((spec, index) => (
          <button
            key={index}
            className={`speciality-btn ${selectedSpeciality === spec ? 'active' : ''}`}
            onClick={() => applyFilter(spec)}
          >
            {spec}
          </button>
        ))}
      </div>
      
      {/* Doctors Grid */}
      <div className="doctors-grid">
        {filteredDocs && filteredDocs.length > 0 ? (
          filteredDocs.map((doctor, index) => (
            <div 
              key={index} 
              className="doctor-card" 
              onClick={() => navigate(`/book-appointment/${doctor._id}`)}
            >
              <div className="doctor-image-container">
                <img src={doctor.image} alt={doctor.name} className="doctor-image" />
              </div>
              <div className="doctor-info">
                <h3 className="doctor-name">{doctor.name}</h3>
                <p className="doctor-speciality">{doctor.speciality}</p>
                <div className="doctor-details">
                  <p className="doctor-experience">{doctor.experience} years exp</p>
                  <p className="doctor-qualification">{doctor.degree}</p>
                </div>
                <div className="doctor-fee-container">
                  <span className="doctor-fee">₹{doctor.fees}</span>
                  <button className="book-btn">Book Now</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-doctors">
            <p>No doctors found for this specialty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;