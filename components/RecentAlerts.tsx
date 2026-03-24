'use client'

import { colors, spacing, typography, borderRadius, styles } from '@/lib/styles'

export default function RecentAlerts({ data }: any) {
  if (!data?.recentAlerts) return null

  const alerts = data.recentAlerts.slice(0, 5)

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

  const noAlertsStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: spacing.lg,
    color: colors.text.secondary,
    fontSize: typography.body.fontSize,
  }

  const alertsListStyle: React.CSSProperties = {
    display: 'grid',
    gap: spacing.sm,
    maxHeight: '256px',
    overflowY: 'auto',
  }

  const alertItemStyle = (severity: string): React.CSSProperties => {
    const isError = severity === 'error';
    return {
      padding: spacing.sm,
      borderRadius: borderRadius.sm,
      fontSize: typography.small.fontSize,
      borderLeft: `4px solid ${isError ? colors.status.danger : colors.status.warning}`,
      background: isError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
      color: isError ? '#fecaca' : '#fef08a',
    }
  }

  const alertMessageStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  }

  const alertTimeStyle: React.CSSProperties = {
    fontSize: typography.label.fontSize,
    color: colors.text.secondary,
    whiteSpace: 'nowrap',
  }

  if (alerts.length === 0) {
    return (
      <div style={cardStyle}>
        <h2 style={titleStyle}>
          <span>📋</span> Recent Alerts (24h)
        </h2>
        <div style={noAlertsStyle}>
          ✅ Keine Warnungen in letzten 24 Stunden
        </div>
      </div>
    )
  }

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>
        <span>📋</span> Recent Alerts (24h)
      </h2>

      <div style={alertsListStyle}>
        {alerts.map((alert: any) => (
          <div
            key={alert.id}
            style={alertItemStyle(alert.severity)}
          >
            <div style={alertMessageStyle}>
              <p style={{ flex: 1 }}>{alert.message}</p>
              <span style={alertTimeStyle}>
                {new Date(alert.timestamp).toLocaleTimeString('de-DE')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
