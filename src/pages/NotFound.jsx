import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="mc-auth text-center">
      <div className="container">
        <div className="mc-404">404</div>
        <h1 className="mc-auth-title">Page not found</h1>
        <p className="mc-muted">The page you are looking for does not exist or has moved.</p>
        <Link to="/" className="btn btn-mc btn-mc-primary">Back to home</Link>
      </div>
    </section>
  )
}
