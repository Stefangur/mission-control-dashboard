'use client'

import { useState } from 'react'
import { colors, spacing, typography, borderRadius, styles } from '@/lib/styles'

export default function QuickActions() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (action: string) => {
    setLoading(action)
    try {
      const response = await fetch(`/api/actions/${action}`, { method: 'POST' })
      if (response.ok) {
        alert(`✅ ${action} erfolgreich ausgeführt!`)
      }
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error)
    } finally {
      setLoading(null)
    }
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

  const actionsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gap: spacing.sm,
  }

  const getActionButtonStyle = (
    color: string,
    isLoading: boolean
  ): React.CSSProperties => ({
    width: '100%',
    padding: `${spacing.md} 1rem`,
    borderRadius: borderRadius.sm,
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    transition: 'all 0.3s ease',
    color: 'white',
    border: 'none',
    cursor: isLoading ? 'wait' : 'pointer',
    background: color,
    opacity: isLoading ? 0.5 : 1,
  })

  const Action = ({
    label,
    icon,
    action,
    bgColor,
  }: {
    label: string
    icon: string
    action: string
    bgColor: string
  }) => (
    <button
      onClick={() => handleAction(action)}
      disabled={loading !== null}
      style={getActionButtonStyle(bgColor, loading === action)}
      onMouseEnter={(e) => {
        if (loading === null) {
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span style={{ marginRight: spacing.xs }}>{icon}</span>
      {loading === action ? 'Lädt...' : label}
    </button>
  )

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>
        <span>⚡</span> Quick Actions
      </h2>

      <div style={actionsContainerStyle}>
        <Action
          label="Trader Daemon"
          icon="🔄"
          action="restart-trader"
          bgColor="#2563eb"
        />
        <Action
          label="Force Briefing"
          icon="📊"
          action="force-briefing"
          bgColor="#9333ea"
        />
        <Action
          label="System Logs"
          icon="📝"
          action="view-logs"
          bgColor="#6b7280"
        />
        <Action
          label="Health Check"
          icon="🏥"
          action="health-check"
          bgColor="#16a34a"
        />
      </div>
    </div>
  )
}
