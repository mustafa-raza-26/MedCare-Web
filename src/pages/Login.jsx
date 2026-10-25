import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { EMAIL_RE } from '../lib/format'
import { Field, PasswordInput, SocialButtons } from '../components/FormBits'

export default function Login() {
  const { user, signIn } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || '/'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={redirectTo} replace />

  async function handleSubmit(e) {
    e.preventDefault()
    const next = {}
    if (!EMAIL_RE.test(email.trim())) next.email = 'Enter a valid email address.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    const { error } = await signIn(email.trim(), password)
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Welcome back! You have logged in successfully.')
    navigate(redirectTo, { replace: true })
  }

  return (
    <section className="mc-auth">
      <div className="container">
        <div className="mc-auth-card">
          <div className="text-center mb-4">
            <div className="mc-auth-icon"><i className="bi bi-person-lock" /></div>
            <h1 className="mc-auth-title">Welcome back</h1>
            <p className="mc-muted">Log in to book and manage your appointments.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <Field
              label="Email"
              id="email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="current-password"
            />
            <button type="submit" className="btn btn-mc btn-mc-primary w-100 mt-2" disabled={busy}>
              {busy && <span className="spinner-border spinner-border-sm me-2" />}
              Login
            </button>
          </form>
          <SocialButtons verb="Login" />
          <p className="text-center mc-muted mt-4 mb-0">
            Don&apos;t have an account? <Link to="/signup" state={location.state}>Register here</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
