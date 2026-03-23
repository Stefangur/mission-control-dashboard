import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { NextResponse } from 'next/server'

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || join(process.env.HOME || '/root', '.openclaw', 'workspace')
const MEMORY_FILE = join(WORKSPACE_DIR, 'MEMORY.md')
const MEMORY_DIR = join(WORKSPACE_DIR, 'memory')

export async function GET() {
  try {
    let content = ''
    try {
      content = readFileSync(MEMORY_FILE, 'utf-8')
    } catch {
      content = '' // File doesn't exist
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
