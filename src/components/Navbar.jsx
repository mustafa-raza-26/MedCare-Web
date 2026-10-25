import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/logo.png'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { initials } from '../lib/format'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/services', label: 'Services' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/about', label: 'About Us' },
]

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)

  // Close menus whenever the page changes.
  useEffect(() => {
    setOpen(false)
    setMenu(false)
  }, [location.pathname])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  async function handleLogout() {
    setMenu(false)
    const { error } = await signOut()
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('You have been logged out.')
    navigate('/login')
  }

  return (
    <header className={`mc-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav className="navbar navbar-expand-lg mc-nav">
        <div className="container">
          <Link className="navbar-brand mc-brand" to="/">
            <img src={logo} alt="" width="38" height="38" />
            <span className="mc-brand-text">
              Med<b>Care</b>
              <small>Patient Booking System</small>
            </span>
          </Link>

          <div className="d-flex align-items-center gap-2 order-lg-last">
            <button
              className="navbar-toggler mc-toggler"
              type="button"
              aria-controls="mainNav"
              aria-expanded={open}
              aria-label="Toggle navigation"
              onClick={() => setOpen((o) => !o)}
            >
              <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`} />
            </button>
          </div>

          <div className={`collapse navbar-collapse ${open ? 'show' : ''}`} id="mainNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1">
              {LINKS.map((l) => (
                <li className="nav-item" key={l.to}>
                  <NavLink className="nav-link mc-link" to={l.to} end={l.end}>
                    {l.label}
                  </NavLink>
                </li>
              ))}

              {!user ? (
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                  <Link to="/login" className="btn btn-mc btn-mc-primary btn-sm px-4">
                    <i className="bi bi-box-arrow-in-right me-2" />
                    Login
                  </Link>
                </li>
              ) : (
                <li className="nav-item ms-lg-2 mt-2 mt-lg-0 position-relative" ref={menuRef}>
                  <button
                    type="button"
                    className="mc-user-btn"
                    aria-expanded={menu}
                    aria-haspopup="true"
                    onClick={() => setMenu((m) => !m)}
                  >
                    <span className="mc-avatar mc-avatar-sm">
                      {profile?.avatar ? <img src={profile.avatar} alt="" /> : initials(profile?.name)}
                    </span>
                    <span className="mc-user-name">{profile?.name?.split(' ')[0]}</span>
                    <i className={`bi bi-chevron-${menu ? 'up' : 'down'} small`} />
                  </button>
                  {menu && (
                    <div className="mc-menu" role="menu">
                      <div className="mc-menu-head">
                        <strong>{profile?.name}</strong>
                        <small>{profile?.email}</small>
                      </div>
                      <Link to="/profile" role="menuitem">
                        <i className="bi bi-person-circle" /> My profile
                      </Link>
                      <Link to="/appointments" role="menuitem">
                        <i className="bi bi-calendar2-check" /> My appointments
                      </Link>
                      <hr />
                      <button type="button" role="menuitem" onClick={handleLogout} className="text-danger">
                        <i className="bi bi-box-arrow-right" /> Logout
                      </button>
                    </div>
                  )}
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}
