import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || join(process.env.HOME || '/root', '.openclaw', 'workspace')
const MEMORY_FILE = join(WORKSPACE_DIR, 'MEMORY.md')
const MEMORY_DIR = join(WORKSPACE_DIR, 'memory')

export async function GET() {
  try {
    let content = ''
    
    // 1. Try reading MEMORY.md (main long-term memory)
    try {
      const memoryContent = readFileSync(MEMORY_FILE, 'utf-8').trim()
      if (memoryContent && memoryContent.length > 0) {
        content = memoryContent
      }
    } catch {
      // MEMORY.md doesn't exist, that's ok
    }
    
    // 2. If MEMORY.md is empty, get today's daily log (YYYY-MM-DD.md format)
    if (!content || content.length === 0) {
      try {
        const files = readdirSync(MEMORY_DIR)
          .filter(f => /^\d{4}-\d{2}-\d{2}\.md$/.test(f)) // Only date format files
          .sort()
          .reverse() // Latest first
        
        if (files.length > 0) {
          // Get most recent date file
          const latestFile = join(MEMORY_DIR, files[0])
          content = readFileSync(latestFile, 'utf-8')
        } else {
          content = 'No memory created yet. Start by saving your thoughts!'
        }
      } catch (err) {
        console.error('Error reading memory directory:', err)
        content = 'Error loading memory files.'
      }
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading long-term memory:', error)
    return NextResponse.json(
      { error: 'Failed to read memory' },
      { status: 500 }
    )
  }
}
