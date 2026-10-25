import { Link } from 'react-router-dom'
import { formatMoney } from '../lib/format'

export default function ServiceCard({ service, detailed = false }) {
  return (
    <article className="mc-card mc-service h-100">
      <div className="mc-service-icon">
        <i className={`bi ${service.icon}`} />
      </div>
      <h3 className="mc-service-title">{service.name}</h3>
      <p className="mc-muted">{service.blurb}</p>

      {detailed && (
        <ul className="mc-checks">
          {service.points.map((p) => (
            <li key={p}>
              <i className="bi bi-check2-circle" /> {p}
            </li>
          ))}
        </ul>
      )}

      <div className="mc-service-meta">
        <span>
          <i className="bi bi-clock" /> {service.duration}
        </span>
        <strong>{formatMoney(service.price)}</strong>
      </div>

      <Link to={`/book?service=${encodeURIComponent(service.name)}`} className="btn btn-mc btn-mc-primary btn-sm w-100 mt-3">
        Book now <i className="bi bi-arrow-right ms-1" />
      </Link>
    </article>
  )
}
