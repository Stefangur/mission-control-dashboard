'use client'

import { useState, useEffect } from 'react'
import { Calendar, Search as SearchIcon } from 'lucide-react'
import { colors, spacing, typography, borderRadius, fontFamily } from '@/lib/styles'

export default function MemoryDashboard({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'long-term' | 'daily' | 'search'>('long-term')
  const [longTermContent, setLongTermContent] = useState<string>('')
  const [dailyFiles, setDailyFiles] = useState<Array<{ date: string; filename: string }>>([])
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [dailyContent, setDailyContent] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<Array<{ file: string; preview: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    const loadMemoryData = async () => {
      try {
        setLoading(true)
        setError('')

        const longTermRes = await fetch('/api/memory/long-term')
        if (longTermRes.ok) {
          const data = await longTermRes.json()
          setLongTermContent(data.content || '')
        } else if (longTermRes.status === 404) {
          setLongTermContent('No long-term memory (MEMORY.md) found yet.')
        }

        const datesRes = await fetch('/api/memory/dates')
        if (datesRes.ok) {
          const data = await datesRes.json()
          setDailyFiles(data.files || [])
          if (data.files && data.files.length > 0) {
            setSelectedDate(data.files[0].date)
          }
        }

        setLoading(false)
      } catch (err) {
        setError('Failed to load memory data')
        setLoading(false)
      }
    }

    loadMemoryData()
  }, [])

  useEffect(() => {
    const loadDailyContent = async () => {
      if (!selectedDate) return

      try {
        setLoading(true)
        const res = await fetch(`/api/memory/daily?date=${selectedDate}`)
        if (res.ok) {
          const data = await res.json()
          setDailyContent(data.content || '')
        } else {
          setDailyContent('Failed to load daily log.')
        }
        setLoading(false)
      } catch (err) {
        setDailyContent('Error loading daily log.')
        setLoading(false)
      }
    }

    loadDailyContent()
  }, [selectedDate])

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      const res = await fetch(`/api/memory/search?q=${encodeURIComponent(query)}`)
      if (res.ok) {
        const data = await res.json()
        setSearchResults(data.results || [])
      }
    } catch (err) {
      console.error('Search failed:', err)
    }
  }

  const renderMarkdown = (content: string) => {
    if (!content) return null

    return (
      <div>
        {content.split('\n').map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} style={{ ...typography.h3, color: '#60a5fa', marginTop: spacing.md, marginBottom: spacing.sm }}>
                {line.replace('### ', '')}
              </h3>
            )
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} style={{ ...typography.h2, color: '#93c5fd', marginTop: spacing.lg, marginBottom: spacing.md }}>
                {line.replace('## ', '')}
              </h2>
            )
          }
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} style={{ fontSize: '1.5rem', fontWeight: 700, color: '#bfdbfe', marginTop: spacing.xl, marginBottom: spacing.lg }}>
                {line.replace('# ', '')}
              </h1>
            )
          }

          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} style={{ marginLeft: spacing.md, marginBottom: spacing.xs, display: 'flex', gap: spacing.sm }}>
                <span style={{ color: '#60a5fa', flexShrink: 0 }}>•</span>
                <span style={{ color: colors.text.secondary }}>{line.slice(2)}</span>
              </div>
            )
          }

          if (line.trim().length === 0) {
            return <div key={idx} style={{ height: spacing.xs }}></div>
          }

          if (line.trim().length > 0) {
            return (
              <p key={idx} style={{ color: colors.text.secondary, marginBottom: spacing.sm, fontSize: typography.body.fontSize }}>
                {line}
              </p>
            )
          }

          return null
        })}
      </div>
    )
  }

  const containerStyle: React.CSSProperties = {
    width: '100%',
  }

  const headerStyle: React.CSSProperties = {
    marginBottom: spacing.lg,
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  }

  const navStyle: React.CSSProperties = {
    display: 'flex',
    gap: 0,
    borderBottom: `1px solid ${colors.border.default}`,
  }

  const navButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: `0.5rem 1rem`,
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    transition: 'all 0.3s ease',
    color: isActive ? '#60a5fa' : colors.text.secondary,
    borderBottom: isActive ? '2px solid #60a5fa' : 'none',
    background: 'transparent',
    border: isActive ? undefined : 'none',
    cursor: 'pointer',
    marginBottom: '-1px',
  })

  const contentAreaStyle: React.CSSProperties = {
    background: 'rgba(31, 41, 55, 0.3)',
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    border: `1px solid ${colors.border.default}`,
    minHeight: '600px',
  }

  const loadingStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  }

  const loadingContentStyle: React.CSSProperties = {
    textAlign: 'center',
  }

  const errorStyle: React.CSSProperties = {
    color: '#fca5a5',
    padding: spacing.md,
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: borderRadius.sm,
    border: `1px solid ${colors.status.danger}`,
  }

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    gap: spacing.md,
  }

  const dateSelectorStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  }

  const dateSelectorLabelStyle: React.CSSProperties = {
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    color: colors.text.secondary,
  }

  const datesListStyle: React.CSSProperties = {
    display: 'grid',
    gap: spacing.sm,
    maxHeight: '396px',
    overflowY: 'auto',
  }

  const dateButtonStyle = (isSelected: boolean): React.CSSProperties => ({
    width: '100%',
    textAlign: 'left',
    padding: `0.5rem 0.75rem`,
    borderRadius: borderRadius.sm,
    transition: 'all 0.3s ease',
    fontSize: typography.small.fontSize,
    background: isSelected ? '#2563eb' : colors.background.card,
    color: isSelected ? colors.text.primary : colors.text.secondary,
    border: 'none',
    cursor: 'pointer',
  })

  const searchInputStyle: React.CSSProperties = {
    width: '100%',
    paddingLeft: '2.5rem',
    paddingRight: '1rem',
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
    background: colors.background.card,
    border: `1px solid ${colors.border.default}`,
    borderRadius: borderRadius.sm,
    color: colors.text.primary,
    fontSize: typography.body.fontSize,
  }

  const searchResultsStyle: React.CSSProperties = {
    display: 'grid',
    gap: spacing.md,
  }

  const resultCardStyle: React.CSSProperties = {
    background: 'rgba(31, 41, 55, 0.5)',
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    border: `1px solid ${colors.border.default}`,
    transition: 'all 0.3s ease',
  }

  const resultTitleStyle: React.CSSProperties = {
    fontSize: typography.body.fontSize,
    fontWeight: 600,
    color: '#60a5fa',
    marginBottom: spacing.sm,
  }

  const resultPreviewStyle: React.CSSProperties = {
    fontSize: typography.small.fontSize,
    color: colors.text.secondary,
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <div style={headerStyle}>
        <h2 style={titleStyle}>
          <span>📝</span> Memory Dashboard
        </h2>

        {/* Tab Navigation */}
        <div style={navStyle}>
          <button
            onClick={() => setActiveTab('long-term')}
            style={navButtonStyle(activeTab === 'long-term')}
          >
            Long-term Memory
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            style={navButtonStyle(activeTab === 'daily')}
          >
            Daily Logs
          </button>
          <button
            onClick={() => setActiveTab('search')}
            style={navButtonStyle(activeTab === 'search')}
          >
            Search
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={contentAreaStyle}>
        {loading && activeTab !== 'search' ? (
          <div style={loadingStyle}>
            <div style={loadingContentStyle}>
              <div style={{
                width: '32px',
                height: '32px',
                border: '4px solid rgba(37, 99, 235, 0.2)',
                borderTopColor: '#2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 0.5rem',
              }}></div>
              <p style={{ color: colors.text.secondary }}>Loading memory...</p>
            </div>
          </div>
        ) : error ? (
          <div style={errorStyle}>{error}</div>
        ) : activeTab === 'long-term' ? (
          <div style={{ display: 'grid', gap: spacing.md }}>
            {longTermContent ? (
              <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: borderRadius.sm, padding: spacing.md, border: `1px solid ${colors.border.default}` }}>
                {renderMarkdown(longTermContent)}
              </div>
            ) : (
              <div style={{ color: colors.text.secondary, fontStyle: 'italic', padding: spacing.md }}>
                No long-term memory created yet. Create a MEMORY.md file in your workspace.
              </div>
            )}
          </div>
        ) : activeTab === 'daily' ? (
          <div style={gridStyle}>
            {/* Date Selector */}
            <div>
              <div style={dateSelectorStyle}>
                <Calendar style={{ width: '16px', height: '16px', color: '#60a5fa' }} />
                <h3 style={dateSelectorLabelStyle}>Available Dates</h3>
              </div>
              <div style={datesListStyle}>
                {dailyFiles.length > 0 ? (
                  dailyFiles.map((file) => (
                    <button
                      key={file.date}
                      onClick={() => setSelectedDate(file.date)}
                      style={dateButtonStyle(selectedDate === file.date)}
                      onMouseEnter={(e) => {
                        if (selectedDate !== file.date) {
                          e.currentTarget.style.background = colors.background.cardHover;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selectedDate !== file.date) {
                          e.currentTarget.style.background = colors.background.card;
                        }
                      }}
                    >
                      {file.date}
                    </button>
                  ))
                ) : (
                  <p style={{ color: colors.text.secondary, fontSize: typography.small.fontSize, fontStyle: 'italic' }}>
                    No daily logs found
                  </p>
                )}
              </div>
            </div>

            {/* Daily Content */}
            <div>
              {selectedDate && dailyContent ? (
                <div style={{ background: 'rgba(31, 41, 55, 0.5)', borderRadius: borderRadius.sm, padding: spacing.md, border: `1px solid ${colors.border.default}` }}>
                  {renderMarkdown(dailyContent)}
                </div>
              ) : (
                <div style={{ color: colors.text.secondary, fontStyle: 'italic', padding: spacing.md }}>
                  {selectedDate ? 'Failed to load log' : 'Select a date to view its log'}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Search Tab
          <div style={{ display: 'grid', gap: spacing.md }}>
            <div style={{ position: 'relative' }}>
              <SearchIcon style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: colors.text.secondary }} />
              <input
                type="text"
                placeholder="Search across all memory files..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                style={searchInputStyle}
              />
            </div>

            {searchQuery.trim().length < 2 ? (
              <div style={{ color: colors.text.secondary, fontStyle: 'italic', padding: spacing.md }}>
                Enter at least 2 characters to search
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ color: colors.text.secondary, fontStyle: 'italic', padding: spacing.md }}>
                No results found for "{searchQuery}"
              </div>
            ) : (
              <div style={searchResultsStyle}>
                <p style={{ color: colors.text.secondary, fontSize: typography.small.fontSize }}>
                  {searchResults.length} results found
                </p>
                {searchResults.map((result, idx) => (
                  <div key={idx} style={resultCardStyle}>
                    <h4 style={resultTitleStyle}>{result.file}</h4>
                    <p style={resultPreviewStyle}>{result.preview}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
