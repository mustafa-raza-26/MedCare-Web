import PageHeader from '../components/PageHeader'
import ServiceCard from '../components/ServiceCard'
import { Hotline, Testimonial } from '../components/Sections'
import { SERVICES } from '../lib/data'

export default function Services() {
  return (
    <>
      <PageHeader
        title="Health Services"
        crumb="Services"
        subtitle="Choose a service to see what is included, then book your visit in a few clicks."
      />
      <section className="mc-section">
        <div className="container">
          <div className="row g-4">
            {SERVICES.map((s) => (
              <div className="col-md-6 col-lg-4" key={s.id}>
                <ServiceCard service={s} detailed />
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
