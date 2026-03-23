import { readFileSync } from 'fs'
import { join } from 'path'
import { NextResponse, NextRequest } from 'next/server'

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || join(process.env.HOME || '/root', '.openclaw', 'workspace')
const MEMORY_DIR = join(WORKSPACE_DIR, 'memory')

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    const filePath = join(MEMORY_DIR, `${date}.md`)
    let content = ''

    try {
      content = readFileSync(filePath, 'utf-8')
    } catch {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error reading daily memory:', error)
    return NextResponse.json(
      { error: 'Failed to read memory' },
      { status: 500 }
    )
  }
}
