import { useState, useEffect } from 'react'
import { Grid, List, SortAsc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToolCard } from '@/components/directory/ToolCard'
import { RepositoryCard } from '@/components/directory/RepositoryCard'
import { ModelCard } from '@/components/directory/ModelCard'
import { CategoryFilter } from '@/components/directory/CategoryFilter'
import { SmartSearch } from '@/components/directory/SmartSearch'
import { blink } from '@/blink/client'
import type { Tool, Repository, Model, Category, SearchResult } from '@/types'

export function HomePage() {
  const [tools, setTools] = useState<Tool[]>([])
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [models, setModels] = useState<Model[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('rating')
  const [loading, setLoading] = useState(true)
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const loadInitialData = async () => {
    try {
      // Load categories
      const categoriesData = await blink.db.sql(`
        SELECT c.*, 
        (SELECT COUNT(*) FROM tools WHERE category_id = c.id AND status = 'approved') +
        (SELECT COUNT(*) FROM repositories WHERE category_id = c.id AND status = 'approved') +
        (SELECT COUNT(*) FROM models WHERE category_id = c.id AND status = 'approved') as count
        FROM categories c
        ORDER BY c.name
      `)
      
      // Load tools
      const toolsData = await blink.db.sql(`
        SELECT t.*, c.name as category_name 
        FROM tools t 
        LEFT JOIN categories c ON t.category_id = c.id 
        WHERE t.status = 'approved' 
        ORDER BY t.rating DESC, t.review_count DESC
        LIMIT 50
      `)
      
      // Load repositories
      const repositoriesData = await blink.db.sql(`
        SELECT r.*, c.name as category_name 
        FROM repositories r 
        LEFT JOIN categories c ON r.category_id = c.id 
        WHERE r.status = 'approved' 
        ORDER BY r.stars DESC, r.rating DESC
        LIMIT 50
      `)
      
      // Load models
      const modelsData = await blink.db.sql(`
        SELECT m.*, c.name as category_name 
        FROM models m 
        LEFT JOIN categories c ON m.category_id = c.id 
        WHERE m.status = 'approved' 
        ORDER BY m.rating DESC, m.download_count DESC
        LIMIT 50
      `)

      setCategories(categoriesData.map((cat: any) => ({
        ...cat,
        count: cat.count || 0
      })))
      
      setTools(toolsData.map((tool: any) => ({
        ...tool,
        category: tool.category_name || tool.category,
        tags: JSON.parse(tool.tags || '[]')
      })))
      
      setRepositories(repositoriesData.map((repo: any) => ({
        ...repo,
        category: repo.category_name || repo.category,
        tags: JSON.parse(repo.tags || '[]')
      })))
      
      setModels(modelsData.map((model: any) => ({
        ...model,
        category: model.category_name || model.category,
        tags: JSON.parse(model.tags || '[]')
      })))
      
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInitialData()
  }, [])

  const handleSearchResults = (results: SearchResult) => {
    setSearchResults(results)
  }

  const handleSearchLoading = (loading: boolean) => {
    setIsSearching(loading)
  }

  const clearSearch = () => {
    setSearchResults(null)
  }

  // Use search results if available, otherwise use original data
  const displayTools = searchResults ? searchResults.tools : tools
  const displayRepositories = searchResults ? searchResults.repositories : repositories
  const displayModels = searchResults ? searchResults.models : models

  // Filter and sort logic
  const filteredTools = displayTools
    .filter(tool => {
      const matchesCategory = !selectedCategory || tool.category === categories.find(c => c.id === selectedCategory)?.name
      return matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'reviews':
          return b.review_count - a.review_count
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const filteredRepositories = displayRepositories
    .filter(repo => {
      const matchesCategory = !selectedCategory || repo.category === categories.find(c => c.id === selectedCategory)?.name
      return matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'stars':
          return b.stars - a.stars
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const filteredModels = displayModels
    .filter(model => {
      const matchesCategory = !selectedCategory || model.category === categories.find(c => c.id === selectedCategory)?.name
      return matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'downloads':
          return b.download_count - a.download_count
        case 'name':
          return a.name.localeCompare(b.name)
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        default:
          return 0
      }
    })

  const handleViewToolDetails = (tool: Tool) => {
    console.log('View tool details:', tool)
    // TODO: Implement tool details modal/page
  }

  const handleViewRepositoryDetails = (repository: Repository) => {
    console.log('View repository details:', repository)
    // TODO: Implement repository details modal/page
  }

  const handleViewModelDetails = (model: Model) => {
    console.log('View model details:', model)
    // TODO: Implement model details modal/page
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Discover AI Tools, Repositories & Models
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Find the best AI tools, libraries, repositories, and models to power your next project. 
          Curated by the community, for the community.
        </p>
        
        {/* Smart Search */}
        <SmartSearch 
          onSearchResults={handleSearchResults}
          onLoading={handleSearchLoading}
        />
        
        {searchResults && (
          <div className="mt-4">
            <Button variant="outline" onClick={clearSearch}>
              Clear Search ({searchResults.total} results)
            </Button>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SortAsc className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="stars">Most Stars</SelectItem>
              <SelectItem value="downloads">Most Downloads</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isSearching && (
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
            <span>Searching with AI...</span>
          </div>
        </div>
      )}

      {/* Content Tabs */}
      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="tools">
            AI Tools ({filteredTools.length})
          </TabsTrigger>
          <TabsTrigger value="repositories">
            Repositories ({filteredRepositories.length})
          </TabsTrigger>
          <TabsTrigger value="models">
            Models ({filteredModels.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tools">
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onViewDetails={handleViewToolDetails}
              />
            ))}
          </div>
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No tools found matching your criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="repositories">
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredRepositories.map((repository) => (
              <RepositoryCard
                key={repository.id}
                repository={repository}
                onViewDetails={handleViewRepositoryDetails}
              />
            ))}
          </div>
          {filteredRepositories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No repositories found matching your criteria.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="models">
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {filteredModels.map((model) => (
              <ModelCard
                key={model.id}
                model={model}
                isListView={viewMode === 'list'}
              />
            ))}
          </div>
          {filteredModels.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No models found matching your criteria.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}