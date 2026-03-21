'use client'

export default function LocalDaemonsStatus({ data }: any) {
  if (!data?.daemons) return null

  const { ollama, traderDaemon } = data.daemons

  const Daemon = ({
    name,
    status,
    details,
  }: {
    name: string
    status: boolean
    details?: string
  }) => (
    <div className={`p-4 rounded border-l-4 ${
      status
        ? 'border-l-green-500 bg-green-900/10'
        : 'border-l-red-500 bg-red-900/10'
    }`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold">{name}</p>
          {details && <p className="text-sm text-gray-400 mt-1">{details}</p>}
        </div>
        <div
          className={`w-3 h-3 rounded-full ${
            status ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
      </div>
    </div>
  )

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>⚙️</span> Local Daemons
      </h2>

      <div className="grid gap-3">
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
