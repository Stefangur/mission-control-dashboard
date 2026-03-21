'use client'

import { useState } from 'react'

export default function QuickActions() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (action: string) => {
    setLoading(action)
    try {
      // In production, these would call actual endpoints
      const response = await fetch(`/api/actions/${action}`, { method: 'POST' })
      if (response.ok) {
        // Show success notification
        alert(`✅ ${action} erfolgreich ausgeführt!`)
      }
    } catch (error) {
      console.error(`Failed to execute ${action}:`, error)
    } finally {
      setLoading(null)
    }
  }

  const Action = ({
    label,
    icon,
    action,
    color,
  }: {
    label: string
    icon: string
    action: string
    color: string
  }) => (
    <button
      onClick={() => handleAction(action)}
      disabled={loading !== null}
      className={`w-full py-3 px-4 rounded font-semibold transition-all ${color} ${
        loading === action ? 'opacity-50 cursor-wait' : 'hover:shadow-lg'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {loading === action ? 'Lädt...' : label}
    </button>
  )

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>⚡</span> Quick Actions
      </h2>

      <div className="space-y-2">
        <Action
          label="Trader Daemon"
          icon="🔄"
          action="restart-trader"
          color="bg-blue-600 hover:bg-blue-700 text-white"
        />
        <Action
          label="Force Briefing"
          icon="📊"
          action="force-briefing"
          color="bg-purple-600 hover:bg-purple-700 text-white"
        />
        <Action
          label="System Logs"
          icon="📝"
          action="view-logs"
          color="bg-gray-700 hover:bg-gray-600 text-white"
        />
        <Action
          label="Health Check"
          icon="🏥"
          action="health-check"
          color="bg-green-600 hover:bg-green-700 text-white"
        />
      </div>
    </div>
  )
}
