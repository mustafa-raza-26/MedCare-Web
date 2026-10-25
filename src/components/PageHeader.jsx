import { Link } from 'react-router-dom'

export default function PageHeader({ title, subtitle, crumb, children }) {
  return (
    <section className="mc-pagehead">
      <div className="container">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb mc-crumbs">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {crumb || title}
            </li>
          </ol>
        </nav>
        <div className="d-flex flex-wrap align-items-end justify-content-between gap-3">
          <div>
            <h1 className="mc-pagehead-title">{title}</h1>
            {subtitle && <p className="mc-pagehead-sub">{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  )
}
