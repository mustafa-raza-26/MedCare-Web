import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { supabase, TABLES } from '../lib/supabase'
import { formatDate, formatTime, parseDate } from '../lib/format'
import PageHeader from '../components/PageHeader'
import Spinner from '../components/Spinner'
import { ConfirmModal } from '../components/FormBits'

export default function Appointments() {
  const { user } = useAuth()
  const toast = useToast()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')
  const [target, setTarget] = useState(null)
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    if (!supabase || !user) {
      setLoading(false)
      return
    }
    // NOTE: the booking form saves `user_id`, so we read by `user_id` too
    // (the original code filtered on a different column, `auth_id`, so the list was always empty).
    const { data, error } = await supabase
      .from(TABLES.appointments)
      .select('*')
      .eq('user_id', user.id)
    if (error) {
      toast.error(`Could not load appointments: ${error.message}`)
    } else {
      setItems(data || [])
    }
    setLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  useEffect(() => {
    load()
  }, [load])

  const { upcoming, past } = useMemo(() => {
    const now = Date.now()
    const withTime = items.map((i) => ({ ...i, _t: parseDate(i.date_time)?.getTime() ?? 0 }))
    return {
      upcoming: withTime.filter((i) => i._t >= now).sort((a, b) => a._t - b._t),
      past: withTime.filter((i) => i._t < now).sort((a, b) => b._t - a._t),
    }
  }, [items])

  const list = tab === 'upcoming' ? upcoming : past

  async function cancel() {
    if (!target) return
    setBusy(true)
    const { error } = await supabase.from(TABLES.appointments).delete().eq('id', target.id)
    setBusy(false)
    if (error) {
      toast.error(`Could not cancel: ${error.message}`)
      return
    }
    toast.success('Your appointment has been cancelled.')
    setItems((prev) => prev.filter((i) => i.id !== target.id))
    setTarget(null)
  }

  return (
    <>
      <PageHeader title="My Appointments" subtitle="Everything you have booked, in one place.">
        <Link to="/book" className="btn btn-mc btn-mc-primary">
          <i className="bi bi-plus-lg me-2" /> New appointment
        </Link>
      </PageHeader>

      <section className="mc-section pt-4">
        <div className="container">
          <div className="mc-tabs mb-4" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'upcoming'}
              className={tab === 'upcoming' ? 'active' : ''} onClick={() => setTab('upcoming')}>
              Upcoming <span>{upcoming.length}</span>
            </button>
            <button type="button" role="tab" aria-selected={tab === 'past'}
              className={tab === 'past' ? 'active' : ''} onClick={() => setTab('past')}>
              Past <span>{past.length}</span>
            </button>
          </div>

          {loading ? (
            <Spinner />
          ) : list.length === 0 ? (
            <div className="mc-empty">
              <i className="bi bi-calendar2-x" />
              <h4>{tab === 'upcoming' ? "You don't have any upcoming appointments" : 'No past appointments yet'}</h4>
              <p className="mc-muted">Book a visit with one of our doctors in just a minute.</p>
              <Link to="/book" className="btn btn-mc btn-mc-primary">Book an appointment</Link>
            </div>
          ) : (
            <div className="row g-4">
              {list.map((a) => (
                <div className="col-md-6 col-xl-4" key={a.id}>
                  <article className="mc-card mc-appt h-100">
                    <header>
                      <span className={`mc-pill ${tab === 'upcoming' ? 'is-upcoming' : 'is-past'}`}>
                        {tab === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </span>
                      <small className="mc-muted">PT{a.id}</small>
                    </header>
                    <h5 className="mc-appt-doctor">{a.doctor_Name}</h5>
                    <dl className="mc-appt-list">
                      <div><dt><i className="bi bi-calendar3" /> Date</dt><dd>{formatDate(a.date_time)}</dd></div>
                      <div><dt><i className="bi bi-clock" /> Time</dt><dd>{formatTime(a.date_time)}</dd></div>
                      <div><dt><i className="bi bi-person" /> Patient</dt><dd>{a.patient_Name}</dd></div>
                      <div><dt><i className="bi bi-chat-left-text" /> Reason</dt><dd>{a.reason}</dd></div>
                    </dl>
                    {tab === 'upcoming' && (
                      <button type="button" className="btn btn-mc btn-mc-danger-outline btn-sm w-100 mt-auto"
                        onClick={() => setTarget(a)}>
                        Cancel appointment
                      </button>
                    )}
                  </article>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ConfirmModal
        show={Boolean(target)}
        danger
        busy={busy}
        title="Cancel this appointment?"
        body={target ? `Your visit with ${target.doctor_Name} on ${formatDate(target.date_time)} will be removed.` : ''}
        confirmLabel="Yes, cancel it"
        onConfirm={cancel}
        onClose={() => !busy && setTarget(null)}
      />
    </>
  )
}
