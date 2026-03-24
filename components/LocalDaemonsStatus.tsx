'use client'

import { colors, spacing, typography, borderRadius, styles } from '@/lib/styles'

export default function LocalDaemonsStatus({ data }: any) {
  if (!data?.daemons) return null

  const { ollama, traderDaemon } = data.daemons

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

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gap: spacing.sm,
  }

  const daemonItemStyle = (status: boolean): React.CSSProperties => ({
    padding: spacing.md,
    borderRadius: borderRadius.sm,
    borderLeft: `4px solid ${status ? colors.status.success : colors.status.danger}`,
    background: status ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
  })

  const daemonHeaderStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  }

  const daemonNameStyle: React.CSSProperties = {
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    color: colors.text.primary,
  }

  const daemonDetailsStyle: React.CSSProperties = {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  }

  const statusIndicatorStyle = (status: boolean): React.CSSProperties => ({
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    background: status ? colors.status.success : colors.status.danger,
  })

  const Daemon = ({
    name,
    status,
    details,
  }: {
    name: string
    status: boolean
    details?: string
  }) => (
    <div style={daemonItemStyle(status)}>
      <div style={daemonHeaderStyle}>
        <div style={{ flex: 1 }}>
          <p style={daemonNameStyle}>{name}</p>
          {details && <p style={daemonDetailsStyle}>{details}</p>}
        </div>
        <div style={statusIndicatorStyle(status)}></div>
      </div>
    </div>
  )

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>
        <span>⚙️</span> Local Daemons
      </h2>

      <div style={gridStyle}>
        <Daemon
          name="Ollama"
          status={ollama?.running || false}
          details={ollama?.port ? `Port: ${ollama.port}` : undefined}
        />
        <Daemon
          name="Trader Daemon"
          status={traderDaemon?.running || false}
          details={traderDaemon?.purpose}
        />
      </div>
    </div>
  )
}
