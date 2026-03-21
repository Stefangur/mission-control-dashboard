'use client'

export default function CronJobsSchedule({ data }: any) {
  if (!data?.cronJobs) return null

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span>📅</span> Cron Schedule
      </h2>

      <div className="space-y-3">
        {data.cronJobs.map((job: any, idx: number) => (
          <div
            key={idx}
            className="flex items-center gap-3 p-3 bg-gray-700 rounded"
          >
            <div className="text-center min-w-12">
              <p className="font-bold text-lg text-blue-400">{job.time}</p>
            </div>
            <div className="flex-1">
              <p className="text-sm">{job.name}</p>
            </div>
            <div className="text-xs">
              {job.active ? (
                <span className="px-2 py-1 bg-green-900/40 text-green-400 rounded">
                  Aktiv
                </span>
              ) : (
                <span className="px-2 py-1 bg-gray-600 text-gray-400 rounded">
                  Inaktiv
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
