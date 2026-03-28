'use client'

import { useState, useEffect } from 'react'
import SystemStatusHeader from '@/components/SystemStatusHeader'
import RenderAppsHealth from '@/components/RenderAppsHealth'
import LocalDaemonsStatus from '@/components/LocalDaemonsStatus'
import CronJobsSchedule from '@/components/CronJobsSchedule'
import RecentAlerts from '@/components/RecentAlerts'
import QuickActions from '@/components/QuickActions'
import { colors, spacing, typography, borderRadius, fontFamily } from '@/lib/styles'

type TabType = 'dashboard'

export default function Dashboard() {
  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchHealth = async () => {
    try {
      setIsRefreshing(true)
      const response = await fetch('/api/health', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        }
      })
      if (response.ok) {
        const data = await response.json()
        setHealthData(data)
        setLastUpdate(new Date().toLocaleTimeString('de-DE'))
      }
    } catch (error) {
      console.error('Failed to fetch health:', error)
    } finally {
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 5000)

    return () => clearInterval(interval)
  }, [])

  const pageStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: colors.gradient,
    color: colors.text.primary,
    fontFamily,
    padding: spacing.md,
  }

  const containerStyle: React.CSSProperties = {
    maxWidth: '1280px',
    margin: '0 auto',
  }

  const headerStyle: React.CSSProperties = {
    marginBottom: spacing.lg,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: spacing.sm,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  }

  const subtitleStyle: React.CSSProperties = {
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
  }

  const navStyle: React.CSSProperties = {
    marginTop: spacing.md,
    display: 'flex',
    gap: spacing.md,
    borderBottom: `1px solid ${colors.border.default}`,
  }

  const navButtonStyle = (active: boolean): React.CSSProperties => ({
    padding: `${spacing.sm} 1rem`,
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    transition: 'all 0.3s ease',
    color: active ? '#3b82f6' : colors.text.secondary,
    borderBottom: active ? '2px solid #3b82f6' : 'none',
    background: 'transparent',
    border: active ? undefined : 'none',
    cursor: 'pointer',
    marginBottom: '-1px',
  })

  const navLinkStyle: React.CSSProperties = {
    padding: `${spacing.sm} 1rem`,
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    transition: 'all 0.3s ease',
    color: colors.text.secondary,
    textDecoration: 'none',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    marginBottom: '-1px',
  }

  const loadingContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
  }

  const loadingContentStyle: React.CSSProperties = {
    textAlign: 'center',
  }

  const spinnerStyle: React.CSSProperties = {
    width: '48px',
    height: '48px',
    border: '4px solid rgba(59, 130, 246, 0.2)',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto 1rem',
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: spacing.md,
    marginBottom: spacing.lg,
  }

  const mainGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing.md,
  }

  const alertsSectionStyle: React.CSSProperties = {
    marginTop: spacing.lg,
  }

  if (loading && !healthData) {
    return (
      <div style={pageStyle}>
        <div style={loadingContainerStyle}>
          <div style={loadingContentStyle}>
            <style>{`
              @keyframes spin {
                to { transform: rotate(360deg); }
              }
            `}</style>
            <div style={spinnerStyle}></div>
            <p style={{ color: colors.text.secondary }}>Mission Control initialisiert...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: spacing.md }}>
            <div style={{ flex: 1 }}>
              <h1 style={titleStyle}>
                <span>🎛️</span> Mission Control Dashboard
              </h1>
              <p style={subtitleStyle}>
                Zuletzt aktualisiert: {lastUpdate || 'Wird geladen...'} {isRefreshing && '⏳'}
              </p>
            </div>
            {/* ✅ REFRESH BUTTON */}
            <button
              onClick={fetchHealth}
              disabled={isRefreshing}
              style={{
                padding: '0.5rem 1rem',
                background: isRefreshing ? 'rgba(107, 114, 128, 0.5)' : 'rgba(59, 130, 246, 0.2)',
                color: isRefreshing ? 'rgba(255, 255, 255, 0.5)' : '#3b82f6',
                border: `1px solid ${isRefreshing ? 'rgba(107, 114, 128, 0.3)' : '#3b82f6'}`,
                borderRadius: borderRadius.sm,
                cursor: isRefreshing ? 'not-allowed' : 'pointer',
                fontSize: typography.small.fontSize,
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.3)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.background = 'rgba(59, 130, 246, 0.2)';
                }
              }}
            >
              {isRefreshing ? '⏳ Aktualisiere...' : '🔄 Aktualisieren'}
            </button>
          </div>

          {/* Tab Navigation */}
          <div style={navStyle}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={navButtonStyle(activeTab === 'dashboard')}
            >
              📊 System Status
            </button>
            <a
              href="https://memory-dashboard.onrender.com"
              target="_blank"
              rel="noopener noreferrer"
              style={navLinkStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = colors.text.secondary;
              }}
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
              <div style={gridStyle}>
                <SystemStatusHeader data={healthData} />
              </div>
            )}

            {/* Main Grid */}
            <div style={mainGridStyle}>
              {/* Left Column */}
              <div style={{ display: 'grid', gap: spacing.md }}>
                {healthData && <RenderAppsHealth />}
                {healthData && <LocalDaemonsStatus data={healthData} />}
              </div>

              {/* Right Column */}
              <div style={{ display: 'grid', gap: spacing.md }}>
                {healthData && <CronJobsSchedule data={healthData} />}
                <QuickActions />
              </div>
            </div>

            {/* Alerts Section */}
            <div style={alertsSectionStyle}>
              {healthData && <RecentAlerts data={healthData} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
