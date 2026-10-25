import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { EMAIL_RE } from '../lib/format'
import { Field, PasswordInput, SocialButtons } from '../components/FormBits'

function strength(pw) {
  let score = 0
  if (pw.length >= 6) score++
  if (pw.length >= 10) score++
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function Signup() {
  const { user, signUp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ name: '', email: '', password: '', number: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to="/" replace />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const score = strength(form.password)

  async function handleSubmit(e) {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (!EMAIL_RE.test(form.email.trim())) next.email = 'Enter a valid email address.'
    if (form.password.length < 6) next.password = 'Use at least 6 characters.'
    if (form.number && !/^[+\d][\d\s-]{6,}$/.test(form.number.trim())) next.number = 'Enter a valid phone number.'
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    const { error, hasSession } = await signUp({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      number: form.number.trim(),
    })
    setBusy(false)
    if (error) {
      toast.error(`Signup error: ${error.message}`)
      return
    }
    if (hasSession) {
      toast.success('Your account has been created successfully!')
      navigate('/', { replace: true })
    } else {
      toast.success('Account created! Check your email to confirm it, then log in.')
      navigate('/login', { replace: true, state: location.state })
    }
  }

  return (
    <section className="mc-auth">
      <div className="container">
        <div className="mc-auth-card mc-auth-card-wide">
          <div className="text-center mb-4">
            <div className="mc-auth-icon"><i className="bi bi-person-plus" /></div>
            <h1 className="mc-auth-title">Create your account</h1>
            <p className="mc-muted">It takes less than a minute.</p>
          </div>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">
              <Field className="col-md-6" label="Full name" id="name" placeholder="Your name" autoComplete="name"
                value={form.name} onChange={set('name')} error={errors.name} />
              <Field className="col-md-6" label="Phone number" id="num" type="tel" placeholder="+92 300 1234567"
                autoComplete="tel" value={form.number} onChange={set('number')} error={errors.number} />
            </div>
            <Field label="Email" id="email" type="email" placeholder="you@example.com" autoComplete="email"
              value={form.email} onChange={set('email')} error={errors.email} />
            <PasswordInput value={form.password} onChange={set('password')} error={errors.password}
              autoComplete="new-password" />
            {form.password && (
              <div className="mc-strength" aria-hidden="true">
                {[1, 2, 3, 4].map((n) => (
                  <span key={n} className={n <= score ? `on s${score}` : ''} />
                ))}
              </div>
            )}
            <button type="submit" className="btn btn-mc btn-mc-primary w-100 mt-2" disabled={busy}>
              {busy && <span className="spinner-border spinner-border-sm me-2" />}
              Sign Up
            </button>
          </form>
          <SocialButtons verb="Sign up" />
          <p className="text-center mc-muted mt-4 mb-0">
            Already have an account? <Link to="/login" state={location.state}>Login</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
