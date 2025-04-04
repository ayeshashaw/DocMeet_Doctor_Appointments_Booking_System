import React from 'react'
import { assets } from '../assets/assetsDoc'
import './About.css'
import Footer from '../components/Footer'

const About = () => {
  return (
    <>
    <div className="about-container">
      <h1 className="about-title">About Us</h1>
      
      <div className="about-content">
        <div className="about-text">
          <section className="welcome-section">
            <h2>Welcome to DocMeet</h2>
            <p>
              Where innovation meets excellence in healthcare technology. Our mission is to simplify and enhance the process of booking medical appointments, ensuring seamless connectivity between patients and healthcare professionals.
            </p>
          </section>

          <section className="who-we-are">
            <h2>Who We Are</h2>
            <p>
              At DocMeet, we are a passionate team of developers, designers, and healthcare experts dedicated to creating user-friendly solutions that empower patients and doctors alike. With a strong emphasis on technology-driven efficiency, we strive to make healthcare more accessible and convenient for everyone.
            </p>
          </section>

          <section className="what-we-do">
            <h2>What We Do</h2>
            <p>
              We provide an advanced online appointment booking system that allows patients to find the right doctor, choose a suitable time slot, and book their appointments with ease. Our platform eliminates long waiting times and makes scheduling medical visits effortless.
            </p>
            
            <div className="key-features">
              <h3>Our Key Features:</h3>
              <ul>
                <li> User-friendly calendar for selecting appointment dates</li>
                <li> Real-time availability of doctors and instant booking confirmation</li>
                <li>Secure and reliable data management</li>
                <li>Seamless payment integration for hassle-free transactions</li>
              </ul>
            </div>
          </section>

          <section className="our-vision">
            <h2>Our Vision</h2>
            <p>
              We believe that healthcare should be efficient, accessible, and stress-free. Our vision is to revolutionize the way patients connect with medical professionals, ensuring a smooth, transparent, and digital-first experience.
            </p>
          </section>

          <section className="why-choose-us">
            <h2>Why Choose Us?</h2>
            <ul>
              <li>Convenience: Schedule appointments anytime, anywhere</li>
              <li>Reliability: Verified doctors and secure platform</li>
              <li>Innovation: Cutting-edge technology for a seamless experience</li>
              <li> Customer Support: Dedicated assistance for all your queries</li>
            </ul>
          </section>

          <p className="call-to-action">
            Join us in transforming the future of healthcare. Book your next appointment with DocMeet and experience a smarter way to connect with healthcare professionals!
          </p>
        </div>

        <div className="about-image">
          <img src={assets.about_image} alt='DocMeet Healthcare Platform' />
        </div>
      </div>

     
    </div>
    <Footer/>
    </>
  )
}

export default About