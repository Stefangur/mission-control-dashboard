'use client'

import { colors, spacing, typography, borderRadius, styles } from '@/lib/styles'

export default function CronJobsSchedule({ data }: any) {
  if (!data?.cronJobs) return null

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

  const jobsContainerStyle: React.CSSProperties = {
    display: 'grid',
    gap: spacing.sm,
  }

  const jobItemStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    background: colors.background.card,
    borderRadius: borderRadius.sm,
    transition: 'all 0.3s ease',
  }

  const jobTimeStyle: React.CSSProperties = {
    textAlign: 'center',
    minWidth: '48px',
    fontSize: typography.h3.fontSize,
    fontWeight: 700,
    color: '#3b82f6',
  }

  const jobNameStyle: React.CSSProperties = {
    flex: 1,
    fontSize: typography.small.fontSize,
    color: colors.text.primary,
  }

  const statusBadgeStyle = (active: boolean): React.CSSProperties => ({
    padding: `${spacing.xs} 0.5rem`,
    fontSize: typography.label.fontSize,
    borderRadius: borderRadius.sm,
    background: active ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
    color: active ? colors.status.success : colors.text.secondary,
    fontWeight: 500,
  })

  return (
    <div style={cardStyle}>
      <h2 style={titleStyle}>
        <span>📅</span> Cron Schedule
      </h2>

      <div style={jobsContainerStyle}>
        {data.cronJobs.map((job: any, idx: number) => (
          <div
            key={idx}
            style={jobItemStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.background.cardHover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.background.card;
            }}
          >
            <div style={jobTimeStyle}>{job.time}</div>
            <div style={jobNameStyle}>{job.name}</div>
            <div style={statusBadgeStyle(job.active)}>
              {job.active ? 'Aktiv' : 'Inaktiv'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
