import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const systemStatus = {
      timestamp: new Date().toISOString(),
      hostname: process.env.HOSTNAME || 'unknown',
      uptime: process.uptime(),
    }

    // Check Ollama daemon
    const ollamaRunning = checkProcess('ollama serve')
    
    // Check Trader daemon
    const traderRunning = checkProcess('node daemon.js')

    // Get cron jobs
    const cronJobs = [
      { time: '08:00', name: 'Trader Briefing (Morning)', active: true },
      { time: '12:00', name: 'Trader Briefing (Noon)', active: true },
      { time: '18:00', name: 'Trader Briefing (Evening)', active: true },
    ]

    // Get recent alerts from render-ping.log
    const alerts = getRecentAlerts()

    return Response.json({
      status: 'ok',
      system: systemStatus,
      daemons: {
        ollama: { running: ollamaRunning, port: 11434 },
        traderDaemon: { running: traderRunning, purpose: 'Live trading' },
      },
      cronJobs,
      recentAlerts: alerts,
    })
  } catch (error) {
    return Response.json(
      { error: 'Health check failed', details: String(error) },
      { status: 500 }
    )
  }
}

function checkProcess(pattern: string): boolean {
  try {
    const result = execSync(`pgrep -f "${pattern}"`, { encoding: 'utf-8' })
    return result.trim().length > 0
  } catch {
    return false
  }
}

function getRecentAlerts(): any[] {
  try {
    const logPath = path.join(process.env.HOME || '/tmp', '.openclaw', 'workspace', 'render-ping.log')
    if (!fs.existsSync(logPath)) return []

    const content = fs.readFileSync(logPath, 'utf-8')
    const lines = content.split('\n').reverse().slice(0, 10)
    
    return lines
      .filter(line => line.trim())
      .map((line, idx) => ({
        id: idx,
        timestamp: new Date().toISOString(),
        message: line.trim(),
        severity: line.includes('ERROR') ? 'error' : 'warning',
      }))
  } catch {
    return []
  }
}
