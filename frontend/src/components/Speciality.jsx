import React from 'react';
import './Speciality.css';
import { specialityData } from '../assets/assetsDoc';
import { Link } from 'react-router-dom';

const Speciality = () => {
  return (
    <>
      <section id="features" className="features">
        <div className="container">
          <h2 className="section-name">Our Specialities</h2>
          <div className="features-grid">
            {specialityData.map((data, index) => {
              return (
                <div key={index} className="feature-card">
                  <Link to={`/doctors/${data.speciality}`}>
                    <img className="feature-icon" src={data.image} alt={data.speciality} />
                    <h3>{data.speciality}</h3>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2 className="section-name">How It Works</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Create an Account</h3>
              <p>Sign up as a patient to access our services.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Find a Doctor</h3>
              <p>Browse doctors by specialty, availability, or location.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Book Appointment</h3>
              <p>Select a convenient time slot and confirm your booking.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h3>Get Care</h3>
              <p>Visit the doctor at the scheduled time or connect online.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Speciality;
