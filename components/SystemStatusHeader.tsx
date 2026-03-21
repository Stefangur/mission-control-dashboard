'use client'

export default function SystemStatusHeader({ data }: any) {
  if (!data) return null

  const getStatusColor = (status: string) => {
    if (status === 'up' || status === 'operational') return 'bg-green-900 border-green-700'
    if (status === 'degraded') return 'bg-yellow-900 border-yellow-700'
    return 'bg-red-900 border-red-700'
  }

  const getStatusDot = (status: string) => {
    if (status === 'up' || status === 'operational') return 'status-dot green'
    if (status === 'degraded') return 'status-dot yellow'
    return 'status-dot red'
  }

  const ollamaRunning = data.daemons?.ollama?.running
  const traderRunning = data.daemons?.traderDaemon?.running

  return (
    <div className="card border-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Systemstatus</h2>
        <span className="text-sm text-gray-400">{data.timestamp}</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-700 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">Ollama</p>
          <div className="flex items-center">
            <span className={getStatusDot(ollamaRunning ? 'up' : 'down')}></span>
            <span className="font-semibold">{ollamaRunning ? 'Online' : 'Offline'}</span>
          </div>
        </div>

        <div className="bg-gray-700 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">Trader Daemon</p>
          <div className="flex items-center">
            <span className={getStatusDot(traderRunning ? 'up' : 'down')}></span>
            <span className="font-semibold">{traderRunning ? 'Aktiv' : 'Inaktiv'}</span>
          </div>
        </div>

        <div className="bg-gray-700 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">Uptime</p>
          <p className="font-semibold">{Math.floor(data.system?.uptime / 3600)}h</p>
        </div>

        <div className="bg-gray-700 rounded p-3">
          <p className="text-xs text-gray-400 mb-1">Version</p>
          <p className="font-semibold">v0.1.0</p>
        </div>
      </div>
    </div>
  )
}
