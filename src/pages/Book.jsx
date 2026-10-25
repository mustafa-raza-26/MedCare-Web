import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supabase, NOT_CONFIGURED_MESSAGE, TABLES } from '../lib/supabase'
import { useDoctors } from '../lib/useDoctors'
import { EMAIL_RE, isFuture, minDateTimeLocal } from '../lib/format'
import PageHeader from '../components/PageHeader'
import { Field } from '../components/FormBits'

export default function Book() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { doctors, loading: loadingDoctors, usingSample } = useDoctors()

  const service = params.get('service')
  const [form, setForm] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    number: profile?.number || '',
    age: '',
    dateTime: '',
    gender: '',
    reason: service ? `${service} consultation` : '',
    doctor: '',
  })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter the patient name.'
    if (!EMAIL_RE.test(form.email.trim())) e.email = 'Enter a valid email address.'
    if (!/^[+\d][\d\s-]{6,}$/.test(form.number.trim())) e.number = 'Enter a valid phone number.'
    const age = Number(form.age)
    if (!form.age || !Number.isFinite(age) || age < 0 || age > 120) e.age = 'Enter an age between 0 and 120.'
    if (!form.dateTime) e.dateTime = 'Choose a date and time.'
    else if (!isFuture(form.dateTime)) e.dateTime = 'Choose a time in the future.'
    if (!form.gender) e.gender = 'Select a gender.'
    if (form.reason.trim().length < 3) e.reason = 'Tell the doctor briefly why you are visiting.'
    if (!form.doctor) e.doctor = 'Select a doctor.'
    return e
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      toast.warning('Please fix the highlighted fields.')
      return
    }
    if (!supabase) {
      toast.error(NOT_CONFIGURED_MESSAGE)
      return
    }
    setBusy(true)
    const { error } = await supabase.from(TABLES.appointments).insert({
      user_id: user.id,
      patient_Name: form.name.trim(),
      email: form.email.trim(),
      contact_No: form.number.trim(),
      age: Number(form.age),
      date_time: form.dateTime,
      gender: form.gender,
      reason: form.reason.trim(),
      doctor_Name: form.doctor,
    })
    setBusy(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Your appointment has been booked!')
    navigate('/appointments')
  }

  return (
    <>
      <PageHeader title="Book an Appointment" subtitle="Fill in the details below and we will reserve your visit." />
      <section className="mc-section pt-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-9 col-xl-8">
              <form className="mc-card p-4 p-md-5" onSubmit={handleSubmit} noValidate>
                {service && (
                  <div className="mc-note mb-4">
                    <i className="bi bi-info-circle" /> Booking: <strong>{service}</strong>
                  </div>
                )}
                {usingSample && (
                  <div className="mc-note mc-note-warn mb-4">
                    <i className="bi bi-exclamation-circle" /> Showing sample doctors. Add rows to your doctors table to
                    list real ones.
                  </div>
                )}
                <div className="row">
                  <Field className="col-md-6" label="Patient name *" id="nameAp" placeholder="Full name"
                    value={form.name} onChange={set('name')} error={errors.name} />
                  <Field className="col-md-6" label="Email *" id="emailAp" type="email" placeholder="you@example.com"
                    value={form.email} onChange={set('email')} error={errors.email} />
                  <Field className="col-md-6" label="Phone number *" id="num" type="tel" placeholder="+92 300 1234567"
                    value={form.number} onChange={set('number')} error={errors.number} />
                  <Field className="col-md-3" label="Age *" id="age" type="number" min="0" max="120" placeholder="Age"
                    value={form.age} onChange={set('age')} error={errors.age} />
                  <Field className="col-md-3" label="Gender *" id="gender" error={errors.gender}>
                    <select id="gender" className={`form-select mc-input ${errors.gender ? 'is-invalid' : ''}`}
                      value={form.gender} onChange={set('gender')}>
                      <option value="" disabled>Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </Field>
                  <Field className="col-md-6" label="Appointment date &amp; time *" id="date" type="datetime-local"
                    min={minDateTimeLocal()} value={form.dateTime} onChange={set('dateTime')} error={errors.dateTime} />
                  <Field className="col-md-6" label="Doctor *" id="doctor" error={errors.doctor}>
                    <select id="doctor" className={`form-select mc-input ${errors.doctor ? 'is-invalid' : ''}`}
                      value={form.doctor} onChange={set('doctor')} disabled={loadingDoctors}>
                      <option value="" disabled>{loadingDoctors ? 'Loading doctors…' : 'Select the doctor'}</option>
                      {doctors.map((d) => (
                        <option key={d.id} value={d.value}>
                          {d.name}{d.specialty ? ` — ${d.specialty}` : ''}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field className="col-12" label="Reason for visit *" id="reason" error={errors.reason}>
                    <textarea id="reason" rows="3" placeholder="Describe your symptoms or the reason for your visit"
                      className={`form-control mc-input ${errors.reason ? 'is-invalid' : ''}`}
                      value={form.reason} onChange={set('reason')} />
                  </Field>
                </div>
                <div className="d-flex justify-content-end mt-2">
                  <button type="submit" className="btn btn-mc btn-mc-primary px-5" disabled={busy}>
                    {busy && <span className="spinner-border spinner-border-sm me-2" />}
                    Confirm booking
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
