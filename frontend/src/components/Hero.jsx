import React from 'react'
import { Link } from 'react-router-dom'
import './Hero.css'
import { assets } from '../assets/assetsDoc'


const Hero = () => {
  return (
    <section className="hero">
    <div className="container">
      <div className="hero-content">
        <h1 className="hero-title fade-in">Medical Appointment Booking Made Simple</h1>
        <p className="hero-subtitle slide-up">Book appointments with doctors online, manage your medical schedule, and get the care you need.</p>
        <div className="hero-buttons">
          <Link to="/doctors" className="btn btn-primary">Book an Appointment</Link>
        </div>
      </div>
      <div className="hero-image fade-in">
        <img src={assets.heroImage} alt="Doctor with patient" />
      </div>
    </div>
  </section>
  )
}

export default Hero
