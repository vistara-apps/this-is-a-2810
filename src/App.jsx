import React from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import Dashboard from './pages/Dashboard'
import MemeGenerator from './pages/MemeGenerator'
import TrendDiscovery from './pages/TrendDiscovery'
import Analytics from './pages/Analytics'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen gradient-bg">
        <AppShell>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<MemeGenerator />} />
            <Route path="/trends" element={<TrendDiscovery />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </AppShell>
      </div>
    </AppProvider>
  )
}

export default App