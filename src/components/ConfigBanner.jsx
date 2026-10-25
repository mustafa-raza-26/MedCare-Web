import { isConfigured } from '../lib/supabase'

/** Small notice shown while the .env Supabase values are still missing. */
export default function ConfigBanner() {
  if (isConfigured) return null
  return (
    <div className="mc-config-banner" role="alert">
      <i className="bi bi-plug me-2" />
      Supabase is not connected. Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to your{' '}
      <code>.env</code> file to enable login and bookings.
    </div>
  )
}
