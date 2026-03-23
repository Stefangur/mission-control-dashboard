'use client'

import { useState, useEffect } from 'react'
import SystemStatusHeader from '@/components/SystemStatusHeader'
import RenderAppsHealth from '@/components/RenderAppsHealth'
import LocalDaemonsStatus from '@/components/LocalDaemonsStatus'
import CronJobsSchedule from '@/components/CronJobsSchedule'
import RecentAlerts from '@/components/RecentAlerts'
import QuickActions from '@/components/QuickActions'
type TabType = 'dashboard'

export default function Dashboard() {
  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/health')
        if (response.ok) {
          const data = await response.json()
          setHealthData(data)
          setLastUpdate(new Date().toLocaleTimeString('de-DE'))
        }
      } catch (error) {
        console.error('Failed to fetch health:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealth()
    const interval = setInterval(fetchHealth, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading && !healthData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Mission Control initialisiert...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <span className="text-2xl">🎛️</span> Mission Control Dashboard
          </h1>
          <p className="text-gray-400">
            Zuletzt aktualisiert: {lastUpdate || 'Wird geladen...'}
          </p>
          
          {/* Tab Navigation */}
          <div className="mt-6 flex gap-4 border-b border-gray-700">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-3 font-semibold transition-all ${
                activeTab === 'dashboard'
                  ? 'text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              📊 System Status
            </button>
            <a
              href="https://memory-dashboard.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 font-semibold transition-all text-gray-400 hover:text-gray-300 hover:text-blue-400"
            >
              📝 Memory →
            </a>
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            {/* Status Overview */}
            {healthData && (
              <div className="grid grid-cols-1 gap-6 mb-8">
                <SystemStatusHeader data={healthData} />
              </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-2 space-y-6">
                {healthData && <RenderAppsHealth />}
                {healthData && <LocalDaemonsStatus data={healthData} />}
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {healthData && <CronJobsSchedule data={healthData} />}
                <QuickActions />
              </div>
            </div>

            {/* Alerts Section */}
            <div className="mt-8">
              {healthData && <RecentAlerts data={healthData} />}
            </div>
          </>
        )}

        {/* Memory Tab — External Link */}
        {/* No rendering needed — link opens https://memory-dashboard.onrender.com */}
      </div>
    </div>
  )
}
