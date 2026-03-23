import { readFileSync, readdirSync, statSync } from 'fs'
import { join, basename } from 'path'
import { NextResponse } from 'next/server'

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || join(process.env.HOME || '/root', '.openclaw', 'workspace')
const MEMORY_DIR = join(WORKSPACE_DIR, 'memory')

export async function GET() {
  try {
    const files: Array<{ date: string; filename: string; mtime: number }> = []

    try {
      const entries = readdirSync(MEMORY_DIR)
      
      for (const entry of entries) {
        // Match YYYY-MM-DD.md pattern
        if (/^\d{4}-\d{2}-\d{2}\.md$/.test(entry)) {
          const filePath = join(MEMORY_DIR, entry)
          const stat = statSync(filePath)
          const date = entry.replace('.md', '')
          
          files.push({
            date,
            filename: entry,
            mtime: stat.mtime.getTime(),
          })
        }
      }
    } catch {
      // Directory doesn't exist
    }

    // Sort by date, newest first
    files.sort((a, b) => b.mtime - a.mtime)

    return NextResponse.json({
      files: files.map((f) => ({ date: f.date, filename: f.filename })),
    })
  } catch (error) {
    console.error('Error listing memory dates:', error)
    return NextResponse.json(
      { error: 'Failed to list dates' },
      { status: 500 }
    )
  }
}
