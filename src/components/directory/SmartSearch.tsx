import { useState } from 'react'
import { Search, Sparkles, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { blink } from '@/blink/client'
import type { SearchResult, ContentType } from '@/types'

interface SmartSearchProps {
  onSearchResults: (results: SearchResult) => void
  onLoading: (loading: boolean) => void
}

export function SmartSearch({ onSearchResults, onLoading }: SmartSearchProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'machine learning models for text classification',
    'computer vision tools for object detection',
    'open source repositories for natural language processing',
    'audio processing models for speech recognition'
  ])

  const searchContent = async (type: ContentType, params: any) => {
    const keywords = params.keywords.join(' ')
    
    try {
      let query = ''
      
      switch (type) {
        case 'tools':
          query = `
            SELECT t.*, c.name as category_name 
            FROM tools t 
            LEFT JOIN categories c ON t.category_id = c.id 
            WHERE t.status = 'approved' 
            AND (t.name LIKE '%${keywords}%' OR t.description LIKE '%${keywords}%' OR t.tags LIKE '%${keywords}%')
            ORDER BY t.rating DESC, t.review_count DESC
            LIMIT 20
          `
          break
        case 'repositories':
          query = `
            SELECT r.*, c.name as category_name 
            FROM repositories r 
            LEFT JOIN categories c ON r.category_id = c.id 
            WHERE r.status = 'approved' 
            AND (r.name LIKE '%${keywords}%' OR r.description LIKE '%${keywords}%' OR r.tags LIKE '%${keywords}%')
            ORDER BY r.stars DESC, r.rating DESC
            LIMIT 20
          `
          break
        case 'models':
          query = `
            SELECT m.*, c.name as category_name 
            FROM models m 
            LEFT JOIN categories c ON m.category_id = c.id 
            WHERE m.status = 'approved' 
            AND (m.name LIKE '%${keywords}%' OR m.description LIKE '%${keywords}%' OR m.tags LIKE '%${keywords}%')
            ORDER BY m.rating DESC, m.download_count DESC
            LIMIT 20
          `
          break
      }

      const result = await blink.db.sql(query)
      return result.map((item: any) => ({
        ...item,
        category: item.category_name || item.category,
        tags: JSON.parse(item.tags || '[]')
      }))
    } catch (error) {
      console.error(`Failed to search ${type}:`, error)
      return []
    }
  }

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    onLoading(true)

    try {
      // Use AI to understand the natural language query and extract search parameters
      const { text: aiResponse } = await blink.ai.generateText({
        prompt: `Analyze this search query and extract relevant search parameters: "${searchQuery}"

Please respond with a JSON object containing:
- "keywords": array of relevant keywords to search for
- "categories": array of likely categories (tools, repositories, models)
- "tags": array of relevant tags
- "intent": brief description of what the user is looking for

Example query: "machine learning models for image classification"
Example response: {
  "keywords": ["machine learning", "image classification", "computer vision"],
  "categories": ["models"],
  "tags": ["ml", "vision", "classification", "deep learning"],
  "intent": "Looking for AI models that can classify images"
}`,
        model: 'gpt-4o-mini'
      })

      let searchParams
      try {
        searchParams = JSON.parse(aiResponse)
      } catch {
        // Fallback to simple keyword search
        searchParams = {
          keywords: [searchQuery],
          categories: ['tools', 'repositories', 'models'],
          tags: [],
          intent: searchQuery
        }
      }

      // Search across all three content types
      const [toolsData, repositoriesData, modelsData] = await Promise.all([
        searchContent('tools', searchParams),
        searchContent('repositories', searchParams),
        searchContent('models', searchParams)
      ])

      const results: SearchResult = {
        tools: toolsData,
        repositories: repositoriesData,
        models: modelsData,
        total: toolsData.length + repositoriesData.length + modelsData.length
      }

      onSearchResults(results)

      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [searchQuery, ...prev.filter(s => s !== searchQuery)].slice(0, 4)
        return updated
      })

    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
      onLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Ask for anything... 'machine learning models for text analysis'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 pr-24 h-12 text-base border-2 border-gray-200 focus:border-indigo-500 rounded-xl"
          />
          <Button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-4 bg-indigo-600 hover:bg-indigo-700"
          >
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-1" />
                Search
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Recent/Suggested Searches */}
      {recentSearches.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Try these searches:</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <Badge
                key={index}
                variant="outline"
                className="cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                onClick={() => {
                  setQuery(search)
                  handleSearch(search)
                }}
              >
                {search}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}