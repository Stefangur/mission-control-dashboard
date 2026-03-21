'use client'

import { useEffect, useState } from 'react'

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
    const interval = setInterval(fetchRenderHealth, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    if (status === 'available' || status === 'up') return 'text-green-400 bg-green-900/20'
    if (status === 'building' || status === 'suspended') return 'text-yellow-400 bg-yellow-900/20'
    return 'text-red-400 bg-red-900/20'
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

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>📱</span> Render Apps Health
      </h2>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Lädt...</div>
      ) : (
        <div className="grid gap-3">
          {appsData.map((app) => (
            <div
              key={app.serviceName}
              className="flex items-center justify-between p-3 bg-gray-700 rounded border border-gray-600"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm">{app.serviceName}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {app.lastDeploy
                    ? new Date(app.lastDeploy).toLocaleString('de-DE')
                    : 'Nie'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(app.status)}`}>
                {getStatusLabel(app.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
