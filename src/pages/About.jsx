import PageHeader from '../components/PageHeader'
import { AboutSection, Hotline, Testimonial } from '../components/Sections'
import { FEATURES } from '../lib/data'

export default function About() {
  return (
    <>
      <PageHeader title="About Us" subtitle="Making healthcare more accessible and efficient." />
      <AboutSection />
      <section className="mc-section mc-section-soft">
        <div className="container">
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
    </>
  )
}
