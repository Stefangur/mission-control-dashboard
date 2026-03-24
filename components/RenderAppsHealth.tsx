'use client'

import { useEffect, useState } from 'react'
import { colors, spacing, typography, borderRadius, styles } from '@/lib/styles'

export default function RenderAppsHealth() {
  const [appsData, setAppsData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRenderHealth = async () => {
      try {
        const response = await fetch('/api/render-health')
        if (response.ok) {
          const data = await response.json()
          setAppsData(data.apps || [])
        }
      } catch (error) {
        console.error('Failed to fetch Render health:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRenderHealth()
    const interval = setInterval(fetchRenderHealth, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusStyle = (status: string) => {
    if (status === 'available' || status === 'up') {
      return {
        color: '#10b981',
        background: 'rgba(16, 185, 129, 0.15)',
      }
    }
    if (status === 'building' || status === 'suspended') {
      return {
        color: '#f59e0b',
        background: 'rgba(245, 158, 11, 0.15)',
      }
    }
    return {
      color: '#ef4444',
      background: 'rgba(239, 68, 68, 0.15)',
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      available: '✅ Online',
      building: '🔨 Wird gebaut',
      suspended: '⏸️ Pausiert',
      failed: '❌ Fehler',
    }
    return labels[status] || '❓ Unbekannt'
  }

  const cardStyle: React.CSSProperties = {
    ...styles.card,
  }

  const titleStyle: React.CSSProperties = {
    ...typography.h3,
    marginBottom: spacing.md,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  }

  const loadingStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: spacing.lg,
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: spacing.sm,
  }

  const appItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm,
    background: colors.background.card,
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.border.default}`,
    transition: 'all 0.3s ease',
  }

  const appInfoStyle: React.CSSProperties = {
    flex: 1,
  }

  const appNameStyle: React.CSSProperties = {
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    color: colors.text.primary,
  }

  const lastDeployStyle: React.CSSProperties = {
    fontSize: typography.label.fontSize,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  }

  const statusBadgeStyle = (status: string): React.CSSProperties => ({
    ...getStatusStyle(status),
    padding: `${spacing.xs} 0.75rem`,
    borderRadius: borderRadius.sm,
    fontSize: typography.small.fontSize,
    fontWeight: 600,
  })

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>
        <span>📱</span> Render Apps Health
      </h2>

      {loading ? (
        <div style={loadingStyle}>Lädt...</div>
      ) : (
        <div style={gridStyle}>
          {appsData.map((app) => (
            <div
              key={app.serviceName}
              style={appItemStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.background.cardHover;
                e.currentTarget.style.borderColor = colors.border.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.background.card;
                e.currentTarget.style.borderColor = colors.border.default;
              }}
            >
              <div style={appInfoStyle}>
                <p style={appNameStyle}>{app.serviceName}</p>
                <p style={lastDeployStyle}>
                  {app.lastDeploy
                    ? new Date(app.lastDeploy).toLocaleString('de-DE')
                    : 'Nie'}
                </p>
              </div>
              <div style={statusBadgeStyle(app.status)}>
                {getStatusLabel(app.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
