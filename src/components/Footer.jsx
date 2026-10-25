import { Link } from 'react-router-dom'
import logo from '../assets/logo.png'

export default function Footer() {
  return (
    <footer className="mc-footer">
      <div className="container">
        <div className="row g-4 py-5">
          <div className="col-lg-4">
            <div className="mc-brand mb-3 text-white">
              <img src={logo} alt="" width="40" height="40" />
              <span className="mc-brand-text">
                Med<b>Care</b>
                <small>Patient Booking System</small>
              </span>
            </div>
            <p className="mc-footer-text">
              Book, view and manage doctor appointments from anywhere. Simple scheduling for better healthcare.
            </p>
          </div>
          <div className="col-6 col-lg-2 offset-lg-1">
            <h6>Explore</h6>
            <ul className="list-unstyled mc-footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/book">Book Appointment</Link></li>
            </ul>
          </div>
          <div className="col-6 col-lg-2">
            <h6>Account</h6>
            <ul className="list-unstyled mc-footer-links">
              <li><Link to="/profile">Profile</Link></li>
              <li><Link to="/appointments">Appointments</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>
          <div className="col-lg-3">
            <h6>Emergency</h6>
            <p className="mc-footer-phone">
              <i className="bi bi-telephone-fill me-2" />
              (+01) – 256 567 550
            </p>
            <p className="mc-footer-text mb-0">We provide 24/7 customer support for emergency cases.</p>
          </div>
        </div>
        <div className="mc-footer-bottom">© {new Date().getFullYear()} All Rights Reserved By Mustafa Raza</div>
      </div>
    </footer>
  )
}
