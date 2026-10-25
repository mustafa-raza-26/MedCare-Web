import { Link } from 'react-router-dom'
import doctorImg from '../assets/d1.webp'
import illustration from '../assets/bg2.png'

export function Testimonial() {
  return (
    <section className="mc-section mc-section-soft">
      <div className="container">
        <figure className="mc-quote text-center mx-auto">
          <img src={doctorImg} alt="Dr. Suzzane Holroyd" className="mc-quote-img" />
          <blockquote>
            “Good care starts with good access. When patients can book in a minute and arrive prepared, we spend our
            time on what matters: treating them.”
          </blockquote>
          <figcaption>Dr. Suzzane Holroyd</figcaption>
        </figure>
      </div>
    </section>
  )
}

export function Hotline() {
  return (
    <section className="mc-hotline">
      <div className="container text-center">
        <span className="mc-eyebrow mc-eyebrow-light">Emergency hotline</span>
        <a href="tel:+01256567550" className="mc-hotline-number">
          (+01) – 256 567 550
        </a>
        <p>We provide 24/7 customer support. Please feel free to contact us for emergency cases.</p>
      </div>
    </section>
  )
}

export function AboutSection() {
  return (
    <section className="mc-section" id="about">
      <div className="container">
        <div className="row align-items-center g-5">
          <div className="col-lg-7">
            <span className="mc-eyebrow">About us</span>
            <h2 className="mc-h2">Healthcare scheduling, made simple</h2>
            <p className="mc-lead">
              Patient Booking System is a web-based application that allows you to easily book, view and manage
              appointments with doctors at your convenience. We simplify healthcare scheduling through a friendly
              interface, ensuring a seamless and efficient experience.
            </p>
            <p className="mc-muted">
              Built with modern technologies, our aim is to make healthcare more accessible and efficient for
              everyone.
            </p>
            <Link to="/book" className="btn btn-mc btn-mc-primary mt-2">
              Book an appointment <i className="bi bi-arrow-right ms-2" />
            </Link>
          </div>
          <div className="col-lg-5 text-center">
            <div className="mc-about-art">
              <img src={illustration} alt="Doctors reviewing a patient chart" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
