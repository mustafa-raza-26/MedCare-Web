import { useState } from 'react'
import googleIcon from '../assets/google.webp'
import fbIcon from '../assets/fb.png'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

/** Text input + label + inline error, built on Bootstrap's form classes. */
export function Field({ label, id, error, hint, className = '', children, ...input }) {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label mc-label">
          {label}
        </label>
      )}
      {children || <input id={id} className={`form-control mc-input ${error ? 'is-invalid' : ''}`} {...input} />}
      {error ? <div className="invalid-feedback d-block">{error}</div> : hint ? <div className="form-text">{hint}</div> : null}
    </div>
  )
}

export function PasswordInput({ label = 'Password', id = 'password', error, value, onChange, autoComplete, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label mc-label">
        {label}
      </label>
      <div className="mc-pass">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`form-control mc-input ${error ? 'is-invalid' : ''}`}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          placeholder={placeholder || label}
        />
        <button
          type="button"
          className="mc-pass-toggle"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} />
        </button>
      </div>
      {error && <div className="invalid-feedback d-block">{error}</div>}
    </div>
  )
}

export function SocialButtons({ verb = 'Continue' }) {
  const { signInWithProvider } = useAuth()
  const toast = useToast()

  async function go(provider) {
    const { error } = await signInWithProvider(provider)
    if (error) toast.error(`${provider[0].toUpperCase() + provider.slice(1)} sign-in failed: ${error.message}`)
  }

  return (
    <>
      <div className="mc-divider">
        <span>or</span>
      </div>
      <div className="d-flex gap-2">
        <button type="button" className="btn mc-social flex-fill" onClick={() => go('google')}>
          <img src={googleIcon} alt="" width="22" height="22" /> {verb} with Google
        </button>
        <button type="button" className="btn mc-social flex-fill" onClick={() => go('facebook')}>
          <img src={fbIcon} alt="" width="26" height="26" /> {verb} with Facebook
        </button>
      </div>
    </>
  )
}

/** Bootstrap modal driven by React state (no bootstrap JS needed). */
export function ConfirmModal({ show, title, body, confirmLabel = 'Confirm', danger, busy, onConfirm, onClose }) {
  if (!show) return null
  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} />
      <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true" onClick={onClose}>
        <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
          <div className="modal-content mc-modal">
            <div className="modal-body text-center p-4">
              <div className={`mc-modal-icon ${danger ? 'is-danger' : ''}`}>
                <i className={`bi ${danger ? 'bi-exclamation-triangle' : 'bi-question-circle'}`} />
              </div>
              <h5 className="mt-3">{title}</h5>
              <p className="mc-muted mb-4">{body}</p>
              <div className="d-flex gap-2 justify-content-center">
                <button type="button" className="btn btn-mc btn-mc-outline" onClick={onClose} disabled={busy}>
                  Keep it
                </button>
                <button
                  type="button"
                  className={`btn btn-mc ${danger ? 'btn-mc-danger' : 'btn-mc-primary'}`}
                  onClick={onConfirm}
                  disabled={busy}
                >
                  {busy && <span className="spinner-border spinner-border-sm me-2" />}
                  {confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
