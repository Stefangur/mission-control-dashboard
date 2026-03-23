'use client'

import { useState, useEffect } from 'react'
import { Calendar, Search as SearchIcon } from 'lucide-react'

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

  // Load long-term memory and available dates on mount
  useEffect(() => {
    const loadMemoryData = async () => {
      try {
        setLoading(true)
        setError('')

        // Fetch long-term memory
        const longTermRes = await fetch('/api/memory/long-term')
        if (longTermRes.ok) {
          const data = await longTermRes.json()
          setLongTermContent(data.content || '')
        } else if (longTermRes.status === 404) {
          setLongTermContent('No long-term memory (MEMORY.md) found yet.')
        }

        // Fetch available daily log dates
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

  // Load daily content when selected date changes
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

  // Handle search
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
      <div className="prose prose-invert max-w-none text-sm leading-relaxed">
        {content.split('\n').map((line, idx) => {
          // Headings
          if (line.startsWith('### ')) {
            return (
              <h3 key={idx} className="text-lg font-bold text-blue-400 mt-4 mb-2">
                {line.replace('### ', '')}
              </h3>
            )
          }
          if (line.startsWith('## ')) {
            return (
              <h2 key={idx} className="text-xl font-bold text-blue-300 mt-6 mb-3">
                {line.replace('## ', '')}
              </h2>
            )
          }
          if (line.startsWith('# ')) {
            return (
              <h1 key={idx} className="text-2xl font-bold text-blue-200 mt-8 mb-4">
                {line.replace('# ', '')}
              </h1>
            )
          }

          // Bullet points
          if (line.startsWith('- ') || line.startsWith('* ')) {
            return (
              <div key={idx} className="ml-4 mb-1 flex gap-2">
                <span className="text-blue-400 flex-shrink-0">•</span>
                <span className="text-gray-300">{line.slice(2)}</span>
              </div>
            )
          }

          // Empty lines
          if (line.trim().length === 0) {
            return <div key={idx} className="h-2"></div>
          }

          // Regular text
          if (line.trim().length > 0) {
            return (
              <p key={idx} className="text-gray-300 mb-2">
                {line}
              </p>
            )
          }

          return null
        })}
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-4">
          <span>📝</span> Memory Dashboard
        </h2>
        
        {/* Tab Navigation */}
        <div className="flex gap-0 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('long-term')}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === 'long-term'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Long-term Memory
          </button>
          <button
            onClick={() => setActiveTab('daily')}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === 'daily'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Daily Logs
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 font-semibold transition-all ${
              activeTab === 'search'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            Search
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-gray-800/30 rounded-lg p-6 border border-gray-700 min-h-[600px]">
        {loading && activeTab !== 'search' ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-400">Loading memory...</p>
            </div>
          </div>
        ) : error ? (
          <div className="text-red-400 p-4 bg-red-900/20 rounded border border-red-700">
            {error}
          </div>
        ) : activeTab === 'long-term' ? (
          <div className="space-y-4">
            {longTermContent ? (
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                {renderMarkdown(longTermContent)}
              </div>
            ) : (
              <div className="text-gray-400 italic p-4">
                No long-term memory created yet. Create a MEMORY.md file in your workspace.
              </div>
            )}
          </div>
        ) : activeTab === 'daily' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Date Selector */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-blue-400" />
                <h3 className="font-semibold text-gray-300">Available Dates</h3>
              </div>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {dailyFiles.length > 0 ? (
                  dailyFiles.map((file) => (
                    <button
                      key={file.date}
                      onClick={() => setSelectedDate(file.date)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${
                        selectedDate === file.date
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {file.date}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm italic">No daily logs found</p>
                )}
              </div>
            </div>

            {/* Daily Content */}
            <div className="lg:col-span-3">
              {selectedDate && dailyContent ? (
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  {renderMarkdown(dailyContent)}
                </div>
              ) : (
                <div className="text-gray-400 italic p-4">
                  {selectedDate ? 'Failed to load log' : 'Select a date to view its log'}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Search Tab
          <div className="space-y-4">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search across all memory files..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {searchQuery.trim().length < 2 ? (
              <div className="text-gray-400 italic p-4">
                Enter at least 2 characters to search
              </div>
            ) : searchResults.length === 0 ? (
              <div className="text-gray-400 italic p-4">
                No results found for "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-400 text-sm">{searchResults.length} results found</p>
                {searchResults.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-blue-500 transition-colors"
                  >
                    <h4 className="font-semibold text-blue-400 mb-2">{result.file}</h4>
                    <p className="text-gray-300 text-sm">{result.preview}</p>
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
