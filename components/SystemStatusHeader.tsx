'use client'

import { colors, spacing, typography, borderRadius, styles } from '@/lib/styles'

export default function SystemStatusHeader({ data }: any) {
  if (!data) return null

  const getStatusColor = (status: string) => {
    if (status === 'up' || status === 'operational') {
      return {
        background: 'rgba(16, 185, 129, 0.1)',
        borderLeft: `4px solid ${colors.status.success}`,
      }
    }
    if (status === 'degraded') {
      return {
        background: 'rgba(245, 158, 11, 0.1)',
        borderLeft: `4px solid ${colors.status.warning}`,
      }
    }
    return {
      background: 'rgba(239, 68, 68, 0.1)',
      borderLeft: `4px solid ${colors.status.danger}`,
    }
  }

  const getStatusDotColor = (status: string) => {
    if (status === 'up' || status === 'operational') return colors.status.success
    if (status === 'degraded') return colors.status.warning
    return colors.status.danger
  }

  const ollamaRunning = data.daemons?.ollama?.running
  const traderRunning = data.daemons?.traderDaemon?.running

  const cardStyle: React.CSSProperties = {
    ...styles.card,
    marginBottom: spacing.md,
  }

  const headerRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  }

  const titleStyle: React.CSSProperties = {
    ...typography.h2,
  }

  const timestampStyle: React.CSSProperties = {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: spacing.md,
  }

  const statusBoxStyle = (status: string): React.CSSProperties => ({
    ...getStatusColor(status),
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  })

  const statusLabelStyle: React.CSSProperties = {
    fontSize: typography.label.fontSize,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  }

  const statusValueStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    fontSize: typography.body.fontSize,
    fontWeight: 600,
  }

  const dotStyle: React.CSSProperties = {
    ...styles.statusDot,
  }

  return (
    <div style={cardStyle}>
      <div style={headerRowStyle}>
        <h2 style={titleStyle}>Systemstatus</h2>
        <span style={timestampStyle}>{data.timestamp}</span>
      </div>

      <div style={gridStyle}>
        <div style={statusBoxStyle('up')}>
          <p style={statusLabelStyle}>Ollama</p>
          <div style={statusValueStyle}>
            <span style={{ ...dotStyle, background: getStatusDotColor(ollamaRunning ? 'up' : 'down') }}></span>
            <span>{ollamaRunning ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        <div style={statusBoxStyle('up')}>
          <p style={statusLabelStyle}>Trader Daemon</p>
          <div style={statusValueStyle}>
            <span style={{ ...dotStyle, background: getStatusDotColor(traderRunning ? 'up' : 'down') }}></span>
            <span>{traderRunning ? 'Aktiv' : 'Inaktiv'}</span>
          </div>
        </div>

        <div style={statusBoxStyle('up')}>
          <p style={statusLabelStyle}>Uptime</p>
          <p style={statusValueStyle}>{Math.floor(data.system?.uptime / 3600)}h</p>
        </div>

        <div style={statusBoxStyle('up')}>
          <p style={statusLabelStyle}>Version</p>
          <p style={statusValueStyle}>v0.1.0</p>
        </div>
      </div>
    </div>
  )
}
