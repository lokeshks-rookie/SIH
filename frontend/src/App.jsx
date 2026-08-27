import { useState, useEffect } from 'react'
import Navbar from './components/landing page/Navbar'
import Splash from './components/landing page/Splash'
import Hero from './components/landing page/Hero'
import StatsStrip from './components/landing page/StatsStrip'
import Pillars from './components/landing page/Pillars'
import Features from './components/landing page/Features'
import ConceptTeaser from './components/landing page/ConceptTeaser'
import AlgorithmStrip from './components/landing page/AlgorithmStrip'
import Comparison from './components/landing page/Comparison'
import FinalCTA from './components/landing page/FinalCTA'
import Footer from './components/landing page/Footer'
import DashboardLayout from './layouts/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Lesson from './pages/Lesson'
import CircuitBuilder from './pages/CircuitBuilder'
import Playground from './pages/Playground'

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    const onLocationChange = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', onLocationChange)
    return () => window.removeEventListener('popstate', onLocationChange)
  }, [])

  if (currentPath === '/dashboard') {
    return (
      <DashboardLayout>
        <Dashboard />
      </DashboardLayout>
    )
  }

  if (currentPath === '/circuit-builder') {
    return (
      <DashboardLayout>
        <CircuitBuilder />
      </DashboardLayout>
    )
  }

  if (currentPath === '/playground') {
    return (
      <DashboardLayout>
        <Playground />
      </DashboardLayout>
    )
  }

  if (currentPath.startsWith('/lesson/')) {
    const id = currentPath.split('/lesson/')[1];
    return (
      <DashboardLayout>
        <Lesson id={id} />
      </DashboardLayout>
    )
  }

  return (
    <>
      <Splash />
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <Pillars />
        <Features />
        <ConceptTeaser />
        <AlgorithmStrip />
        <Comparison />
        <FinalCTA />
      </main>
      <Footer />
    </>
  )
}
