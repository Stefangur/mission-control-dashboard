import { execSync } from 'child_process'

export async function POST(req: Request) {
  const action = req.url.split('/').pop()

  try {
    switch (action) {
      case 'restart-trader':
        execSync('pkill -f "node daemon.js"', { stdio: 'inherit' })
        setTimeout(() => {
          try {
            execSync('cd ~/.trader && nohup node daemon.js > daemon.log 2>&1 &', {
              shell: '/bin/bash',
            })
          } catch (e) {
            console.error('Failed to restart:', e)
          }
        }, 1000)
        return Response.json({ status: 'restarting' })

      case 'force-briefing':
        // Trigger immediate briefing
        execSync('pkill -SIGUSR1 -f "node daemon.js"', { stdio: 'inherit' })
        return Response.json({ status: 'briefing_triggered' })

      case 'view-logs':
        const logs = execSync('tail -50 ~/.trader/daemon.log', {
          encoding: 'utf-8',
        })
        return Response.json({ logs })

      case 'health-check':
        const response = await fetch('http://localhost:3000/api/health')
        const health = await response.json()
        return Response.json({ health })

      default:
        return Response.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (error) {
    return Response.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}
