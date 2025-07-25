import { useState, useEffect } from 'react'
import { Grid, List, Filter, SortAsc } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ToolCard } from '@/components/directory/ToolCard'
import { RepositoryCard } from '@/components/directory/RepositoryCard'
import { CategoryFilter } from '@/components/directory/CategoryFilter'
import { blink } from '@/blink/client'
import type { Tool, Repository, Category } from '@/types'

interface HomePageProps {
  searchQuery: string
}

export function HomePage({ searchQuery }: HomePageProps) {
  const [tools, setTools] = useState<Tool[]>([])
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('rating')
  const [loading, setLoading] = useState(true)

  // Mock data for initial display
  useEffect(() => {
    const mockCategories: Category[] = [
      { id: '1', name: 'Machine Learning', description: 'ML tools and frameworks', icon: '🤖', count: 45 },
      { id: '2', name: 'Natural Language', description: 'NLP and text processing', icon: '💬', count: 32 },
      { id: '3', name: 'Computer Vision', description: 'Image and video processing', icon: '👁️', count: 28 },
      { id: '4', name: 'Data Science', description: 'Data analysis and visualization', icon: '📊', count: 38 },
      { id: '5', name: 'Automation', description: 'Workflow and task automation', icon: '⚡', count: 25 },
      { id: '6', name: 'Development', description: 'Developer tools and frameworks', icon: '🛠️', count: 42 },
    ]

    const mockTools: Tool[] = [
      {
        id: '1',
        name: 'ChatGPT',
        description: 'Advanced conversational AI that can help with writing, coding, analysis, and creative tasks.',
        category: 'Natural Language',
        website_url: 'https://chat.openai.com',
        github_url: '',
        logo_url: '',
        tags: ['conversational-ai', 'writing', 'coding', 'analysis'],
        rating: 4.8,
        review_count: 1250,
        user_id: 'user1',
        status: 'approved',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'Midjourney',
        description: 'AI-powered image generation tool that creates stunning artwork from text descriptions.',
        category: 'Computer Vision',
        website_url: 'https://midjourney.com',
        github_url: '',
        logo_url: '',
        tags: ['image-generation', 'art', 'creative', 'design'],
        rating: 4.7,
        review_count: 890,
        user_id: 'user2',
        status: 'approved',
        created_at: '2024-01-14T15:30:00Z',
        updated_at: '2024-01-14T15:30:00Z'
      },
      {
        id: '3',
        name: 'Hugging Face',
        description: 'Platform for machine learning models, datasets, and spaces for AI applications.',
        category: 'Machine Learning',
        website_url: 'https://huggingface.co',
        github_url: 'https://github.com/huggingface',
        logo_url: '',
        tags: ['ml-models', 'datasets', 'transformers', 'nlp'],
        rating: 4.9,
        review_count: 2100,
        user_id: 'user3',
        status: 'approved',
        created_at: '2024-01-13T09:15:00Z',
        updated_at: '2024-01-13T09:15:00Z'
      },
      {
        id: '4',
        name: 'Zapier',
        description: 'Automation platform that connects your apps and services to create powerful workflows.',
        category: 'Automation',
        website_url: 'https://zapier.com',
        github_url: '',
        logo_url: '',
        tags: ['automation', 'workflows', 'integration', 'productivity'],
        rating: 4.6,
        review_count: 1580,
        user_id: 'user4',
        status: 'approved',
        created_at: '2024-01-12T14:20:00Z',
        updated_at: '2024-01-12T14:20:00Z'
      }
    ]

    const mockRepositories: Repository[] = [
      {
        id: '1',
        name: 'tensorflow',
        description: 'An Open Source Machine Learning Framework for Everyone',
        category: 'Machine Learning',
        github_url: 'https://github.com/tensorflow/tensorflow',
        language: 'Python',
        stars: 185000,
        forks: 74000,
        tags: ['machine-learning', 'deep-learning', 'neural-networks', 'python'],
        rating: 4.8,
        review_count: 450,
        user_id: 'user1',
        status: 'approved',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z'
      },
      {
        id: '2',
        name: 'pytorch',
        description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration',
        category: 'Machine Learning',
        github_url: 'https://github.com/pytorch/pytorch',
        language: 'Python',
        stars: 82000,
        forks: 22000,
        tags: ['deep-learning', 'neural-networks', 'gpu', 'research'],
        rating: 4.7,
        review_count: 320,
        user_id: 'user2',
        status: 'approved',
        created_at: '2024-01-14T15:30:00Z',
        updated_at: '2024-01-14T15:30:00Z'
      },
      {
        id: '3',
        name: 'transformers',
        description: 'State-of-the-art Machine Learning for Pytorch, TensorFlow, and JAX.',
        category: 'Natural Language',
        github_url: 'https://github.com/huggingface/transformers',
        language: 'Python',
        stars: 133000,
        forks: 26000,
        tags: ['nlp', 'transformers', 'bert', 'gpt', 'huggingface'],
        rating: 4.9,
        review_count: 280,
        user_id: 'user3',
        status: 'approved',
        created_at: '2024-01-13T09:15:00Z',
        updated_at: '2024-01-13T09:15:00Z'
      },
      {
        id: '4',
        name: 'opencv',
        description: 'Open Source Computer Vision Library',
        category: 'Computer Vision',
        github_url: 'https://github.com/opencv/opencv',
        language: 'C++',
        stars: 78000,
        forks: 55000,
        tags: ['computer-vision', 'image-processing', 'opencv', 'cpp'],
        rating: 4.6,
        review_count: 190,
        user_id: 'user4',
        status: 'approved',
        created_at: '2024-01-12T14:20:00Z',
        updated_at: '2024-01-12T14:20:00Z'
      }
    ]

    setCategories(mockCategories)
    setTools(mockTools)
    setRepositories(mockRepositories)
    setLoading(false)
  }, [])

  // Filter and sort logic
  const filteredTools = tools
    .filter(tool => {
      const matchesCategory = !selectedCategory || tool.category === categories.find(c => c.id === selectedCategory)?.name
      const matchesSearch = !searchQuery || 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
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

  const filteredRepositories = repositories
    .filter(repo => {
      const matchesCategory = !selectedCategory || repo.category === categories.find(c => c.id === selectedCategory)?.name
      const matchesSearch = !searchQuery || 
        repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        repo.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCategory && matchesSearch
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

  const handleViewToolDetails = (tool: Tool) => {
    console.log('View tool details:', tool)
    // TODO: Implement tool details modal/page
  }

  const handleViewRepositoryDetails = (repository: Repository) => {
    console.log('View repository details:', repository)
    // TODO: Implement repository details modal/page
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
          Discover AI Tools & Repositories
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find the best AI tools, libraries, and repositories to power your next project. 
          Curated by the community, for the community.
        </p>
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

      {/* Content Tabs */}
      <Tabs defaultValue="tools" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="tools">
            AI Tools ({filteredTools.length})
          </TabsTrigger>
          <TabsTrigger value="repositories">
            Repositories ({filteredRepositories.length})
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
      </Tabs>
    </div>
  )
}