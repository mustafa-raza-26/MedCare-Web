import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ConfigBanner from './ConfigBanner'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname])
  return null
}

export default function Layout() {
  return (
    <div className="mc-app">
      <ScrollToTop />
      <ConfigBanner />
      <Navbar />
      <main className="mc-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
