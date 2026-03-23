import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { NextResponse, NextRequest } from 'next/server'

const WORKSPACE_DIR = process.env.WORKSPACE_DIR || join(process.env.HOME || '/root', '.openclaw', 'workspace')
const MEMORY_FILE = join(WORKSPACE_DIR, 'MEMORY.md')
const MEMORY_DIR = join(WORKSPACE_DIR, 'memory')

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function getPreview(content: string, searchTerm: string, maxLength: number = 150): string {
  const regex = new RegExp(escapeRegex(searchTerm), 'i')
  const match = content.match(regex)
  
  if (!match || !match.index) {
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '')
  }

  const start = Math.max(0, match.index - 50)
  const end = Math.min(content.length, match.index + match[0].length + 100)
  let preview = content.substring(start, end)
  
  if (start > 0) preview = '...' + preview
  if (end < content.length) preview = preview + '...'
  
  return preview
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query too short' },
        { status: 400 }
      )
    }

    const results: Array<{ file: string; preview: string }> = []
    const searchRegex = new RegExp(escapeRegex(query), 'gi')

    // Search long-term memory
    try {
      const content = readFileSync(MEMORY_FILE, 'utf-8')
      if (searchRegex.test(content)) {
        results.push({
          file: 'MEMORY.md (Long-term)',
          preview: getPreview(content, query),
        })
      }
    } catch {
      // File doesn't exist
    }

    // Search daily logs
    try {
      const entries = readdirSync(MEMORY_DIR)
      
      for (const entry of entries) {
        if (/^\d{4}-\d{2}-\d{2}\.md$/.test(entry)) {
          try {
            const filePath = join(MEMORY_DIR, entry)
            const content = readFileSync(filePath, 'utf-8')
            
            if (searchRegex.test(content)) {
              results.push({
                file: `${entry.replace('.md', '')} (Daily Log)`,
                preview: getPreview(content, query),
              })
            }
          } catch {
            // Skip files that can't be read
          }
        }
      }
    } catch {
      // Directory doesn't exist
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Error searching memory:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
