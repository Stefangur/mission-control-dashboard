'use client'

export default function RecentAlerts({ data }: any) {
  if (!data?.recentAlerts) return null

  const alerts = data.recentAlerts.slice(0, 5) // Show last 5

  if (alerts.length === 0) {
    return (
      <div className="card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span>📋</span> Recent Alerts (24h)
        </h2>
        <div className="text-center py-8 text-gray-400">
          ✅ Keine Warnungen in letzten 24 Stunden
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>📋</span> Recent Alerts (24h)
      </h2>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {alerts.map((alert: any) => (
          <div
            key={alert.id}
            className={`p-3 rounded text-sm border-l-4 ${
              alert.severity === 'error'
                ? 'border-l-red-500 bg-red-900/10 text-red-200'
                : 'border-l-yellow-500 bg-yellow-900/10 text-yellow-200'
            }`}
          >
            <div className="flex justify-between items-start gap-2">
              <p className="flex-1">{alert.message}</p>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                {new Date(alert.timestamp).toLocaleTimeString('de-DE')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
