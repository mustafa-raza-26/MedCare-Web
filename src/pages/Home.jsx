import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { ARTICLES, FEATURES, SERVICES } from '../lib/data'
import ServiceCard from '../components/ServiceCard'
import { AboutSection, Hotline, Testimonial } from '../components/Sections'

export default function Home() {
  const { user } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  function handleBook() {
    if (!user) {
      toast.info('Please sign up or log in to book an appointment.')
      navigate('/login', { state: { from: '/book' } })
      return
    }
    navigate('/book')
  }

  return (
    <>
      <section className="mc-hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-7 col-xl-6">
              <span className="mc-eyebrow">Trusted online healthcare</span>
              <h1 className="mc-hero-title">
                Book Doctor <em>Appointments</em> Easily
              </h1>
              <p className="mc-lead">
                Easily book appointments with expert doctors online. Find the right doctor for your needs and
                schedule a visit at your convenience.
              </p>
              <div className="d-flex flex-wrap gap-3 mt-4">
                <button type="button" className="btn btn-mc btn-mc-primary btn-lg" onClick={handleBook}>
                  Book Now <i className="bi bi-arrow-right ms-2" />
                </button>
                <Link to="/services" className="btn btn-mc btn-mc-outline btn-lg">
                  Our services
                </Link>
              </div>
              <ul className="mc-hero-points">
                <li><i className="bi bi-check-circle-fill" /> Online booking</li>
                <li><i className="bi bi-check-circle-fill" /> 24/7 support</li>
                <li><i className="bi bi-check-circle-fill" /> Easy cancellation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mc-section" id="services">
        <div className="container">
          <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
            <div>
              <span className="mc-eyebrow">What we offer</span>
              <h2 className="mc-h2 mb-0">Health Services</h2>
            </div>
            <Link to="/services" className="mc-more">
              View all services <i className="bi bi-arrow-right" />
            </Link>
          </div>
          <div className="row g-4">
            {SERVICES.slice(0, 3).map((s) => (
              <div className="col-md-6 col-lg-4" key={s.id}>
                <ServiceCard service={s} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mc-section mc-section-soft">
        <div className="container">
          <div className="text-center mb-5">
            <span className="mc-eyebrow">Why MedCare</span>
            <h2 className="mc-h2">Care that fits around your life</h2>
          </div>
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div className="col-sm-6 col-lg-3" key={f.title}>
                <div className="mc-feature">
                  <i className={`bi ${f.icon}`} />
                  <h5>{f.title}</h5>
                  <p className="mc-muted mb-0">{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonial />
      <Hotline />

      <section className="mc-section">
        <div className="container">
          <div className="row g-4 align-items-end mb-5">
            <div className="col-md-5">
              <span className="mc-eyebrow">Health journal</span>
              <h2 className="mc-h2 mb-0">MedCare Experienced Doctors</h2>
            </div>
            <div className="col-md-7">
              <p className="mc-muted mb-0">
                Practical advice from our doctors on staying healthy, preparing for visits and understanding your
                care.
              </p>
            </div>
          </div>
          <div className="row g-4">
            {ARTICLES.map((a) => (
              <div className="col-md-6 col-lg-4" key={a.id}>
                <article className="mc-card mc-article h-100">
                  <div className="mc-article-img">
                    <img src={a.image} alt="" loading="lazy" />
                  </div>
                  <div className="p-4">
                    <small className="mc-tag">{a.tag}</small>
                    <h5 className="mt-2">{a.title}</h5>
                    <div className="mc-article-meta">
                      <span><i className="bi bi-chat" /> {String(a.comments).padStart(2, '0')} comments</span>
                      <span><i className="bi bi-heart" /> 0 likes</span>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutSection />
    </>
  )
}
