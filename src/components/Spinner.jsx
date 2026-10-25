export default function Spinner({ full = false, label = 'Loading…' }) {
  return (
    <div className={`mc-spinner ${full ? 'mc-spinner-full' : ''}`} role="status">
      <div className="spinner-border text-primary" />
      <span>{label}</span>
    </div>
  )
}
