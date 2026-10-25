import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supabase, TABLES } from '../lib/supabase'
import { formatDate, initials, parseDate } from '../lib/format'
import PageHeader from '../components/PageHeader'
import { Field, PasswordInput } from '../components/FormBits'

export default function Profile() {
  const { user, profile, updateProfile, updatePassword, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: profile?.name || '', number: profile?.number || '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const [pw, setPw] = useState({ next: '', confirm: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [pwBusy, setPwBusy] = useState(false)

  const [stats, setStats] = useState({ total: 0, upcoming: 0, next: null })

  useEffect(() => {
    if (!supabase || !user) return undefined
    let active = true
    supabase
      .from(TABLES.appointments)
      .select('id,date_time,doctor_Name')
      .eq('user_id', user.id)
      .then(({ data }) => {
        if (!active || !data) return
        const now = Date.now()
        const future = data
          .map((d) => ({ ...d, t: parseDate(d.date_time)?.getTime() ?? 0 }))
          .filter((d) => d.t >= now)
          .sort((a, b) => a.t - b.t)
        setStats({ total: data.length, upcoming: future.length, next: future[0] || null })
      })
    return () => {
      active = false
    }
  }, [user])

  const dirty = form.name.trim() !== (profile?.name || '') || form.number.trim() !== (profile?.number || '')
  const isEmailAccount = profile?.provider === 'email'

  async function saveProfile(e) {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your full name.'
    if (form.number && !/^[+\d][\d\s-]{6,}$/.test(form.number.trim())) next.number = 'Enter a valid phone number.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSaving(true)
    const { error } = await updateProfile({ name: form.name.trim(), number: form.number.trim() })
    setSaving(false)
    if (error) toast.error(error.message)
    else toast.success('Profile updated.')
  }

  async function savePassword(e) {
    e.preventDefault()
    const next = {}
    if (pw.next.length < 6) next.next = 'Use at least 6 characters.'
    if (pw.confirm !== pw.next) next.confirm = 'Passwords do not match.'
    setPwErrors(next)
    if (Object.keys(next).length) return
    setPwBusy(true)
    const { error } = await updatePassword(pw.next)
    setPwBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    setPw({ next: '', confirm: '' })
    toast.success('Password changed.')
  }

  async function handleLogout() {
    const { error } = await signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('You have been logged out.')
    navigate('/login')
  }

  return (
    <>
      <PageHeader title="My Profile" subtitle="Manage your personal details and account security." />
      <section className="mc-section pt-4">
        <div className="container">
          <div className="row g-4">
            <aside className="col-lg-4">
              <div className="mc-card p-4 text-center">
                <div className="mc-avatar mc-avatar-lg mx-auto">
                  {profile?.avatar ? <img src={profile.avatar} alt="" /> : initials(profile?.name)}
                </div>
                <h4 className="mt-3 mb-1">{profile?.name}</h4>
                <p className="mc-muted mb-1">{profile?.email}</p>
                {profile?.createdAt && <small className="mc-muted">Member since {formatDate(profile.createdAt)}</small>}

                <div className="mc-stats">
                  <div><strong>{stats.total}</strong><span>Total visits</span></div>
                  <div><strong>{stats.upcoming}</strong><span>Upcoming</span></div>
                </div>

                {stats.next && (
                  <div className="mc-next">
                    <small>Next appointment</small>
                    <strong>{stats.next.doctor_Name}</strong>
                    <span>{formatDate(stats.next.date_time)}</span>
                  </div>
                )}

                <div className="d-grid gap-2 mt-4">
                  <Link to="/appointments" className="btn btn-mc btn-mc-outline">My appointments</Link>
                  <Link to="/book" className="btn btn-mc btn-mc-primary">Book new appointment</Link>
                  <button type="button" className="btn btn-mc btn-mc-danger-outline" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2" /> Logout
                  </button>
                </div>
              </div>
            </aside>

            <div className="col-lg-8">
              <form className="mc-card p-4 p-md-5 mb-4" onSubmit={saveProfile} noValidate>
                <h5 className="mc-card-title">Personal information</h5>
                <div className="row">
                  <Field className="col-md-6" label="Full name" id="pname" value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} />
                  <Field className="col-md-6" label="Phone number" id="pnum" type="tel" placeholder="+92 300 1234567"
                    value={form.number} onChange={(e) => setForm((f) => ({ ...f, number: e.target.value }))}
                    error={errors.number} />
                  <Field className="col-12" label="Email" id="pmail" value={profile?.email || ''} readOnly disabled
                    hint="Your email is your login and can't be changed here." />
                </div>
                <div className="d-flex justify-content-end">
                  <button type="submit" className="btn btn-mc btn-mc-primary px-4" disabled={!dirty || saving}>
                    {saving && <span className="spinner-border spinner-border-sm me-2" />}
                    Save changes
                  </button>
                </div>
              </form>

              <form className="mc-card p-4 p-md-5" onSubmit={savePassword} noValidate>
                <h5 className="mc-card-title">Change password</h5>
                {isEmailAccount ? (
                  <>
                    <div className="row">
                      <div className="col-md-6">
                        <PasswordInput id="newpw" label="New password" value={pw.next} autoComplete="new-password"
                          onChange={(e) => setPw((p) => ({ ...p, next: e.target.value }))} error={pwErrors.next} />
                      </div>
                      <div className="col-md-6">
                        <PasswordInput id="confpw" label="Confirm password" value={pw.confirm} autoComplete="new-password"
                          onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} error={pwErrors.confirm} />
                      </div>
                    </div>
                    <div className="d-flex justify-content-end">
                      <button type="submit" className="btn btn-mc btn-mc-outline px-4" disabled={pwBusy || !pw.next}>
                        {pwBusy && <span className="spinner-border spinner-border-sm me-2" />}
                        Update password
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="mc-muted mb-0">
                    You signed in with {profile?.provider}. Your password is managed by that provider.
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
